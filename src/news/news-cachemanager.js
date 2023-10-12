'use strict';
require('dotenv').config('../../.env');
const axios = require('axios');
const apiKey = process.env.NEWS_API_KEY;

const fetchNewsbyParams = async function(params, key, cache, nextPage)   {
  try {
  params.apiKey = key;       //Adding the api key to the object passed as params
  if(nextPage) params.page = nextPage;
  const response = await axios.get("https://newsdata.io/api/1/news",{params: params});
  cache.push(...response.data.results);
  nextPage = response.data.nextPage;
  return nextPage;
  } catch(err) {
    console.error(err.message + "cannot fetch news");
    throw err;
  }
}
// async function main ()  {
//   const news = await fetchNewsbyPreferences({country: 'in', language: 'en'}, apiKey, cache);
//   console.log(news);
// }
// main();
//
async function initCache(cache, prefs, interval, maxPage) {
  try {
    let pageCount = 1;
    let newPage = await fetchNewsbyParams(prefs, apiKey, cache);
    let intervalId = setInterval(async () => {
      if (!pageCount == maxPage){
        newPage = await fetchNewsbyParams(prefs, apiKey, cache, newPage); 
        pageCount++;
      }else 
      clearInterval(intervalId);
    }, interval);
  } catch (err){
    console.error(err.message + "cannot initialize Cache");
  }
}

const flushCache = (cache, interval, elements) => {
  try {
    const intervalId = setInterval( () => {
      for (let i = 0; i < elements; i++){
        cache.shift();
      }
      if (!cache) 
        clearInterval(intervalId);
    } , interval);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

const getNewsById = (cache, id) => {
  const news = cache.forEach(news => news.article_id ===id);
  if (!news) throw new Error(`News with id ${id} does not exist`);
  return news;
}

const getNewsByPreferences = (prefs, cache) => {
  try {
    const category = prefs.category.split(',');
    const country = prefs.country.split(',');
    const language = prefs.language.split(',');
    const keywords = prefs.keywords.split(',');
    const preferredNews = cache.reduce((newsArray, news) => {
     if(category.includes(news.category) ||
        country.includes(news.country) ||
        language.includes (news.language) ||
        keywords.includes (news.keywords))
      newsArray.push(news);
    }, []);
    if(!preferredNews) {
      initCache (cache, prefs, 5);
      preferredNews = getNewsByPreference(prefs, cache);
    }
    else return preferredNews;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = { fetchNewsbyParams, initCache, flushCache, getNewsById, getNewsByPreferences };
