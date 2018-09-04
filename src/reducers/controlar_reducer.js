const initialControlarState = {
	contrato: {},
	recomendacion: {},
	changeContrato: false,
	changeRecomendacion: false,
};

export default function ControlarReducer(state = initialControlarState, action) {
	switch (action.type) {
		case 'SET_CONTRATO_CONTROLAR':
			state.contrato = action.payload;
			return state;
		case 'UPDATE_CONTRATO_CONTROLAR':
			state.contrato = action.payload.contrato;
			state.changeContrato = action.payload.changeContrato;
			state.recomendacion = {};
			return state;
		case 'SET_RECOMENDACION_CONTROLAR':
			state.contrato = action.payload.contrato;
			state.recomendacion = action.payload.recomendacion;
			return state;
		case 'UPDATE_RECOMENDACION_CONTROLAR':
			state.contrato = action.payload.contrato;
			state.recomendacion = action.payload.recomendacion;
			state.changeRecomendacion = action.payload.changeRecomendacion;
			return state;
		case 'EDITAR_CONTROLAR':
			state.contrato = action.payload.contrato;
			state.recomendacion = action.payload.recomendacion;
			state.sup = action.payload.sup;
			return state;
		case 'REMOVE_CONTROLAR':
			state.contrato = {};
			state.recomendacion = {};
			state.sup = undefined;
			state.changeContrato = false;
			state.changeRecomendacion = false;
			return state;
		default:
			return state;
	}
}