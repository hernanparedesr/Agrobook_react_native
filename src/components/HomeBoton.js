import React, { Component } from 'react';
import { TouchableOpacity, Alert, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import stylesApp from '../assets/styles';

import Loading from './Loading';

class HomeBoton extends Component {

	constructor(props) {
		super(props);
		this.home = this.home.bind(this);
	}

	home() {
		const { nav } = this.props;
		const lastRoute = nav.routes[nav.routes.length - 1];
		const lastRouteName = nav.routes[nav.routes.length - 1].routeName;
		if (lastRouteName === 'Generar') {
			this.Loading.showLoading(true, 'Regresar', '¿Desea regresar? Perderá la recomendación', [
				{ text: 'Cancelar', onPress: null },
				{ text: 'Si',
					onPress: async () => {
						this.props.removeGenerar();
						this.Loading.hideLoading();
						this.props.goHome();
						//return true;
					}
				}
			], false);
		} else if (lastRouteName === 'Controlar') {
			this.Loading.showLoading(true, 'Regresar', '¿Desea regresar? Perderá la supervisión', [
				{ text: 'Cancelar', onPress: null },
				{ text: 'Si',
					onPress: async () => {
						this.props.removeControlar();
						this.Loading.hideLoading();
						this.props.goHome();
						//return true;
					}
				}
			], false);
		} else if (lastRouteName === 'Sincronizar' || lastRouteName === 'Collect') {
			this.Loading.showLoading(true, 'Regresar', '¿Desea regresar?', [
				{ text: 'Cancelar', onPress: null },
				{ text: 'Si',
					onPress: async () => {
						this.Loading.hideLoading();
						this.props.goHome();
						//return true;
					}
				}
			], false);
		}
		return false;
	}

	render() {
		return (
			<TouchableOpacity
				onPress={this.home}
				style={{ width: '50%', height: '100%', alignItems: 'flex-end', justifyContent: 'center' }}
			>
				<MaterialIcons name='home' color={stylesApp.whitePrimary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25} />
				<Loading ref={c => this.Loading = c} />
			</TouchableOpacity>

		);
	}
}

const mapStateToProps = state => ({
	nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
	goHome: () => dispatch({ type: 'HOME_NAV'}),
	removeGenerar: () => dispatch({ type: 'REMOVE_GENERAR' }),
	removeControlar: () => dispatch({ type: 'REMOVE_CONTROLAR' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeBoton);
