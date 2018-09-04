import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';

import { Keyboard, Platform, ScrollView, View, ListView, Text, Image, } from 'react-native';
import { Card, CardItem, Button, Body, Item, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import stylesApp from '../assets/styles';

import ContratoDetalle from './ContratoDetalle';
import FondoTemplate from './FondoTemplate';

import KeyboardSpacer from './KeyboardSpacer';
import Loading from './Loading';
import PotrerosDetalle from './PotrerosDetalle';
import CultivosModal from './CultivosModal';

class Cultivos extends Component {

	constructor(props) {
		super(props);

		this.generar = this.props.generar;
		this.campos = _.map(this.generar.contrato.campos, c => {
			c.cultivos = _.map(c.cultivos, cu => {
				cu.relacion_id = cu.id;
				return cu;
			});
			return c;
		});
		this.camposNuevos = [];

		this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

		this.state = {
			generar: this.generar,
			changeContrato: this.generar.changeContrato,
			data: this.ds.cloneWithRows(_.map(this.campos, c => {
				c.selected = false;
				return c;
			})),
			todosCampos: false,
			camposNuevos: this.camposNuevos,
			campos: [],
			campo: {},
			showCultivo: false,
			cultivo: {},
			showNewRelacionCultivo: false,
			showNewCultivo: false,
			temporadas: this.props.temporadas,
			filter: '',
			isLoading: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.generar.changeContrato !== this.state.changeContrato) {
			if (nextProps.generar.contrato && nextProps.generar.contrato.id && this.props.generar.contrato && this.props.generar.contrato.id) {
				this.generar = nextProps.generar;
				this.campos = this.generar.contrato.campos;
				this.camposNuevos = [];
				this.setState({
					generar: this.generar,
					changeContrato: this.generar.changeContrato,
					data: this.ds.cloneWithRows(_.map(this.campos, c => {
						c.selected = false;
						return c;
					})),
					todosCampos: false,
					camposNuevos: this.camposNuevos,
					campos: [],
					campo: {},
					showCultivo: false,
					cultivo: {},
					showNewRelacionCultivo: false,
					showNewCultivo: false,
					temporadas: nextProps.temporadas,
					filter: '',
					isLoading: false,
				});
				this.scrollview.scrollTo({ y: 0 });
			}
		} else {
			this.setState(this.state);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.data !== this.state.data || nextState.todosCampos !== this.state.todosCampos || nextState.camposNuevos !== this.state.camposNuevos || nextState.campos !== this.state.campos || nextState.campo !== this.state.campo || nextState.showCultivo !== this.state.showCultivo || nextState.cultivo !== this.state.cultivo || nextState.showNewRelacionCultivo !== this.state.showNewRelacionCultivo || nextState.showNewCultivo !== this.state.showNewCultivo || nextState.temporadas !== this.state.temporadas || nextState.filter !== this.state.filter /*|| nextProps.generar.changeContrato !== this.state.changeContrato*/) {
			return true;
		}
		return false;
	}

	searchPotrero = (info) => {
		const filter = info.toLowerCase();

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? this.campos
      : this.campos.filter(({ nombre }) => (
        0 <= nombre.toLowerCase().indexOf(filter)
      ));

    this.setState({
    	filter: info,
      data: this.ds.cloneWithRows(filtered)
    });
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

	setDataCultivosGenerales = (tipo_cultivo_id) => {
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

	addNewCampo = () => {
		this.setState({
			showNewRelacionCultivo: true
		});
	}

	addNewRelacion = (campo) => {
		if (campo.id) {
			campo.cultivos = [this.state.cultivo];
			campo.selected = true;
			campo.estado = 0;
			this.campos = _.map(this.campos, c => {
				if (c.id === campo.id) {
					c = campo;
				}
				return c;
			});
			this.setState({
				data: this.ds.cloneWithRows(this.campos),
				campos: _.filter(this.campos, { selected: true }),
				campo: {},
				showNewRelacionCultivo: false,
				showNewCultivo: false,
				cultivo: {},
				showNewRelacionCultivo: false,
				showNewCultivo: false,
				temporadas: this.props.temporadas,
				filter: ''
			});
		} else {
			const campo = this.CultivosModal.inputCampo.getState();
			const nuevoCampo = {
				id: null,
				nombre: campo.charAt(0).toUpperCase() + campo.slice(1).toLowerCase(),
				sup_sembrada: 0,
				contrato_id: this.state.generar.contrato.id,
				cultivos: [this.state.cultivo],
				estado: 0,					// es 0 porque es nuevo, (false en bdd)
				selected: true
			};
			this.camposNuevos.push(nuevoCampo);
			this.campos = _.concat(this.campos, nuevoCampo);
			this.setState({
				data: this.ds.cloneWithRows(this.campos),
				campo: {},
				campos: _.filter(this.campos, { selected: true }),
				camposNuevos: this.camposNuevos,
				showNewRelacionCultivo: false,
				showNewCultivo: false,
				cultivo: {},
				showNewRelacionCultivo: false,
				showNewCultivo: false,
				temporadas: this.props.temporadas,
				filter: ''
			});
			if (this.CultivosModal.inputCampo) this.CultivosModal.inputCampo.resetState();
		}

		Keyboard.dismiss();
		if (this.CultivosModal.pickerRubro)
			this.CultivosModal.pickerRubro.setNewState({
				value: ''
			});
		if (this.CultivosModal.pickerCultivoGeneral)
			this.CultivosModal.pickerCultivoGeneral.setNewState({
				value: '',
			});
		if (this.CultivosModal.pickerTemporada)
			this.CultivosModal.pickerTemporada.setNewState({
				value: ''
			});
	}

	pickCampo = (value) => {
		let campos = this.state.campos;
		const data = _.map(this.campos, c => {
			if (c.id === value.id) {
				c.selected = !c.selected;
				if (c.selected) {
					campos.push(c);
				} else {
					const camposNuevo = _.remove(campos, c => {
						return c.id === value.id;
					});
				}
			}
			return c;
		});
		this.setState({
			data: this.ds.cloneWithRows(data),
			campos,
			filter: ''
		});
	}

	editCampo = (campo) => {
		this.setState({
			showNewRelacionCultivo: true,
			campo,
		});
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
			if (this.CultivosModal.pickerCultivoGeneral)
				this.CultivosModal.pickerCultivoGeneral.setNewState({
					value: '',
					data: this.setDataCultivosGenerales(value.id)
				});
			if (this.CultivosModal.pickerTemporada)
				this.CultivosModal.pickerTemporada.setNewState({
					value: ''
				});
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
					tipo_insumo_ids: undefined,
					temporada_id: this.state.cultivo.temporada_id,
					temporada_nombre: this.state.cultivo.temporada_nombre
				},
			});
			//Keyboard.dismiss();
		}
	}

	selectAll = () => {
		this.setState({
			data: this.ds.cloneWithRows(_.map(this.campos, c => {
				c.selected = !this.state.todosCampos;
				return c;
			})),
			campos: _.filter(this.campos, { selected: true }),
			todosCampos: !this.state.todosCampos
		});
	}

	selectCultivo(estado) {
		Keyboard.dismiss();
		this.setState({
			isLoading: true,
		});
		let cultivos = [];
		_.map(estado.campos, c => {
			const culti = c.cultivos[0];
			const cultivo = {
				cultivos_campo_id: culti.relacion_id,
				cultivo_id: culti.cultivo_id,
				cultivo_nombre: culti.cultivo_nombre,
				tipo_insumo_ids: culti.tipo_insumo_ids,
				tipo_cultivo_id: culti.tipo_cultivo_id,
				tipo_cultivo_nombre: culti.tipo_cultivo_nombre,
				temporada_id: culti.temporada_id,
				temporada_nombre: culti.temporada_nombre,
				campo_id: c.id,
				campo_nombre: c.nombre,
				sup_sembrada: c.sup_sembrada
			};
			if (culti.relacion_id > 0 && culti.cultivo_id > 0) {
				cultivo.relacionExiste = true;
				cultivo.relacionNueva = false;
				cultivo.nuevoCultivo = false;
			} else if (culti.relacion_id === null && culti.cultivo_id > 0) {
				cultivo.relacionExiste = false;
				cultivo.relacionNueva = true;
				cultivo.nuevoCultivo = false;
			} else if (culti.relacion_id === null && culti.cultivo_id === null && culti.cultivo_nombre !== '') {
				let tipo_insumos = [];
				_.map(this.props.insumos.tipo_insumos, ti => {
					const tipo_cultivos = ti.tipo_cultivo_ids.split(', ');
					let tins = [];
					_.map(tipo_cultivos, tc => {
						if (parseInt(tc) === parseInt(cultivo.tipo_cultivo_id)) {
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
			cultivos.push(cultivo);
		});

		const propsCultivo = this.props.generar.cultivo;
		//console.log(cultivos, propsCultivo);

		if (!_.isEqual(propsCultivo, cultivos) && propsCultivo.length > 0 && cultivos.length > 0) {
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
						this.props.updateCultivoGenerar(this.props.generar.contrato, cultivos, !this.props.generar.changeCultivo);
						this.Loading.hideLoading();
						this.setState({
							isLoading: false,
						});
						this.props.goNormas();
					}
				}
			], false);
		} else if (_.isEqual(propsCultivo, cultivos)) {
			this.setState({
				isLoading: false,
			});
			this.props.goNormas();
		} else {
			this.props.saveCultivoGenerar(this.props.generar.contrato, cultivos);
			this.setState({
				isLoading: false,
			});
			this.props.goNormas();
		}
	}

	renderDetalle(campo) {
		return <PotrerosDetalle
			campo={campo}
			pickCampo={this.pickCampo}
			editCampo={this.editCampo}
		/>;
	}

	render() {
		console.log('Cultivos');
		const contrato = this.state.generar.contrato,
					campos = this.state.campos,
					cultivo = this.state.cultivo;
		let icon = {
		    	icon: 'check-box-outline-blank',
		    	color: stylesApp.blackSecondary,
		    };
		if (this.state.todosCampos) {
			icon = {
	    	icon: 'check-box',
	    	color: stylesApp.colorNaranja
	    };
		}
		let aux = true;
		_.map(campos, c => {
			if (c.cultivos.length === 0) {
				aux = false;
			}
		});
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
							<Text style={stylesApp.cardTitleSectionText}>POTREROS</Text>
						</CardItem>
						<CardItem style={stylesApp.cardSubTitleSection}>
							<Text style={stylesApp.cardSubTitleSectionText}>NUEVO:</Text>
						</CardItem>
						<CardItem style={{ paddingBottom: 10, ...stylesApp.cardContent }}>
							<Text style={{ fontFamily: stylesApp.fontSemiBold, marginLeft: 10, textAlign: 'center', color: stylesApp.blackSecondary }}>Agregar nuevo potrero  </Text>
							<MaterialIcons
  							name='add-circle'
								onPress={this.addNewCampo}
  							color={stylesApp.blackSecondary}
  							size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
  						/>
						</CardItem>
					</Card>
					<Card style={{ ...stylesApp.cardContainer, marginTop: 15, marginBottom: 15 }}>
						<CardItem style={stylesApp.cardSubTitleSection}>
							<Text style={stylesApp.cardSubTitleSectionText}>SELECCIONAR:</Text>
						</CardItem>
						<CardItem style={stylesApp.cardContent}>
							<MaterialIcons onPress={this.selectAll} name={icon.icon} color={icon.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
							<Text style={{ fontFamily: stylesApp.fontSemiBold, marginLeft: 10, textAlign: 'center', color: stylesApp.blackSecondary }}>Seleccionar todos los potreros</Text>
						</CardItem>
						<CardItem style={stylesApp.cardContent}>
							<Body>
								<Item>
									<Input
										name="buscar"
										placeholder='Buscar'
										placeholderTextColor={stylesApp.blackSecondary}
										style={{ color: stylesApp.blackSecondary,
										fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
										fontFamily: stylesApp.fontRegular }}
										onChangeText={this.searchPotrero}
										value={this.state.filter}
										onSubmitEditing={Keyboard.dismiss}
									/>
									<MaterialIcons name='search' color={stylesApp.colorNaranja} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} />
								</Item>
							</Body>
						</CardItem>
					</Card>
					<View>
						<ListView
							dataSource={this.state.data}
							renderRow={this.renderDetalle.bind(this)}
							enableEmptySections={true}
						/>
					</View>
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
						{campos.length > 0 && aux &&
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
				<CultivosModal
					ref={c => this.CultivosModal = c}
					visible={this.state.showNewRelacionCultivo}
					closeModal={() => {
						this.setState({
							campo: {},
							cultivo: {},
							showNewRelacionCultivo: false,
							showNewCultivo: false,
						});
						if (this.CultivosModal.inputCampo) this.CultivosModal.inputCampo.resetState();
						if (this.CultivosModal.pickerRubro) {
							this.CultivosModal.pickerRubro.setNewState({
								value: ''
							});
						}
						if (this.CultivosModal.pickerCultivoGeneral) {
							this.CultivosModal.pickerCultivoGeneral.setNewState({
								value: ''
							});
						}
						if (this.CultivosModal.pickerTemporada) {
							this.CultivosModal.pickerTemporada.setNewState({
								value: ''
							});
						}
						Keyboard.dismiss();
					}}
					addNewRelacion={this.addNewRelacion}
					campo={this.state.campo}
					cultivo={cultivo}
					pickRubro={this.pickRubro}
					setDataCultivosGenerales={this.setDataCultivosGenerales}
					pickCultivoGeneral={this.pickCultivoGeneral}
					showNewCultivo={this.state.showNewCultivo}
					newCultivo={this.newCultivo}
					temporadas={this.state.temporadas}
					pickTemporada={this.pickTemporada}
				/>
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
