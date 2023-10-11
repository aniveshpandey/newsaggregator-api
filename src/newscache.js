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
const globalPrefs = {
  country: 'in',
  language: 'en,hi,bn,mr,ta',
  category: 'business,politics,science,technology,sports',
};

const newsCacheL1 = [];

async function initCache(cache, maxPage) {
  try {
    let pageCount = 1;
    let newPage = await fetchNewsbyPreferences(globalPrefs, apiKey, cache);
    let intervalId = setInterval(async () => {
      if (!pageCount == maxPage){
        newPage = await fetchNewsbyPreferences(globalPrefs, apiKey,cache, cache); 
        pageCount++;
      }else 
      clearInterval(intervalId);
    },fetchInterval);
  } catch (err){
    console.error(err.message + "cannot initialize Cache");
  }
}

initCache(newsCacheL1, 15);

const getNewsById = (cache, id) => {
  const news = cache.forEach(news => news.article_id ===id);
  if (!news) throw new Error(`News with id ${id} does not exist`);
  return news;
}

// const getNewsByPreference = (

// ) => {};
