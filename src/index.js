import { combineReducers } from 'redux';
/**
 * @typedef {object} Action
 * @property {string} type The type of de action
 * @property {object|error} [payload] The data asociated to de action
 * @property {boolean} [error] Indicates if the payload is an error
 */
/**
 * @typedef {object} ActionTypes
 * @property {string} request
 * @property {string} success
 * @property {string} failure
*/
/**
 * @typedef {object} ActionCreators
 * @property {function} request
 * @property {function} success
 * @property {function} failure
 */
/**
 * @typedef {function} Thunk
 */

/**
 * Return the three action tyoes for a given resource.
 * @function
 * @param {string} resourceName - The name of the resource being fetched
 * @returns {ActionTypes}
 */
export const types = resourceName => {
  const RESOURCE = resourceName.toUpperCase();
  return {
    request: `fetch-duck/GET_${RESOURCE}_REQUEST`,
    success: `fetch-duck/GET_${RESOURCE}_SUCCESS`,
    failure: `fetch-duck/GET_${RESOURCE}_FAILURE`,
  };
};

/**
 * Returns three action creators for a given resource.
 * @function
 * @param {string} resourceName - The name of the resource.
 * @returns {ActionCreators}
 */
export const actionCreators = resourceName => {
  const fetchTypes = types(resourceName);
  return {
    /**
     * Request action creator. This actions indicates the API will be called.
     * @function
     * @memberof actionCreators
     * @return {Action} 
     */
    request: () => ({
      type: fetchTypes.request,
    }),
    /**
     * Success action creator. This action passes the data to the reducer. 
     * @function
     * @memberof actionCreators
     * @param {object|string|number} data - The data received from the API call.
     * @return {Action}
     */
    success: data => ({
      type: fetchTypes.success,
      payload: data,
    }),
    /**
     * Failure action creator. This actions passes the error to the reducer.
     * @function
     * @memberof actionCreators
     * @param {object|error} error - The error received from the response.
     * @return {Action}
     */
    failure: error => ({
      type: fetchTypes.failure,
      payload: error,
      error: true,
    }),
  };
};

/**
 * Create the fetch thunk. Do not forget to dispatch the thunk call at the moment of the fetch.
 * @function
 * @param {string} resourceName - The name of the resource beeing fetched
 * @param {function} callApi - This function is called with the args passed to Thunk created with this method. Must return a Promise representing the response.
 * @param {function} [dataSelector] - Function to select the data payload from the response object.
 * @param {function} [errorSelector] - Function to select the error payload from the response object.
 * @returns {Thunk}
 */
export const thunkCreator = (resourceName, callApi, dataSelector = null, errorSelector = null) => {
  const actions = actionCreators(resourceName);
  return (...args) => (dispatch) => {
    dispatch(actions.request());
    return callApi(...args)
      .then(res => {
        const data = typeof dataSelector === 'function'
          ? dataSelector(res)
          : res;
        dispatch(actions.success(data));
      }, err => {
        const error = typeof errorSelector === 'function'
          ? errorSelector(err)
          : err;
        dispatch(actions.failure(error));
      });
  };
};
/**
 * Returns a High order reducer wich creates the fetching resource and combine other reducers.
 * @param {string} resourceName 
 * @return {function}
 */
export function withFetch(resourceName) {
  const fetchTypes = types(resourceName);
  const error = (state = null, action) => {
    switch (action.type) {
    case fetchTypes.failure:
      return action.payload;
    case fetchTypes.success:
      return null;
    default:
      return state;
    }
  };
  function loading(state = false, action) {
    switch (action.type) {
    case fetchTypes.failure:
    case fetchTypes.success:
      return false;
    case fetchTypes.request:
      return true;
    default:
      return state;
    }
  }
  const data = (state = null, action) => {
    switch (action.type) {
    case fetchTypes.success:
      return action.payload;
    default:
      return state;
    }
  };

  /**
   * Creates the final reducer.
   * @param {object} [reducers] - This args is passed to combineReducers
   */
  function combine(reducers) {
    return combineReducers(Object.assign({}, reducers, {
      data,
      loading,
      error,
    }));
  }
  return combine;
}

