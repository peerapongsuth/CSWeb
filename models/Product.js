const Sequelize = require('sequelize');
const db = require('../config/database');

const Product = db.define('products',{
    productId: {
        type: Sequelize.DataTypes.STRING(10),
        primarykey : true
    },
    productName : {
        type: Sequelize.DataTypes.STRING(50)
    }
},{
    timestamps: false
}
);
Product.removeAttribute('id');

module.exports = Product;
