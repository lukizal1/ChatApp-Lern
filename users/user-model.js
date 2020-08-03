'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true, index: true },
    password: {type: String },
    state: { type: String, enum: ['online', 'offline'] },
});

module.exports = mongoose.model('users', userSchema);