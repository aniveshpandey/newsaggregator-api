const bcrypt = require('bcrypt');
const { User, UserManager } = require('./userhandler.js');
const um = new UserManager();
const jwt = require('jsonwebtoken');


const createUserFromReq = (req) => {
  const { username, fullName, email, privilege } = req.body;
  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  const newUser = new User(fullName, email, privilege, password);  
  um.createUser(username, newUser);
}

const findUserFromReq = (req) => {
    const username = req.body.username;
    const email = req.body.email;
    if (username) 
      return um.findUserByUsername(username);
    else if (email)
      return um.findUserByEmail(email);
    else 
      throw new Error('Something went wrong finding the user');
} 

const verifyToken = (req, res, next) => {
  const authHeader = req.header.authorizarion;
  const payload = jwt.decode(authHeader);
  if(!payload)
    throw new Error('Error decoding');
  req.user = um.findUserByEmail(payload.email);
  next();
  };
const sendError  = (err) => {
  return res.status(400).send({error: err});
};

const signUp = (req, res) => {
  try {
    createUserFromReq(req);
    res.status(200).send({message: "User Created"});
  } catch (err){
    sendError(err);
  }
};
const signIn = (req, res) => {
  try {
    const user = findUserFromReq(req);
    const password = req.body.password;
    if (!bcrypt.compareSync(password, user.password))
      throw new Error("Invalid Password");
    const token = jwt.sign({
      email: user.email,
      dateCreated: user.dateCreated,
    }, process.env.API_SECRET,{
        expiresIn: 86400
    });
    res.status(200).send({
      fullName: user.fullName, 
      email: user.email,
      dateCreated: user.dateCreated,
      message: 'Login Successful',
      token: token,
    });
  }catch(err){
    sendError(err);
  }
};
const getPreferences = (req, res) => {
  try{
    const user = req.user;
    res.status(200).send(user.preference);
  } catch(err){
    sendError(err);
  }
};
const putPreferences = (req, res) => {
  const prefs = req.prefs;
  const 
};
const getNews = (req, res) => {};
const postNewsRead = (req, res) => {};
const postNewsFavorite = (req, res) => {};
const getNewsRead = (req, res) => {};
const getNewsFavorite = (req, res) => {};
const getUser = (req, res) => {};

module.exports = {signIn, signUp}
