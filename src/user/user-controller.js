require('dotenv').config('../../.env');
const jwtExpiry = eval(process.env.JWT_EXPIRY);
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const { User, addUser, findUser, modifyUser } = require('./user-manager.js');
const { validationResult } = require('express-validator');
const path = require('path');
const userdbPath = path.join(__dirname, '../../db/users');
const jwt = require('jsonwebtoken');

const registerUser = (req, res) => {
  try {
    validationResult(req).throw();
    const user = new User(req.body.email, bcrypt.hashSync(req.body.password, 8), req.body.privilege);
    addUser(user, userdbPath);
    res.status(200).send({message: `User with email ${user.email} added`});
  }catch(err){
    res.status(400).send({error: err.message || validationResult(req).array()});
  }
};

const loginUser = (req, res) => {
  try{
    validationResult(req).throw();
    const user = findUser(req.body.email, userdbPath);
    const token = jwt.sign({
    email: user.email, 
    dateCreated: user.dateCreated 
    }, jwtSecret, { expiresIn: jwtExpiry } );
    res.status(200).send({message: 'SignIn successful', accessToken: token });
  }catch(err){
    res.status(400).send({error: err.message || validationResult(req)});
  }
};

const verifyUser = (req, res, next) =>{
  try {
    validationResult(req).throw();
    let payload = '';
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        res.status(403).send({error: 'Invalid Token ' + err.message });
      payload = decoded;
    });
    req.user = findUser(payload.email, userdbPath);
    next();
  } catch(err){
    res.status(400).send({error: err.message || validationResult(req).array()});
  }
};

const getPreferences = (req, res) => {
  try {
    res.status(200).send({preferences: req.user.preferences});
  } catch (err) {
    res.status(400).send({error: err.message });
  } 
};

const putPreferences = (req, res) => {
  try {
    // validationReault(req).throw();
    const preferences = req.body.preferences;
    const prefs = modifyUser(req.user.email, userdbPath, 'preferences', preferences);
    res.status(200).send({message: `Modified preferences of ${req.user.email}`}); 
  } catch (err) {
    res.status(400).send({error: err.message || validationResult(req).array()});
  }
}

const updateUserReadNews = (req, res) => {
  try {
    const readId = req.params.id;
    req.user.read.push(readId);
    const readNews = modifyUser(req.user.email, userdb, 'read', req.user.read);
    res.status(200).send({read: readNews});
  } catch(err) {
    res.status(400).send({error: err.message});
  }
};
const updateUserFavoriteNews = (req, res) => {
  try {
    const favoriteId = req.params.id;
    req.user.favorite.push(favoriteId);
    const favoriteNews = modifyUser(req.user.email, userdb, 'favorite', req.user.favorite);
    res.status(200).send({read: favoriteNews});
  } catch(err) {
    res.status(400).send({error: err.message});
  }
};


module.exports = { registerUser, loginUser, verifyUser, getPreferences, putPreferences, updateUserReadNews, updateUserFavoriteNews }; 
