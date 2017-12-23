import { combineReducers } from 'redux';
/**
 * Return action types given a resource name
 * @param {string} resourceName - The name of the resource being fetched
 */
export const types = resourceName => {
  const RESOURCE = resourceName.toUpperCase();
  return {
    request: `GET_${RESOURCE}_REQUEST`,
    success: `GET_${RESOURCE}_SUCCESS`,
    failure: `GET_${RESOURCE}_FAILURE`,
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
 * Create the fetch thunk
 * @param {String} resourceName - The name of the resource beeing fetched
 * @param {Promise} request - Promise object representing the API call where de data is fetched,
 * must resolve to a data object and reject to a en error object.
 * @param {Function} dataSelector - Function to select the data payload from the response object
 * @param {Funtion} errorSelector - Function to select the error payload from the response
 */
export const getResourceThunk = (resourceName, request, dataSelector, errorSelector) => {
  const actions = actionCreators(resourceName);
  return () => async (dispatch) => {
    dispatch(actions.request());
    try {
      const res = await request;
      dispatch(actions.success(dataSelector(res)));
    } catch (error) {
      dispatch(actions.failure(errorSelector(error)));
    }
  };
};
/**
 * Returns a High order reducer wich manages the fetching resource
 * @param {String} resourceName 
 */
export const withFetch = resourceName => {
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
  /** Loading reducer */
  const loading = (state = false, action) => {
    switch (action.type) {
    case fetchTypes.failure:
    case fetchTypes.success:
      return false;
    case fetchTypes.request:
      return true;
    default:
      return state;
    }
  };
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
  const hor = (targetReducer = null) => (state, action) => {
    const targetState = typeof targetReducer === 'function'
      ? targetReducer(state, action)
      : undefined;

    const fetchState = combineReducers({
      data,
      loading,
      error,
    })(state, action);
    return Object.assign({}, targetState, fetchState);
  };

  return hor;
};

