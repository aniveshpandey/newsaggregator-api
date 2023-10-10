require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, addUser, findUser } = require('./usermanager.js');
const { validationResult } = require('express-validator');
const userdbPath = '../db/users';
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
    }, process.env.JWT_SECRET, { expiresIn: '1h' } );
    res.status(200).send({message: 'SignIn successful', accessToken: token });
  }catch(err){
    res.status(400).send({error: err.message || validationResult(req)});
  }
};

module.exports = { registerUser, loginUser }; 
