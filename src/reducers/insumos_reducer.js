export default function InsumosReducer(state = [], action) {
  switch (action.type) {
    case 'SAVE_INSUMOS':
      return { insumos: action.payload.insumos, tipo_insumos: action.payload.tipo_insumos, unidades: action.payload.unidades };
    default:
      return state;
  }
}
