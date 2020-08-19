const express = require('express');
const router = express.Router();
const db = require('../config/database')
const Product = require('../models/Product');

router.get('/', (req, res) => 
    Product.findAll()
    .then(product => {
        res.status(200).send(product);
    })
    .catch(err => console.log(err))
);

module.exports = router;