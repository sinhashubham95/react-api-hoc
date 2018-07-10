let mStore = null;

const enhanceStore = store => {
  mStore = store;
  return store;
};

const getStore = () => mStore;

export { enhanceStore, getStore };
