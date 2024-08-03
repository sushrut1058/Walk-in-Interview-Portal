const User = require('../../models/User');
const Room = require('../../models/Room');

exports.fetchProfile = async (req, res) => {
    const userId = req.userId;

    if (req.userId!==userId){
        return res.status(401).json({message: "Not authorized to view the profile"});
    }
    try{
        const user = await User.findOne({
            where:{
                id: userId
            }
        });
        if (user){
            return res.status(200).json({first_name: user.first_name, last_name: user.last_name, email: user.email, company: user.company, linkedin: user.linkedin, github: user.github});
        }else{
            return res.status(404).json({message: "Can't find the profile"});
        }
    } catch (e) {
        return res.status(500).json({message: "Something went wrong while fetching the user's profile"});
    } 
}

exports.updateProfile = async (req, res) => {
    const userId = req.userId;
    console.log("userid:",userId, req);
    try{
        const user = await User.findOne({
            where:{
                id: userId 
            }
        });
        if (user){
            if (req.body.first_name!==''){
                user.first_name = req.body.first_name;
            }
            if (req.body.last_name!==''){
                user.last_name = req.body.last_name;
            }
            console.log(req.body);
            if (req.body.email!==''){
                user.email = req.body.email;
            }
            if(req.body.company!==''){
                user.company = req.body.company;
            }
            if (req.body.linkedin!==''){
                user.linkedin = req.body.linkedin;
            } 
            if (req.body.github!==''){
                user.github = req.body.github;
            }
            user.save();
            return res.status(200).json({message: "Updated info successfully!"});
        }else{
            return res.status(404).json({message: "Can't find the profile"});
        }
    } catch (e) {
        return res.status(500).json({message: "Something went wrong while fetching the user's profile"});
    } 
}