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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Users', // This should match the table name of the User model
            key: 'id'
        },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
    }
}, {
    sequelize,
    modelName: 'Room'
});

module.exports = Room;
