const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../../models/User');
const Room = require('../../models/Room');
const { v4: uuidv4 } = require('uuid');  // For generating unique tokens

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.register = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const emailVerificationToken = uuidv4(); // Generate a unique token
        const user = await User.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            email_verification_token: emailVerificationToken
        });
        
        const verificationUrl = `http://localhost:5000/acc/verify-email/${user.id}/${emailVerificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `Please click on the link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
        });

        res.status(201).json({ message: 'User created successfully. Please check your email to verify.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.verifyEmail = async (req, res) => {
    const { userId, token } = req.params;

    try {
        const user = await User.findOne({
            where: {
                id: userId,
                email_verification_token: token,
                is_email_verified: false
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        user.email_verification_token = null;
        user.is_email_verified = true;
        await user.save();

        res.json({ message: 'Email verified successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify email', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(process.env.JWT_SECRET_KEY)
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const role_placeholder = user.role!=null ? user.role : 0;
        const token = jwt.sign({ first_name:user.first_name, id: user.id, role: role_placeholder }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        if(user.is_email_verified){
            res.status(200).json({first_name: user.first_name, last_name: user.last_name, role: user.role, active: user.is_onboarded , token });
        }else{
            res.status(200).json({email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role, verified_email: false, active: user.is_onboarded , token });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

exports.validateToken = (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent as "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findByPk(decoded.id)
            .then(user => {
                if (!user) throw new Error('No user associated with this token');
                if (user.is_email_verified){
                    res.status(200).json({ id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role, active: user.is_onboarded });
                }else{
                    res.status(200).json({ id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role, active: user.is_onboarded, is_email_verified: false });
                }  
            })
            .catch(error => {
                res.status(404).json({ message: "User not found", error });
            });
    } catch (error) {
        res.status(401).json({ message: "Token is not valid or has expired", error });
    }
};

// the user already has the user object, without the onboarded value.
// but the user needs the onboarded value for UI decisions, supply it with an active
// there's no other reason for the user to have the is_onboarded value.
// finally the user object that should remain consistent across all pages, {id, fn, ln, active}
exports.onboardUser = async (req, res) => {
    const role = req.body.role;
    const company = req.body.company;
    const linkedin = req.body.linkedin;
    const github = req.body.github;
    const cv = req.file.path;

    const userId = req.userId;
    if (!['Hire', 'Hunt'].includes(role)){
        return res.status(400).json({ message : "Okay keep trying beyotch" });
    }

    try{
        const user = await User.findOne({
            where: {
                id: userId,
                is_email_verified: true,
                is_onboarded: false
            }
        });

        if(!user){
            return res.status(404).json({ message : "User not found!" });
        }

        user.role = role==='Hire' ? 2 : 1;
        user.company = company
        user.linkedin = linkedin;
        user.github = github;
        user.cv = cv;
        user.is_onboarded = true;
        await user.save();
        const token = jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ message : "User onboarded successfully", token: token });

    } catch (error){
        res.status(401).json({ message: "Something went wrong", error })
    }
}

exports.resendEmail = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findOne({
            where:{
                id: userId,
                is_email_verified: false,
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_email_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const emailVerificationToken = uuidv4(); // Re-generate a new token
        user.email_verification_token = emailVerificationToken;
        await user.save();

        const verificationUrl = `http://localhost:5000/acc/verify-email/${user.id}/${emailVerificationToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Verify your email',
            html: `Please click on the link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
        });

        res.json({ message: 'Verification email resent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend verification email', error });
    }
};