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
import createDebounce from 'redux-debounced';
import rootReducer from './reducers/index';

// create a store that has redux-debounced middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  createDebounce()
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

### Leading or trailing debouncing

You can specify if the action should be dispatch on the leading and/or trailing edge of the debounce. This implementation is similar to the lodash `_.debounce()` method. By default, `leading = false` and `trailing = true`. If both values are set to `false`, the action will not be debounced.

```js
const action = {
  type: 'MY_ACTION',
  meta: {
    debounce: {
      time: 300,
      // The action will be dispatched at the beginning of the debounce and not at the end
      leading: true,
      trailing: false
    }
  }
};
```

### Cancelling a Debounced Action (Advanced)

If you need to cancel a debounced action, you can set the `cancel` flag to true:

```
const action = {
  type: 'MY_ACTION',
  meta: {
    debounce: {
      cancel: true
    }
  }
};

// OR

const otherAction = {
  type: 'CANCEL_OTHER_ACTION',
  meta: {
    debounce: {
      cancel: true,
      key: 'MY_ACTION'
    }
  }
}
```

This works in conjunction with the custom `key` metadata.  This can be useful if
one action may need to cancel another debounced action (e.g., a debounced API
call that does not need to run if another action comes in).

*Important* - A cancel action will terminate in the middleware without
propagating further.  It will not show up DevTools or cause other side effects.
So you cannot "piggyback" a cancel on another call at this time.

### Debouncing a thunk
If you want to use redux-debounced with redux-thunk add the meta object as a property to the thunk function and the debounced middleware should be applied before the thunk middleware.

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createDebounce from 'redux-debounced';

const store = createStore(
  rootReducer,
  applyMiddleware(createDebounce(), thunk)
);

export function trackCustomerSearch(key) {
  const thunk = dispatch => {
    console.log('Search Key ----> ', key);
  };
  thunk.meta = {
    debounce: {
      time: 2500,
      key: 'TRACK_CUSTOMER_SEARCH'
    }
  };
  return thunk;
}
```

*Important* - A key must be specified as the thunk has no type.

## License

[MIT License](http://ryanseddon.mit-license.org/)
