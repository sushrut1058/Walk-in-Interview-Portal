// models/Candidate.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config/database'); // Adjust the import based on your project structure

class Candidate extends Model {}

Candidate.init({
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Users', // This should match the table name of the User model
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Candidate'
});

module.exports = Candidate;
