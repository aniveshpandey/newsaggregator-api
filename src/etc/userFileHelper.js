const fs = require('fs');
// const {User} = require('./usermanager.js');

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



// console.log(readData);

//
// const user1 = new User('Adam', 'asdfjkl;', 'normal');
// const user2 = new User('Adele', 'asdfjkl;', 'admin');
// // const user3 = new User('Alex', 'asdfjkl;');
// const userSet = new Set();
// //
// userSet.add(user1);
// userSet.add(user2);
// //
// writeUsers('../db/users', userSet);
// //
// //
// const fileData1 = readUsers('../db/users');
// console.log(fileData1);
// //
// userSet.add(user3);
// writeUsers('../db/file', userSet);
// const fileData2 = readUsers('../db/file');
// console.log(fileData2);
