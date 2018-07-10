/**
 * @author SHUBHAM SINHA
 * @description
 * Uses axios to make api calls
 * If redux is integrated with the application, then update data in redux store
 * Else update data in local component state and provide as a prop.
 */

import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import Axios from 'axios';
import { getStore } from '../utils/enhanceStore';
import { isReduxIntegrated } from '../utils/getReducer';
import * as types from '../utils/types';

export default function withAPIRequest(Component) {
  class ComponentWithAPIRequest extends React.Component {
    static displayName = `withAPIRequest(${Component.displayName ||
      Component.name})`;

    state = {
      LOADING: false,
      CURRENT_ID: '',
      DATA: {},
    };

    componentDidMount() {
      console.log(getStore());
      if (isReduxIntegrated) {
        this.storeSubscription = getStore().subscribe(this.handleChange);
      }
    }

    componentWillUnmount() {
      if (isReduxIntegrated && this.storeSubscription) {
        this.storeSubscription();
      }
    }

    storeSubscription = null;
    data = null;

    handleChange = () => {
      const currentState = getStore().getState().apiData;
      let updated = true;
      Object.keys(this.data).map(mData => {
        if (
          JSON.stringify(currentState[mData]) !==
          JSON.stringify(this.data[mData])
        ) {
          updated = false;
        }
        return true;
      });
      if (updated) {
        this.setState({ LOADING: false, CURRENT_ID: '' });
      }
    };

    /**
     * @argument request
     * It can be multiple key value pairs each corresponding to a single request
     * for which the key is the unique id based on which caching will be done
     * and the value is the set of parameters required for making the call
     * which are as follows
     * url,
     * method - request, get, delete, head, options, post, put and patch,
     * body,
     * headers,
     * options and
     * axios - custom instance of axios.
     * All these requests will be executed in parallel.
     * @description
     * Used to make the API Request
     * In case of multiple different request keys each corresponding to a
     * different service call, all of them are called in parallel. On success,
     * the data is stored as a key value pair with the key being the same id
     * which is passed in the request argument. Similar is the case for error.
     * The only difference is in case of error it will store corresponding to
     * the key of the first request id.
     */
    apiRequest = async request => {
      const reqKeys = Object.keys(request);
      this.setState({ LOADING: true, CURRENT_ID: reqKeys[0] });
      try {
        const response = await Promise.all(
          Object.values(request).map(req => {
            let client = Axios;
            if (req.axios) {
              client = req.axios;
            }
            return client({
              url: req.url,
              method: req.method,
              headers: req.headers,
              data: req.body,
              ...req.options,
            });
          })
        );
        // store the response now
        const mData = Object.assign({}, this.state.DATA);
        for (let i = 0; i < reqKeys.length; i += 1) {
          mData[reqKeys[i]] = response[i];
        }
        if (isReduxIntegrated) {
          this.data = mData;
          getStore().dispatch({
            type: types.UPDATE_DATA,
            data: mData,
          });
        } else {
          this.setState({ LOADING: true, DATA: mData, CURRENT_ID: '' });
        }
        return true;
      } catch (error) {
        // store the error now - in case of multiple parallel requests,
        // it stores corresponding to 1st key
        const mData = Object.assign({}, this.state.DATA);
        mData[reqKeys[0]] = error;
        if (isReduxIntegrated) {
          this.data = mData;
          getStore().dispatch({
            type: types.UPDATE_DATA,
            data: mData,
          });
        } else {
          this.setState({ LOADING: true, DATA: mData, CURRENT_ID: '' });
        }
        return false;
      }
    };

    render() {
      return (
        <Component
          {...this.props}
          ref={this.props.onRef}
          loading={this.state.LOADING}
          data={this.state.DATA}
          currentLoadingId={this.state.CURRENT_ID}
          apiRequest={this.apiRequest}
        />
      );
    }
  }

  return hoistStatics(ComponentWithAPIRequest, Component);
}
