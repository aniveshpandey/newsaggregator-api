'use strict';
require('dotenv').config('../../.env');
const apiKey = process.env.NEWS_API_KEY;
const maxPage = eval(process.env.MAX_CACHE_PAGE);
const fetchInterval = eval(process.env.CACHE_FETCH_INTERVAL);
const flushInterval = eval(precess.env.CACHE_FLUSH_INTERVAL);
const flushElements = eval(process.env.CACHE_FLUSH_ELEMENTS);
const { validationResult } = require('express-validator');
const { initCache, flushCache, getNewsById, getNewsByPreferences, fetchNewsbyParams } = require('./news-cachemanager.js');
const { modifyUser } = require('../user/usermanager.js');

const globalPrefs = {
  country: 'in,us,ru',
  language: 'en,hi,bn,mr,ta',
  category: 'business,politics,science,technology,sports',
};

const newsCache = [];
initCache(newsCache, globalPrefs, fetchInterval, maxPage);
flushCache(newsCache, flushInterval, flushElements);

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

const searchNews = (req, res) => {
  try {
    const newsArray = [];
    fetchNewsbyParams(req.params.keyword, apiKey, newsArray);  
    res.status(200).send(newsArray);  
  } catch(err) {
    res.status(400).send({error: err.message});
  }
}

module.exports = { getUserNews, getReadNews, getFavoriteNews, searchNews};
