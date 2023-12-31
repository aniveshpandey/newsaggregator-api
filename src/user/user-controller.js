'use strict';
require('dotenv').config('../../.env');
const jwtExpiry = eval(process.env.JWT_EXPIRY);
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const { addUser, findUser, modifyUser } = require('./services/user-manager.js');
const { User } = require('./services/user-class.js');
const { validationResult } = require('express-validator');
const path = require('path');
const userdbPath = path.join(__dirname, '../../db/users.json');
const jwt = require('jsonwebtoken');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const registerUser = (req, res) => {
  try {
    validationResult(req).throw();
    const user = new User(req.body.email, bcrypt.hashSync(req.body.password, 8), req.body.privilege);
    addUser(user, userdbPath);
    eventEmitter.emit('register', user);
    res.status(200).send({message: `User with email ${user.email} added`});
  }catch(err){
    res.status(400).send({error: err.message || validationResult(req).array()});
  }
};

const loginUser = (req, res) => {
  try{
    validationResult(req).throw();
    const user = findUser(req.body.email, userdbPath);
    if(!bcrypt.compareSync(req.body.password, user.password))
      res.status(401).send({error: "Invalid Password"});
    else {
      const token = jwt.sign({
        email: user.email, 
        dateCreated: user.dateCreated 
      }, jwtSecret, { expiresIn: jwtExpiry } );
      eventEmitter.emit('login', user);
      res.status(200).send({message: 'SignIn successful', accessToken: token });
    }
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
    if (!req.user.preferences)
      throw new Error("Empty preferences");
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
    eventEmitter.emit('userPrefsUpdated', prefs);
    res.status(200).send({message: `Modified preferences of ${req.user.email}`}); 
  } catch (err) {
    res.status(400).send({error: err.message || validationResult(req).array()});
  }
};

const updateUserReadNews = (req, res) => {
  try {
    const readId = req.params.id;
    if(!req.user.read.includes(readId))
      req.user.read.push(readId);
    const readNews = modifyUser(req.user.email, userdbPath, 'read', req.user.read);
    eventEmitter.emit('readUpdated', req.user, readId);
    res.status(200).send({read: readNews});
  } catch(err) {
    res.status(400).send({error: err.message});
  }
};

const updateUserFavoriteNews = (req, res) => {
  try {
    const favoriteId = req.params.id;
    if(!req.user.favorite.includes(favoriteId))
      req.user.favorite.push(favoriteId);
    const favoriteNews = modifyUser(req.user.email, userdbPath, 'favorite', req.user.favorite);
    eventEmitter.emit('favoriteUpdated',  req.user, favoriteId);
    res.status(200).send({favorite: favoriteNews});
  } catch(err) {
    res.status(400).send({error: err.message});
  }
};

module.exports = { registerUser, loginUser, verifyUser, getPreferences, putPreferences, updateUserReadNews, updateUserFavoriteNews }; 
