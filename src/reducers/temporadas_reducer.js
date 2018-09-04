export default function TemporadasReducer(state = [], action) {
  switch (action.type) {
    case 'SAVE_TEMPORADAS':    
      return action.payload;
    default:
      return state;
  }
}