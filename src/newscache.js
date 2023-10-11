'use strict';
require('dotenv').config();
const axios = require('axios');
const apiKey = process.env.NEWS_API_KEY;
const fetchInterval = 120000;

const fetchNewsbyPreferences = async function(prefs, key, cache, nextPage)   {
  try {
  prefs.apiKey = key;       //Adding the api key to the object passed as params
  if(nextPage) prefs.page = nextPage;
  const response = await axios.get("https://newsdata.io/api/1/news",{params: prefs});
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
async function initCache(cache, prefs, maxPage) {
  try {
    let pageCount = 1;
    let newPage = await fetchNewsbyPreferences(prefs, apiKey, cache);
    let intervalId = setInterval(async () => {
      if (!pageCount == maxPage){
        newPage = await fetchNewsbyPreferences(prefs, apiKey, cache, newPage); 
        pageCount++;
      }else 
      clearInterval(intervalId);
    },fetchInterval);
  } catch (err){
    console.error(err.message + "cannot initialize Cache");
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

module.exports = {initCache, getNewsById, getNewsByPreferences};
