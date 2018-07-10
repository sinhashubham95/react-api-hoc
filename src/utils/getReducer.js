import * as types from './types';

let reduxIntegrated = false;

/**
 * @param {string} clearType
 * It is the action type which will be used to clear the data in the reducer.
 */
export default function(clearType = 'EXIT_APP') {
  reduxIntegrated = true;

  const apiReducer = (state = {}, action) => {
    switch (action.type) {
      case types.UPDATE_DATA:
        return Object.assign({}, state, action.data);
      case types.RESET_DATA:
        return Object.assign({});
      case clearType:
        return Object.assign({});
      default:
        return state;
    }
  };

  return apiReducer;
}

export const isReduxIntegrated = () => reduxIntegrated;
