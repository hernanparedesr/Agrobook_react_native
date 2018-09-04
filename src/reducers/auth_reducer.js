export default function AuthReducer(state = [], action) {
  switch (action.type) {
    case 'SAVE_USER':    
      return action.payload;
    case 'REMOVE_USER':    
      return [];
    default:
      return state;
  }
}