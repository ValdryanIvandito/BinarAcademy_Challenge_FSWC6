const express = require('express');
const bcrypt = require('bcrypt');
const { rockP1, paperP1, scissorsP1, gamelog, readScoresBuffer, writeScoresBuffer, loadProfile, loadProfiles, findProfile, saveProfiles, addProfile, checkDuplicate, deleteProfile, updateProfiles, addCredential, writeCurrentUser, readCurrentUser, loadCredential } = require('../utils/script.js');
const { body, validationResult, check } = require('express-validator');
const router = express.Router();
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const { Pool } = require('pg');

require('../utils/db');
const User_Profile = require('../model/credential');

// Konfigurasi koneksi database
const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'fswc6'
  });

// setup method override
router.use(methodOverride('_method'));

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

router.get('/rank', (req, res) => {
    pool.query('SELECT * FROM user_history ORDER BY scores DESC', (error, results) => {
      if (error) {
        console.error('Error executing query', error);
        res.send('An error occurred');
      } else {
        const title = 'rank page';
        res.status(200);
        res.render('rank', { title, leaderboard: results.rows });
      }
    });
  });

router.post('/index', (req, res) => {
    res.redirect('/');
});

router.post('/sign-up', (req, res) => {
    res.redirect('/sign-up');
});

router.post('/login', (req, res) => {
    res.redirect('/login');
});

router.post('/rank', (req, res) => {
    res.redirect('/rank');
});

router.post('/game', (req, res) => {
    const title = 'game page';
    const playerOne = null;
    const playerCom = null;
    const result = null;
    const scores = readScoresBuffer();
    const username = readCurrentUser();
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, username, scores });
});

router.post('/restart', (req, res) => {
    const title = 'game page';
    const playerOne = null;
    const playerCom = null;
    const result = null;
    const scores = readScoresBuffer();
    const username = readCurrentUser();
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, username, scores });
});

router.post('/back-profile', async (req, res) => {
    const username = readCurrentUser();
    const scores = readScoresBuffer();
    const user_profile = await User_Profile.findOne({ username });
    const title = 'profile page';
    const sex = user_profile.sex;
    const birthday = user_profile.birthday;
    const hobby = user_profile.hobby;

    res.status(200);
    res.render('profile', { title, scores, username, sex, birthday, hobby });
});

router.post('/check-credential', async (req, res) => {
    const user_profile = await User_Profile.findOne({ username: req.body.username });

    if (user_profile === null) {
        console.log('Credential is not valid');
        const errors = 'Incorrect username!';
        res.render('login', { 
            title: 'login page',
            errors,
        });
    } else {
        const passwordCheck = req.body.password;
        const storedHashedPassword = user_profile.hashedPassword;

        bcrypt.compare(passwordCheck, storedHashedPassword, async (err, isPasswordCorrect) => {
            const result = await pool.query(`SELECT scores FROM user_history WHERE username = '${ req.body.username }'`);
            const scores = result.rows.map(row => row.scores);
            writeScoresBuffer(scores);

            if (err) {
                console.log('Error comparing passwords:', err);
                res.status(500).send('<h1>Internal Server Error</h1>');
            } else if (isPasswordCorrect) {
                const title = 'profile page';
                const username = user_profile.username;
                const sex = user_profile.sex;
                const birthday = user_profile.birthday;
                const hobby = user_profile.hobby;

                writeCurrentUser(username);
                res.status(200);
                res.render('profile', { title, scores, username, sex, birthday, hobby });
            } else {
                console.log('Incorrect password');
                const errors = 'Incorrect password!';
                res.render('login', { 
                    title: 'login page',
                    errors,
                });
            }
        });
    }
});

// add profile data 
router.post('/profile', [
    body('username').custom(async (value) => {
        const duplicate = await User_Profile.findOne({ username: value });
        if (duplicate) {
            throw new Error('Username already exists!');
        }
        return true;
    }),
    body('confirm-password').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        res.render('sign-up', { 
            title: 'sign-up page',
            errors: errors.array(),
        });
    } else {
        const title = 'profile page';
        const username = req.body.username;
        const sex = req.body.sex;
        const birthday = req.body.birthday;
        const hobby = req.body.hobby;
        const scores = 0;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        // Hash the password using the salt
        const passwordGenerate = req.body.password;
        const hashedPassword = bcrypt.hashSync(passwordGenerate, salt);

        writeCurrentUser(username);
        writeScoresBuffer(scores);
        User_Profile.insertMany({ username, sex, birthday, hobby, hashedPassword });

        const profile = await User_Profile.findOne({ username: req.body.username });
        const _id = profile._id;

        const query = `
            INSERT INTO user_history (_id, username, scores, created_on)
            VALUES ($1, $2, $3, NOW())
            RETURNING *;`;

        const values = [_id, username, scores];
        const result = await pool.query(query, values);

        res.status(200);
        res.render('profile', { title, scores, username, sex, birthday, hobby });
    }
});

// profile data edit form
router.post('/profile/edit/', async (req, res) => {
    const profile = await User_Profile.findOne({ username: req.body.username });

    const title = 'edit page';
    const oldUsername = profile.username;
    const username = profile.username;
    const sex = profile.sex;
    const birthday = profile.birthday;
    const hobby = profile.hobby;
    const _id = profile._id;

    res.render('edit-profile', { title, oldUsername, username, sex, birthday, hobby, _id });
});

// process data edit 
router.put('/profile', async (req, res) => {   
    const errors = validationResult(req);
    const oldUsername = req.body.username;
    const username = req.body.username;
    const sex = req.body.sex;
    const birthday = req.body.birthday;
    const hobby = req.body.hobby;
    const _id = req.body._id;

    if (!errors.isEmpty()) {
        res.render('edit-profile', { 
            title: 'profile data edit form',
            errors: errors.array(),
            oldUsername,
            username,
            sex,
            birthday,
            hobby,
            _id,
        });
    } else { 
        const query = `
        UPDATE user_history
        SET username = $1
        WHERE _id = $2
        RETURNING *;`;

        const id = `"${_id}"`;
        const values = [username, id];
        const result = await pool.query(query, values);

        User_Profile.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    username: req.body.username,
                    sex: req.body.sex,
                    birthday: req.body.birthday,
                    hobby: req.body.hobby,
                },
            }
        ).then(async result => {
            const profile = await User_Profile.findOne({ username: req.body.username });
            const title = 'profile page';
            const username = profile.username;
            const sex = profile.sex;
            const birthday = profile.birthday;
            const hobby = profile.hobby;
            const scores = readScoresBuffer();

            res.status(200);
            res.render('profile', { title, scores, username, sex, birthday, hobby });
        });
    }
});

// delete profile data 
router.delete('/profile', async (req, res) => {
    const query = `DELETE FROM user_history WHERE username = '${ req.body.username }'`;
    const result = await pool.query(query);

    User_Profile.deleteOne({ username: req.body.username }).then((result) => {
        res.redirect('/');
    }); 
});

router.post('/submit-rock', (req, res) => {
    const title = 'game page';
    const value = rockP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const newScores = value.scores;
    const scores = readScoresBuffer() + newScores;
    const username = readCurrentUser();
    writeScoresBuffer(scores);

    const query = `
        UPDATE user_history
        SET scores = $1
        WHERE username = $2
        RETURNING *;`;

        const values = [scores, username];
        const _result = pool.query(query, values);

    gamelog(playerOne, playerCom, result, scores);

    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scores, username });
});

router.post('/submit-paper', (req, res) => {
    const title = 'game page';
    const value = paperP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const newScores = value.scores;
    const scores = readScoresBuffer() + newScores;
    const username = readCurrentUser();
    writeScoresBuffer(scores);

    const query = `
        UPDATE user_history
        SET scores = $1
        WHERE username = $2
        RETURNING *;`;

        const values = [scores, username];
        const _result = pool.query(query, values);

    gamelog(playerOne, playerCom, result, scores);

    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scores, username });
});

router.post('/submit-scissors', (req, res) => {
    const title = 'game page';
    const value = scissorsP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    const newScores = value.scores;
    const scores = readScoresBuffer() + newScores;
    const username = readCurrentUser();
    writeScoresBuffer(scores);

    const query = `
        UPDATE user_history
        SET scores = $1
        WHERE username = $2
        RETURNING *;`;

        const values = [scores, username];
        const _result = pool.query(query, values);

    gamelog(playerOne, playerCom, result, scores);

    res.status(200);
    res.render('game', { title, playerOne, playerCom, result, scores, username });
});

router.get('*', (req, res) => {
    res.status(404);
    res.send('<h1>404 Page not found!</h1>');
});

module.exports = router;