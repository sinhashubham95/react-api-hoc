module.exports = {
  // action types which will be dispatched in case of redux integration
  get actionTypes() {
    return require('./reducerUtils/types').default;
  },

  // modify the reducer(root) to accomodate the changes for the HOC(storage of data from API)
  get enhanceReducer() {
    return require('./reducerUtils/enhanceReducer').default;
  },

  get withAPIRequest() {
    return require('./views').default;
  },
};
