import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AsyncStorage, View, Text, Platform, Animated, Image } from 'react-native';

import { sync_data, sync_data2, data_Sync, get_userInsumos, get_contratos } from './Utils';

import HomeBotones from './HomeBotones';
import Icon from '@expo/vector-icons/FontAwesome'
import { Button, } from 'native-base';
import stylesApp from '../assets/styles';
import Loading from './Loading';
import { Grid, Col } from 'react-native-easy-grid';





class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			action: '',
		};

		super();
 
	this.scrollYAnimatedValue = new Animated.Value(0);
	this.scrollY = new Animated.Value(0);    // How many pixels scrolled
 
	}





renderBotonMenu(icon, action, texto, press) {
	return (
		<HomeBotones icon={icon} action={action} texto={texto} press={press} isLoading={this.state.isLoading} actionLoading={this.state.action} />
	);
}

	render()
{
    const parallaxHeaderHeight = 200;
const headerHeight = 70;
const headerDiff = parallaxHeaderHeight - headerHeight;    // 100px

    return(
      <View style = { styles.container }>
      
       <Animated.Image
            source={stylesApp.fondoverde}
            style={{
				
				position: 'absolute', zIndex: 1,
				top: 0, left: 0, right: 0,
				width: '100%',
				height: parallaxHeaderHeight,
				transform: [
                    {
                        translateY: this.scrollY.interpolate({
							inputRange: [-1, 0, headerDiff, headerDiff + 1],
                            outputRange: [0, 0, -headerDiff, -headerDiff]
                        })
                    },
                    {
                        scale: this.scrollY.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [1.005, 1, 1]
                        })
                    }
                ] 
				
			}}
        >
<Animated.View style = {{ height: parallaxHeaderHeight, backgroundColor: 'transparent' } }>
					

					<Grid>
							<Col size={20} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
							<Icon name="user-o" size={18}
									color={stylesApp.whitePrimary}
									onPress={this.salir}
								/><Text style={styles.headerText}>{this.props.user.rut.length > 0 ? this.props.user.nombre : ''}</Text>
								</Col>

								<Col size={60} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
								<Image style = {styles.imageheader} resizeMode="contain" source={stylesApp.logonewagrosatblanco} />
								</Col>
							
							
							<Col size={20} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
								<Icon name="sign-out" size={18}
									color={stylesApp.whitePrimary}
									onPress={this.salir}
								/>
							</Col>
						</Grid>

			
			</Animated.View>
		</Animated.Image>

		

<Animated.ScrollView
            contentContainerStyle={{ paddingTop: parallaxHeaderHeight}}
            scrollEventThrottle={1}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                { useNativeDriver: true }
            )}
        >
         	<Button style={styles.buttonmenu} onPress={this.generar} >
				 			<Icon name="folder-open-o" size={18} />
                            <Text style = { styles.itemText }> GENERAR RECOMENDACIÓN</Text>
                </Button>

				<Button style={styles.buttonmenu} onPress={this.controlar} >
				 			<Icon name="search" size={18} />
                            <Text style = { styles.itemText }> CONTROLAR RECOMENDACIÓN</Text>
                </Button>

				<Button style={styles.buttonmenu} onPress={this.sincronizar} >
							<Icon name="search" size={18} />
                            <Text style = { styles.itemText }> EDITAR O SINCRONIZAR</Text>
                </Button>

				<Button style={styles.buttonmenu} onPress={this.collect} >
				 			<Icon name="calendar" size={18} />
                            <Text style = { styles.itemText }> REGISTROS COLLECT</Text>
                </Button>
        </Animated.ScrollView>
		

	  <Loading ref={c => this.Loading = c} />
  </View>
  
    );
}








	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.isLoading !== this.state.isLoading) {
			return true;
		}
		return false;
	}

	generar = async () => {
		this.setState({
			isLoading: true,
			action: 'generar'
		});

		if (this.props.data && this.props.data.length > 0) {
			setTimeout(() => {
				this.setState({
					isLoading: false,
					action: '',
				});
				this.props.goGenerar();
			}, 100);
		} else {
			this.Loading.showLoading(true, 'Alerta', 'No hay destinatarios disponibles', [{text: 'OK', onPress: null}], false);
			this.setState({
				isLoading: false,
				action: '',
			});
		}
	}

	controlar = async () => {
		this.setState({
			isLoading: true,
			action: 'controlar'
		});
		if (this.props.cs_recomendaciones && this.props.cs_recomendaciones.length > 0) {
			setTimeout(() => {
				this.setState({
					isLoading: false,
					action: '',
				});
				this.props.goControlar();
			}, 100);
		} else {
			this.Loading.showLoading(true, 'Alerta', 'No hay recomendaciones disponibles', [{text: 'OK', onPress: null}], false);
			this.setState({
				isLoading: false,
				action: '',
			});
		}
	}

	sincronizar = async () => {
		this.setState({
			isLoading: true,
			action: 'sync'
		});

		const nextNextNext = (resp) => {
			this.setState({
				isLoading: false,
				action: '',
			});
		};

		const nextNext = (resp) => {
			if (resp) {
				nextNextNext();
			} else {
				const getDatos = (resp) => {
					get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextNextNext, this.Loading.showLoading);
				};

				get_userInsumos(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, getDatos, this.Loading.showLoading);
			}
		};

		const sinc = () => {
			//para que solo sincronice lo que no sea de recomendaciones y supervisiones
			sync_data2(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, nextNext, false, this.Loading.showLoading);
		};

		const next = async (data) => {
			if (data !== false) {
				if (data.recomendacionesSync.length > 0 || data.supervisionesSync.length > 0) {
					if (data.recomendacionesSync.length === 0) {
						this.setState({
							isLoading: false,
							action: '',
						});
						this.props.goSupsSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
					} else {
						this.setState({
							isLoading: false,
							action: '',
						});
						this.props.goSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
					}
				} else {
					this.Loading.showLoading(
						true,
						'No hay recomendaciones/supervisiones para enviar',
						'¿Desea traer información actualizada?',
						[{ text: 'No',
							onPress: () => {
								this.setState({
									isLoading: false,
									action: '',
								});
								this.Loading.hideLoading();
							}
						},
						{ text: 'Si',
							onPress: () => sinc()
						}],
						false);
				}
			} else {
				this.setState({
					isLoading: false,
					action: '',
				});
			}
		}


		await data_Sync(true, next, this.Loading.showLoading);
	}

	salir = async () => {
		this.setState({
			isLoading: true,
			action: 'salir',
		});

		const salirFunc = () => {
			this.Loading.showLoading(
				true,
				'Cerrar sesión',
				'¿Desea cerrar sesión y salir de la aplicación?',
				[
					{ text: 'Cancelar', onPress: () => {
						this.setState({
							isLoading: false,
							action: '',
						});
						this.Loading.hideLoading();
					}},
					{ text: 'Si',
						onPress: async () => {
							await AsyncStorage.mergeItem(
								'lastLoginAgrobookCooprinsem',
								JSON.stringify({ lastLogin: false })
							).then(async () => {
								const lastLogin_string = await AsyncStorage.getItem('lastLoginAgrobookCooprinsem');
								if (lastLogin_string) {
									const lastlogin_json = JSON.parse(lastLogin_string);
									if (!lastlogin_json.lastLogin) {
										console.log('Logout ok ' + JSON.stringify(lastlogin_json));
										//this.props.removeUser();
										this.Loading.hideLoading();
										this.props.goLogout();
									}
								}
							}).catch((error) => {
								console.log(error);
								this.Loading.showLoading(true, 'Error', 'Hubo un error en el proceso', [{ text: 'OK', onPress: null }], false);
							});
						}
					}
				], false);
		};

		const next = (isData) => {
			console.log(`Hay datos pendietes para sincronizar: ${isData}`);
			setTimeout(() => {
				if (isData) {
					this.Loading.showLoading(
						true,
						'Pendiente por sincronizar',
						'Si cierra la sesión y entra con otro usuario perderá lo pendiente por sincronizar. ¿Desea sincronizar?',
						[{ text: 'No', onPress: () => {
							this.setState({
								isLoading: false,
								action: '',
							});
							this.Loading.hideLoading();
						}},
						{ text: 'Si',
							onPress: () => {
								const nextNext = (resp = true) => {
									this.setState({
										isLoading: false,
										action: ''
									});
									if (resp) salirFunc();
									else {
										this.Loading.showLoading(true, 'Error', 'Hubo un error en la sincronización', [{ text: 'OK', onPress: null }], false);
									}
								};

								this.Loading.showLoading(true, 'Alerta', 'Sincronizando', [], true);
								sync_data(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, nextNext, true, false, this.Loading.showLoading);
							}
						}], false);
				} else {
					salirFunc();
				}
			}, 100);
		};

		await data_Sync(false, next, this.Loading.showLoading);
	}

	collect = async () => {
		this.setState({
			isLoading: true,
			action: 'collect'
		});

		if (this.props.collects.length > 0) {
			setTimeout(() => {
				this.setState({
					isLoading: false,
					action: '',
				});
				this.props.goCollect();
			}, 100);
		} else {
			this.Loading.showLoading(true, 'Alerta', 'No hay registros de Collet', [{ text: 'OK', onPress: null }], false);
			this.setState({
				isLoading: false,
				action: '',
			});
		}
	}

	

	
}

const styles = {
	container:
	{
		flex: 1,
		paddingTop: (Platform.OS == 'ios') ? 20 : 0
	},

	animatedHeader:
	{
		position: 'absolute',
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},

	imageheader:
	{
		width: 200,
		justifyContent: 'center',
		alignItems: 'center'
	}, 

	headerText:
    {
        color: 'white',
        fontSize: 10
	},
	
	item:
	{
		backgroundColor: '#E0E0E0',
		margin: 16,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},

	itemText:
	{
		color: 'black',
		fontSize: 16
	},

	buttonmenu :{
		backgroundColor: '#E0E0E0',
		width: '90%',
		height: '40%',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 16,
		borderRadius: 60,
	},
};

const mapStateToProps = state => ({
	user: state.auth,
	data: state.data,
	cs_recomendaciones: state.cs_recomendaciones,
	collects: state.collects,
	insumos: state.insumos,
	nav: state.nav
});

const mapDispatchToProps = dispatch => ({
	goGenerar: () => dispatch({ type: 'GENERAR_NAV' }),
	goControlar: () => dispatch({ type: 'CONTROLAR_NAV' }),
	goSincronizar: (data) => dispatch({ type: 'SINCRONIZAR_NAV', payload: data }),
	goSupsSincronizar: (data) => dispatch({ type: 'SUPSSINCRONIZAR_NAV', payload: data }),
	goCollect: () => dispatch({ type: 'COLLECTS_NAV' }),
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response }),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response }),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
	goLogout: () => dispatch({ type: 'LOGOUT_NAV' }),
	removeUser: () => dispatch({ type: 'REMOVE_USER' }),
	saveUsers: (response) => dispatch({ type: 'SAVE_USERS', payload: response }),
	saveTemporadas: (response) => dispatch({ type: 'SAVE_TEMPORADAS', payload: response }),
	saveInsumos: (insumos, tipo_insumos, unidades) => dispatch({ type: 'SAVE_INSUMOS', payload: { insumos, tipo_insumos, unidades } }),
	saveCultivos: (response) => dispatch({ type: 'SAVE_CULTIVOS', payload: response }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);