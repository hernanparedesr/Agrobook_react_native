export default function CollectsReducer(state = [], action) {
	switch (action.type) {
		case 'SET_COLLECTS':
			return action.payload || state;
		default:
			return state;
	}
}
