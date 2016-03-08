export default () => {
  let timers = {};

  const middleware = () => dispatch => action => {
    const {
      meta: { debounce={} }={},
      type
    } = action;

    const {
      time,
      key = type
    } = debounce;

    if (!time || !key) {
      return dispatch(action);
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
    }

    timers[key] = setTimeout(() => {
      dispatch(action);
    }, time);
  };

  middleware._timers = timers;

  return middleware;
};
