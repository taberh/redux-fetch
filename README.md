# redux-fetch

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Build Status](https://travis-ci.org/taberh/redux-fetch.svg?branch=master)](https://travis-ci.org/taberh/redux-fetch)

Simple and elegant isomorophic fetch for Redux middleware. Not complex api, just like writing a synchronization action.

# Install
```
npm install --save redux-fetch-elegant
```

# Example Usage
```
import Redux, {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import fetchMiddleware, {
  STATUS_REQUEST,
  STATUS_SUCCESS,
  STATUS_FAILURE,
  configureOptions
} from 'redux-fetch-elegant'

// you can configure global default options
configureOptions({
  credentials: 'same-origin',
  headers: {
    'xxx': 'xxx'
  }
})

// and configure common logic
fetchMiddleware.then((response) => response.json())

const composeArray = [
  applyMiddleware(fetchMiddleware)
]
const store = compose.apply(Redux, composeArray)(createStore)(reducer)

const FETCH_SOMETHING = 'fetch_something'

store.dispatch({
  type: FETCH_SOMETHING,
  endpoint: 'http://domain/path/',
  body: JSON.stringify({}),
  method: 'GET'
})

function reducer(state, action) {
  if (action.type === FETCH_SOMETHING) {
    switch (state.status) {
      case STATUS_REQUEST
        // fetch start
        break
      case STATUS_SUCCESS:
        // fetch success
        break
      case STATUS_FAILURE:
        // fetch error
        break
    }
  }
}
```