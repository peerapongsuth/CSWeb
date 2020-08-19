const Sequelize = require('sequelize');
const db = require('../config/database');
const {Op} = require('sequelize');

const Upselling = db.define('upselling',{
    userId : {
        type: Sequelize.DataTypes.STRING(10),
        unique : true
    },
    accountNo : {
        type: Sequelize.DataTypes.STRING(10),
        unique : true
    },
    companyName : {
        type: Sequelize.DataTypes.STRING(50)
    },
    awb : {
        type: Sequelize.DataTypes.STRING(10)
    },
    shipDate : {
        type: 'TIMESTAMP',
        allowNull: false
    },
    declareValue : {
        type: Sequelize.DataTypes.FLOAT
    },
    InsuranceValue : {
        type: Sequelize.DataTypes.FLOAT
    },
    productCode : {
        type: Sequelize.DataTypes.STRING(10)
    },
    destination : {
        type: Sequelize.DataTypes.STRING(10)
    },
    weight : {
        type: Sequelize.DataTypes.FLOAT
    },
    route : {
        type: Sequelize.DataTypes.STRING(10)
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
    tableName: 'Upselling'
}
);

module.exports = Upselling;