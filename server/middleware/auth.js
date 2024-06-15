const jwt = require('jsonwebtoken')
const User = require('../models/User');
const roomStates = require('../sharedState');

exports.authenticate_lv1 = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token format
        const decoded = jwt.verify(token, 'secret'); // Replace 'secret' with your secret key or use environment variables

        req.userId = decoded.id; // Add the user ID to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token format
        const decoded = jwt.verify(token, 'secret'); // Replace 'secret' with your secret key or use environment variables

        req.userId = decoded.id; // Add the user ID to the request object
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error("User not found!");
        }
        if (!user.is_onboarded) {
            throw new Error("User is not activated!");
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
}

exports.authenticateSocket_recruiter = (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    console.log("TOken found");
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err || decoded.role!=2) {
            console.log("Auth error");
            return next(new Error('Authentication error'));
        }
        socket.user = decoded; // Assuming your JWT contains the user information
        console.log("SOmething Happend");
        next();
    });
    console.log("NOT verified JWT");

};

exports.authenticateSocket = (socket, next) => {
    const token = socket.handshake.query.token;
    
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = decoded; // Assuming your JWT contains the user information
        next();
    });
};

// module.exports = [authenticate_lv1, authenticate];

/*
authenticate_lv1 is for the user where email_v=0 and onboarded=0. 
user logs in : emailv=0 , comp loads
user validates token: emailv=0 , comp loads
attacker changes emailv=1 , comp onboard loads, onboards user to activate account.(!!!!)
attacker changes onboarded=1, real homepage loads, but can't do shit as authenticate is set to prevent anything.

*/
