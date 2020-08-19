const express = require('express');
const router = express.Router();
const db = require('../config/database')
const Upselling = require('../models/Upselling');
const Product = require('../models/Product');
const {Op} = require('sequelize');

router.get('/', (req, res) => 
    Upselling.findAll({
        limit : 50,
        order: [['shipDate' ,'DESC' ]]
    })
    .then(upselling => {
        res.status(200).send(upselling);
    })
    .catch(err => console.log(err))
);

router.get('/month/:monthValue', (req, res) => {
    const reqMonth = req.params.monthValue
    const temp = reqMonth.split("-");
    const year = temp[0]
    const month = parseInt(temp[1]) - 1

    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(year, month, 2);
    const lastDay = new Date(year, month + 1, 1);

    const startDate = firstDay.getUTCDate();
    const endDate = lastDay.getUTCDate();

    const monthlySummary = {
        month : reqMonth,
        monthlyAllRecord: 0,
        monthlyVerifiedRecord: 0,
        daily: []
    }
    for (x = startDate; x <= endDate; x++) {
        monthlySummary.daily.push({
                date: x,
                allRecords: 0,
                VerifyRecord:0
            },
        )
    }
    res.send(monthlySummary)
})

router.get('/record',(req, res) => {
    const userId = req.query.userId;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const accountNo = req.query.accountNo;
    const awb = req.query.awb;
    const productCode = req.query.productCode;
    const verify = req.query.verify;

    let where = {};

    if(userId != null){
        where['userId'] = userId
    }

    if(fromDate != null || toDate != null){
        where = {'ShipDate' : {[Op.between] : [fromDate , toDate] }}
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

    if(verify != null){
        where['verify'] = verify
    }

    Upselling.findAll({
        limit : 50,
        order: [['shipDate' ,'DESC' ]],
        attributes: ['ID','userId', 'accountNo','awb','shipDate','productCode','verify'],
        where,
    })

        .then(upselling => {
            res.send(upselling);
        })
        .catch(err => console.log(err))
})


router.patch('/up', (req, res) => {
    const ID = req.query.ID;
    const shipDate = req.body.shipDate;
    const accountNo = req.body.accountNo;
    const companyName = req.body.companyName;
    const destination = req.body.destination;
    const weight = req.body.weight;
    const awb = req.body.awb;
    const route = req.body.route;
    const declareValue = req.body.declareValue;
    const insuranceValue = req.body.insuranceValue;
    const productCode = req.body.productCode;
    const verify = req.body.verify;
    
    
    Upselling.update({
        shipDate : shipDate,
        accountNo : accountNo,
        companyName : companyName,
        destination : destination,
        weight : weight,
        awb : awb,
        route : route,
        declareValue : declareValue,
        insuranceValue : insuranceValue,
        productCode : productCode,
        verify : verify
        },{
        where: {
           ID: ID
           //verify : 0
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

router.put('/record/:recordId', (req, res) => {
    const ID = req.params.recordId;
    console.log(ID)
    Upselling.update({
        verify : 1
    },{
        where: {
            ID: ID
        }
    }).then(Updated => {
        if(Updated >= 1 ){
            res.status(201).send({
                message: `ID ${ID} has been updated.`
            });
        }
    }).catch(err => res.status(406).send({
        message: "This record cannot be updated , due to " + err
    }))
})

router.delete('/del', (req, res) => {
    const ID = req.query.ID;
   
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