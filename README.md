[![Build Status](https://img.shields.io/travis/ryanseddon/redux-debounced/master.svg?style=flat-square)](http://travis-ci.org/ryanseddon/redux-debounced) [![npm](https://img.shields.io/npm/v/redux-debounced.svg?style=flat-square)](https://www.npmjs.com/package/redux-debounced)

# redux-debounce

Debounce middleware for [Redux](https://github.com/rackt/redux).

## What's debounce?

Debounce allows you to discard a fast paced action from updating your state until a certain period of time passes after the last action is fired.

If you have a search that happens when someone types in a text box you can use this middleware to only fire your action after the user has stopped for a specified period of time.

```bash
$ npm install --save redux-debounced
```

## Usage

First, add some `debounce` metadata to your actions using the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) pattern:

```js
const action = {
  type: 'MY_ACTION',
  meta: {
    debounce: {
      time: 300
    }
  }
};
```

To enable Redux Debounce:

```js
import { createStore, applyMiddleware } from 'redux';
import debounce from 'redux-debounced';
import rootReducer from './reducers/index';

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  debounce
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
```

You can also specify your own key rather than using the action type this is useful if you're already using a promise middleware.

Since promise middleware doesn't have a single type associated to it you can specify your own key for the middleware to keep track of your action being dispatched.

```js
const action = {
  types: ['MY_ACTION_REQUEST', 'MY_ACTION_SUCCESS', 'MY_ACTION_FAILURE'],
  promise: () => {},
  meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
};
```

## License

[MIT License](http://ryanseddon.mit-license.org/)
