class User {
  constructor(fullName, email, privilege, password){
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.privilege = privilege;
    this.dateCreated = new Date();
    this.preference = [];
    this.isValidUser();
  }
  isValidUser(){
    const emailRegex = /^[A-Za-z0-9.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!fullName)
      throw new Error('Invalid Name');
    if(!emailRegex.test(this.email))
      throw new Error('Invalid Email');
    if(typeof this.password != "string" || !this.password.length)
      throw new Error('Invalid Password Length');
    if(!["normal","admin"].includes(this.privilege))
      throw new Error('Invalid Privilege');
  }
  addPreference(...prefs){
    prefs.forEach(pref => this.preference.push(pref));
    }
  removePreference(...prefs){
    this.preference = this.preference.filter(pref => !prefs.includes(pref));
  }
}

class UserManager {
  constructor() {
    this.map = new Map();
    this.emailSet = new Set();
  }
  isUsername(username) {
    if (!username || username.length < 3) throw new Error(`Invalid Username ${username}`);
    return this.map.has(username);
  }
  _errorUsernameExists(username) {
    if (this.isUsername(username)) {
      throw new Error(`User with Username ${username} already exists`);
    }
  }
  _errorUsernameMissing(username) {
    if (!this.isUsername(username)) {
      throw new Error(`User with Username ${username} does not exist`);
    }
  }
  _errorNoUser() {
    if (this.map.size === 0) {
      throw new Error(`No users in the map`);
    }
  }

  isEmail(email) {
    if (!email && email.length < 5) throw new Error(`Invalid email  ${email}`);
    return this.emailSet.has(email);
  }
  _errorEmailExists(email) {
    if (this.isEmail(email)) {
      throw new Error(`User with Email ${email} already exists`);
    }
  }
  _errorEmailMissing(email) {
    if (!this.isEmail(email)) {
      throw new Error(`User with Email ${email} does not exist`);
    }
  }
  _errorNoEmail() {
    if (this.emailSet.size === 0) {
      throw new Error(`No emails in the set`);
    }
  }

  createUser(username, user) {
    this._errorUsernameExists(username);
    this._errorEmailExists(user.email);
    this.map.set(username, user);
  }
  findUserByUsername(username) {
    this._errorUsernameMissing(username);
    return this.map.get(username);
  }
  findUserByEmail(email){
    this._errorEmailMissing(email);
    const userArray = this.readAllUsersWithoutUsername();
    const user = userArray.find((user) => user.email === email);
    if(!user)
      throw new Error('User Not Found');
    return user;
  }

  updateUser(username, user) {
    this._errorUsernameMissing(username);
    this.map.set(username, user);
  }   
  deleteUser(username) {
    this._errorUsernameMissing(username);
    this.map.delete(username);
  }

  readAllUsers() {
    this._errorNouser();
    const userArray = [];
    this.map.forEach((value, key) => userArray.push({ key, value }));
    return userArray;
  }
  readAllUsersWithoutUsername() {
    this._errorNoUser();
    const userArray = [];
    this.map.forEach((value) => userArray.push(value));
    return userArray;
  }
  deleteAllUsers() {
    this._errorNoUser();
    this.map.clear();
  }


}

module.exports = { User, UserManager };
