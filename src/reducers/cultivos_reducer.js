export default function CultivosReducer(state = [], action) {
	switch (action.type) {
		case 'SAVE_CULTIVOS':
			return action.payload || state;
		default:
			return state;
	}
}