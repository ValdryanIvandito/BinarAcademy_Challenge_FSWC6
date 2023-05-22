const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/fswc6', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
});

// test add data
// const user_profile1 = new User_Profile({
//     username: 'Dora Eldorado',
//     sex: 'Female',
//     birthday: '2023-05-12',
//     hobby: 'ngoborol ama monyet',
//     hashedPassword: 'sdfgq45eghwey2345ysdsdfsdfsr'
// });

// user_profile1.save().then((user_profile) => console.log(user_profile));