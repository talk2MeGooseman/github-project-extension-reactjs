export const updateAction = (state, payload) => {
  console.log({ state, payload })
  return {
    ...state,
    ...payload
  };
}
