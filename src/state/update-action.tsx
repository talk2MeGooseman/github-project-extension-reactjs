export const updateAction = (state, payload) => {
  return {
    ...state,
    ...payload
  };
}
