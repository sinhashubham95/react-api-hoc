# React-API-HOC

It eases out the amount of effort that the developer has to put in for integrating his/her component with an service API. Normally an API request in React or React Native is made using a thunk action which will internally dispatch multiple actions - to get to know the LOADING, LOADED and LOADERROR status of that request. But using this HOC, you will be freed from doing all these tasks. Just pass the API endpoints and whatever necessary to make a request, and this higher order component will internally take care of everything required to provide the LOADING status to show something on the screen until the request loads, and also internally manages the storage of the data which will be done in the redux under apiData state if it is a redux integrated application, otherwise in case of a non-redux application, it provides you the data as a prop.

##Installation

Since the library is a JS-based solution, to install the latest version of react-navigation you only need to run:

```bash
yarn add react-api-hoc
```

or

```bash
npm install --save react-api-hoc
```

##Documentation

First requirement is to include a reducer at the top most level in the root reducer of your application. Pass the action type which you will be dispatching in your application to clear the entire redux state while exiting the application. Make sure this is at the top most level only.
```
import { combineReducers } from 'redux';
import { getReducer } from 'react-api-hoc';

export default combineReducers({
  apiData: getReducer('EXIT_APP');
  ...otherReducers,
});
```

The next step includes exposing the redux store for which you will have to do the following and take the modified store as the return value and in the provider provide that as the store.
```
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { enhanceStore } from 'react-api-hoc';
import RootComponent from './src';
import RootReducer from './reducers';

const store = enhanceStore(createStore(RootReducer));

const App = () => (
  <Provider store={store}>
  </Provider>
);
```

That's it. Now you are all set to wrap your component with the withAPIRequest HOC to avail the functionalities.
```
import React from 'react';
import { Button } from 'react-native';
import { withAPIRequest } from 'react-api-hoc';

// The data corresponding to these requests can be found in
// this.props.apiData.UNIQUE_ID1 and this.props.apiData.UNIQUE_ID2 respectively.
class Sample extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.loading !== true && this.props.loading === true) {
      // render loading content
    }
  }

  onClick = () => {
    this.props.apiRequest({
      'UNIQUE_ID1': {
        url: '',
        headers: '',
        ...
      },
      'UNIQUE_ID2': {
        url: '',
        headers: '',
        ...
      },
    });
  }

  render() {
    return (
      <Button
        onPress={this.onClick}
        title="Make an API Request."
      />
    );
  }
}

const mapStateToProps = state => ({
  apiData: state.apiData,
});

export default connect(mapStateToProps)(withAPIRequest(Sample));
```

If you don't want the data to be stored in the redux state i.e. when the application is not connected to redux, then the first 2 steps do not need to be performed.
```
import React from 'react';
import { Button } from 'react-native';
import { withAPIRequest } from 'react-api-hoc';

// The data corresponding to these requests can be found in
// this.props.apiData.UNIQUE_ID1 and this.props.apiData.UNIQUE_ID2 respectively.
class Sample extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.loading !== true && this.props.loading === true) {
      // render loading content
    }
  }

  onClick = () => {
    this.props.apiRequest({
      'UNIQUE_ID1': {
        url: '',
        headers: '',
        ...
      },
      'UNIQUE_ID2': {
        url: '',
        headers: '',
        ...
      },
    });
  }

  render() {
    return (
      <Button
        onPress={this.onClick}
        title="Make an API Request."
      />
    );
  }
}

export default withAPIRequest(Sample);
```
