const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users',{
    userid: {
        type: Sequelize.DataTypes.STRING(255),
        unique : true
    },
    firstname: {
        type: Sequelize.DataTypes.STRING(255)
    },
    lastname: {
        type: Sequelize.DataTypes.STRING(255)
    },
    password: {
        type: Sequelize.DataTypes.STRING(255)
    },
    email: {
        type: Sequelize.DataTypes.STRING(255)
    },
    role: {
        type: Sequelize.DataTypes.STRING(50)
    },
    isActive: {
        type: Sequelize.DataTypes.STRING(1)
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
 
 }
);


module.exports = User;