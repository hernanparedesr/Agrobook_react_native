export default function CsRecomendacionesReducer(state = [], action) {
	switch (action.type) {
		case 'SET_RECOMENDACIONES':
			return action.payload || state;
		default:
			return state;
	}
}