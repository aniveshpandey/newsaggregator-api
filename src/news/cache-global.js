const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const crypto = require('crypto');
const axios = require('axios');
const { Article } = require('./article-class.js');

const globalPreferences = {};

const _updateGlobalPreferences = (prefs) => {
  try{
  for (let prop in prefs){
    if (!globalPreferences[prop])
      globalPreferences[prop] = [];
    globalpreferences[prop].push(prefs[prop]); 
  }
  eventEmitter.emit('globalPrefsUpdated', globalPreferences);
  } catch(err){
    console.error('Error updating globalPreferences' + err.message);
    throw err;
  }
}


const _queryFromPrefs = (prefs, key, page) => {
  const query = '';
  for (let prop in prefs){
    let string = `${prop}=${prefs[prop].join('+OR+')}&`
    query +=string;
  }
  const result = `${query}&page=${page}&apiKey=${key}`;
  if(result.length > 500)
    throw new Error("Query too long");
  return result;
};

const _fetchDataFromAPI = async (prefs, key, url, maxPage) => {
  try{
    const dataArray = [];
    for (let i = 1 ; i <= maxPage; i++){
      const query = _queryFromPrefs(prefs, key, i);
      const data = await axios.get(url, { params: query });
      if (data.status != 'ok')
        throw new Error ('Invalid data received from API');
      dataArray.push(data.articles);
      setTimeout(()=> {}, 1100);
    }
    return dataArray;
 } catch(err) {
    console.error('Error fetching data' + err.message);
    throw err;
  }
};

const _populateCache = (cache, prefs, key, url, maxPage) => {
  try { 
    const data = _fetchDataFromAPI(prefs, key, url, maxPage);
    data.forEach(article => {
    const newsArticle = new Article(article);
    const cacheKey = { id: crypto.randomUUID() , fetchedAt:  newsArticle.fetchedAt };
    cache.set(cacheKey, newsArticle);
  });
  } catch (err){
    console.log("Error populating cache" + err.message);
    throw err;
  }
};

const _flushCache = (cache, expiryDuration) => {
  try {
    for (let [key, value] in cache){
      const timeDifference = new Date() - key.fetchedAt;
      if(timeDifference > expiryDuration)
        cache.delete(key);
    }
  } catch(err) {
    console.log("Error flushing cache" + err.message);
    throw err;
  }
};

const initGlobalCache = (cache, key, url, maxPage, refreshInterval, expiryDuration) => {
  try{
  let globalPrefs = {};
  eventEmitter.on('userPrefsUpdated', _updateGlobalPreferences);
  eventEmitter.on('globalPrefsUpdated', (globalPreferences) => {
    globalPrefs = globalPreferences;
  });
  _populateCache(cache, globalPrefs, key, url, maxPage);
  eventEmitter.emit('globalCacheInitialized', cache);
  setInterval (() => {
    _flushCache(cache, expiryDuration);
    _populateCache(cache, globalPrefs, key, url, maxPage);
  }, refreshInterval);
  } catch (err) {
    console.log('Error initializing Global Cache' + err.message);
    throw err;
  }
};

module.exports = { initGlobalCache };

