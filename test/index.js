import { assert } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import debounce, { timers } from '../src';

describe('debounce middleware', () => {
  let store;
  let clock;

  beforeEach(() => {
    let increment = 0;
    const createStoreWithMiddleware = applyMiddleware(debounce)(createStore);
    const initialState = {};
    const reducer = (state = initialState, action) => {
      switch (action.type) {
        case 'SEARCH': {
          return {
            ...state,
            query: action.payload
          };
        }

      case 'UPDATE': {
        return {
          ...state,
          increment: increment+1
        }
      }

        default: {
          return state;
        }
      }
    }
    store = createStoreWithMiddleware(reducer, initialState);
    clock = useFakeTimers();
    spy(store, 'dispatch');
    spy(global, 'setTimeout');
  });

  describe('debounced action is dispatched', () => {
    const timeout = 300;

    beforeEach(() => store.dispatch({
      type: 'SEARCH',
      payload: 'foo',
      meta: {
        debounce: { time: timeout }
      }
    }));

    it('dispatch is only called once', () => {
      assert.equal(store.dispatch.callCount, 1);
    });

    it('timers object contains key matching action', () => {
      assert.ok(timers.SEARCH);
    });

    it('state is unchanged from initialState', () => {
      assert.deepEqual(store.getState(), {});
    });

    it('setTimeout is called', () => {
      assert.equal(global.setTimeout.callCount, 1);
    });

    it('state is updated when timeout elapses', () => {
      clock.tick(timeout);
      assert.deepEqual(store.getState(), {query:'foo'});
    });
  });

  describe('debounced action with time and key', () => {
    const timeout = 300;
    const key = 'query';

    beforeEach(() => store.dispatch({
      type: 'SEARCH',
      payload: 'foo',
      meta: {
        debounce: { time: timeout, key: key }
      }
    }));

    it('timers object should contain item matching key', () => {
      assert.ok(timers.query);
    });
  });

  describe('debounced action is dispatched with no time', () => {
    beforeEach(() => store.dispatch({
      type: 'SEARCH',
      payload: 'foo',
      meta: {
        debounce: {}
      }
    }));

    it('state is updated straight away', () => {
      assert.deepEqual(store.getState(), {query:'foo'});
    });
  });

  describe('debounced action is fired many times', () => {
    const action = {
      type: 'UPDATE',
      meta: {
        debounce: {time:300}
      }
    };

    beforeEach(() => {
      spy(global, 'clearTimeout');
      store.dispatch(action);
      store.dispatch(action);
      store.dispatch(action);
    });

    it('clearTimeout is called twice', () => {
      assert.ok(global.clearTimeout.calledTwice);
    });

    it('dispatch is called three times', () => {
      assert.ok(store.dispatch.calledThrice);
    });

    it(`state will only update once per ${action.meta.debounce.time}ms`, () => {
      clock.tick(300);
      assert.deepEqual(store.getState(), {increment:1});
    });
  });
});
