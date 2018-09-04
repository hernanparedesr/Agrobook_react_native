import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { StyleSheet, ImageBackground, AsyncStorage, Alert, Text } from 'react-native';
import { Container, Button } from 'native-base';
import stylesApp from '../assets/styles';

import { install_query, get_contratos, sync_data, get_userInsumos } from './Utils';

import Loading from './Loading';

class Splash extends Component {

	constructor(props) {
		super(props);

		this.state = {
			reintentar: false
		};

		this.reintentar = this.reintentar.bind(this);
	}

	componentDidMount() {
		this.reintentar();
	}

	async reintentar() {
		this.setState({reintentar: false});
		const install_string = await AsyncStorage.getItem('installAgrobookCooprinsem');
		const install_json = JSON.parse(install_string);
		const licencia_string = await AsyncStorage.getItem('licenciaAgrobookCooprinsem');
		const licencia_json = JSON.parse(licencia_string);
		let lastLogin_string = await AsyncStorage.getItem('lastLoginAgrobookCooprinsem');
		let lastLogin_json = JSON.parse(lastLogin_string);

		const toLogin = (resp) => {
			this.props.goLogin();
		};

		const toHome = (resp) => {
			this.props.goHome();
		};

		const toReintentar = (resp) => {
			if (resp) this.props.goLogin();
			else {
				this.setState({ reintentar: true });
			}
		};

		const installLoginFalseFunc = (resp) => {
			if (resp) this.props.goLogin();
			else get_userInsumos(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, toLogin, this.Loading.showLoading);
		};

		const getDatos = async (resp) => {
			await this.props.saveUser(lastLogin_json);
			if (this.props.user && this.props.user.lastLogin && this.props.user.rut) {
				get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, toHome, this.Loading.showLoading);
			} else {
				this.props.goLogin();
			}
		};

		const installLoginTrueFunc = (resp) => {
			if (resp) {
				sync_data(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, getSync, false, true, this.Loading.showLoading);
			} else {
				get_userInsumos(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, getDatos, this.Loading.showLoading);
			}
		};

		let getSync = (resp) => {
			if (resp) this.props.goHome();
			else getDatos();
		};

		if (install_json && licencia_json) {
			if (lastLogin_json) {
				if (lastLogin_json.lastLogin && lastLogin_json.habilitado) {
					await this.props.saveUser(lastLogin_json);
					if (this.props.user && this.props.user.lastLogin && this.props.user.rut) {
						install_query(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, false, lastLogin_json, installLoginTrueFunc, this.Loading.showLoading);
					} else toLogin();
				} else {
					install_query(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, false, lastLogin_json, installLoginFalseFunc, this.Loading.showLoading);
				}
			} else {
				install_query(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, false, [], installLoginFalseFunc, this.Loading.showLoading);
			}
		} else {
			install_query(this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, true, [], toReintentar, this.Loading.showLoading);
		}
	}

	render() {
		return (
			<ImageBackground
				source={stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.fondoExpoTablet : stylesApp.fondoExpoPhone}
				style={stylesApp.fondoDimensiones}
			>
				<Container style={stylesApp.contentCenter}>
					<ImageBackground
						source={stylesApp.logoAgrobook}
						style={styles.logoAgrobook}
					>
					{
						this.state.reintentar ?
							<Button
								onPress={this.reintentar}
								full
								style={styles.boton}
							>
								<Text style={styles.botonText}>Reintentar</Text>
							</Button>
						: null
					}
					</ImageBackground>
					<Loading ref={c => this.Loading = c} />
				</Container>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	fondo: {
		width: '100%',
		height: '100%',
		position: 'absolute'
	},
	logoAgrobook: {
		width: stylesApp.widthWindow < stylesApp.widthTablet ?
			stylesApp.widthWindow * 0.6 : stylesApp.widthWindow * 0.48,
		height: stylesApp.widthWindow < stylesApp.widthTablet ?
			stylesApp.widthWindow * 0.125 : stylesApp.widthWindow * 0.098,
	},
	boton: {
		marginTop: '30%',
		marginRight: '10%',
		marginLeft: '10%',
		borderRadius: 5,
		backgroundColor: stylesApp.blackSecondary,
	},
	botonText: {
		color: stylesApp.whiteSecondary,
		fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
		fontFamily: stylesApp.fontRegular,
	}
});

function mapStateToProps(state) {
	return {
		user: state.auth,
		users: state.users,
		nav: state.nav,
		data: state.data,
		insumos: state.insumos,
		cs_recomendaciones: state.cs_recomendaciones,
	};
}

const mapDispatchToProps = dispatch => ({
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response}),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response}),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
	saveUser: (response) => dispatch({ type: 'SAVE_USER', payload: response}),
	saveUsers: (response) => dispatch({ type: 'SAVE_USERS', payload: response}),
	saveTemporadas: (response) => dispatch({ type: 'SAVE_TEMPORADAS', payload: response}),
	saveInsumos: (insumos, tipo_insumos, unidades) => dispatch({ type: 'SAVE_INSUMOS', payload: { insumos, tipo_insumos, unidades }}),
	saveCultivos: (response) => dispatch({ type: 'SAVE_CULTIVOS', payload: response}),
	goLogin: () => dispatch({ type: 'LOGIN_NAV' }),
	goHome: () => dispatch({ type: 'HOME_NAV' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
