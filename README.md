# redux-fetch-duck
Simple and flexible API for creating a [redux](https://redux.js.org/) duck to manage a single fetch request, features loading and error states. 

## Instalation
It requires redux and thunk middleware.
```javascript
$ yarn add redux-fetch-duck redux redux-thunk
```

## Example
### Simple usage
You can create a single file module in your project
```javascript
// users.js
import { thunkCreator, withFetch } from 'redux-fetch-duck';

// This function is in charge of fetching the data.
// It must return a promise
const callApi = () => fetch('api.example.com/users');
// Selectors funcions depends on wich library is doing the request. They are optional.
const dataSelector = res => res.data;
const errorSelector = err => err.body.message;

// This functions returns the thunk ready to be disptched.
export const getUsers = thunkCreator('users', callApi, dataSelector, errorSelector)

// creates the duck reducer. 
export default withFetch('users')();
```
Combine the new duck reducer
```javascript
// rootReducer.js
import { combineReducers } from 'redux';
import users from './users';

export default combineReducers({
  users,
})
```
This generate the state initial state
```javascript
{
  users: {
    data: null,
    loading: false,
    error: null,
  }
}
```
Finally dispatch the thunk if you want to fetch de data
```javascript
import React from 'react';
import { connect } from 'react-redux'
import { getUsers } from '../redux/users';

class Container extends React.Component {
  componentWillMount() {
    if (!this.props.users) {
      this.props.dispach(getUsers());
    }
  }
  render() {
    const { loading, users, error } = this.props;
    if (loading) return <div>Loading ...</div>;
    if (error) return <div>Cant fethc data, error: {error}</div>
    return (
      <div>
        {users}
      </div>
    )
  }
}

export default connect(state => ({
  loading: state.users.loading,
  error: state.users.error,
  users: state.users.data,
})(Container);
```

### Extend your reducer

If you need a more complex state for your fetching resource you can import the types and action creators.
```javascript
// users.js
import { thunkCreator, withFetch, types, actionCreators } from 'redux-fetch-duck';

// return an object with keys request, success, failure
const fetchTypes = types('users');

// this reducer will count the number of calls to the API
const calls = (state = 0, action) => {
  switch (action.type) {
    case fetchTypes.request:
      return state + 1;
    default:
      return state;
  }
};

// pass the reducer to be combined, it calls combineReducer under the hood.
export default withFetch('users')({ calls })
```
The new initial state will be
```javascript
{
  users: {
    data: null,
    loading: false,
    error: null,
    calls: 0,
  }
}
```
## API

You can find the api documentation [here](https://github.com/ivanwolf15/redux-fetch-duck/blob/master/docs.md)

## Motivation

This module aims to reduce the boilerplate generated when you adopt [this](https://redux.js.org/docs/advanced/AsyncActions.html) common pattern in Redux based apps.

## Test

The test suite requires Jest, clone the repo, install the dependencies and then run the tests.
```bash
$ yarn
$ yarn test
```

## Contribution

Feel free to create an Issue or even a pull request. You can email me at ivanwolf15@gmail.com. I'd love to hear your feedback.

## License
MIT

