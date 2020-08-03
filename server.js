'use strict';

const hostname = "localhost";
const port = 2604;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

app.get('/helloExpress', (req, res) => {
    res.status(200).send('this is express - up and running')
});

app.listen(port, hostname, function () {
    console.log(`Chat Wgit eb Application is up and running on ${hostname}:${port}.`);
});