const { readUsers, writeUsers } = require("../etc/fileHelper.js");
const { User } = require('./user-class.js');

const addUser = (user, path) => {
  try {
    const userdb = readUsers(path);
    userdb.forEach( registeredUser => {
      if(registeredUser.email === user.email)
        throw new Error(`User with email ${user.email} already exists`);
    } );
    userdb.set(user.email, user);
    // console.log(userdb);
    writeUsers(path, userdb);
  } catch(err){
    console.log('Error trying to add new user')
    throw err;
  }
};

const findUser = (email, path) => {
  try {
    const userdb = readUsers(path);
    const user = userdb.get(email);
    if(!user)
      throw new Error('User Not Found');
    return user;
  } catch(err){
    console.log('Error trying to find user');
    throw err;
  }
};

const modifyUser = (email, path, prop, value) => {
  try {
    const userdb = readUsers(path);
    const user = findUser(email, path);
    if (!Object.hasOwn(user, prop))
       throw new Error ('User does not have that property');
    user[prop] = value;
    user.dateModified = Date.now();
    writeUsers(path, userdb);
    return user.prop;
  } catch(err){
    throw new Error(`Error modifying property of ${user} : ${err.message}`);
  }
};

module.exports = {User, addUser, findUser, modifyUser};
