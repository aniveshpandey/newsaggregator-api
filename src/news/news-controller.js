'use strict';

const { initGlobalCache } = require("./L1-cache-manager");
require('dotenv').config('../../.env');
const apiKey = process.env.NEWS_API_KEY;
const url = process.env.NEWS_API_URL;
const maxPage = eval(process.env.MAX_CACHE_PAGE);
const refreshInterval = eval(process.env.CACHE_REFRESH_INTERVAL);
const expiryInterval = eval(process.env.CACHE_EXPIRY_INTERVAL);
const { validationResult } = require('express-validator');

const globalCache = new Map();
initGlobalCache(globalCache, apiKey, url, maxPage, refreshInterval, expiryInterval);

const getUserNews = (req, res) => {
  const user = req.user;
  
};
const getReadNews = (req, res) => {};
const getFavoriteNews = (req, res) => {};
const searchNews = (req, res) => {};

