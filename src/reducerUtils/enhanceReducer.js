import { combineReducers } from 'redux';
import * as types from './types';

let reduxIntegrated = false;

/**
 * @param {object} rootReducer
 * It is the top level reducer of the application.
 * Modified form of this one will be used to accomodate the use of HOC.
 * @param {string} clearType
 * It is the action type which will be used to clear the data in the reducer.
 */
export default function(rootReducer, clearType) {
  reduxIntegrated = true;

  const apiReducer = (state = {}, action) => {
    switch (action.type) {
      case types.UPDATE_DATA:
        return Object.assign({}, state, action.data);
      case types.RESET_DATA:
        return Object.assign({});
      case clearType:
        return Object.assign({});
    }
  };

  return combineReducers({ ...rootReducer, apiData: apiReducer });
}

export const isReduxIntegrated = () => reduxIntegrated;
