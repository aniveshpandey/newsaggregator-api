const fs = require('fs');

const _initMapFromFile = (path) => {
  try{
    const data = JSON.parse(fs.readFileSync(path));
    const map = new Map();
    for (key in data) {
      if (data.hasOwnProperty(key))
      map.set(key, data[key]);
    }
    return map;
  } catch(err) {
    console.error("Error initializing map from file");
    throw err;
  }
};

const _writeMaptoFile = (path, map) => {
  try {
    const data = {};
    for (const [key, value] of map) {
      // console.log(key, value); 
      data[key] = value;
    }
    fs.writeFileSync(path, JSON.stringify(data)); 
  } catch (err) {
    console.error("Error writing map to file");
  }
};

const readUsers = function (path){
  try {
    const userMap = _initMapFromFile(path);
    return userMap; 
  } catch (err){
    console.log(err);
    throw err;
  }
};

const writeUsers = function (path, userMap) {
  try {
    _writeMaptoFile(path, userMap);
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const readNews = function (path){
  try {
    const newsMap = _initMapFromFile(path);
    return newsMap; 
  } catch (err){
    console.log(err);
    throw err;
  }
};

const writeNews = function (path, newsMap) {
  try {
    _writeMaptoFile(path, newsMap);
  } catch(err) {
    console.log(err);
    throw err;
  }
};

module.exports = {readUsers, writeUsers, readNews, writeUsers};
