export default () => {
  let timers = {};

  const middleware = () => dispatch => action => {
    const { meta: { debounce = {} } = {}, type } = action;

    const {
      time,
      key = type,
      cancel = false,
      leading = false,
      trailing = true
    } = debounce;

    const shouldDebounce =
      ((time && key) || (cancel && key)) && (trailing || leading);
    const dispatchNow = leading && !timers[key];

    const later = () => {
      if (trailing && !dispatchNow) {
        return new Promise(resolve => {
          timers[key] = setTimeout(() => {
            resolve(dispatch(action));
          }, time);
        });
      }
      timers[key] = null;
    };

    if (!shouldDebounce) {
      return dispatch(action);
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
      timers[key] = null;
    }

    if (!cancel) {
      if (dispatchNow) {
        return new Promise(resolve => {
          timers[key] = setTimeout(() => {
            resolve(dispatch(action));
          }, time);
        });
      }

      timers[key] = setTimeout(later, time);
    }
  };

  middleware._timers = timers;

  return middleware;
};
