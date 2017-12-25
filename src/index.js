import { combineReducers } from 'redux';
/**
 * Return action types given a resource name
 * @param {string} resourceName - The name of the resource being fetched
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
 * Return an object with request, seccues and failure action creator
 * given a resource name
 * @param {string} resourceName 
 */
export const actionCreators = resourceName => {
  const fetchTypes = types(resourceName);
  return {
    request: () => ({
      type: fetchTypes.request,
    }),
    success: data => ({
      type: fetchTypes.success,
      payload: data,
    }),
    failure: error => ({
      type: fetchTypes.failure,
      payload: error,
      error: true,
    }),
  };
};

/**
 * Create the fetch thunk creator
 * @param {string} resourceName - The name of the resource beeing fetched
 * @param {function} callApi - This function must returns a promise wich resolve with the data object and reject to a en error object.
 * @param {function} dataSelector - Function to select the data payload from the response object
 * @param {function} errorSelector - Function to select the error payload from the response
 * @returns {function} thunkCreator - When this function is called with args and dispatched, the api is called with args.
 */
export function thunkCreator(resourceName, callApi, dataSelector = null, errorSelector = null) {
  const actions = actionCreators(resourceName);
  return (...args) => function (dispatch) {
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
}
/**
 * Returns a High order reducer wich manages the fetching resource
 * @param {String} resourceName 
 */
export function withFetch(resourceName) {
  const fetchTypes = types(resourceName);
  /** Error reducer */
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
  /**
   * Loading reducer, manages the loading flag
   * @param {State} state 
   * @param {Object} action 
   * @returns {State}
   */
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
  /** Data reducer */
  const data = (state = null, action) => {
    switch (action.type) {
    case fetchTypes.success:
      return action.payload;
    default:
      return state;
    }
  };

  /**
   * Creates a new reducer. The final funcion manage the same state and error, loading and data state
   * @param {Function} targetReducer - Reducer to be merged
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

