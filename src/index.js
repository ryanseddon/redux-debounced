export let timers = {};

export default () => dispatch => action => {
  const {
    meta = {
      debounce: {}
    },
    type
  } = action;
  const {
    time,
    key = type
  } = meta.debounce;

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
