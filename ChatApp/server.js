'use strict';

const hostname = "mychat.htl-vil.informatik";
const port = 2604;
const mongoConnectionString = 'mongodb://localhost:27017/chatapplerndbV1';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const deleteFormerDB = 'YES';

const userRouter = require('./users/user-router');

const app = express();
connectDb(deleteFormerDB);

function connectDb(deleteFormerDB) {
    let dbConn = null;

    if (deleteFormerDB == 'YES') {
        dbConn = mongoose.createConnection(mongoConnectionString, { useNewUrlParser: true});
        dbConn.dropDatabase();
        console.log('former database dropped');
    }


    mongoose.connect(mongoConnectionString, { useNewUrlParser: true , useUnifiedTopology: true});
    dbConn = mongoose.connection;
    

    dbConn.on('error', errorSetup);

    dbConn.once('open', function () {
        console.log(`database connection to ${mongoConnectionString} successfully established. `);

        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
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

