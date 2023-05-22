const mongoose = require('mongoose');

// create schema
const User_Profile = mongoose.model('User_Profile', {
    username: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    hobby: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
});

module.exports = User_Profile;