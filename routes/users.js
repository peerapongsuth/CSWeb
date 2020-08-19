const express = require('express');
const router = express.Router();
const db = require('../config/database')
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//---------------------------------------------All users---------------------------------------------//
//--------------------------------------------------------------------------------------------------//
router.get('/', (req, res) => {
    const userid = req.query.userId;
    console.log(userid)
    let where = {};
    if(userid != null){
        where['userId'] = userid
    }
    where['isActive'] = 'Y'

    User.findAll({
        attributes: ['userid', 'firstname','lastname','email','role','updatedAt'],
        where
    })
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => console.log(err))
})


//---------------------------------------------Find one---------------------------------------------//
//--------------------------------------------------------------------------------------------------//
router.get('/:userid',(req, res) => {
    const userid = req.params.userid;
    //res.status(200).send(userid); 
     User.findOne({
         attributes: ['userid', 'firstname','lastname','email','role','updatedAt'],
         where:{
             userid : userid,
             isActive: 'Y'
         }
     })
     .then(users => {
         res.send(users);
     })
})

router.get('/',(req, res) => {
    const userid = req.query.userid;
    //res.status(200).send(userid);
    User.findOne({
        attributes: ['userid', 'firstname','lastname','email','role','updatedAt'],
        where:{
            userid : userid,
            isActive: 'Y'
        }
    })
        .then(users => {
            res.send(users);
        })
})
//---------------------------------------------Add user---------------------------------------------//
//--------------------------------------------------------------------------------------------------//
router.post('/', (req, res) => {

const userid = req.body.userid;
const firstname = req.body.firstname;
const lastname = req.body.lastname;
const password = req.body.password;
const email = req.body.email;
const role = req.body.role;

bcrypt.genSalt(10, function(err, salt)  {
    bcrypt.hash(password, salt, function(err, hash) {
        User.create({
            userid: userid,
            firstname: firstname,
            lastname: lastname,
            password: hash,
            email: email,
            role: role
        })
        .then(users => {{console.log(hash)}
            if(users){
                res.status(201).send({
                    message: "User is created"
                });
            }else{
                res.status(406).send({
                    message: "This user cannot be created"
                });
            }
        }).catch(err => res.status(406).send({
            message: "This user cannot be created , due to " + err
        }))
        });
   })
})



//---------------------------------------------Delete user---------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
router.patch('/del', (req, res) => {
const userid = req.query.userid;
const isActive = req.body.isActive;

User.update({
    isActive: isActive
    },{
    where: {
       userid: userid,
       isActive: 'Y'
    }
 })
 .then(flagUpdated => { 
   if(flagUpdated == 1 ){
    res.status(201).send({
        message: `User [${userid}] has been deleted..`
    });
    }else{
        res.status(404).send({
            message: "User not found"
        });
    }
 }).catch(err => res.status(406).send({
    message: "This user cannot be deleted , due to " + err
  }))
})


//---------------------------------------------Update user---------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
router.patch('/:userid', (req, res) => {
    const userid = req.params.userid;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    // const role = req.body.role;
    
    User.update({
        firstname: firstname,
        lastname: lastname,
        email: email,
        // role: role
        },{
        where: {
           userid: userid,
           isActive: 'Y'
        }
     })
     .then(Updated => { 
       if(Updated >= 1 ){
        res.status(201).send({
            message: "User [" + userid + "] has been updated" 
        });
        }else{
            res.status(404).send({
                message: "User not found"
            });
        }
     }).catch(err => res.status(406).send({
        message: "This user cannot be updated , due to " + err
      }))
    })


router.patch('/password/:Id', (req, res) => {
    const Id = req.params.Id;
    const password  = req.body.password;
    console.log(Id)

    bcrypt.genSalt(10, function(err, salt)  {
        bcrypt.hash(password, salt, function(err, hash) {
            User.update({
                password: hash,
            },{
                where: {
                    userId : Id,
                    isActive: 'Y'
                }
            }).then(Updated => {
                if(Updated >= 1 ){
                    res.status(200).send({message: "Password of user [" + Id + "] has been updated" });
                }else{
                    res.status(400).send({message: "User not found"});
                }
            })
        })
    })
})

module.exports = router;
