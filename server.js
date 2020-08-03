'use strict';

const hostname = "mychat.htl-vil.informatik";
const port = 2604;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./users/user-router');

const app = express();
app.use(bodyParser.json());

app.get('/helloExpress', (req, res) => {
    res.status(200).send('this is express - up and running')
});

app.use('/api/users', userRouter);

app.listen(port, hostname, function () {
    console.log(`Chat Web Application is up and running on ${hostname}:${port}.`);
});