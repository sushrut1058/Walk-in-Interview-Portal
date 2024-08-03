// models/Candidate.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config/database'); // Adjust the import based on your project structure

// class Candidate extends Model {}
const Candidate = sequelize.define('Candidate',{
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'Candidate'
});

module.exports = Candidate;
