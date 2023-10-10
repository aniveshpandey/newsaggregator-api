const { readUsers, writeUsers } = require("./userFileHelper");

class User {
  constructor (email, password, privilege = 'normal') {
    this.email = email;
    this.password = password;
    this.privilege = privilege;
    this.preferences = {};
    this.dateCreated = new Date();
  }
  set privilege(val) {
    switch (val){
      case 'normal': {
        this._privilege = 'normal';
        break;
      }
      case 'admin': {
        this._privilege = 'admin';
        break;
      }
      default:
        throw new Error('Invalid Privilege');
    }
  }
  get privilege() {
    return this._privilege;
  }
  updatePreferences(prefs){
    try {
      this.preferences = prefs;
    } catch (err) {
      throw new Error('Error updating preferences');
    }
  }
}


const addUser = (user, path) => {
  try {
    const userdb = readUsers(path);
    userdb.forEach( registeredUser => {
      if(registeredUser.email === user.email)
        throw new Error(`User with email ${user.email} already exists`);
    } );
    userdb.add(user);
    console.log(userdb);
    writeUsers(path, userdb);
  } catch(err){
    console.log('Error trying to add new user')
    throw err;
  }
};

const findUser = (email, path) => {
  try {
    const userdb = readUsers(path);
    for (const user of userdb){
      if (user.email === email)
        return user;
    }
    throw new Error('User Not Found');
  } catch(err){
    console.log('Error trying to find user');
    throw err;
  }
}

module.exports = {User, addUser, findUser};