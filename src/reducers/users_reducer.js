export default function UsersReducer(state = [], action) {
  switch (action.type) {
    case 'SAVE_USERS':    
      return action.payload;
    default:
      return state;
  }
}