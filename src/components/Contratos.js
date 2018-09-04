import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import { Keyboard, StyleSheet, Alert, ListView, View, } from 'react-native';
import { Item, Input, Body, } from 'native-base';
import stylesApp from '../assets/styles';
import { MaterialIcons } from '@expo/vector-icons';
import ContratosDetalle from './ContratosDetalle';
import FondoTemplate from './FondoTemplate';
import Cultivos from './Cultivos';
import Loading from './Loading';

class Contratos extends Component {
	constructor(props) {
		super(props);

		this.route = this.props.nav.routes[this.props.nav.routes.length - 1];
		this.routeName = this.route.routeName;

		this.contratos = this.routeName === 'Generar'
		? _.map(this.props.data, c => _.assign(c, {selected: false}) )
		: _.map(this.props.cs_recomendaciones, c => _.assign(c, {selected: false}) );

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });


		this.state = {
			data: this.ds.cloneWithRows(this.contratos),
			isLoadingC: false,
			activeC: 0,
			route: this.routeName,
			cultivo: [],
			filter: '',
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isLoadingC !== this.state.isLoadingC || nextState.activeC !== this.state.activeC || nextState.filter !== this.state.filter || nextState.data !== this.state.data) return true;
    return false;
  }

	searchContrato(info) {
		const filter = info.toLowerCase();

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? this.contratos
      : this.contratos.filter(({ cto_num, calle, distrito, agricultor_nombre, agricultor_rut, zona_nombre }) => (
        0 <= cto_num.toLowerCase().indexOf(filter) ||
        0 <= calle.toLowerCase().indexOf(filter) ||
        0 <= distrito.toLowerCase().indexOf(filter) ||
        0 <= agricultor_nombre.toLowerCase().indexOf(filter) ||
        0 <= agricultor_rut.toLowerCase().indexOf(filter) ||
        0 <= zona_nombre.toLowerCase().indexOf(filter)
      ));

    this.setState({
    	filter: info,
      data: this.ds.cloneWithRows(filtered)
    });
	}

	async selectContrato(contratoSelected) {
		let contrato = [];
		let contratos = this.routeName === 'Generar' ? this.props.data : this.props.cs_recomendaciones;
		const routeGeneral = this.props.nav.routes[this.props.nav.routes.length - 1];

		let getContrato = () => {
			_.map(contratos, c => {
				if(c.id === contratoSelected.id) c.selected = true;
				else c.selected = false;
				return c;
			});
			contratoSelected.selected = true;
			this.setState({
				data: this.ds.cloneWithRows(contratos),
				isLoadingC: true,
				activeC: contratoSelected.id,
			});
			contrato = {
				id: contratoSelected.id,
				cto_num: contratoSelected.cto_num,
				agricultor_nombre: contratoSelected.agricultor_nombre,
				agricultor_rut: contratoSelected.agricultor_rut,
				agricultor_email: contratoSelected.agricultor_email,
				calle: contratoSelected.calle,
				distrito: contratoSelected.distrito,
				zona_nombre: contratoSelected.zona_nombre,
				campos: contratoSelected.campos,
				recomendaciones: contratoSelected.recomendaciones,
				collect: {},
				cultivos_campo: contratoSelected.cultivos_campo
			};
		};

		if (routeGeneral.routeName === 'Generar') {
			if (routeGeneral.index === 0) {				//generar - contratos
				const lastLastRoute = routeGeneral.routes[0];
				if (lastLastRoute.index === 0) {
					getContrato();
					if (this.props.generar.contrato && this.props.generar.contrato.id && this.props.generar.contrato.id !== contrato.id) {
						this.Loading.showLoading(true, 'Alerta', 'Cambiar de destinatario eliminará la información actual. ¿Desea continuar?', [
							{ text: 'Cancelar',
								onPress: () => {
									_.map(contratos, c => {
										if(c.id === this.props.generar.contrato.id) c.selected = true;
										else c.selected = false;
										return c;
									});
									contrato.selected = false;
									this.setState({
										data: this.ds.cloneWithRows(contratos),
										filter: '',
										isLoadingC: false,
										activeC: this.props.generar.contrato.id
									});
									this.Loading.hideLoading();
								}
							},
							{ text: 'Si',
								onPress: async () => {
								  this.props.updateContratoGenerar(contrato, !this.props.generar.changeContrato);
								  this.setState({
										filter: '',
										isLoadingC: false,
										cultivo: []
									});
									this.Loading.hideLoading();
									this.props.goCultivos();
								}
							}
						], false);
					} else if(this.props.generar.contrato && this.props.generar.contrato.id && this.props.generar.contrato.id === contrato.id) {
						this.setState({
							filter: '',
							isLoadingC: false,
						});
						this.props.goCultivos();
					} else {
						this.props.saveContratoGenerar(contrato);
						this.setState({
							filter: '',
							isLoadingC: false,
						});
						this.props.goCultivos();
					}
				}
			}
		} else if (routeGeneral.routeName === 'Controlar') {
			if (routeGeneral.index === 0) {				//controlar - contratos
				getContrato();
				if (this.props.controlar.contrato && this.props.controlar.contrato.id && this.props.controlar.contrato.id !== contrato.id) {
					this.Loading.showLoading(true, 'Alerta', 'Cambiar de destinatario eliminará la información actual. ¿Desea continuar?', [
						{ text: 'Cancelar',
							onPress: () => {
								_.map(contratos, c => {
									if(c.id === this.props.controlar.contrato.id) c.selected = true;
									else c.selected = false;
									return c;
								});
								contrato.selected = false;
								this.setState({
									filter: '',
									data: this.ds.cloneWithRows(contratos),
									isLoadingC: false,
									activeC: this.props.controlar.contrato.id
								});
								this.Loading.hideLoading();
							}
						},
						{ text: 'Si',
							onPress: async () => {
								this.props.updateContratoControlar(contrato, !this.props.controlar.changeContrato);
								this.setState({
									filter: '',
									isLoadingC: false,
								});
								this.Loading.hideLoading();
								this.props.goRecomendaciones();
							}
						}
					], false);
				} else if (this.props.controlar.contrato && this.props.controlar.contrato.id && this.props.controlar.contrato.id === contrato.id) {
				this.setState({
					filter: '',
					isLoadingC: false,
				});
					this.props.goRecomendaciones();
				} else {
					this.props.saveContratoControlar(contrato);
					this.setState({
						filter: '',
						isLoadingC: false,
					});
					this.props.goRecomendaciones();
				}
			}
		}
	}

	renderDetalle(contrato) {
		return <ContratosDetalle contrato={contrato} press={this.state.isLoadingC ? () => {} : this.selectContrato.bind(this)} isLoading={this.state.isLoadingC} activeC={this.state.activeC} route={this.state.route} />;
	}

	render() {
		const route = this.state.route;
		console.log(route);
		return (
			<FondoTemplate>
				<View style={{marginRight: '5%', marginLeft: '5%', marginTop: 5, height: 60, justifyContent: 'center'}}>
					<Body>
						<Item>
							<Input
								name="buscar"
								placeholder='Buscar'
								placeholderTextColor={stylesApp.blackSecondary}
								style={StyleSheet.flatten(styles.input)}
								onChangeText={this.searchContrato.bind(this)}
								value={this.state.filter}
								onSubmitEditing={Keyboard.dismiss}
							/>
							<MaterialIcons name='search' color={route === 'Generar' ? stylesApp.colorNaranja : route === 'Controlar' ? stylesApp.colorAzul : stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} />
						</Item>
					</Body>
				</View>
				<View style={{ height: '85%'}}>
					<ListView
		        dataSource={this.state.data}
		        renderRow={this.renderDetalle.bind(this)}
		        enableEmptySections={true}
		      />
				</View>
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

const styles = StyleSheet.create({
	inputContainer: {
		//marginTop: stylesApp.heightWindow * 0.05,
		marginRight: stylesApp.widthWindow * 0.05,
		marginLeft: stylesApp.widthWindow * 0.05,
	},
	input: {
		color: stylesApp.blackSecondary,
		fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
		fontFamily: stylesApp.fontRegular,
	},
});

function mapStateToProps(state) {
	return {
		data: state.data,
		cs_recomendaciones: state.cs_recomendaciones,
		nav: state.nav,
		generar: state.generar,
		controlar: state.controlar
	};
}

const mapDispatchToProps = dispatch => ({
	//goNormas: () => dispatch({ type: 'NORMAS_NAV' }),
	goCultivos: () => dispatch({ type: 'CULTIVOS_NAV' }),
	saveContratoGenerar: (contrato) => dispatch({ type: 'SET_CONTRATO_GENERAR', payload: contrato }),
	updateContratoGenerar: (contrato, changeContrato) => dispatch({ type: 'UPDATE_CONTRATO_GENERAR', payload: {contrato, changeContrato} }),
	goRecomendaciones: () => dispatch({ type: 'RECOMENDACIONES_NAV' }),
	saveContratoControlar: (contrato) => dispatch({ type: 'SET_CONTRATO_CONTROLAR', payload: contrato }),
	updateContratoControlar: (contrato, changeContrato) => dispatch({ type: 'UPDATE_CONTRATO_CONTROLAR', payload: {contrato, changeContrato} }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contratos);
