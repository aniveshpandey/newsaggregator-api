'use strict';
require('dotenv').config();
const apiKey = process.env.NEWS_API_KEY;
const maxPage = eval(process.env.MAX_CACHE_PAGE);
const { validationResult } = require('express-validator');
const { initCache, getNewsById, getNewsByPreferences } = require('./newscache.js');
const { modifyUser } = require('./usermanager.js');

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

const getReadNews = (req, res) => {
  try {
    const readNews = req.user.read;
    if(!readNews) res.status(404).send({error: "Not read any News"});
    const newsArray = [];
    readNews.forEach((id) => {
      newsArray.push(getNewsById(newsCache,id));
    });
    res.status(200).send({read: newsArray});
  } catch (err) {
    res.status(400).send({error: err.message});
  }
};

const getFavoriteNews = (req, res) => {
  try {
    const favoriteNews = req.user.favorite;
    if(!favoriteNews) res.status(404).send({error: "Not favorited any News"});
    const newsArray = [];
    favoriteNews.forEach((id) => {
      newsArray.push(getNewsById(newsCache,id));
    });
    res.status(200).send({read: favoriteNews});
  } catch (err) {
    res.status(400).send({error: err.message});
  }
};

module.exports = { getUserNews, getReadNews, getFavoriteNews};
