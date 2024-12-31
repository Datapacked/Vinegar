const express = require('express');

const bodyParser = require('body-parser');

const { blake2bHex } = require('blakejs');

const jsonParser = bodyParser.json();

const app = express();
const PORT = 2500;

const api = require('./api');

app.use('/api', api);

app.listen(PORT, () => {
    console.log("app listening on port 2500 of localhost");
})