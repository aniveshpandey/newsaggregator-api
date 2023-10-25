'use strict';
const { readNews, writeNews } = require('../../etc/file-helper.js');
const path = require('path');
const userCachedb = path.join((__dirname, '../../db/newsdb/'));
const { _fetchDataFromAPI } = require('./L1-cache-manager.js');

const _filterCacheByKeyword = (word, cache, map) => {
  for (let [key, article] in cache){
    if(article.has(word))
      map.set(key, article);
  }
};

const _populateUserCache = (user, globalCache, userCache) => {
  try {
    const keywords = user.preference.q;
    keywords.forEach(word => {
      _filterCacheByKeyword(word, globalCache, userCache);
    });
  } catch(err) {
    console.log('Error populating user cache' + err.message);
    throw err;
  }
  };

const _getNewsById = (id, cache) => {
  try {
    cache.forEach( (article, key) => {
      if(key.id == id)
        return article;
    });
    throw new Error ("Article with id not found");
  } catch(err) {
    console.log("error finding news article by id" + err.message);
    throw err;
  }
};

const initUserCache = (user) => {
  try {
    const cache = readNews(path.join(userCachedb, `${user.email}`))
    if(!cache)
      cache = new Map();
    _populateUserCache(user, globalCache, cache);
    writeNews(path.join(userCachedb, `${user.email}`), cache);
    return cache;
  } catch (err) {
    console.log("Error initializing user cache" + err.message);
    throw err;
  }
 };

//For logout controller which is not implemented yet
const flushUserCache = (user) => {
  try{
    const cache = readNews(path.join(userCachedb, `${user.email}`))
    cache.clear();
    writeNews(path.join(userCachedb, `${user.email}`), cache);
  } catch (err) {
    console.log('Error flushing user cache' + err.message );
    throw err;
  }
};

const getReadNews = (user) => {
  try {
    const readUserNews = new Map();
    const cache = readNews(path.join(userCachedb, `${user.email}`))
    cache.forEach(article => {
      if(article.readFlag)
    readUserNews.set(key, article);
    })
    return readUserNews;
  } catch(err) {
    console.log("Error getting read news" + err.message);
    throw err;
  }
};

const getFavoriteNews = (user) => {
  try {
    const favoriteNews = new Map();
    const cache = readNews(path.join(userCachedb, `${user.email}`))
    cache.forEach(article => {
      if(article.favoriteFlag)
    favoriteNews.set(key, article);
    })
    return favoriteNews;
  } catch(err) {
    console.log("Error getting favorite news" + err.message);
    throw err;
  }
};

module.exports = { initUserCache, flushUserCache, getReadNews, getFavoriteNews };
