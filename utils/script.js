const fs = require('fs');
const value = ["scissors", "paper", "rock"];
let valueOne, valueCom;

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
        return { valueOne, valueCom, result };
    }

    else if(valueOne === "paper" && valueCom === "rock") {
        const result = "PLAYER1 WIN!";
        return { valueOne, valueCom, result };
    }

    else if(valueOne === 'rock' && valueCom === "scissors") {
        const result = "PLAYER1 WIN!";
        return { valueOne, valueCom, result };
    }

    //playerCom Win Scenario
    else if(valueCom === 'scissors' && valueOne === "paper") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result };
    }

    else if(valueCom === "paper" && valueOne === "rock") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result };
    }

    else if(valueCom === 'rock' && valueOne === "scissors") {
        const result = "COM WIN!";
        return { valueOne, valueCom, result };
    }

    //Draw Scenario
    else if(valueCom === 'rock' && valueOne === 'rock') {
        const result = "DRAW!";
        return { valueOne, valueCom, result };
    }

    else if(valueCom === 'paper' && valueOne === 'paper') {
        const result = "DRAW!";
        return { valueOne, valueCom, result };
    }

    else {
        const result = "DRAW!";
        return { valueOne, valueCom, result };
    }
}

const gamelog = (playerOne, playerCom, result) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const timestamp = new Date().toLocaleString('en-US', options);
    const newgamelog = {
        timestamp,
        playerOne,
        playerCom,
        result
    }
    const dataBuffer = fs.readFileSync('./db/gamelog.json', 'utf-8');
    const gamelog = JSON.parse(dataBuffer);
    gamelog.push(newgamelog);
    fs.writeFileSync('db/gamelog.json', JSON.stringify(gamelog));
}

module.exports = { rockP1, paperP1, scissorsP1, gamelog };