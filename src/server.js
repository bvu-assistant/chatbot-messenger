"use strict";


const express = require('express');
const logger = require('morgan');
// const runMiddleware = require('run-middleware');
const path = require('path');
const app = express();
require('dotenv/config');
const request = require('supertest');


// runMiddleware(app);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//  Add middlewares
app.use('/webhook', require('./routes/webhook'));
// app.use('/login', require('./routes/login'));



//  routing to root page
app.get('/', (req, res) =>
{
    res.status(200).send('BVU Assistant ChatBot server running Oke.');
});



app.get('/test-ics/:studentId', (req, res) => {
    const id = req.params.studentId;
    res.download(path.resolve(__dirname, `./self_modules/test-schedules-ics/${id}.ics`), );
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



const firestoreListener = require('./self_modules/firebase/firebase-instance');
firestoreListener.admin
    .firestore()
    .doc('news/details')
    .listCollections().
        then(value => {

            console.log('getting...');
            console.log(value.length);

            value.forEach((collection, index, arr) => {
                collection.onSnapshot(snapshopt => {

                    console.log('docChanges:', snapshopt.docChanges().length);

                    //  ignore the first initial query
                    if (snapshopt.docChanges().length == 1) {
                        snapshopt.docChanges().forEach((change, mIndex, mArr) => {
                            switch (change.type) {
                                case 'added': case 'modified':  //  handle news added
                                    setupMockData(change.doc.data());
                                    break;
                            
                                default:
                                    break;
                            }
                        });
                    }
                });
            });
        })
        .catch(err => {
            console.log('error...');
            console.log(err);
        });



function setupMockData(newsRecord) {
    console.log(newsRecord);

    //  send the mock request
    const client = request(app);
    client
        .post('/webhook')
        .send({
            isNewsAdded: true,
            mockData: newsRecord,
        })
            .then(res => {
                console.log('mock request success');
                // console.log(res);
            })
            .catch(err => {
                console.log('mock request failed');
                // console.log(err);
            });
}
        