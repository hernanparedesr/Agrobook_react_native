export default function DataReducer(state = [], action) {
	switch (action.type) {
		case 'SET_DATA':
			return action.payload || state;
		default:
			return state;
	}
}