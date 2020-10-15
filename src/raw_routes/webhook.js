"use strict";

const router = require('express').Router();
require('dotenv/config');



//  Use this for Verifying access to Facebook app from this server
router.get('/', (req, res) =>
{
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN)
    {
        res.status(200).send(req.query['hub.challenge']);
    }
    else
    {
        res.status(404).send('Error, wrong validation token.');
    }
});


//  When Facebook webhook send we a request --- typically when user send message to the bot
router.post('/', async(req, res) =>
{
    //  Firstly, confirm with Facebook that we have received the request
    res.status(200).send('Oke.');
    console.log('\n\n———————————————————————————————————————————————————————————————————————————————');
    console.log('■■■ Received request from Facebook webhook.');


    try
    {
        const Bot = require('../bot/bot');
        let bot = await new Bot(req);   //  initializing the bot may take quite much time

        console.log('\n\n■■■ ', bot);
        bot.process();
    }
    catch (error)
    {
        console.log('\n■■■ Error when initializing Bot', error);
    }
});



module.exports = router;