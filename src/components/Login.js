import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Keyboard, Image, ImageBackground, Text, TouchableWithoutFeedback, View, TextInput, AsyncStorage } from 'react-native';
import { Button, } from 'native-base';
import stylesApp from '../assets/styles';
import { get_contratos, clear_tables } from './Utils';
import Loading from './Loading';

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			rut: null,
			pass: null,
			isLogging: false
		};
		this.login = this.login.bind(this);
	}

	/************ SACADO DE INTERNET ****************/
	validarRut(rutCompleto) {
		/*if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv = tmp[1];
		var rut = tmp[0];*/
		let digv = rutCompleto.slice(-1);
		const rut = rutCompleto.slice(0, -1);
		if (digv === 'K') digv = 'k';
		return (this.dv(rut) == digv); // se coloca solo == para qeu no compare el tipo de variable, si no solo el contenido
	}

	dv(T) {
		let M = 0;
		let S = 1;
		for (;T;T=Math.floor(T/10)) {
			S = (S+T%10*(9-M++%6))%11;
		}
		return S ? S-1 : 'k';
	}
	/************ SACADO DE INTERNET ****************/

	async login() {
		//quitarle los puntos, los guiones, y pasarlo a mayusculas
		const rut = this.state.rut.replace(/\./g, '').replace(/\-/g, '').toUpperCase();
		if (!this.validarRut(rut)) {
			this.setState({ isLogging: false, rut: null });
			this.Loading.showLoading(true, 'Alerta', 'Rut inválido', [{ text: 'OK', onPress: null }], false);
		} else if (rut && this.state.pass) {
			this.setState({ isLogging: true });
			const user = _.find(this.props.users, { rut, pass: this.state.pass });
			if (user) {
				if (user.habilitado) {
					if (user.habilitado_movil) {
						const lastLoginString = await AsyncStorage.getItem('lastLoginAgrobookCooprinsem');
						const goNext = async () => {
							await this.props.saveUser({ lastLogin: true, ...user });
							if (this.props.user && this.props.user.rut) {
								this.setState({ isLogging: false });
								this.props.goHome();
							}	else {
								this.setState({ isLogging: false });
								this.Loading.showLoading(true, 'Alerta', 'Datos inválidos', [{ text: 'OK', onPress: null }], false);
							}
						};
						if (lastLoginString) {
						const lastLoginJson = JSON.parse(lastLoginString);
						const next = async () => {
							await AsyncStorage.mergeItem(
								'lastLoginAgrobookCooprinsem',
								JSON.stringify({ lastLogin: true, ...user })
							).then(() => {
								console.log('Save user ok merge');
								goNext();
							}).catch((error) => {
								console.log(`Save user Error merge ${JSON.stringify(error)}`);
								this.Loading.showLoading(true, 'Alerta', 'Datos inválidos', [{ text: 'OK', onPress: null }], false);
								this.setState({ isLogging: false });
							});
						};

						if (user.rut !== lastLoginJson.rut) {
							console.log('Usuario diferente al previo, se borraran la información');
							//aqui debo llamar l afuncion de borrar los contratos prevuis ya que no son del usuario nuevo logueandose
							await this.props.setData([]);
							await this.props.setRecomendaciones([]);
							await clear_tables(user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, next, true, false, this.Loading.showLoading);
						} else {
							await get_contratos(user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, next, this.Loading.showLoading);
						}
						//ahora si si son el mismo usuario pues no pasa nada
					} else {
						await AsyncStorage.setItem(
							'lastLoginAgrobookCooprinsem',
							JSON.stringify({ lastLogin: true, ...user })
						).then(() => {
							console.log('Save user ok');
							this.Loading.showLoading(true, 'Éxito', 'Sincronice para traer su información', [{ text: 'OK', onPress: null }], false);
							goNext();
						}).catch((error) => {
							console.log(`Save user Error ${JSON.stringify(error)}`);
							this.Loading.showLoading(true, 'Alerta', 'Datos inválidos', [{ text: 'OK', onPress: null }], false);
							this.setState({ isLogging: false });
						});
					}
					} else {
						this.Loading.showLoading(true, 'Alerta', 'Su licencia no incluye el Agrobook Móvil', [{ text: 'OK', onPress: null }], false);
						this.setState({ isLogging: false });
					}
				} else {
					this.Loading.showLoading(true, 'Alerta', 'Usuario deshabilitado', [{ text: 'OK', onPress: null }], false);
					this.setState({ isLogging: false });
				}
			} else {
				this.setState({ isLogging: false });
				this.Loading.showLoading(true, 'Alerta', 'Datos inválidos', [{ text: 'OK', onPress: null }], false);
			}
		}
	}

	render() {
		return (



			<ImageBackground source={stylesApp.fondonewlogin} style={stylesApp.imageBackgroundStyle}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                    <View style={stylesApp.container}>

                        <Image style={stylesApp.imageSingIn} resizeMode="contain" source={stylesApp.logonewagrosat} />
                        
                        <Text style={stylesApp.title}>INICIAR SESIÓN</Text>    
                        <Text style={stylesApp.headergreen}>Test Tepeyac</Text>

                       	<Text style={stylesApp.titlegreen}>USUARIO</Text>
						<TextInput name="rut" style={stylesApp.textinputgreen} 
						underlineColorAndroid={'transparent'} 
						value={this.state.rut}
						onChangeText={rut => this.setState({ rut })}
						onSubmitEditing={Keyboard.dismiss}/>

                		<Text style={stylesApp.titlegreen}>CONTRASEÑA</Text>
						<TextInput name="pass" secureTextEntry={true}  
						style={stylesApp.textinputgreen} underlineColorAndroid={'transparent'} 
						onChangeText={pass => this.setState({ pass })}
						onSubmitEditing={Keyboard.dismiss}/>
                        <Text style={stylesApp.titlegreen} onPress={() => this.props.navigation.navigate('StartScreen')}>Volver</Text>
                        {this.state.isLogging || !this.state.rut || !this.state.pass ?
											<Button
												full
												onPress={this.login}
												style={stylesApp.button}
												disabled
											>
												{
													this.state.isLogging ?
														<Image
															source={stylesApp.loadingGif}
															style={{
																width: stylesApp.widthWindow * 0.05,
																height: stylesApp.widthWindow * 0.05,
															}}
														/>
													:
														<Text style={stylesApp.textbtn}>Ingresar</Text>}
											</Button>
											:
											<Button
												onPress={this.login}
												full
												style={stylesApp.buttongreen}
											>
												<Text style={stylesApp.textbtn}>Ingresar</Text>
											</Button>
						}
						
                        <Image style={stylesApp.imagetepeyac} resizeMode="contain" source={stylesApp.logonewtepeyac}/>


                   				 </View>

               	 </TouchableWithoutFeedback>
					<Loading ref={c => this.Loading = c} />
            </ImageBackground>


								
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.auth,
		data: state.data,
		users: state.users,
		cs_recomendaciones: state.cs_recomendaciones,
	};
}

const mapDispatchToProps = dispatch => ({
	saveUser: (response) => dispatch({ type: 'SAVE_USER', payload: response }),
	goHome: () => dispatch({ type: 'HOME_NAV' }),
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response }),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response }),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
