"use strict";


const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
require('dotenv/config');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//  Add '/webhook' middleware
const webhook_routes = require('./raw_routes/webhook');
app.use('/webhook', webhook_routes);


//  routing to root page
app.get('/', (req, res) =>
{
    res.status(200).send('BVU Assistant ChatBot server running Oke.');
});

//  wakeupper from 'cronjob schedules' to prevent this server (after deployed on heroku) from sleeping
app.get('/wakeupper', (req, res) =>
{
    res.status(200).send('I waked up.');
});



//  Turn on the server
const PORT = process.env.PORT;
app.listen(PORT, () =>
{
    console.log("BVU Assistant ChatBot server listening on port: ", PORT);
});