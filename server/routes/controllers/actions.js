const User = require('../../models/User');
const Room = require('../../models/Room');
const Candidate = require('../../models/Candidate');
const { v4: uuidv4 } = require('uuid'); 

exports.saveUser = async (req, res) => {
    try{
        const roomId = await Room.findOne({
            where:{
                userId: req.userId
            }
        });
        if(roomId){
            console.log("Found room");
        }else{
            return req.status(400).json({message: "Invalid request"});
        }
        const newUser = await Candidate.create({
            roomId: roomId,
            userId: req.userId
        });
        if(newUser){
            return req.status(201).json({message: "User saved successfully!"});
        }else{
            return req.status(400).json({message: "Trouble saving user"});
        }

    } catch (e) {

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

        const newRoom = await Room.create({
            title:title,
            duration:duration,
            roomId:roomId,
            userId:userId
        });

        res.status(201).json({message:'Room Created Successfully!', roomId: roomId})

    }catch (e){
        console.log("Error creating room", e);
        res.status(500).json({message:'Something went wrong while creating the room'});
    }
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
        const history = await Rooms.findAll({
            where:{
                is_active: false
            }
        })
        return res.status(200).json({message: history});
    } catch (e) {
        res.status(500).json({message:"Error fetching rooms"});
    }

        
}