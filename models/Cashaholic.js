const Sequelize = require('sequelize');
const db = require('../config/database');

const Cashaholic = db.define('cashaholic',{
    userId : {
        type: Sequelize.DataTypes.STRING(10),
        unique : true
    },
    accountNo : {
        type: Sequelize.DataTypes.STRING(10),
        unique : true
    },
    cbjNo : {
        type: Sequelize.DataTypes.STRING(50)
    },
    awb : {
        type: Sequelize.DataTypes.STRING(10)
    },
    shipDate : {
        type: 'TIMESTAMP',
        allowNull: false
    },
    weight : {
        type: Sequelize.DataTypes.FLOAT
    },
    verify : {
        type: Sequelize.DataTypes.INTEGER(1)
    },
    createdAt : {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt : {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    freezeTableName: true,
    tableName: 'Cashaholic'
}
);


module.exports = Cashaholic;