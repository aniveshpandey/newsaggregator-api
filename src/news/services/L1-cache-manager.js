'use strict';
const crypto = require('crypto');
const axios = require('axios');
const { globalPreferences, updateGlobalPreferences } = require('./global-preferences.js');
const { Article } = require('./article-class.js');
const EventEmitter = require('events');
const { Console } = require('console');
const eventEmitter = new EventEmitter();

// const _queryFromPrefs = (prefs, key, page) => {
//   const query = '';
//   for (let prop in prefs){
//     let string = `${prop}=${prefs[prop].join('+OR+')}&`
//     query +=string;
//   }
//   let result;
//   if(query)
//     result = `${query}&page=${page}&apiKey=${key}`;
//   else
//     result = `page=${page}&apiKey=${key}`;
//   if(result.length > 500)
//     throw new Error("Query too long");
//   return result;
// };
//
const _fetchDataFromAPI = async (prefs, key, url, maxPage) => {
  try{ const dataArray = [];
    for (let i = 1 ; i <= maxPage; i++){
      const query = prefs;
      query.apiKey = key;
      const data = await axios.get(url, { params: query });
      if (data.status != 'ok')
        throw new Error ('Invalid data received from API');
      dataArray.push(data.articles);
    }
    return dataArray;
 } catch(err) {
    console.error('Error fetching data: ' + err.message);
    throw err;
  }
};

const _populateCache = async (cache, prefs, key, url, maxPage) => {
  try { 
    let data = [];
    data = await _fetchDataFromAPI(prefs, key, url, maxPage);
    console.log(data);
    data.forEach(article => {
    const newsArticle = new Article(article);
    const cacheKey = { id: crypto.randomUUID(), fetchedAt:  newsArticle.fetchedAt };
    cache.set(cacheKey, newsArticle);
    });
  } catch (err){
    console.log("Error populating cache: " + err.message);
    throw err;
  }
};

const _flushCache = (cache, expiryInterval) => {
  try {
    cache.forEach(  (_, key)  => {
      const timeDifference = new Date() - key.fetchedAt;
      if(timeDifference > expiryInterval)
        cache.delete(key);
    });
  } catch(err) {
    console.log("Error flushing cache: " + err.message);
    throw err;
  }
};

const initGlobalCache = (cache, key, url, maxPage, refreshInterval, expiryInterval) => {
  eventEmitter.on('globalPrefsUpdated', (globalPreferences) => {
    globalPrefs = globalPreferences;
    try{
      let globalPrefs = {};
       eventEmitter.on('userPrefsUpdated', updateGlobalPreferences);
  
       _populateCache(cache, globalPrefs, key, url, maxPage);
        eventEmitter.emit('globalCacheInitialized', cache);
        setInterval (() => {
        _flushCache(cache, expiryInterval);
        _populateCache(cache, globalPrefs, key, url, maxPage);
       }, refreshInterval);
  } catch (err) {
    console.log('Error initializing Global Cache' + err.message);
    throw err;
  }
  });
  
};

const searchNewsByKeyword = (word, globalCache) => {
  try {
    const news = new Map();
    _filterCacheByKeyword(word, globalCache, news);
    const result = [];
    news.forEach(article => result.push(article));
    if (!result)
      result = _fetchDataFromAPI({q: word}, key, url, 1); 
    return result;
  } catch(err) {
    console.log("Error searching news by keyword");
    throw err;
  }
};
module.exports = { initGlobalCache, searchNewsByKeyword };
