import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';

const initialNavState = AppNavigator.router.getStateForAction(
	AppNavigator.router.getActionForPathAndParams('Splash')
);

export default function NavReducer(state = initialNavState, action) {
	let nextState;

	switch (action.type) {
		case 'SPLASH_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Splash' }),
				state
			);
			break;
		case 'START_NAV': //NO ESTA HACIENDO NADA ESTE CASE
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'StartScreen' }),
				state
			);
		case 'LOGIN_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'StartScreen' }), //SE PUSO STARTSCREEN PARA QUE INICIE EN ESTA PANTALLA
				state
			);
			break;
		case 'HOME_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Home', params: action.payload ? action.payload : '' }),
				state
			);
			break;
		case 'GENERAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Generar' }),
				state
			);
			break;
		case 'CULTIVOS_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Cultivos' }),
				state
			);
			break;
		case 'NORMAS_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Normas' }),
				state
			);
			break;
		case 'RECOMENDAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Recomendar' }),
				state
			);
			break;
		case 'CONTROLAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Controlar' }),
				state
			);
			break;
		case 'RECOMENDACIONES_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Recomendaciones' }),
				state
			);
			break;
		case 'SUPERVISAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Supervisar' }),
				state
			);
			break;
		case 'SINCRONIZAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Sincronizar', params: action.payload }),
				state
			);
			break;
		case 'RECSSINCRONIZAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'RecSincronizar', params: action.payload }),
				state
			);
			break;
		case 'SUPSSINCRONIZAR_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'SupSincronizar', params: action.payload }),
				state
			);
			break;
		case 'COLLECTS_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Collects' }),
				state
			);
			break;
		case 'COLLECTDETALLE_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'CollectDetalle', params: action.payload }),
				state
			);
			break;
		case 'LOGOUT_NAV':
			nextState = AppNavigator.router.getStateForAction(
				NavigationActions.navigate({ routeName: 'Login' }),
				state
			);
			break;
		default:
			nextState = AppNavigator.router.getStateForAction(action, state);
			break;
	}
	// Simply return the original `state` if `nextState` is null or undefined.
	return nextState || state;
}
