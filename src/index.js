export default () => {
  let timers = {};

  const middleware = () => dispatch => action => {
    const {
      meta: { debounce={} }={},
      type
    } = action;

    const {
      time,
      key = type,
      cancel = false
    } = debounce;

    const shouldDebounce = (time && key) || (cancel && key);

    if (!shouldDebounce) {
      return dispatch(action);
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
    }

    if (!cancel) {
      return new Promise(resolve => {
        timers[key] = setTimeout(() => {
          resolve(dispatch(action));
        }, time);
      })
    }
  };

  middleware._timers = timers;

  return middleware;
};
