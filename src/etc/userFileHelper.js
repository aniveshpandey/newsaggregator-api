const fs = require('fs');
// const {User} = require('../user/user-manager.js');
const path = require('path');
const filePath = path.join(__dirname, '../../db/users');

const readUsers = function (path){
  try {
    const data = fs.readFileSync(path);
    return new Set(Array.from(JSON.parse(data.toString())));
  } catch (err){
    console.log(err);
  }
};
const writeUsers = function (path, userSet) {
  try {
    fs.writeFileSync(path, JSON.stringify(Array.from(userSet)));
  } catch(err) {
    console.log(err);
  }
}


module.exports = {readUsers, writeUsers};

// const user1 = new User('Adam@exmaple.com', 'asdfjkl;', 'normal');
// const user2 = new User('Adele@example.com', 'asdfjkl;', 'admin');
// // const user3 = new User('Alex', 'asdfjkl;');
// const userSet = new Set();
// //
// userSet.add(user1);
// userSet.add(user2);
// //
// writeUsers(filePath, userSet);
// //
// //
// const fileData1 = readUsers(filePath);
// console.log(fileData1);
// //
// userSet.add(user3);
// writeUsers('../db/file', userSet);
// const fileData2 = readUsers('../db/file');
// console.log(fileData2);
