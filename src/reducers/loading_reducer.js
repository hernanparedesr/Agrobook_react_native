const initialState = {
  show: false,
  title: '',
  msg: '',
  botones: [],
  cancelable: false
};

export default function LoadingReducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_LOADING':
      return action.payload;
    case 'HIDE_LOADING':
      return {
        show: false,
        title: '',
        msg: '',
        botones: [],
        cancelable: false
      };
    default:
      return state;
  }
}
