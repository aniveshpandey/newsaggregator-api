class User {
  constructor (email, password, privilege = 'normal') {
    this.email = email;
    this.password = password;
    this.privilege = privilege;
    this.preferences = {};
    this.dateCreated = new Date();
    this.read = [];
    this.favorite = [];
  }

  set email(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email))
      throw new Error(`Invalid email ${email}`);
    this._email = email;
  }
  
  get email() {
    return this._email;
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

  // set preferences(prefs){
  //   try {
  //     if(prefs.q)
  //       this._preferences = prefs;
  //   } catch (err) {
  //     throw new Error('Error updating preferences');
  //   }
  // }
  //
  // get preferences() {
  //   return this._preferences;
  // }
}

module.exports = { User };
