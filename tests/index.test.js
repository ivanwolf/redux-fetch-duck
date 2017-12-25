const expect = require('expect');
const configureStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const { 
  actionCreators, types, thunkCreator, withFetch
} = require('../dist/index.js');
const REGIONS = 'regions';

describe('Action creators', () => {
  const fetchTypes = types(REGIONS);
  const actions = actionCreators(REGIONS);

  describe('Request action creator', () => {
    it('should return expected object', () => {
      const expectedAction = {
        type: fetchTypes.request,
      };
      expect(actions.request()).toEqual(expectedAction);
    });
  });

  describe('Success action creator', () => {
    it('should return expected object', () => {
      const data = [
        { name: 'Metropolitana', id: 1},
        { name: 'Antofagasta', id: 2},
      ];
      const expectedAction = {
        type: fetchTypes.success,
        payload: data,
      };
      expect(actions.success(data)).toEqual(expectedAction);
    });
  });

  describe('Failure action creator', () => {
    it('should return expected object', () => {
      const error = 'Not found';
      const expectedAction = {
        type: fetchTypes.failure,
        payload: error,
        error: true,
      };
      expect(actions.failure(error)).toEqual(expectedAction);
    });
  });
});

describe('Thunk creator', () => {
  const actions = actionCreators(REGIONS);
  const callApi = jest.fn(() => Promise.resolve({
    data: [
      { name: 'Metropolitana', id: 1},
      { name: 'Antofagasta', id: 2},
    ]
  }));

  it('should call the API', () => {
    const getRegions = thunkCreator(REGIONS, callApi);
    const store = mockStore({});
    return store.dispatch(getRegions()).then(() => {
      expect(callApi).toHaveBeenCalled();
    });
  });
  it('should pass the args to the API call', () => {
    const getRegions = thunkCreator(REGIONS, callApi);
    const store = mockStore({});
    return store.dispatch(getRegions('someToken')).then(() => {
      expect(callApi).toHaveBeenCalledWith('someToken');
    });
  });
  it('should dispatch GET_RESOURCE_REQUEST', () => {
    const getRegions = thunkCreator(REGIONS, callApi);
    const store = mockStore({});
    return store.dispatch(getRegions()).then(() => {
      const actionsDispatched = store.getActions();
      expect(actionsDispatched[0]).toEqual(actions.request());
    });
  });
  it('should dispatch GET_RESOURCE_SUCCESS on succes', () => {
    const getRegions = thunkCreator(REGIONS, callApi, res => res.data);
    const store = mockStore({});
    return store.dispatch(getRegions()).then(() => {
      const actionsDispatched = store.getActions();
      expect(actionsDispatched[1]).toEqual(actions.success([
        { name: 'Metropolitana', id: 1},
        { name: 'Antofagasta', id: 2},
      ]));
    });
  });
  it('should dispatch GET_RESOURCE_FAILURE on failure', () => {
    const badCallApi = jest.fn(() => Promise.reject(new Error('404 not found')));
    const getRegions = thunkCreator(REGIONS, badCallApi, null, error => error.message);
    const store = mockStore({});
    return store.dispatch(getRegions()).then(() => {
      const actionsDispatched = store.getActions();
      expect(actionsDispatched[1]).toEqual(actions.failure('404 not found'));
    });
  });
});

describe('The high order reducer', () => {
  const hor = withFetch(REGIONS);
  it('should create a new reducer if no params are given', () => {
    const reducer = hor();
    const initialState = {
      data: null,
      error: null,
      loading: false,
    };
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });
  it('combine the reducers passed as args', () => {
    const count = (state = 5, action) => state;
    const red = (state = { some: 'state', key: 'value' }, action) => state;
    const reducer = hor({ count, red });
    const initialState = {
      data: null,
      error: null,
      loading: false,
      count: 5,
      red: {
        some: 'state',
        key: 'value',
      }
    };
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });
  describe('The new reducer', () => {
    const initialState = {
      data: null,
      error: null,
      loading: false,
    };
    const actions = actionCreators(REGIONS);
    const reducer = hor();
    it('should handle GET_RESOURCE_REQUEST', () => {
      const state = reducer(initialState, actions.request());
      expect(state).toEqual(Object.assign({}, state, {
        loading: true,
      }));
    });
    it('should handle GET_RESOURCE_SUCCESS', () => {
      const data = {
        some: 'data',
        key: 'value',
      };
      const state = reducer(initialState, actions.success(data));
      expect(state).toEqual(Object.assign({}, state, {
        data,
        error: null,
        loading: false,
      }));
    });
    it('should handle GET_RESOURCE_FAILURE', () => {
      const error = 'Bad request';
      const state = reducer(initialState, actions.failure(error));
      expect(state).toEqual(Object.assign({}, state, {
        loading: false,
        error,
      }));
    });
  });
});


