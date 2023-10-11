'use strict';
require('dotenv').config();
const apiKey = process.env.NEWS_API_KEY;
const maxPage = process.env.MAX_CACHE_PAGE;
const { validationResult } = require('express-validator');
const { initCache, getNewsById, getNewsByPreferences } = require('./newscache.js');

const globalPrefs = {
  country: 'in,us,ru',
  language: 'en,hi,bn,mr,ta',
  category: 'business,politics,science,technology,sports',
};

const newsCache = [];
initCache(newsCache, globalPrefs, maxPage);

const getUserNews = (req, res) => {
  try {
    const prefs = req.user.prefs;
    const userNews = getNewsByPreferences(prefs, newsCache);
    res.status(200).send(userNews);
  } catch(err){
    res.status(400).send({error: err.message});
  }
};


module.exports = { getUserNews };




