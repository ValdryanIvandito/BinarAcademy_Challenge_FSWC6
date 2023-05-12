const express = require('express');
const { rockP1, paperP1, scissorsP1, gamelog, readScoresBuffer, writeScoresBuffer, loadProfile, loadProfiles, findProfile, saveProfiles, addProfile, checkDuplicate, deleteProfile, updateProfiles, addCredential, writeCurrentUser, readCurrentUser } = require('../utils/script.js');
const { body, validationResult, check } = require('express-validator');
const router = express.Router();

router.get('/', (req, res) => {
    const title = 'landing page';
    res.status(200);
    res.render('index', { title });
});

router.get('/sign-up', (req, res) => {
    const title = 'sign-up page';
    res.status(200);
    res.render('sign-up', { title });
});

router.get('/login', (req, res) => {
    const title = 'login page';
    res.status(200);
    res.render('login', { title });
});

router.get('/profile', (req, res) => {
    const title = 'profile page';

    const scores = readScoresBuffer();
    const currentuser = readCurrentUser();
    const profile = loadProfile(currentuser);

    const username = profile.username;
    const sex = profile.sex;
    const birthday = profile.birthday;
    const hobby = profile.hobby;

    console.log(profile);

    res.status(200);
    res.render('profile', { title, scores, username, sex, birthday, hobby });
});

router.get('/game', (req, res) => {
    const title = 'game page';
    const playerOne = null;
    const playerCom = null;
    const result = null;
    const scoresResult = readScoresBuffer();
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scoresResult });
});

router.get('/edit-profile', (req, res) => {
    const title = 'edit profile page';
    res.status(200);
    res.render('edit-profile', {title});
});

router.get('/edit-credential', (req, res) => {
    const title = 'edit credential page';
    res.status(200);
    res.render('edit-credential', {title});
});

router.post('/sign-up', (req, res) => {
    res.redirect('/sign-up');
});

router.post('/login', (req, res) => {
    res.redirect('/login');
});

// process add contact data
router.post('/profile', [
    body('username').custom((value) => {
        const duplicate = checkDuplicate(value);
        if (duplicate) {
            throw new Error('Username already exists!')
        }
        return true;
    }),
    body('confirm-password').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.render('sign-up', { 
            title: 'sign-up page',
            errors: errors.array(),
        });
    } else {
        writeCurrentUser(req.body.username);
        addProfile(req.body);
        addCredential(req.body);
        res.redirect('/profile');
    }
});

router.post('/game', (req, res) => {
    res.redirect('/game');
});

router.post('/index', (req, res) => {
    res.redirect('/');
});

router.post('/restart', (req, res) => {
    res.redirect('/game');
});

router.post('/check-credential', (req, res) => {
    res.redirect('/profile');
});

router.post('/edit-profile', (req, res) => {
    res.redirect('/edit-profile');
});

router.post('/edit-credential', (req, res) => {
    res.redirect('/edit-credential');
});

router.post('/submit-rock', (req, res) => {
    const title = 'game page';
    const value = rockP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const scores = value.scores;
    
    const scoresResult = readScoresBuffer() + scores;
    writeScoresBuffer(scoresResult);

    gamelog(playerOne, playerCom, result, scoresResult);
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scoresResult });
});

router.post('/submit-paper', (req, res) => {
    const title = 'game page';
    const value = paperP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const scores = value.scores;
    
    const scoresResult = readScoresBuffer() + scores;
    writeScoresBuffer(scoresResult);

    gamelog(playerOne, playerCom, result, scoresResult);

    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scoresResult });
});

router.post('/submit-scissors', (req, res) => {
    const title = 'game page';
    const value = scissorsP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const scores = value.scores;
    
    const scoresResult = readScoresBuffer() + scores;
    writeScoresBuffer(scoresResult);

    gamelog(playerOne, playerCom, result, scoresResult);

    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scoresResult });
});

router.get('*', (req, res) => {
    res.status(404);
    res.send('<h1>404 Page not found!</h1>');
});

module.exports = router;