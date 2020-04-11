
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(process.env.PORT, () =>
{
    console.log('Assistant server listening on port:', process.env.PORT);
});




const webhookRoutes = require('./routes/webhook');
app.use('/webhook', webhookRoutes);



app.get('/', (req, res) =>
{
    res.status(200).send('Assistant server running Oke.');
});


app.get('/wakeupper', (req, res) =>
{
    res.status(200).send('Oke.');
});