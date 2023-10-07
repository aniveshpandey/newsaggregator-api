const express = require('express');
const {signUp, signIn}= require('./controller.js')
const app = express();
require('dotenv').config();
app.use(express.json());

app.post('/register', signIn);
app.post('/login', signUp);
app.get('/preferences', getPreferences);
app.put('/preferences', );
app.get('/news');
app.post('/news/:id/read');
app.post('/news/:id/favorite');
app.get('/news/read');
app.get('/news/favorite');
app.get('/user/:username');


