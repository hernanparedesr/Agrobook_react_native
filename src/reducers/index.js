import { combineReducers } from 'redux';

import NavReducer from './nav_reducer';
import AuthReducer from './auth_reducer';
import DataReducer from './data_reducer';
import CsRecomendacionesReducer from './csRecomendaciones_reducer';
import GenerarReducer from './generar_reducer';
import ControlarReducer from './controlar_reducer';
import UsersReducer from './users_reducer';
import TemporadasReducer from './temporadas_reducer';
import InsumosReducer from './insumos_reducer';
import CultivosReducer from './cultivos_reducer';
import CollectsReducer from './collects_reducer';
import LoadingReducer from './loading_reducer';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  data: DataReducer,
  cs_recomendaciones: CsRecomendacionesReducer,
  generar: GenerarReducer,
  controlar: ControlarReducer,
  users: UsersReducer,
  temporadas: TemporadasReducer,
  insumos: InsumosReducer,
  cultivos: CultivosReducer,
  collects: CollectsReducer,
  loading: LoadingReducer,
});

export default AppReducer;
