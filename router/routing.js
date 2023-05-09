const express = require('express');
const { rockP1, paperP1, scissorsP1, gamelog } = require('../utils/script.js');

const router = express.Router();

router.get('/', (req, res) => {
    const title = 'landing page';
    res.status(200);
    res.render('index', { title });
});

router.get('/game', (req, res) => {
    const title = 'game page';
    const playerOne = null;
    const playerCom = null;
    const result = null;
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result });
});

router.post('/submit-game', (req, res) => {
    res.redirect('game');
});

router.post('/submit-index', (req, res) => {
    res.redirect('/');
});

router.post('/submit-restart', (req, res) => {
    res.redirect('/game');
});

router.post('/submit-rock', (req, res) => {
    const title = 'game page';
    const value = rockP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    gamelog(playerOne, playerCom, result);
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result });
});

router.post('/submit-paper', (req, res) => {
    const title = 'game page';
    const value = paperP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    gamelog(playerOne, playerCom, result);
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result });
});

router.post('/submit-scissors', (req, res) => {
    const title = 'game page';
    const value = scissorsP1();
    const playerOne = value.valueOne;
    const playerCom = value.valueCom;
    const result = value.result;
    gamelog(playerOne, playerCom, result);
    res.status(200);
    res.render('game', { title, playerOne, playerCom, result });
});

router.get('*', (req, res) => {
    res.status(404);
    res.send('<h1>404 Page not found!</h1>');
});

module.exports = router;