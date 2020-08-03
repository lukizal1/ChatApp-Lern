'use strict';

let selectionFields = '_id firstname lastname username password state';
const express = require('express');
const User = require('./user-model');
const router = express.Router();

router.get('/', (req, res) => {
    User.find({}, selectionFields, function (err, users) {
        if (err) {
            res.status(500).json('something went wrong.');
        } else {
            res.status(200).json(users);
        }
    });
});

router.get('/:id', (req, res) => {
    //if no User is found, send 404
    User.findById(req.params.id, selectionFields, (err, user) => {
        if (err) {
            res.status(500).send('something went wrong');
        } else {
            if (user != null) {
                res.status(200).json(user);
            }
            else {
                res.status(404).send('not found');
            }
        }
    });
});

router.post('/', (req, res) => {
    User.create(req.body, function (err, savedUser) {
        if(err) {
            // todo: improve error handler later,
            //       meanwhile send a 400 bad request
            res.status(400).json('creating the user did not work.');
        } else {
            //two possibilities:
            //a) the REST - way:
            //     deliver the URL of the new generated ressource
            //b) the pragmatic - way:
            //      deliver the generated objcet incl. _id
            res.status(201).json(savedUser);
        }
    })


    //res.status(201).json('user created');
});

router.put('/:id', (req, res) => {
    //if no User is found, send 404
    res.status(200).send(`Complete update on user with id ${req.params.id}`);
});

router.patch('/:id', (req, res) => {
    //if no User is found, send 404
    res.status(200).send(`Partial update on user with id ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    // if no User is found, send 404
    res.status(204).send(`Delete user with id ${req.params.id}`);
});

module.exports = router;