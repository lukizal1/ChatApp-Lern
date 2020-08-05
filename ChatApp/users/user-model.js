'use strict';

const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true, index: true },
    password: {type: String },
    state: { type: String, enum: ['online', 'offline'] },
});

let userModel = mongoose.model('users', userSchema);
userModel.IdIsValid = function(id) {
    return ObjectID.isValid(id);
}

module.exports = userModel;