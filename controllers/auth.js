const express = require('express');
const router = express.Router();
const db = require('../config/database')
const User = require('../models/User')
const bcrypt = require('bcryptjs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { errorMonitor } = require('nodemailer/lib/mailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.dhl.com', // <= your smtp server here
    port: 25, // <= connection port
    secure: false, // use SSL or not
    tls: {rejectUnauthorized: false},
    auth: {
       user: 'dhlrequest@dhl.com', // <= smtp login user
       pass: 'Thho2019!' // <= smtp login pass
    }
 });


exports.login = (req, res) => {
    User.findOne({
        attributes: ['userid', 'password', 'firstname','lastname','email','role'],
        where: {
          userid : req.body.userid,
          isActive : 'Y'
        }
    }).then(users => {
        if (!users) {
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
                res.status(200).send(results)
            }else{
                res.status(401).send({
                    msg :'Invalid credentials!'
                })

            }
        });
    
    });  
}

exports.forgotPassword = (req, res) => {
    const {email,userid} = req.body;
    const token = jwt.sign(userid, process.env.RESET_PASSWORD_KEY);
    User.findOne({ where : {userid : userid}}).then(user => {
        if(!user ) {
            return res.status(400).json({error: 'User does not exists.'}) 
        }else{
        const mailOptions = {
            from: 'dhlrequest@dhl.com', 
            to: email, 
            subject: 'CIM : Password reset link', 
            html: `
                <h>Dear ${user.userid},</h>
                <p>Please click on given link to reset your password.
                <br>
                <br>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                <br>
                <br>Your IT team!
            `
        };
        user.update({resetLink : token})
        .then(updated => {
            if(updated) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                   return console.log(error.message);
                }
                return res.status(200).send({msg: 'Email has been sent, kindly follow the instructions'})
            })
            }
         })
        }    
    })
}


exports.resetPassword = (req, res) => {
    const newPassword = req.body.newPassword;
    const resetLink = req.params.resetLink;
    if(resetLink){
        jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY, function(err, decodedData){
            if(err){
                return res.status(401).json({err: 'Incorrect token or it is expired.'}) 
            }
            User.findOne({where : {resetLink : resetLink}}).then(user => {
                if(!user){
                    return res.status(400).json({err: 'User with this token does not exist.'}) 
                }
                bcrypt.genSalt(10, function(err, salt)  {
                    bcrypt.hash(newPassword, salt, function(err, hash) {
                    user.update({password : hash, resetLink : ''}).then(updated => {
                        if(updated){
                            return res.status(200).json({msg: 'Your password has been changed.'}) 
                        }else{
                            return res.status(400).json({err: 'Reset password error.'}) 
                        }
                    })
                });
            })
        })
        })
    }else{
            return res.status(401).json({err: 'Authentication error!'}) 
    }
}
    