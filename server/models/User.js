const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./config/database');
const Room = require('./Room');
const Candidate = require('./Candidate');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_onboarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email_verification_token: DataTypes.STRING,
    role: DataTypes.INTEGER
}, {
    // Additional model options
});

User.hasMany(Room, { foreignKey: 'id' });
Room.belongsTo(User, { foreignKey: 'userId' });
Candidate.belongsTo(User, {foreignKey: 'userId'});

module.exports = User;
