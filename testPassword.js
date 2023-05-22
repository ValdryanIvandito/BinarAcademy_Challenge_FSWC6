const bcrypt = require('bcrypt');
const fs = require('fs');

// PART-1 GENERATE HASHED PASSWORD
// Generate a salt to use for the hash
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// Hash the password using the salt
const passwordGenerate = 'myPassword123';
const hashedPassword = bcrypt.hashSync(passwordGenerate, salt);

const username = 'Denny Jusman';

const credential = { username, hashedPassword };

fs.writeFileSync('./db/testPassword.json', JSON.stringify(credential));

// fs.writeFileSync('./db/testPassword.json', JSON.stringify(hashedPassword));

console.log(`This is HashedPassword: ${hashedPassword}`); // $2b$10$83hmJ1Q6.2SWB25NRhB6/OYs1wK9inZ6S27Wu5hU1kKoULfQf8h/q
