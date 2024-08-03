const path = require('path');
const User = require('../../models/User');
const Room = require('../../models/Room');
const Candidate = require('../../models/Candidate');
const { v4: uuidv4 } = require('uuid'); 
const cron = require('node-cron');
const schedule = require('node-schedule');
const roomStates = require('../../sharedState');


exports.saveUser = async (req, res) => {
    try{
        const room = await Room.findOne({
            where:{
                userId: req.userId,
                active: true
            }
        });
        
        if(room){
            console.log("Found room");
            console.log("RoomId",room.roomId);
        }else{
            return res.status(400).json({message: "Invalid request"});
        }
        
        const curState = await roomStates.getRoomState(room.roomId);
        console.log(curState)
        const attendee = curState.attendee;
        const creator = curState.creator;

        console.log(creator, attendee, curState);

        // Check if the user is already a candidate in the room
        const existingCandidate = await Candidate.findOne({
            where: {
                roomId: room.roomId,
                userId: attendee
            }
        });

        if (existingCandidate) {
            return res.status(400).json({ message: "User already exists in the room" });
        }

        console.log(room.roomId, creator, req.userId);
        const newUser = await Candidate.create({
            roomId: room.roomId,
            userId: attendee,
            creatorId: creator
        });
        if(newUser){
            return res.status(201).json({message: "User saved successfully!"});
        }else{
            return res.status(400).json({message: "Trouble saving user"});
        }

    } catch (e) {
        console.log("Error saving user", e);
        res.status(500).json({message:'Something went wrong while saving user'});
    }
}

exports.fetchSavedUsers = async (req, res) => {
    try {
        const users = await Candidate.findAll ({
            where : {
                creatorId : req.userId 
            }
        });
        // console.log(users);
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching room and candidates info:", error);
        throw error; // You may want to handle this differently in production
      }    
}

exports.createRoom = async (req, res) => {
    const roomId = uuidv4();
    const {title, duration} = req.body;
    const userId = req.userId
    try{
        const existingRoom = await Room.findOne({ 
            where: {
                userId: userId
            } 
        });
        if (existingRoom) {
            return res.status(400).json({ message: "Only one room can be created at a time!" });
        }else{
            console.log("Good to go!, userID:", req.userId);
        }

        const user_ = await User.findOne({
            where: {
                id: userId
            }
        });
        if(!user_){
            return res.status(400).json({ message: "Invalid room!" });
        }else{
            console.log("Good to go, found user");
        }
        

        const newRoom = await Room.create({
            title:title,
            duration:duration,
            roomId:roomId,
            userId:userId,
            linkedin:user_.linkedin
        });
        destroyRoom(roomId, Date.now()+duration*3600*1000);

        res.status(201).json({message:'Room Created Successfully!', roomId: roomId});
        
    }catch (e){
        console.log("Error creating room", e);
        res.status(500).json({message:'Something went wrong while creating the room'});
    }
}

function destroyRoom(roomId, expirationTime) {
    console.log("Creating Job at:", new Date().toISOString());
    console.log("RoomId:", roomId);
    console.log("Expiration Time:", new Date(expirationTime).toISOString());

    schedule.scheduleJob(expirationTime, async () => {
        try {
            const [affectedRows] = await Room.update({ active: false }, {
                where: { roomId: roomId }
            });
            console.log("Affected Rows:", affectedRows);
            if (affectedRows) {
                console.log(`Room for RoomId ${roomId} deactivated at:`, new Date().toISOString());
            } else {
                console.log(`No active room found for RoomId ${roomId} at:`, new Date().toISOString());
            }
        } catch (e) {
            console.error(`Error updating room for RoomId ${roomId} at:`, new Date().toISOString(), e);
        }
    });
}
  

exports.getActiveRooms = async (req,res) => {
    try{
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    }catch (e) {
        console.log("Error getting rooms",e);
        res.status(500).json({message:"Error fetching active rooms"});
    }
}

exports.getHistory = async (req,res) => {
    try{
        const history = await Room.findAll({
            where:{
                active: false
            }
        })
        return res.status(200).json(history);
    } catch (e) {
        res.status(500).json({message:"Error fetching rooms"});
    }
}

exports.fetchPartialProfile = async (req, res) => {
    const {userId} = req.params;
    console.log("userids:",userId, req.userId);
    console.log("role:",req.role, req.role!==2); 
    if (req.userId!==userId && req.role!==2){
        return res.status(401).json({message: "Not authorized to view the profile"});
    }
    try{
        const user = await User.findOne({
            where:{
                id: userId
            }
        });
        if (user){
            return res.status(200).json({first_name: user.first_name, last_name: user.last_name, company: user.company, linkedin: user.linkedin, github: user.github, cv: user.cv});
        }else{
            return res.status(404).json({message: "Can't find the profile"});
        }
    } catch (e) {
        return res.status(500).json({message: "Something went wrong while fetching the user's profile"});
    } 
}

exports.fetchCV = async (req, res) => {
    const {userId} = req.params;
    if(!userId){
        return res.status(500).json({message:"Internal server error!"});
    }
    console.log("userid:",userId);
    if (req.userId!==userId && req.role!==2){
        return res.status(401).json({message: "Not authorized to view the profile"});
    }

    try {
        const user = await User.findOne({
            where:{
                id: userId
            }
        });
        if(!user || !user.cv){
            return res.status(400).json({message: "Either the user or the CV doesn't exist!"});
        }
        return res.sendFile(path.join(__dirname,"../../", user.cv));
    } catch (e) {
        console.error('Error fetching CV:', e);
        res.status(500).json({ message: 'Internal Server Error' });    
    }
}