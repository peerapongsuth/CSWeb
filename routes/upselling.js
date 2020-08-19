const express = require('express');
const router = express.Router();
const db = require('../config/database')
const Upselling = require('../models/Upselling');

router.get('/', (req, res) => 
    Upselling.findAll()
    .then(upselling => {
        res.status(200).send(upselling);
    })
    .catch(err => console.log(err))
);

router.post('/', (req, res) => {
    const userId = req.body.userId;
    const shipDate = req.body.shipDate;
    const accountNo = req.body.accountNo;
    const companyName = req.body.companyName;
    const destination = req.body.destination;
    const weight = req.body.weight;
    const awb = req.body.awb;
    const route = req.body.route;
    const declareValue = req.body.declareValue;
    const productCode = req.body.productCode;
    const insuranceValue = declareValue * 0.02

    
    Upselling.create({
        userId : userId,
        shipDate : shipDate,
        accountNo : accountNo,
        companyName: companyName,
        destination: destination,
        weight : weight,
        awb : awb,
        route : route,
        declareValue : declareValue,
        insuranceValue : insuranceValue,
        productCode : productCode,
        verify: 0
    })
        .then(upselling => {
            if(upselling){
                res.status(200).send({
                    message: "Record has been sumbmited"
                });
            }else{
                res.status(406).send({
                    message: "Record cannot be completed"
                });
            }
        }).catch(err => res.status(406).send({
        message: "Cannot be submited , due to " + err
    }))
})


router.get('/record',(req, res) => {
    const userId = req.query.userId;
    const shipDate = req.query.shipDate;
    const accountNo = req.query.accountNo;
    const awb = req.query.awb;
    const productCode = req.query.productCode;

    let where = {};

    if(userId != null){
        where['userId'] = userId
    }

    if(shipDate != null){
        where['shipDate'] = shipDate
    }

    if(accountNo != null){
        where['accountNo'] = accountNo
    }

    if(awb != null){
        where['awb'] = awb
    }

    if(productCode != null){
        where['productCode'] = productCode
    }

    Upselling.findAll({
        attributes: ['ID','userId', 'accountNo','companyName','awb','shipDate','declareValue','insuranceValue','productCode','destination','weight','route','verify'],
        where,
        limit : 50,
        order: [['shipDate' ,'DESC' ]]
    })

     .then(upselling => {
         res.send(upselling);
     })
     .catch(err => console.log(err))
})

router.get('/record/:recordId',(req, res) => {
    const recordId = req.params.recordId

    Upselling.findOne({
        attributes: ['ID','userId', 'accountNo','companyName','awb','shipDate','declareValue','insuranceValue','productCode','destination','weight','route','verify'],
        where:{
            id : recordId
        }
    })
        .then(upselling => {
            res.send(upselling);
        })
        .catch(err => console.log(err))
})

router.patch('/record/:recordId', (req, res) => {
    const ID = req.params.recordId;
    const shipDate = req.body.shipDate;
    const accountNo = req.body.accountNo;
    const companyName = req.body.companyName;
    const destination = req.body.destination;
    const weight = req.body.weight;
    const awb = req.body.awb;
    const route = req.body.route;
    const declareValue = req.body.declareValue;
    
    Upselling.update({
        shipDate : shipDate,
        accountNo : accountNo,
        companyName : companyName,
        destination : destination,
        weight : weight,
        awb : awb,
        route : route,
        declareValue : declareValue
        },{
        where: {
           ID: ID,
        }
     })
     .then(Updated => { 
       if(Updated >= 1 ){
        res.status(201).send({
            message: `ID ${ID} has been updated.`
        });
        }
     }).catch(err => res.status(406).send({
        message: "This record cannot be updated , due to " + err
      }))
    })

    router.delete('/record/:recordId', (req, res) => {
        const ID = req.params.recordId;
       
        Upselling.destroy({
            where: {
               ID: ID
            }
         })
         .then(Deleted => { 
           if(Deleted >= 1 ){
            res.status(201).send({
                message: `ID ${ID} has been deleted.`
            });
            }
         }).catch(err => res.status(406).send({
            message: "This record cannot be deleted , due to " + err
          }))
        })


module.exports = router;

