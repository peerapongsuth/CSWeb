const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require(`${__dirname}/config/database`)

db.authenticate()
 .then(() => console.log('Datebase connected..'))
 .catch(err => console.log ('Error: ' + err))


const app = express();
app.use(cors())

app.get('/', (req, res) => {
    res.send('INDEX');
})

app.use(bodyParser.urlencoded({
    extended: true
 }));
 
 app.use(bodyParser.json());

//Users route
app.use('/users', require(`${__dirname}/routes/users`))

//Login route
app.use('/login', require(`${__dirname}/routes/login`))

//Upselling route
app.use('/upselling', require(`${__dirname}/routes/upselling`))

//Cashaholic route
app.use('/cashaholic', require(`${__dirname}/routes/cashaholic`))


//Product route
app.use('/products', require(`${__dirname}/routes/products`))

//Incentive route
app.use('/incentive', require(`${__dirname}/routes/incentive`))

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server is running on port ${PORT}...`));

