import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ScrollView, StyleSheet, View, Text, TouchableHighlight, Alert, Image, } from 'react-native';
import { Card, CardItem, } from 'native-base';

import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import ContratoDetalle from './ContratoDetalle';
import ContratoCollectDetalle from './ContratoCollectDetalle';
import Loading from './Loading';

import IconCustom from './IconCustom';

class Normas extends Component {

	constructor(props) {
		super(props);

		this.tipo_insumos = [];

		if (this.props.generar.cultivo.length === 1 && this.props.generar.cultivo[0].tipo_insumo_ids.length > 0) {
			let cultivo_tipo_insumos = this.props.generar.cultivo[0].tipo_insumo_ids.split(', ');
			//cultivo_tipo_insumos = _.map(cultivo_tipo_insumos, cti => { return {id: cti} });
			_.map(this.props.insumos.tipo_insumos, ti => {
				if (_.findIndex(cultivo_tipo_insumos, cti => { return cti == ti.id }) > -1) {
					this.tipo_insumos.push({
						tipo_insumo_id: ti.id,
						tipo_insumo_nombre: ti.nombre,
						tipo_cultivo_ids: ti.tipo_cultivo_ids,
						selected: false
					});
				}
			});
		} else {
			this.tipo_insumos = _.map(this.props.insumos.tipo_insumos, ti => {
				return {
					tipo_insumo_id: ti.id,
					tipo_insumo_nombre: ti.nombre,
					tipo_cultivo_ids: ti.tipo_cultivo_ids,
					selected: false
				};
			});
		}

		this.state = {
			tipo_insumos: this.tipo_insumos,
			changeContrato: this.props.generar.changeContrato,
			changeCultivo: this.props.generar.changeCultivo,
			isLoading: false,
			activeN: 0,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.generar.changeContrato !== this.state.changeContrato || nextProps.generar.changeCultivo !== this.state.changeCultivo) {
			//if (nextProps.generar.contrato && nextProps.generar.contrato.id && this.props.generar.contrato && this.props.generar.contrato.id && nextProps.generar.cultivo && nextProps.generar.cultivo.cultivo_nombre && this.props.generar.cultivo && this.props.generar.cultivo.cultivo_nombre) {
			if (nextProps.generar.contrato && nextProps.generar.contrato.id && this.props.generar.contrato && this.props.generar.contrato.id && nextProps.generar.cultivo.length > 0 && this.props.generar.cultivo.length > 0) {
				this.tipo_insumos = [];
				//console.log(nextProps.generar.cultivo);
				if (nextProps.generar.cultivo.length === 1 && nextProps.generar.cultivo[0].tipo_insumo_ids.length > 0) {
					let cultivo_tipo_insumos = nextProps.generar.cultivo[0].tipo_insumo_ids.split(', ');
					//cultivo_tipo_insumos = _.map(cultivo_tipo_insumos, cti => { return {id: cti} });
					_.map(nextProps.insumos.tipo_insumos, ti => {
						if (_.findIndex(cultivo_tipo_insumos, cti => { return cti == ti.id }) > -1) {
							this.tipo_insumos.push({
								tipo_insumo_id: ti.id,
								tipo_insumo_nombre: ti.nombre,
								tipo_cultivo_ids: ti.tipo_cultivo_ids,
								selected: false
							});
						}
					});
				} else {
					this.tipo_insumos = _.map(nextProps.insumos.tipo_insumos, ti => {
						return {
							tipo_insumo_id: ti.id,
							tipo_insumo_nombre: ti.nombre,
							tipo_cultivo_ids: ti.tipo_cultivo_ids,
							selected: false
						};
					});
				}
				this.setState({
					tipo_insumos: this.tipo_insumos,
					changeContrato: nextProps.generar.changeContrato,
					changeCultivo: nextProps.generar.changeCultivo,
					isLoading: false,
					activeN: 0,
				});
				this.scrollview.scrollTo({y: 0});
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.isLoading !== this.state.isLoading || nextState.activeN !== this.state.activeN /*|| nextProps.generar.changeContrato !== this.state.changeContrato || nextProps.generar.changeCultivo !== this.state.changeCultivo */|| nextState.tipo_insumos !== this.state.tipo_insumos) {
			return true;
		}
		return false;
	}

	selectNorma(tipo_insumo) {
		//let tipo_insumos = this.props.insumos.tipo_insumos;
		let tipo_insumos = this.tipo_insumos;
		_.map(tipo_insumos, ti => {
			if(ti.tipo_insumo_id === tipo_insumo.tipo_insumo_id) ti.selected = true;
			else ti.selected = false;
			return ti;
		});
		tipo_insumo.selected = true;
		this.setState({
			isLoading: true,
			tipo_insumos: tipo_insumos,
			activeN: tipo_insumo.tipo_insumo_id,
		});
		/*tipo_insumo = {
			tipo_insumo_id: tipo_insumo.tipo_insumo_id,
			tipo_insumo_nombre: tipo_insumo.tipo_insumo_nombre,
		};*/

		if (this.props.generar.norma && this.props.generar.norma.tipo_insumo_id && this.props.generar.norma.tipo_insumo_id !== tipo_insumo.tipo_insumo_id) {
			this.Loading.showLoading(true, 'Alerta', 'Cambiar de norma eliminará la información actual. ¿Desea continuar?', [
				{ text: 'Cancelar',
					onPress: () => {
						_.map(tipo_insumos, ti => {
							if(ti.tipo_insumo_id === this.props.generar.norma.tipo_insumo_id) ti.selected = true;
							else ti.selected = false;
							return ti;
						});
						tipo_insumo.selected = false;
						this.setState({
							isLoading: false,
							tipo_insumos: tipo_insumos,
							activeN: this.props.generar.norma.tipo_insumo_id
						});
						this.Loading.hideLoading();
					}
				},
				{ text: 'Si',
					onPress: () => {
						this.props.updateNormaGenerar(this.props.generar.contrato, this.props.generar.cultivo, tipo_insumo, !this.props.generar.changeNorma);
						this.setState({
							isLoading: false,
						});
						this.Loading.hideLoading();
						this.props.goRecomendar();
					}
				}
			], false);
		} else if(this.props.generar.norma && this.props.generar.norma.tipo_insumo_id && this.props.generar.norma.tipo_insumo_id === tipo_insumo.tipo_insumo_id){
			this.setState({
				isLoading: false,
			});
			this.props.goRecomendar();
		} else {
			this.props.saveNormaGenerar(this.props.generar.contrato, this.props.generar.cultivo, tipo_insumo);
			this.setState({
				isLoading: false,
			});
			this.props.goRecomendar();
		}
	}

	renderDetalleNorma(tipo_insumo, key) {
		let colorFondo = stylesApp.whiteSecondary,
			colorText = stylesApp.blackSecondary,
			icon = '';
		if (tipo_insumo.selected){
			colorFondo = stylesApp.colorNaranja;
			colorText = stylesApp.whiteSecondary;
		}

		const boton1 = {
			backgroundColor: colorFondo,
			opacity: 1,
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: stylesApp.widthWindow * 0.30,
			width: stylesApp.widthWindow * 0.30,
			borderRightWidth: 0.6,
			borderRightColor: stylesApp.blackDisabled,
			borderLeftWidth: 0.6,
			borderLeftColor: stylesApp.blackDisabled,
		};
		const boton2 = {
			backgroundColor: colorFondo,
			opacity: 1,
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: stylesApp.widthWindow * 0.30,
			width: stylesApp.widthWindow * 0.30,
		};
		switch (tipo_insumo.tipo_insumo_nombre) {
			case 'Análisis laboratorio':
				icon = 'analisis_laboratorio';
				break;
			case 'Aporca':
				icon = 'aporca';
				break;
			case 'Barbecho químico':
				icon = 'barbecho_quimico';
				break;
			case 'Cosecha':
				icon = 'cosecha';
				break;
			case 'Control de enfermedades':
				icon = 'control_enfermedades';
				break;
			case 'Control de malezas':
				icon = 'control_malezas';
				break;
			case 'Control de plagas':
				icon = 'control_plagas';
				break;
			case 'Enmienda':
				icon = 'enmienda';
				break;
			case 'Fertilización':
				icon = 'fertilizacion';
				break;
			case 'Fertilización foliar':
				icon = 'fertilizacion_foliar';
				break;
			case 'Monitoreo raíces (calicatas)':
				icon = 'monitoreo_raices';
				break;
			case 'Plantación huerto':
				icon = 'plantacion_huerto';
				break;
			case 'Poda':
				icon = 'poda';
				break;
			case 'Preparación de suelos':
				icon = 'preparacion_suelos';
				break;
			case 'Riego':
				icon = 'riego';
				break;
			case 'Riego / Purines':
				icon = 'riego_purines';
				break;
			case 'Siembra':
				icon = 'siembra';
				break;
			case 'Tratamiento de semilla':
				icon = 'tratamiento_semilla';
				break;
			default:
				icon = 'preparacion_suelos';
				break;
		}

		return (
			<TouchableHighlight
				onPress={tipo_insumo.tipo_insumo_id < 100000000000 ? this.state.isLoading ? () => {} : () => this.selectNorma(tipo_insumo) : () => {}}
				style={key === 1 ? boton1 : boton2}
				underlayColor={tipo_insumo.tipo_insumo_id ? stylesApp.colorNaranja : stylesApp.whiteSecondary}
				key={tipo_insumo.tipo_insumo_id}
			>
				{
					tipo_insumo.tipo_insumo_id < 100000000000 ?
						<View style={{ flexDirection: 'column', alignItems: 'center' }}>
						{
							this.state.isLoading && this.state.activeN === tipo_insumo.tipo_insumo_id ?
								<Text style={{ textAlign: 'center', }}>
									<Image
										source={stylesApp.loadingGif}
										style={{
											width: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.1 : stylesApp.widthWindow * 0.2,
											height: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.1 : stylesApp.widthWindow * 0.2,
										}}
									/>
								</Text>
							:
								<IconCustom name={icon} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} color={colorText} />
						}
							<Text
								style={{
									fontFamily: stylesApp.fontRegular,
									color: colorText,
									textAlign: 'center',
									fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 15 : 13,
									marginTop: '2%',
									paddingLeft: '2%',
									paddingRight: '2%',
									width: stylesApp.widthWindow * 0.30,
								}}
							>
								{tipo_insumo.tipo_insumo_nombre}
							</Text>
						</View>
					: <View></View>
				}
			</TouchableHighlight>
		);
	}

	render() {
		console.log('Normas');
		const tipo_insumos = _.chunk(_.orderBy(this.state.tipo_insumos, ['tipo_insumo_nombre'], ['asc']), 3);
		const collect = this.props.generar.contrato.collect;
		return (
			<FondoTemplate>
				<ScrollView ref={c => this.scrollview = c}>
					<ContratoDetalle />
					{
						collect && collect.cto_num ? <ContratoCollectDetalle collect={collect} />
						: null
					}
					<Card style={stylesApp.cardInfo}>
						<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
							<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, }}>SELECCIONE UNA NORMA</Text>
						</CardItem>
						<View>
							{
								_.map(tipo_insumos, (tis, key) => {
									if (tis.length === 1) {
										tis = _.concat(tis, [{ tipo_insumo_id: key + 100000000000 }, { tipo_insumo_id: key + 100000000001 }]);
									} else if (tis.length === 2) {
										tis = _.concat(tis, { tipo_insumo_id: key + 100000000002 });
									}
									return (
										<View
											key={key}
											style={key === 0 ? styles.row1 : styles.row2}
										>
										{
											tis.map((ti, key) => {
												return this.renderDetalleNorma(ti, key);
											})
										}
										</View>
									);
								})
							}
						</View>
					</Card>
				</ScrollView>
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

const styles = StyleSheet.create({
	row1: {
		flex: 1,
		flexDirection:'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: stylesApp.cardContentColor,
		borderWidth: 0.6,
		borderColor: stylesApp.blackDisabled,
	},
	row2: {
		flex: 1,
		flexDirection:'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: stylesApp.cardContentColor,
		borderRightWidth: 0.6,
		borderRightColor: stylesApp.blackDisabled,
		borderLeftWidth: 0.6,
		borderLeftColor: stylesApp.blackDisabled,
		borderBottomWidth: 0.6,
		borderBottomColor: stylesApp.blackDisabled,
	}
});

function mapStateToProps(state) {
	return {
		insumos: state.insumos,
		generar: state.generar,
		nav: state.nav
	};
}

const mapDispatchToProps = dispatch => ({
	goGenerar: () => dispatch({ type: 'GENERAR_NAV' }),
	goRecomendar: () => dispatch({ type: 'RECOMENDAR_NAV'}),
	saveNormaGenerar: (contrato, cultivo, insumo) => dispatch({ type: 'SET_NORMA_GENERAR', payload: {contrato, cultivo, insumo } }),
	updateNormaGenerar: (contrato, cultivo, insumo, changeNorma) => dispatch({ type: 'UPDATE_NORMA_GENERAR', payload: {contrato, cultivo, insumo, changeNorma} }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Normas);
