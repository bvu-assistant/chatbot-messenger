
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




app.listen(9000, ()=>
{
    console.log('Assistant server listening on port: 9000.');
})

app.get('/', (req, res) =>
{
    res.status(200).send("Assistant server running Oke.");
})