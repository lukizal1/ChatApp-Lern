'use strict';

const express = require('express');
const router = express = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(`Deliver all Users here (Array in JSON - Format)`);
});

router.get('/:id', (req, res) => {
    //if no User is found, send 404
    res.status(200).json(`Deliver user with id ${id} here`);
});

router.post('/', (req, res) => {
    res.status(201).json('user created');
});

router.put('/:id', (req, res) => {
    //if no User is found, send 404
    res.status(200).send(`Complete update on user with id ${id}`);
});

router.patch('/:id', (req, res) => {
    //if no User is found, send 404
    res.status(200).send(`Partial update on user with id ${id}`);
});

router.delete('/:id', (req, res) => {
    // if no User is found, send 404
    res.status(204).send();
});

module.exports = router;