'use strict';

require('dotenv').config('../../.env');
const apiKey = process.env.NEWS_API_KEY;
const url = process.env.NEWS_API_URL;
const maxPage = eval(process.env.MAX_CACHE_PAGE);
const refreshInterval = eval(process.env.CACHE_REFRESH_INTERVAL);
const expiryInterval = eval(process.env.CACHE_EXPIRY_INTERVAL);
const { validationResult } = require('express-validator');
const { initGlobalCache, searchNewsByKeyword } = require("./services/L1-cache-manager.js");
const { initUserCache, getUserReadNews, getUserFavoriteNews } = require("./services/L2-cache-manager.js");
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const globalCache = new Map();
const userCache = {};

initGlobalCache(globalCache, apiKey, url, maxPage, refreshInterval, expiryInterval);
eventEmitter.on('login', (user) => {
  if(!userCache[user])
    userCache[user] = initUserCache(user);
    eventEmitter.emit('user_cache_initialized', user);
});

const getUserNews = (req, res) => {
  try {
    const user = req.user;
    const cache = userCache[user];
    if(!cache)
      throw new Error('User Cache not availible');
    res.status(200).send({articles: cache});
  } catch(err){
    res.status(400).send({ message: "Error getting user news", error: err.message});
  }
};

const getReadNews = (req, res) => {
  try {
    const user = req.user;
    const cache = userCache[user];
    const newsArray = [];
    cache.forEach(article => {
      if(article.readFlag)
        newsArray.push(article);
    })
    res.status(200).send({articles: newsArray});
  } catch(err){
    res.status(400).send({ message: "Error getting user read news", error: err.message});
  }
};

const getFavoriteNews = (req, res) => {
  try {
    const user = req.user;
    const cache = userCache[user];
    const newsArray = [];
    cache.forEach(article => {
      if(article.favoriteFlag)
        newsArray.push(article);
    })
    res.status(200).send({articles: newsArray});
  } catch(err){
    res.status(400).send({ message: "Error getting user favorite news", error: err.message});
  }
};

const searchNews = (req, res) => {
  try {
    const keyword = req.params.keyword;
    const news = searchNewsByKeyword(keyword, globalCache);
    res.status(200).send({articles: news});
  } catch(err) {
    res.status(400).send({ message: "Error searching news", error: err.message});
  }
};

module.exports = { getUserNews, getReadNews, getFavoriteNews, searchNews };
