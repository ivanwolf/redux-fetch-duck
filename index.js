'use strict';

var redux = require('redux');

const reducer = (state = '', action) => state;

var index = redux.combineReducers({
  reducer,
})

module.exports = index;
