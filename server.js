'use strict';

const hostname = "mychat.htl-vil.informatik";
const port = 2604;
const mongoConnectionString = 'mongodb://localhost:27017/chatapplerndbV1';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./users/user-router');

const app = express();
connectDb();

function connectDb() {
    mongoose.connect(mongoConnectionString, { useNewUrlParser: true , useUnifiedTopology: true});
    let dbConn = mongoose.connection;
    

    dbConn.on('error', errorSetup);

    dbConn.once('open', function () {
        console.log(`database connection to ${mongoConnectionString} successfully established. `);
        defaultSetup();
    });
}

function errorSetup() {
    app.use('*', (req, res) => {
        res.status(500).send('something went wrong. Inform the administrator');
    });

    app.listen(port, hostname, function () {
        console.error(`Failure: Chat Web Application is up and running on ${hostname}:${port}, but there were problems during the start up. Check the logs ... `);
    });

}

function defaultSetup(){
    app.use(bodyParser.json());
    app.use('/api/users', userRouter);

    app.listen(port, hostname, function () {
    console.log(`Chat Web Application is up and running on ${hostname}:${port}.`);
});
}







app.get('/helloExpress', (req, res) => {
    res.status(200).send('this is express - up and running')
});

