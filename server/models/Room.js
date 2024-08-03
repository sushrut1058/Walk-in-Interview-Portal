// models/Room.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config/database'); // Adjust the import based on your project structure

class Room extends Model {}

Room.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
    modelName: 'Room'
});

module.exports = Room;
