const express = require('express');
const router = express.Router();
const db = require('../config/database')
const User = require('../models/User')
const bcrypt = require('bcryptjs');


router.post('/', (req, res) => {

    User.findOne({
        attributes: ['userid', 'password', 'firstname','lastname','email','role'],
        where: {
          userid : req.body.userid,
          isActive : 'Y'
        }
    }).then(users => {
        if (!users) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.status(404).send({
                msg: 'User not found!'
            })
        } 
        bcrypt.compare(req.body.password, users.password ,(err, data) => {
            if(err) throw err
            if(data) {
                const results = {
                    ID : users.userid,
                    firstName : users.firstname,
                    lastName : users.lastname,
                    Mail : users.email,
                    Role : users.role
                }
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.status(200).send(results)
            }else{
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.status(401).send({
                    msg :'Invalid credentials!'
                })

            }
        });
    
    });  

});

module.exports = router;
