import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';

import { Keyboard, Platform, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Button, } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import stylesApp from '../assets/styles';

import ContratoDetalle from './ContratoDetalle';
import FondoTemplate from './FondoTemplate';

import KeyboardSpacer from './KeyboardSpacer';
import Loading from './Loading';
import CustomPicker from './CustomPicker';
import FilterPicker from './FilterPicker';
import CustomTextField from './CustomTextField';

class Cultivos extends Component {

	constructor(props) {
		super(props);

		this.generar = this.props.generar;
		this.camposNuevos = [];

		this.state = {
			generar: this.generar,
			changeContrato: this.generar.changeContrato,
			camposNuevos: this.camposNuevos,
			campo: {},
			campos: [],
			showPickerCampo: false,


			showCultivo: false,
			cultivo: {},
			showNewRelacionCultivo: false,
			showNewCultivo: false,
			temporadas: this.props.temporadas,
			isLoading: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.generar.changeContrato !== this.state.changeContrato) {
			if (nextProps.generar.contrato && nextProps.generar.contrato.id && this.props.generar.contrato && this.props.generar.contrato.id) {
				this.generar = nextProps.generar;
				this.camposNuevos = [];
				this.setState({
					generar: this.generar,
					changeContrato: this.generar.changeContrato,
					camposNuevos: this.camposNuevos,
					campo: {},
					campos: [],
					showCultivo: false,
					cultivo: {},
					showNewRelacionCultivo: false,
					showNewCultivo: false,
					temporadas: this.props.temporadas,
					isLoading: false,
				});
				this.scrollview.scrollTo({ y: 0 });
			}
		} else {
			this.setState(this.state);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.camposNuevos !== this.state.camposNuevos || nextState.campo !== this.state.campo || nextState.campos !== this.state.campos || nextState.showPickerCampo !== this.state.showPickerCampo || nextState.showCultivo !== this.state.showCultivo || nextState.cultivo !== this.state.cultivo || nextState.showNewRelacionCultivo !== this.state.showNewRelacionCultivo || nextState.showNewCultivo !== this.state.showNewCultivo || nextState.temporadas !== this.state.temporadas /*|| nextProps.generar.changeContrato !== this.state.changeContrato*/) {
			return true;
		}
		return false;
	}

	setDataCultivos(cultivos) {
		return _.map(cultivos, c => {
			return {
				nombre: c.cultivo_nombre + ' - ' + c.temporada_nombre,
				id: c.cultivo_id,
				cultivo_id: c.cultivo_id,
				cultivo_nombre: c.cultivo_nombre,
				tipo_cultivo_id: c.tipo_cultivo_id,
				tipo_cultivo_nombre: c.tipo_cultivo_nombre,
				tipo_insumo_ids: c.tipo_insumo_ids,
				relacion_id: c.id,
				temporada_id: c.temporada_id,
				temporada_nombre: c.temporada_nombre
			}
		});
	}

	setDataCultivosGenerales(tipo_cultivo_id) {
		return _.map(_.filter(this.props.cultivos, { tipo_cultivo_id: tipo_cultivo_id }), c => {
			return {
				nombre: c.cultivo_nombre,
				id: c.cultivo_id,
				cultivo_id: c.cultivo_id,
				cultivo_nombre: c.cultivo_nombre,
				tipo_cultivo_id: c.tipo_cultivo_id,
				tipo_cultivo_nombre: c.tipo_cultivo_nombre,
				tipo_insumo_ids: c.tipo_insumo_ids,
			};
		});
	}

	addNewCampo = (v) => {
		if (v) {
			const nuevoCampo = {
				contrato_id: this.state.generar.contrato.id,
				cultivos: [],
				estado: 0,					// es 0 porque es nuevo
				id: null,
				nombre: v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
				sup_sembrada: 0
			};
			this.camposNuevos.push(nuevoCampo);
			const dataCampos = _.concat(this.pickerCampo.state.data, nuevoCampo);
			this.setState({
				camposNuevos: this.camposNuevos,
				//campo: {},
				//showCultivo: false,
				//cultivo: {},
				//showNewRelacionCultivo: false
			});
			this.pickerCampo.setState({
				data: dataCampos,
				//value: '',
			});
			this.inputCampo.resetState();
			Keyboard.dismiss();
		}
	}

	pickCampo = (value) => {
		if (value !== '') {
			const existe = _.find(this.state.campos, { id: value.id });
			const campos = this.state.campos;
			if (existe) {
				const camposExistente = _.remove(campos, c => { return c.id === value.id; });
			}
			this.setState({
				//campo: value,
				campos: existe ? campos : _.concat(campos, value),
				showPickerCampo: true,
				showCultivo: true,
				cultivo: {},
				showNewRelacionCultivo: !(value.cultivos.length > 0)
			});
			if (this.pickerCultivo) {
				this.pickerCultivo.setNewState({
					value: '',
					data: this.setDataCultivos(value.cultivos)
				});
			}
		}
	}

	pickCultivo = (value) => {
		//console.log(value);
		if (value !== '') {
			if (value === 'otro') {
				this.setState({
					cultivo: {},
					showNewRelacionCultivo: true,
					showNewCultivo: false
				});
			} else {
				this.setState({
					cultivo: value,
					showNewRelacionCultivo: false,
					showNewCultivo: false
				});
			}
		}
	}

	pickRubro = (value) => {
		if (value !== '') {
			this.setState({
				cultivo: {
					relacion_id: null,
					tipo_cultivo_id: value.id,
					tipo_cultivo_nombre: value.nombre
				},
				temporadas: value.id === 1 || value.id === 2 ? _.filter(this.props.temporadas, { formato: 2 }) : _.filter(this.props.temporadas, { formato: 1 }),
				showNewCultivo: false,
			});
			if (this.pickerCultivoGeneral) {
				this.pickerCultivoGeneral.setNewState({
					value: '',
					data: this.setDataCultivosGenerales(value.id)
				});
			}
			if (this.pickerTemporada) {
				this.pickerTemporada.setNewState({
					value: ''
				});
			}
		}
	}

	pickCultivoGeneral = (value) => {
		if (value !== '') {
			if (value === 'otro') {
				this.setState({
					cultivo: {
						relacion_id: null,
						tipo_cultivo_id: this.state.cultivo.tipo_cultivo_id,
						tipo_cultivo_nombre: this.state.cultivo.tipo_cultivo_nombre,
						temporada_id: this.state.cultivo.temporada_id,
						temporada_nombre: this.state.cultivo.temporada_nombre
					},
					showNewCultivo: true,
				});
			} else {
				//console.log(value);
				this.setState({
					cultivo: {
						relacion_id: null,
						tipo_cultivo_id: this.state.cultivo.tipo_cultivo_id,
						tipo_cultivo_nombre: this.state.cultivo.tipo_cultivo_nombre,
						cultivo_id: value.cultivo_id,
						cultivo_nombre: value.cultivo_nombre,
						tipo_insumo_ids: value.tipo_insumo_ids,
						temporada_id: this.state.cultivo.temporada_id,
						temporada_nombre: this.state.cultivo.temporada_nombre
					},
					showNewCultivo: false,
				});
			}
		}
	}

	pickTemporada = (value) => {
		if (value !== '') {
			this.setState({
				cultivo: {
					relacion_id: null,
					tipo_cultivo_id: this.state.cultivo.tipo_cultivo_id,
					tipo_cultivo_nombre: this.state.cultivo.tipo_cultivo_nombre,
					cultivo_id: this.state.cultivo.cultivo_id,
					cultivo_nombre: this.state.cultivo.cultivo_nombre,
					tipo_insumo_ids: this.state.cultivo.tipo_insumo_ids,
					temporada_id: value.id,
					temporada_nombre: value.nombre
				},
			});
		}
	}

	newCultivo = (v) => {
		//console.log(v);
		if (v) {
			this.setState({
				cultivo: {
					relacion_id: null,
					tipo_cultivo_id: this.state.cultivo.tipo_cultivo_id,
					tipo_cultivo_nombre: this.state.cultivo.tipo_cultivo_nombre,
					cultivo_id: null,
					cultivo_nombre: v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
					tipo_insumo_ids: undefined
				},
			});
			//Keyboard.dismiss();
		}
	}

	selectCultivo(estado) {
		Keyboard.dismiss();
		this.setState({
			isLoading: true,
		});
		const cultivo = {
			cultivos_campo_id: estado.cultivo.relacion_id,
			cultivo_id: estado.cultivo.cultivo_id,
			cultivo_nombre: estado.cultivo.cultivo_nombre,
			tipo_insumo_ids: estado.cultivo.tipo_insumo_ids,
			tipo_cultivo_id: estado.cultivo.tipo_cultivo_id,
			tipo_cultivo_nombre: estado.cultivo.tipo_cultivo_nombre,
			temporada_id: estado.cultivo.temporada_id,
			temporada_nombre: estado.cultivo.temporada_nombre,
			campo_id: estado.campo.id,
			campo_nombre: estado.campo.nombre,
			sup_sembrada: estado.campo.sup_sembrada
		};
		if (estado.cultivo.relacion_id > 0 && estado.cultivo.cultivo_id > 0) {
			cultivo.relacionExiste = true;
			cultivo.relacionNueva = false;
			cultivo.nuevoCultivo = false;
		} else if (estado.cultivo.relacion_id === null && estado.cultivo.cultivo_id > 0) {
			cultivo.relacionExiste = false;
			cultivo.relacionNueva = true;
			cultivo.nuevoCultivo = false;
		} else if (estado.cultivo.relacion_id === null && estado.cultivo.cultivo_id === null && estado.cultivo.cultivo_nombre !== '') {
			let tipo_insumos = [];
			_.map(this.props.insumos.tipo_insumos, ti => {
				const tipo_cultivos = ti.tipo_cultivo_ids.split(', ');
				let tins = [];
				_.map(tipo_cultivos, tc => {
					if (tc === estado.cultivo.tipo_cultivo_id) {
						tins.push(ti.id);
					}
				});
				if (tins.length > 0) tipo_insumos.push(tins.join(', '));
			});
			cultivo.tipo_insumo_ids = tipo_insumos.join(', ');
			cultivo.relacionExiste = false;
			cultivo.relacionNueva = false;
			cultivo.nuevoCultivo = true;
		}

		const propsCultivo = this.props.generar.cultivo;

		if (propsCultivo && ((propsCultivo.cultivo_id && propsCultivo.cultivo_nombre !== '') || (propsCultivo.cultivo_id === null && propsCultivo.cultivo_nombre !== '')) && (propsCultivo.cultivo_id !== cultivo.cultivo_id || propsCultivo.campo_id !== cultivo.campo_id || propsCultivo.cultivo_nombre !== cultivo.cultivo_nombre || propsCultivo.tipo_cultivo_id !== cultivo.tipo_cultivo_id || propsCultivo.temporada_id !== cultivo.temporada_id)) {
			this.Loading.showLoading(true, 'Alerta', 'Cambiar alguna opción eliminará la información actual. ¿Desea continuar?', [
				{ text: 'Cancelar',
					onPress: () => {
						this.setState({
							isLoading: false,
						});
						this.Loading.hideLoading();
					}
				},
				{ text: 'Si',
					onPress: () => {
						this.props.updateCultivoGenerar(this.props.generar.contrato, cultivo, !this.props.generar.changeCultivo);
						this.Loading.hideLoading();
						this.setState({
							isLoading: false,
						});
						this.props.goNormas();
					}
				}
			], false);
		} else if(propsCultivo && ((propsCultivo.cultivo_id && propsCultivo.cultivo_nombre !== '') || (propsCultivo.cultivo_id === null && propsCultivo.cultivo_nombre !== '')) && propsCultivo.cultivo_id === cultivo.cultivo_id && propsCultivo.campo_id === cultivo.campo_id && propsCultivo.cultivo_nombre === cultivo.cultivo_nombre && propsCultivo.tipo_cultivo_id === cultivo.tipo_cultivo_id && propsCultivo.temporada_id === cultivo.temporada_id) {
			this.setState({
				isLoading: false,
			});
			this.props.goNormas();
		} else {
			this.props.saveCultivoGenerar(this.props.generar.contrato, cultivo);
			this.setState({
				isLoading: false,
			});
			this.props.goNormas();
		}
	}

	render() {
		console.log('Cultivos');
		const contrato = this.state.generar.contrato,
					campo = this.state.campo,
					campos = this.state.campos,
					cultivo = this.state.cultivo;
					console.log(campos);
		return (
			<FondoTemplate>
				<ScrollView
					ref={c => this.scrollview = c}
					keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
					keyboardShouldPersistTaps='always'
				>
					<ContratoDetalle contrato={contrato} />
					<Card style={stylesApp.cardContainer}>
						<CardItem header style={stylesApp.cardTitleSection}>
							<Text style={stylesApp.cardTitleSectionText}>POTRERO</Text>
						</CardItem>
						<CardItem style={stylesApp.cardSubTitleSection}>
							<Text style={stylesApp.cardSubTitleSectionText}>SELECCIONAR:</Text>
						</CardItem>
						<CardItem style={{ paddingBottom: 0, ...stylesApp.cardContent }}>
							<CustomTextField
								ref={c => this.inputCampo = c}
								name='inputCampo'
								placeholder='NUEVO POTRERO'
								onchange={null}
								addNew={this.addNewCampo}
								width='100%'
							/>
						</CardItem>
						<CardItem style={{ paddingBottom: '8%', ...stylesApp.cardContent }}>
							{/*<CustomPicker
 								ref={c => this.pickerCampo = c}
 								name='pickerCampo'
 								data={contrato.campos}
 								placeholder='POTREROS'
 								onchange={this.pickCampo}
 								otro={false}
 								todos={true}
 							/>*/}
							<TouchableOpacity
								onPress={() => { this.setState({ showPickerCampo: true }); }}
								style={{
									width: campos.length > 0 ? '80%' : '90%',
									flexDirection: 'row'
								}}>
								<View style={{ width: '93%' }}>
									<Text
										style={{
											color: stylesApp.blackSecondary,
											fontFamily: stylesApp.fontRegular,
											fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16
										}}
									>
										{campos.length > 0 ? _.map(campos, c => { return c.nombre; }).join(', ') : 'POTREROS'}
									</Text>
								</View>
								<View>
									<MaterialIcons name='arrow-drop-down' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 22 : 20} />
								</View>
							</TouchableOpacity>
							<FilterPicker
								visible={this.state.showPickerCampo}
								onSelect={this.pickCampo}
								onCancel={() => { this.setState({ showPickerCampo: false }); }}
								options={contrato.campos}
								selectedOption={campos}
								placeholderText='POTREROS'
								placeholderTextColor={stylesApp.blackSecondary}
								cancelButtonText='CANCELAR'
							/>
							{
								campos.length > 0 &&
								<MaterialCommunityIcons
									name='checkbox-marked-circle-outline'
									color={stylesApp.colorNaranja}
									size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
								/>
							}
						</CardItem>
					</Card>
					{
						this.state.showCultivo &&
						<Card style={stylesApp.cardContainer}>
							<CardItem header style={stylesApp.cardTitleSection}>
								<Text style={stylesApp.cardTitleSectionText}>CULTIVO</Text>
							</CardItem>
							<CardItem style={stylesApp.cardSubTitleSection}>
								<Text style={stylesApp.cardSubTitleSectionText}>SELECCIONAR:</Text>
							</CardItem>
							{
								campo.cultivos && campo.cultivos.length > 0 ?
									<CardItem style={stylesApp.cardContent}>
										<CustomPicker
											ref={c => this.pickerCultivo = c}
											name='pickerCultivo'
											placeholder='CULTIVOS'
											data={this.setDataCultivos(campo.cultivos)}
											onchange={this.pickCultivo}
											otro={true}
											todos={false}
										/>
										{
											cultivo.relacion_id && cultivo.relacion_id > 0 &&
											<MaterialCommunityIcons
												name='checkbox-marked-circle-outline'
												color={stylesApp.colorNaranja}
												size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
											/>
										}
									</CardItem>
								:
									<CardItem style={stylesApp.cardContent}>
										<Text style={{ marginTop: 5, marginBottom: 5, ...stylesApp.cardTextRegular }}>No hay cultivos para seleccionar</Text>
									</CardItem>
							}
						</Card>
					}
					{((this.state.showCultivo && this.state.showNewRelacionCultivo) || (campo.cultivos && campo.cultivos.length === 0)) &&
						<Card style={stylesApp.cardContainer}>
							<CardItem style={stylesApp.cardSubTitleSection}>
								<Text style={stylesApp.cardSubTitleSectionText}>DEFINA:</Text>
							</CardItem>
							<CardItem style={stylesApp.cardContent}>
								<CustomPicker
									ref={c => this.pickerRubro = c}
									name='pickerRubro'
									placeholder='RUBROS'
									data={[{
										id: 1,
										nombre: 'Pradera y Forrajera'
									}, {
										id: 2,
										nombre: 'Cultivo'
									}, {
										id: 3,
										nombre: 'Frutal'
									}]}
									onchange={this.pickRubro}
									otro={false}
									todos={false}
								/>
								{
									cultivo.tipo_cultivo_id && cultivo.tipo_cultivo_id > 0 &&
									<MaterialCommunityIcons
										name='checkbox-marked-circle-outline'
										color={stylesApp.colorNaranja}
										size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
									/>
								}
							</CardItem>
							{
								cultivo.tipo_cultivo_id && cultivo.tipo_cultivo_id > 0 &&
								<CardItem style={{ paddingBottom: 0, paddingTop: 0, ...stylesApp.cardContent }}>
									<CustomPicker
										ref={c => this.pickerCultivoGeneral = c}
										name='pickerCultivoGeneral'
										placeholder='CULTIVOS'
										data={this.setDataCultivosGenerales(cultivo.tipo_cultivo_id)}
										onchange={this.pickCultivoGeneral}
										otro={true}
										todos={false}
									/>
									{
										cultivo.cultivo_id && cultivo.cultivo_id > 0 &&
										<MaterialCommunityIcons
											name='checkbox-marked-circle-outline'
											color={stylesApp.colorNaranja}
											size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
										/>
									}
								</CardItem>
							}
							{
								this.state.showNewCultivo &&
								<CardItem style={{ paddingBottom: 0, paddingTop: 0, ...stylesApp.cardContent }}>
									<CustomTextField
										ref={c => this.inputCultivo = c}
										name='inputCultivo'
										placeholder='NUEVO CULTIVO'
										onchange={this.newCultivo}
										addNew={null}
									/>
								</CardItem>
							}
							{
								(cultivo.cultivo_id > 0 || (cultivo.cultivo_id === null && cultivo.cultivo_nombre !== '')) &&
								<CardItem style={stylesApp.cardContent}>
									<CustomPicker
										ref={c => this.pickerTemporada = c}
										name='pickerTemporada'
										placeholder='TEMPORADAS'
										data={this.state.temporadas}
										onchange={this.pickTemporada}
										otro={false}
										todos={false}
									/>
									{
										cultivo.temporada_id && cultivo.temporada_id > 0 &&
										<MaterialCommunityIcons
											name='checkbox-marked-circle-outline'
											color={stylesApp.colorNaranja}
											size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
										/>
									}
								</CardItem>
							}
						</Card>
					}
					<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', marginTop: '5%', marginRight: '5%', marginLeft: '5%' }}>
						<Button
							full
							onPress={this.state.isLoading ? () => {} : () => {
								Keyboard.dismiss();
								this.props.backContratos();
							}}
							style={{
								elevation: 0,
								width: '45%',
								borderRadius: 5,
								backgroundColor: stylesApp.colorNaranja,
							}}
						>
							<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>VOLVER</Text>
						</Button>
						{((campo.id > 0 && campo.estado === 1) || (campo.id === null && campo.nombre !== '' && campo.estado === 0)) && ((cultivo.cultivo_id > 0 && cultivo.relacion_id > 0) || (((cultivo.relacion_id === null && cultivo.cultivo_id > 0) || (cultivo.relacion_id === null && cultivo.cultivo_id === null && cultivo.cultivo_nombre !== '')) && cultivo.tipo_cultivo_id > 0 && cultivo.temporada_id > 0)) &&
								<Button
									full
									onPress={this.state.isLoading ? () => {} : () => this.selectCultivo(this.state)}
									style={{
										elevation: 0,
										marginLeft: '2%',
										width: '45%',
										borderRadius: 5,
										backgroundColor: stylesApp.colorNaranja,
									}}
								>
									{
										this.state.isLoading ?
											<Image
												source={stylesApp.loadingGif}
												style={{
													width: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.05 : stylesApp.widthWindow * 0.08,
													height: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.05 : stylesApp.widthWindow * 0.08,
												}}
											/>
										:
										<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>{this.state.cultivo_id > 0 ? 'SELECCIONAR' : 'AGREGAR'}</Text>
									}
								</Button>
						}
					</View>
				</ScrollView>
				<KeyboardSpacer topSpacing={Platform.OS === 'ios' ? -100 : -30} />
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

function mapStateToProps(state) {
	return {
		insumos: state.insumos,
		generar: state.generar,
		temporadas: state.temporadas,
		cultivos: state.cultivos,
		nav: state.nav
	};
}

const mapDispatchToProps = dispatch => ({
	goGenerar: () => dispatch({ type: 'GENERAR_NAV' }),
	backContratos: () => dispatch(NavigationActions.back({ routeName: 'Cons' })),
	goNormas: () => dispatch({ type: 'NORMAS_NAV' }),
	saveCultivoGenerar: (contrato, cultivo) => dispatch({ type: 'SET_CULTIVO_GENERAR', payload: { contrato, cultivo } }),
	updateCultivoGenerar: (contrato, cultivo, changeCultivo) => dispatch({ type: 'UPDATE_CULTIVO_GENERAR', payload: { contrato, cultivo, changeCultivo } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cultivos);
