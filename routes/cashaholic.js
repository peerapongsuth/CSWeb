const express = require('express');

const router = express.Router();
const db = require('../config/database')
const Cashaholic = require('../models/Cashaholic');

router.get('/', (req, res) => 
    Cashaholic.findAll({limit: 50,order: [['shipDate' ,'DESC' ]]})
    .then(cashaholic => {
        res.status(200).send(cashaholic);
    })
    .catch(err => console.log(err))
);

router.get('/record/:recordId',(req, res) => {
    const recordId = req.params.recordId
    Cashaholic.findOne({
        attributes: ['userId', 'accountNo','cbjNo','awb','shipDate','weight','verify'],
        where:{
            id : recordId
        }
    })
    .then(cashaholic => {
        res.send(cashaholic);
    }).catch(err => console.log(err))
})

router.get('/record',(req, res) => {
    const userId = req.query.userId;
    const shipDate = req.query.shipDate;
    const cbjNo = req.query.cbjNo;
    const awb = req.query.awb;
    const accountNo = req.query.accountNo;
    
    let where = {};

    if(userId != null){
        where['userId'] = userId
    }

    if(shipDate != null){
        where['shipDate'] = shipDate
    }

    if(cbjNo != null){
        where['cbjNo'] = cbjNo
    }

    if(awb != null){
        where['awb'] = awb
    }

    if(accountNo != null){
        where['accountNo'] = accountNo
    }

    Cashaholic.findAll({
        attributes: ['ID','userId', 'accountNo','cbjNo','awb','shipDate','weight','verify'],
        where,
        limit : 50,
        order: [['shipDate' ,'DESC' ]]
    })
     .then(cashaholic => {
         res.send(cashaholic);
     })
     .catch(err => console.log(err))
})

router.post('/record', (req, res) => {

    const userId = req.body.userId;
    const accountNo = req.body.accountNo;
    const shipDate = req.body.shipDate;
    const cbjNo = req.body.cbjNo;
    const awb = req.body.awb;
    const weight = req.body.weight;

    Cashaholic.create({
        userId : userId,
        accountNo : accountNo,
        shipDate: shipDate,
        cbjNo: cbjNo,
        awb : awb,
        weight : weight
    }).then(cashaholic => {
            if(cashaholic){
                res.status(201).send({
                    message: "Record has been sumbmited"
                });
            }else{
                res.status(406).send({
                    message: "Record cannot be completed"
                });
            }
        }).catch(err => res.status(406).send({
            message: "Cannot be created , due to " + err
    }))
})


router.patch('/record/:recordId', (req, res) => {
    const ID = req.params.recordId;
    const accountNo = req.body.accountNo;
    const cbjNo = req.body.cbjNo;
    const awb = req.body.awb;

    Cashaholic.update({
        accountNo : accountNo,
        cbjNo : cbjNo,
        awb : awb
        },{
        where: {
           ID: ID,
        }
     })
     .then(Updated => { 
        if(Updated >= 1 ){
            console.log(Updated.previous());
            res.status(200).send({
                message: `ID ${ID} has been updated.`
            });
        }
     }).catch(err => res.status(406).send({
        message: "This record cannot be updated , due to " + err
      }))
    })

    router.delete('/record/:recordId', (req, res) => {
        const ID = req.params.recordId;
       
        Cashaholic.destroy({
            where: {
               ID: ID
            }
         })
         .then(Deleted => { 
           if(Deleted >= 1 ){
            res.status(200).send({
                message: `ID ${ID} has been deleted.`
            });
            }
         }).catch(err => res.status(406).send({
            message: "This record cannot be deleted , due to " + err
          }))
        })


module.exports = router;

