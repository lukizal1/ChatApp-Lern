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
    let toUpdateUser = req.body;

    User.findById(req.params.id, selectionFields, (err, selectedUser) => {
        if (err){
            res.status(500).send('something went wrong');
        } else {
            if (selectedUser != null) {
                let compareUser = selectedUser.toJSON();

                //remove the id property
                delete compareUser._id;

                //check all properties
                if(Object.keys(compareUser).length != Object.keys(toUpdateUser).length) {
                    res.status(400).send('number of properties in object not valid');
                } else {
                    if(Object.keys(toUpdateUser).some(k => { return compareUser[k] == undefined })) {
                        res.status(400).send('properties of object do not match');
                    } else {
                        //update - now (use the original mongoose-object again)
                        for (let key in toUpdateUser) {
                            selectedUser[key] = toUpdateUser[key];
                        }
                        selectedUser.save(function (err, savedUser) {
                            if (err) {
                                res.status(500).json('somethingwent wrong');
                            } else {
                                res.status(200).json(savedUser);
                            }
                        });
                    }
                }
            }
            else {
                res.status(404).send('not found');
            }
        }
    });
});

router.patch('/:id', (req, res) => {
    //if no User is found, send 404
    let toUpdateUser = req.body;

    User.findById(req.params.id, selectionFields, (err, selectedUser) => {
        if (err) {
            res.status(500).send('something went wrong');
        } else {
            if ( selectedUser != null) {
                //by default you can not iterate mongoose object -
                let compareUser = selectedUser.toJSON();

                //remove the id property
                delete compareUser._id;

                //check properties
                if(Object.keys(toUpdateUser).some(k => { return compareUser[k] == undefined})) {
                    res.status(400).send('properties of object do not match');
                } else {
                    //update - now (use the original mongoos-object again)
                    for (let key in toUpdateUser) {
                        selectedUser[key] = toUpdateUser[key];
                    }
                    selectedUser.save(function (err, savedUser) {
                        if (err) {
                            res.status(500).json('something went wrong');
                        } else {
                            res.status(200).json(savedUser);
                        }
                    });
                }
            }
            else {
                res.status(404).send('not found');
            }
        }
    });
});

router.delete('/:id', (req, res) => {
    // if no User is found, send 404
    User.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            //todo: check error to find out 404 or other problem
            res.status(500).send(err);
        } else {
            // 204 means: there is no content - so no message will be delivered
            res.status(204).send();
        }
    });
});

module.exports = router;