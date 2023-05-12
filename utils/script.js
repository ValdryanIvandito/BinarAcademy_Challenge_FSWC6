const fs = require('fs');
const bcrypt = require('bcrypt');

const value = ["scissors", "paper", "rock"];
let valueOne, valueCom;
let scores = 0;

function rockP1() {
    valueOne = "rock";
    const result = gameStart(valueOne);
    return result;
}

function paperP1() {
    valueOne = "paper";
    const result = gameStart(valueOne);
    return result;
}

function scissorsP1() {
    valueOne = "scissors";
    const result = gameStart(valueOne);
    return result;
}

function gameStart(valueOne) {
    valueCom = Math.trunc(Math.random() * 3);
    valueCom = value[valueCom];

    //playerOne Win Scenario
    if(valueOne === 'scissors' && valueCom === 'paper') {
        const result = "PLAYER1 WIN!";
        scores = scores + 1;
        return { valueOne, valueCom, result, scores };
    }

    else if(valueOne === "paper" && valueCom === "rock") {
        const result = "PLAYER1 WIN!";
        scores = scores + 1;
        return { valueOne, valueCom, result, scores };
    }

    else if(valueOne === 'rock' && valueCom === "scissors") {
        const result = "PLAYER1 WIN!";
        scores = scores + 1;
        return { valueOne, valueCom, result, scores };
    }

    //playerCom Win Scenario
    else if(valueCom === 'scissors' && valueOne === "paper") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result, scores };
    }

    else if(valueCom === "paper" && valueOne === "rock") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result, scores };
    }

    else if(valueCom === 'rock' && valueOne === "scissors") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result, scores };
    }

    //Draw Scenario
    else if(valueCom === 'rock' && valueOne === 'rock') {
        const result = "DRAW!";
        return { valueOne, valueCom, result, scores };
    }

    else if(valueCom === 'paper' && valueOne === 'paper') {
        const result = "DRAW!";
        return { valueOne, valueCom, result, scores };
    }

    else {
        const result = "DRAW!";
        return { valueOne, valueCom, result, scores };
    }
}

const gamelog = (playerOne, playerCom, result, scores) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const timestamp = new Date().toLocaleString('en-US', options);
    const newgamelog = {
        timestamp,
        playerOne,
        playerCom,
        result,
        scores
    }
    const dataBuffer = fs.readFileSync('./db/gamelog.json', 'utf-8');
    const gamelog = JSON.parse(dataBuffer);
    gamelog.push(newgamelog);
    fs.writeFileSync('db/gamelog.json', JSON.stringify(gamelog));
}

const readScoresBuffer = () => {
    const scoresBuffer = JSON.parse(fs.readFileSync('./db/scores-buffer.json', 'utf-8'));
    const result = Number(scoresBuffer.scores);
    return result;
}

const writeScoresBuffer = (scoresResult) => {
    const result = { scores: 0 };
    result.scores = scoresResult;
    fs.writeFileSync('./db/scores-buffer.json', JSON.stringify(result));
}

const readCurrentUser = () => {
    const userBuffer = JSON.parse(fs.readFileSync('./db/user-buffer.json', 'utf-8'));
    const result = userBuffer.username;
    return result;
}

const writeCurrentUser = (username) => {
    const result = { username: "anonymous" };
    result.username = username;
    fs.writeFileSync('./db/user-buffer.json', JSON.stringify(result));
}

// find profile by name
const findProfile = (username) => {
    const profiles = loadProfiles();
    const profile = profiles.find(
        (profile) => profile.username.toLowerCase() === username.toLowerCase()
    );

    return profile;
}

// load profile data from user-profiles.json
const loadProfile = (username) => {
    const profiles = loadProfiles();
    const filteredProfile = profiles.filter((profiles) => profiles.username == username);
    return filteredProfile[0];
}

// load profiles data from user-profiles.json
const loadProfiles = () => {
    const dataBuffer = fs.readFileSync('./db/user-profiles.json', 'utf-8');
    const profiles = JSON.parse(dataBuffer);
    return profiles;
}

// load credentials data from user-credentials.json
const loadCredentials = () => {
    const dataBuffer = fs.readFileSync('./db/user-credentials.json', 'utf-8');
    const credentials = JSON.parse(dataBuffer);
    return credentials;
}

// Write & replace user-profiles.json file with new data
const saveProfiles = (profiles) => {
    fs.writeFileSync('./db/user-profiles.json', JSON.stringify(profiles));
}

// Write & replace user-credentials.json file with new data
const saveCredentials = (profiles) => {
    fs.writeFileSync('./db/user-credentials.json', JSON.stringify(profiles));
}

// Add new profile data
const addProfile = (profile) => {
    const username = profile.username;
    const sex = profile.sex;
    const birthday = profile.birthday;
    const hobby = profile.hobby;
    const profiles = loadProfiles();
    profiles.push( {username, sex, birthday, hobby});
    saveProfiles(profiles);
}

// Add new credential data
const addCredential = (profile) => {
    const username = profile.username;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(profile.username, salt);
    const credentials = loadCredentials();
    credentials.push({ username, hashedPassword });
    saveCredentials(credentials);
}

// Check for duplicate name
const checkDuplicate = (username) => {
    const profiles = loadProfiles();
    return profiles.find((profile) => profile.username === username);
}

// Delete profile
const deleteProfile = (username) => {
    const profiles = loadProfiles();
    const filteredProfiles = profiles.filter((profile) => profile.username !== username);
    saveProfiles(filteredProfiles);
}

// Update profiles
const updateProfiles = (newProfile) => {
    const profiles = loadProfiles();
    // delete old profile which is same as old name
    const filteredProfiles = profiles.filter((profiles) => profiles.username !== newProfile.oldUsername);
    delete newProfile.oldUsername;
    filteredProfiles.push(newProfile);
    saveProfiles(filteredProfiles);
}

module.exports = { rockP1, paperP1, scissorsP1, gamelog, readScoresBuffer, writeScoresBuffer, loadProfile, loadProfiles, findProfile, saveProfiles, addProfile, checkDuplicate, deleteProfile, updateProfiles, addCredential, writeCurrentUser, readCurrentUser };