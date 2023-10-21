'use strict';
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const globalPreferences = {};

const updateGlobalPreferences = (prefs) => {
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

module.exports = { globalPreferences, updateGlobalPreferences };
