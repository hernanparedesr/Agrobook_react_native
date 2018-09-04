const initialGenerarState = {
	contrato: {},
	cultivo: [],
	norma: {},
	isCollect: 0,
	changeContrato: false,
	changeCultivo: false,
	changeNorma: false,
};

export default function GenerarReducer(state = initialGenerarState, action) {
	const newState = state;
	switch (action.type) {
		case 'SET_CONTRATO_GENERAR':
			newState.contrato = action.payload
			return newState;
		case 'UPDATE_CONTRATO_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.changeContrato = action.payload.changeContrato;
			newState.cultivo = [];
			newState.norma = {};
			return newState;
		case 'SET_CULTIVO_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
		return newState;
		case 'UPDATE_CULTIVO_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
			newState.changeCultivo = action.payload.changeCultivo;
			newState.norma = {};
			return newState;
		case 'SET_NORMA_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
			newState.norma = action.payload.insumo;
			return newState;
		case 'UPDATE_NORMA_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
			newState.norma = action.payload.insumo;
			newState.changeNorma = action.payload.changeNorma;
			return newState;
		case 'EDITAR_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
			newState.norma = action.payload.insumo;
			newState.rec = action.payload.rec;
			return newState;
		case 'COLLECT_GENERAR':
			newState.contrato = action.payload.contrato;
			newState.cultivo = action.payload.cultivo;
			newState.isCollect = action.payload.collect;
			return newState;
		case 'REMOVE_GENERAR':
			newState.contrato = {};
			newState.cultivo = [];
			newState.norma = {};
			newState.rec = undefined;
			newState.isCollect = 0;
			newState.changeContrato = false;
			newState.changeCultivo = false;
			newState.changeNorma = false;
			return newState;
		default:
			return newState;
	}
}
