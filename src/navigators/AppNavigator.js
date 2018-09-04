import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, TabBarTop } from 'react-navigation';
import _ from 'lodash';
import { BackHandler, Alert, Text} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


import stylesApp from '../assets/styles';


import Splash from '../components/Splash';
import StartScreen from '../components/StartScreen';
import Login from '../components/Login';
import Home from '../components/Home';
import Header from '../components/Header';
import Contratos from '../components/Contratos';
//Generar recomendaciones
import Cultivos from '../components/Cultivos';
import Normas from '../components/Normas';
import Recomendar from '../components/Recomendar';
//Controlar recomendaciones
import Recomendaciones from '../components/Recomendaciones';
import Supervisar from '../components/Supervisar';
//Sincronizar
import RecSincronizar from '../components/RecSincronizar';
import SupSincronizar from '../components/SupSincronizar';
//collet
import Collects from '../components/Collects';
import CollectDetalle from '../components/CollectDetalle';

import { volver_ruta } from '../components/Utils';

export const GenerarContratoNavigator = TabNavigator({
	Cons: {
		screen: Contratos,
		navigationOptions: {
			tabBarLabel: () => (
				<Text></Text>
			),
		},
	},
	Cultivos: {
		screen: Cultivos,
		navigationOptions: {
			tabBarLabel: () => (
				<Text></Text>
			),
		},
	},
},
{
	swipeEnabled: false,
	lazy: true,
	//lazyLoad: false,
	animationEnabled: false,
	initialRouteName: 'Cons',
	backBehavior: 'previousRoute',
	tabBarOptions: {
		style: {
			height: 0
		},
	}
});

export const GenerarNavigator = TabNavigator({
	Contratos: {
		screen: GenerarContratoNavigator,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, color: tintColor, textAlign: 'center' }} >DESTINATARIOS</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='work' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
	Normas: {
		screen: Normas,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, color: tintColor, textAlign: 'center' }} >MANEJOS</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='settings' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
	Recomendar: {
		screen: Recomendar,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, color: tintColor, textAlign: 'center' }} >RECOMENDAR</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='announcement' size={24} color={tintColor} />
			),
		},
	}
},
{
	swipeEnabled: false,
	lazy: true,
	tabBarComponent: ({ jumpToIndex, ...props, navigation }) => {
		return (
			<TabBarTop
					{...props}
					jumpToIndex={index => {
						if (props.navigation.generar.rec === undefined) {
							if (index === 0 && props.navigation.generar.isCollect === 0) {
								jumpToIndex(index);
							} else if (index === 1) {
								if (props.navigation.generar.contrato && !props.navigation.generar.contrato.id) {
									Alert.alert('Alerta', 'Seleccione un contrato primero');
									/*props.navigation.dispatch({ type: 'SHOW_LOADING', payload: {
										show: true,
										title: 'Alerta',
										msg: 'Seleccione un contrato primero',
										botones: [
											{ text: 'OK', onPress: null }
										],
										cancelable: false
									} });*/
								} else if (props.navigation.generar.cultivo.length === 0) {
									Alert.alert('Alerta', 'Seleccione un potrero con cultivo primero');
								} else jumpToIndex(index);
							} else if (index === 2) {
								//console.log(props.navigation.generar.cultivo.length);
								if (props.navigation.generar.contrato && props.navigation.generar.contrato.id) {
									if (props.navigation.generar.cultivo.length > 0) {
										if (props.navigation.generar.norma && !props.navigation.generar.norma.tipo_insumo_id) {
											Alert.alert('Alerta', 'Seleccione una norma primero');
										} else jumpToIndex(index);
									} else {
										Alert.alert('Alerta', 'Seleccione un potrero con cultivo primero');
									}
								} else {
									Alert.alert('Alerta', 'Seleccione un contrato primero');
								}
							}
						}
					}}
			/>
		);
	},
	initialRouteName: 'Contratos',
	backBehavior: 'previousRoute',
	tabBarOptions: {
		showIcon: true,
		activeTintColor: stylesApp.whitePrimary,
		inactiveTintColor: stylesApp.whiteSecondary,
		indicatorStyle: {
			backgroundColor: stylesApp.colorNaranja,
			borderWidth: 2,
			borderColor: stylesApp.colorNaranja,
		},
		style: {
			backgroundColor: stylesApp.blackDisabled,
			margin: 0,
			elevation: 0,
			paddingTop: 10,
			paddingBottom: 8,
		},
	}
});

export const ControlarNavigator = TabNavigator({
	Contratos: {
		screen: Contratos,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 10, color: tintColor, textAlign: 'center' }} >DESTINATARIOS</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='work' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
	Recomendaciones: {
		screen: Recomendaciones,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 10, color: tintColor, textAlign: 'center', }} >RECOMENDACIONES</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='announcement' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
	Supervisar: {
		screen: Supervisar,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 10, color: tintColor, textAlign: 'center' }} >SUPERVISAR</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='playlist-add-check' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	}
},
{
	swipeEnabled: false,
	lazy: true,
	tabBarComponent: ({ jumpToIndex, ...props, navigation }) => (
		<TabBarTop
			{...props}
			jumpToIndex={index => {
				if (props.navigation.controlar.sup === undefined) {
					if (index === 0) {
						jumpToIndex(index);
					} else if (index === 1) {
						if (props.navigation.controlar.contrato && !props.navigation.controlar.contrato.id) {
							Alert.alert('Alerta', 'Seleccione un contrato primero');
						} else jumpToIndex(index);
					} else if (index === 2) {
						if (props.navigation.controlar.contrato && props.navigation.controlar.contrato.id) {
							if (props.navigation.controlar.recomendacion && !props.navigation.controlar.recomendacion.id) {
								Alert.alert('Alerta', 'Seleccione una recomendación primero');
							} else jumpToIndex(index);
						} else Alert.alert('Alerta', 'Seleccione un contrato primero');
					}
				}
			}}
		/>
	),
	initialRouteName: 'Contratos',
	backBehavior: 'previousRoute',
	tabBarOptions: {
		showIcon: true,
		activeTintColor: stylesApp.whitePrimary,
		inactiveTintColor: stylesApp.whiteSecondary,
		indicatorStyle: {
			backgroundColor: stylesApp.colorAzul,
			borderWidth: 2,
			borderColor: stylesApp.colorAzul,
		},
		style: {
			backgroundColor: stylesApp.blackDisabled,
			margin: 0,
			elevation: 0,
			paddingTop: 10,
			paddingBottom: 8,
		},
	}
});

export const SincronizarNavigator = TabNavigator({
	RecSincronizar: {
		screen: RecSincronizar,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, color: tintColor, textAlign: 'center' }} >RECOMENDACIONES</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='announcement' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
	SupSincronizar: {
		screen: SupSincronizar,
		navigationOptions: {
			tabBarLabel: ({ tintColor }) => (
				<Text style={{ fontFamily: stylesApp.fontSemiBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, color: tintColor, textAlign: 'center', }} >SUPERVISIONES</Text>
			),
			tabBarIcon: ({ tintColor }) => (
				<MaterialIcons name='playlist-add-check' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={tintColor} />
			),
		},
	},
},
{
	swipeEnabled: false,
	lazy: false,
	initialRouteName: 'RecSincronizar',
	tabBarComponent: ({ jumpToIndex, ...props, navigation }) => (
		<TabBarTop
			{...props}
			jumpToIndex={index => {
				let sups = [];
				const recs = navigation.state.routes[0].params && navigation.state.routes[0].params.recs ? navigation.state.routes[0].params.recs : [];
				if (index === 0) {
					recs.length === 0 ?
						Alert.alert('Alerta', 'No hay recomendaciones para sincronizar')
					: jumpToIndex(index);
				} else if (index === 1) {
					recs.length > 0 ?
						sups = _.filter(recs, r => r.supervisiones.length > 0)
					: sups = [];
					navigation.state.routes[1].params.sups.length === 0 && sups.length === 0 ?
						Alert.alert('Alerta', 'No hay supervisiones para sincronizar')
					: jumpToIndex(index);
				} else {
					jumpToIndex(index);
				}
			}}
		/>
	),
	backBehavior: 'previousRoute',
	tabBarOptions: {
		showIcon: true,
		activeTintColor: stylesApp.whitePrimary,
		inactiveTintColor: stylesApp.whiteSecondary,
		indicatorStyle: {
			backgroundColor: stylesApp.whiteSecondary,
			borderWidth: 2,
			borderColor: stylesApp.whiteSecondary,
		},
		style: {
			backgroundColor: stylesApp.blackDisabled,
			margin: 0,
			elevation: 0,
			paddingTop: 10,
			paddingBottom: 8,
		},
	}
});

export const CollectNavigator = TabNavigator({
	Collects: {
		screen: Collects,
		navigationOptions: {
			tabBarLabel: () => (
				<Text></Text>
			)
		},
	},
	CollectDetalle: {
		screen: CollectDetalle,
		navigationOptions: {
			tabBarLabel: () => (
				<Text></Text>
			),
		},
	}
},
{
	swipeEnabled: false,
	lazy: true,
	//lazyLoad: false,
	animationEnabled: false,
	initialRouteName: 'Collects',
	backBehavior: 'previousRoute',
	tabBarOptions: {
		style: {
			height: 0
		},
	}
});

export const AppNavigator = StackNavigator({
	Splash: {
		screen: Splash,
		navigationOptions: {
			header: null,
		},
	},
	StartScreen: {
		screen: StartScreen,
		navigationOptions: {
			header: null,
		},
	},
	Login: {
		screen: Login,
		navigationOptions: {
			header: null,
		},
	},
	Home: {
		screen: Home,
		navigationOptions: {
			header: null,
		  }
	},
	Generar: {
		screen: GenerarNavigator,
		navigationOptions: {
			header: <Header title='GENERAR RECOMENDACIÓN' />,
		}
	},
	Controlar: {
		screen: ControlarNavigator,
		navigationOptions: {
			header: <Header title='CONTROLAR RECOMENDACIÓN' />,
		}
	},
	Sincronizar: {
		screen: SincronizarNavigator,
		navigationOptions: {
			header: <Header title='EDITAR O SINCRONIZAR' />,
		}
	},
	Collect: {
		screen: CollectNavigator,
		navigationOptions: {
			header: <Header title='REGISTROS COLLECT' />,
		}
	},
},
{
	navigationOptions: {
		gesturesEnabled: false,
	},
});

class AppWithNavigationState extends Component {

	constructor(props) {
		super(props);

		this.handleBackButton = this.handleBackButton.bind(this);
	}

	async componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	onNavigationStateChange(prevState, newState) {
		this.setState({ ...this.state, route_index: newState.index });
	}

	//added to handle back button functionality on android
	async handleBackButton() {
		const { nav, dispatch, generar, controlar } = this.props;
		if (this.props.nav.routes.length > 0) {
			await volver_ruta(nav, dispatch, generar, controlar);
		} else {
			return false;
		}
	}

	render() {
		return (
			<AppNavigator
				navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.nav, generar: this.props.generar, controlar: this.props.controlar })}
			/>
		);
	}

}

const mapStateToProps = state => ({
	nav: state.nav,
	generar: state.generar,
	controlar: state.controlar
});

export default connect(mapStateToProps)(AppWithNavigationState);
