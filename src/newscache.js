require('dotenv').config('../.env');
const axios = require('axios');

const newsCache = new Map();

let nextPage = '';

axios.get("https://newsdata.io/api/1/news", 
  {params:{ 
    apikey: process.env.NEWS_API_KEY,
    language: 'en',
  }}).then( response => {
    nextPage = response.data.nextPage;
    const newsArray = response.data.results;
    newsArray.forEach(news => newsCache.set(news.article_id, news));
    console.log(newsCache);
  }).catch(err => {throw err;});

let pageCount = 1;
const maxPageCount = 5;





