'use strict';

let selectionFields = '_id firstname lastname username password state';
const express = require('express');
const User = require('./user-model');
const router = express.Router();


function selectById(req, res, next){
    if(!User.IdIsValid(req.params.id)) {
        res.status(400).send('user id not valid');
        return;
    }

    User.findById(req.params.id, selectionFields, (err, user) => {
        if (err) {
            res.status(500).send('something went wrong');
            return
        }
        if (user == null) {
            res.status(404).send('not found');
            return;
        }

        req.selectedUser = user;
        next();
    });
}

function validateCompleteUser(req, res, next) {
    validateUserObjectForUpdate(req, res, next, true);
}

function validatePartialUser(req, res, next) {
    validateUserObjectForUpdate(req, res, next, false);
}

function validateUserObjectForUpdate(req, res, next, fullUpdate) {
    // by default you can not iterate mongoose object -
    let compareUser = req.selectedUser.toJSON();

    // remove the id property
    delete compareUser._id;

    if (fullUpdate) {
        // check all properties
        if (Object.keys(compareUser).length != Object.keys(req.body).length) {
            res.status(400).send('number of properties in object not valid');
            return;
        }
    }
    if (Object.keys(req.body).some(k => {return compareUser[k] == undefined})) {
        res.status(400).send('properties of Object do not match');
        return;
    }
    next();
}

function doUpdate(req, res, next) {
    let toUpdateUser = req.body;

    for (let key in toUpdateUser) {
        req.selectedUser[key] = toUpdateUser[key];
    }
    req.selectedUser.save(function (err, savedUser) {
        if (err) {
            res.status(500).json('something went wrong');
        } else {
            res.status(200).json(savedUser);
        }
        next();
    });
}

router.get('/', (req, res) => {
    User.find({}, selectionFields, function (err, users) {
        if (err) {
            res.status(500).json('something went wrong.');
        } else {
            res.status(200).json(users);
        }
    });
});

router.get('/:id', selectById, (req, res) => {
    res.status(200).json(req.selectedUser);
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

router.put('/:id', selectById, validateCompleteUser, doUpdate);
 

router.patch('/:id', selectById, validatePartialUser, doUpdate);

router.delete('/:id', selectById, (req, res) => {
    req.selectedUser.remove(err => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

module.exports = router;