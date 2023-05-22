const bcrypt = require('bcrypt');
const fs = require('fs');

//PART-2 LOGIN AND COMPARE PASSWORD
const passwordCheck = 'myPassword123';
const credential = fs.readFileSync('./db/testPassword.json', 'utf-8');
const storedHashedPassword = credential.hashedPassword;
console.log(storedHashedPassword);

const isPasswordCorrect = bcrypt.compareSync(passwordCheck, storedHashedPassword);

console.log(isPasswordCorrect); // true