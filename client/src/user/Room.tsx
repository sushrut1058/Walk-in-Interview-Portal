import React, { useState, useEffect, useRef, useCallback, Component } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Socket, io } from 'socket.io-client';
import Container from '../components/private/Container';
import Waiting from '../components/private/Waiting';
import axios from 'axios';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const auth = useAuth();
  const socket = useRef<Socket | null> (null);
  const [waitingComp, setWaitingComp] = useState<React.ReactElement>();

  const [stream, setStream] = useState<MediaStream | null> (null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const otherUser = useRef<string | null> (null);
  
  const [master, setMaster] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const [mute, setMute] = useState(true);
  const [video, setVideo] = useState(true);
  const [partnerVideoState, setPartnerState] = useState(true);

  const getUserMedia = async () => {    
    try{
      const strm = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
      userStreamRef.current = strm;
      setStream(strm);
      if(userVideo.current){
        userVideo.current.srcObject = strm;
      }
    } catch (e) {
      console.log("Error with video", e);
    }
  };
  
  useEffect(()=>{
    // getUserMedia();
    const token = localStorage.getItem("access");
    let namespace = "room";

    socket.current = io(`http://localhost:8000/${namespace}`,{
      query: {token}
    });

    socket.current.on("unauthorized",()=>window.location.href=`/waiting/${roomId}`);
    socket.current.on("authorized",(role)=>{
      setAllowed(true);
      setMaster(role===2);
      getUserMedia();
    });
    socket.current.on("offer", handleReceiveCall);
    socket.current.on("answer", handleAnswer);
    socket.current.on("ice-candidate",handleNewICECandidateMsg);
    socket.current.on("toggle-video", handlePartnerVideo);

    socket.current.emit("joinRoom", roomId);

    return () => {
      socket.current?.disconnect();
      stopCamera();
    }

  },[]);

  //socket event handler
  const handleReceiveCall = async (incoming : any) => {
    otherUser.current = incoming.caller;
    peerRef.current = createPeer();
    // peerRef.current.ontrack = handleTrackEvent;
    const desc = new RTCSessionDescription(incoming.sdp);
    await peerRef.current.setRemoteDescription(desc);
    if(userStreamRef.current){
      const userStreamTemp = userStreamRef.current;
      console.log("addition of tracks");
      userStreamTemp.getTracks().forEach(track => peerRef.current?.addTrack(track, userStreamTemp));
    }else{
      console.log("stream object empty");
    }
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    socket.current?.emit("answer", {target : incoming.caller, sdp : answer});
  }

  //socket event handler
  const handleAnswer = (message : any) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current?.setRemoteDescription(desc).catch(e => console.log(e));
  }

  //socket event handler
  const handleNewICECandidateMsg = (incoming : any) => {
    console.log("[handleNewICECandidateMsg] incoming packet, ",incoming);
    const candidate = new RTCIceCandidate(incoming.candidate);
    console.log("[handleNewICECandidateMsg] candidate, ",candidate);
    peerRef.current?.addIceCandidate(candidate).catch(e => console.log(e));
  }

  //feature
  const callUser = async (userId : any) => {
    peerRef.current = createPeer(userId);
    if (userStreamRef.current){
      const userStreamTemp = userStreamRef.current;
      console.log("stream added to peer");
      userStreamTemp.getTracks().forEach(track => peerRef.current?.addTrack(track, userStreamTemp));
    }else{
      console.log("stream object empty");
    }
    const offer = await peerRef.current?.createOffer();
    await peerRef.current?.setLocalDescription(offer);
    socket.current?.emit("offer", {target: userId, caller: auth.user.id, sdp: offer});
  };

  //RTC event handler
  const handleTrackEvent = (event : RTCTrackEvent) => {
    if(partnerVideo.current){
      console.log("track event");
      partnerVideo.current.srcObject = event.streams[0];
    }else{
      console.log("nope");
    }
    console.log("Started Camera\n");
    console.log("PeerRef", peerRef.current);
    console.log("userStreamRef", userStreamRef.current);
  }

  //RTC event handler
  const handleICECandidateEvent = (e : RTCPeerConnectionIceEvent) => {
    if(e.candidate){
      console.log("ICE Candidate",e,e.candidate);
      socket.current?.emit("ice-candidate",{target : otherUser.current, candidate: e.candidate});
    }
  }


  const createPeer = (userId? : any) => {
    const peer = new RTCPeerConnection(peerConfiguration);
    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;

    if(userId){
      otherUser.current = userId;
    }
    return peer
  }
  
  const showWaiting = () => {
    setWaitingComp(<Waiting roomId={roomId}/>);
  }
  
  const peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
  }

  const toggleMute = () => {
    if (userStreamRef.current) {
      const audioTracks = userStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const currentlyMuted = !audioTracks[0].enabled; // Determine if currently muted
        console.log(currentlyMuted);
        audioTracks.forEach(track => {
          track.enabled = currentlyMuted; // Toggle the enabled state
        });
        setMute(!currentlyMuted); // Update the state to reflect the change
      }
    }
  };

  const stopCamera = () => {
    if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(track => {
            track.stop();  // Stops both audio and video tracks
        });
        console.log("All tracks have been stopped.");
        userStreamRef.current = null; // Optional: Clear the stream reference
    } else {
        console.log("No stream available to stop.");
    }
  }
  
  const toggleVideo = async () => {
    if (!userStreamRef.current) return;
  
    const videoTrack = userStreamRef.current.getTracks().find(track => track.kind === 'video');
    if (!videoTrack) return;  // Exit if no video track is found
  
    // Toggle the enabled state of the track
    videoTrack.enabled = !videoTrack.enabled;
    console.log("Video track enabled:", videoTrack.enabled);
  
    // Emit an event to inform the other peer of the change
    socket.current?.emit("toggle-video", videoTrack.enabled ? "on" : "off");
  
    // Update local UI state
    setVideo(videoTrack.enabled);
  }

  const saveUser = async () => {
    if (otherUser.current){
      const token = await localStorage.getItem('token');
      const response = await axios.post("http://localhost:8000/actions/saveUser", {
        headers: {
          "Authorization":`Bearer ${token}`
        },
        body: {
          'userId': otherUser.current
        }
      })
    }
  }

  // handlePartner
  const handlePartnerVideo = () => {
    console.log("handlePartnerVideoState");
    setPartnerState(!partnerVideoState);
  }

  return (
    <div>
      <h1>Welcome to Room {roomId}</h1>
      {master && 
        (
          <>
          <div>
            <button onClick={showWaiting}>Waiting Arena</button>
            <Container activeComponent={waitingComp} />
          </div>
          <div>
            <button onClick={()=>callUser(8)}>Call</button>
          </div>
          </>
        )
      }
      {allowed && 
        (
          <div>
            {/* Here you would integrate your video chat functionality */}
            <div>
              <h3>Me</h3>
              <video ref={userVideo} autoPlay playsInline />
            </div>
            <div>
              <h3>Peer</h3>
              <video ref={partnerVideo} autoPlay playsInline />
              <button onClick={saveUser}>Save User</button>
            </div>
            <button onClick={toggleMute}>Toggle Mute</button>
            <button onClick={toggleVideo}>Toggle Video</button> 
          </div>
        )
      }

      
      
    </div>
  );
};

export default Room;
