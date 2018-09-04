import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';

import { Platform, Text, Alert, ScrollView, View, Image } from 'react-native';
import { Card, CardItem, Button, } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import ContratoDetalle from './ContratoDetalle';
import RecomendarCheckboxs from './RecomendarCheckboxs';
import RecomendarPickers from './RecomendarPickers';
import NotasFotos from './NotasFotos';
import RecSupUbicacion from './RecSupUbicacion';
import ZoomImage from './ZoomImage';
import ContratoCollectDetalle from './ContratoCollectDetalle';
import SelectEmails from './SelectEmails';
import Loading from './Loading';

import KeyboardSpacer from './KeyboardSpacer';

import { save_recomendacion, get_contratos, edit_recomendacion, data_Sync } from './Utils';

class Recomendar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			normaID: this.props.generar.norma.tipo_insumo_id,
			generar: this.props.generar,
			changeContrato: this.props.generar.changeContrato,
			changeNorma: this.props.generar.changeNorma,
			changeCultivo: this.props.generar.changeCultivo,
			photoZoom: false,
			imageZoom: '',
			isLoading: false,
			rec: this.props.generar.rec !== undefined ? this.props.generar.rec : []
		};
		this.insumosAgregados = [];
	}

	/*componentDidMount() {
		this.setState({isLoading: false});
	}*/

	componentWillReceiveProps(nextProps) {
		if (this.state.changeContrato !== nextProps.generar.changeContrato || this.state.changeCultivo !== nextProps.generar.changeCultivo || this.state.changeNorma !== nextProps.generar.changeNorma || this.state.normaID === undefined){
			if(nextProps.generar.contrato && nextProps.generar.contrato.id && this.props.generar.contrato && this.props.generar.contrato.id && nextProps.generar.cultivo.length > 0 && this.props.generar.cultivo.length > 0 && this.props.generar.norma && this.props.generar.norma.tipo_insumo_id && nextProps.generar.norma && nextProps.generar.norma.tipo_insumo_id) {
				this.setState({
					normaID: nextProps.generar.norma.tipo_insumo_id,
					generar: nextProps.generar,
					changeContrato: nextProps.generar.changeContrato,
					changeNorma: nextProps.generar.changeNorma,
					changeCultivo: nextProps.generar.changeCultivo,
					photoZoom: false,
					imageZoom: '',
					rec: nextProps.generar.rec !== undefined ? nextProps.generar.rec : []
				});
				this.prioridadesComp.resetPrioridades();
				this.notasFotosComp.resetNotasFotos();
				this.ubicacionComp.resetUbicacion();
				this.selectEmailsComp.resetSelectEmails();

				this.scrollview.scrollTo({ y: 0 });
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.photoZoom !== this.state.photoZoom || nextState.imageZoom !== this.state.imageZoom || nextState.isLoading !== this.state.isLoading || nextState.normaID !== this.state.normaID || nextState.generar !== this.state.generar /*|| nextState.generar.changeContrato !== this.state.changeContrato */|| nextState.generar.changeNorma !== this.state.changeNorma || this.state.rec !== nextState.rec) {
		//if(nextState !== this.state) {
			return true;
		}
		return false;
	}

	getImages() {
		const { show, images } = this.camaraComp.getState();
		this.setState({
			addPhoto: show,
			images
		});
	}

	getState() {
		return {
			contrato_id: this.props.generar.contrato.id,
			tecnico_id: this.props.user.id,
			tecnico_nombre: this.props.user.nombre,
			tipo_insumo_id: this.props.generar.norma.tipo_insumo_id,
			tipo_insumo_nombre: this.props.generar.norma.tipo_insumo_nombre,
			cto_num: this.props.generar.contrato.cto_num,
			agricultor_nombre: this.props.generar.contrato.agricultor_nombre,
			agricultor_rut: this.props.generar.contrato.agricultor_rut,
			agricultor_email: this.props.generar.contrato.agricultor_email,
			cultivo: this.props.generar.cultivo
		};
	}

	guardarRecomendacion(cond) {
		let recomendar = {
			...this.getState(),
			...this.prioridadesComp.getState(),
			...this.ubicacionComp.getState(),
			insumos: this.insumosComp.getState(),
			...this.notasFotosComp.getState(),
			...this.selectEmailsComp.getState(),
			isCollect: this.props.generar.isCollect
		};
		//console.log(recomendar);
		if (recomendar.insumos.length === 0 && recomendar.tipo_insumo_nombre !== 'Análisis laboratorio') {
			this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar insumos para la recomendación', [{ text: 'OK', onPress: null }], false);
		} else if (recomendar.agricultor_emails_selected === '') {
			this.Loading.showLoading(true, 'Alerta', 'Seleccione algún correo electrónico para el envío de la notificación',
					[{ text: 'OK', onPress: null }], false);
		} else {
			if (!cond) {
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar la recomendación y volver al Menú Principal?',
				[
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si',
						onPress: async () => {
							this.setState({ isLoading: true });
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);
							let next = (resp) => {
								let nextt = async () => {
									this.setState({ isLoading: false });
									await this.props.removeGenerar();
									this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
									this.props.goHome();
								};
								if (resp) get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
								else this.setState({ isLoading: false });
							};
							//guardar en la base de datos
							save_recomendacion(this.props.user, recomendar, next, this.Loading.showLoading);
						}
					}
				], false);
			} else {
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar la recomendación y seguir recomendando para este Destinatario?',
				[
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si',
						onPress: async () => {
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);
							let next = (resp) => {
								let nextt = async () => {
									this.setState({ isLoading: false });
									const contratoSelected = _.find(this.props.data, { id: this.props.generar.contrato.id });
									const new_contrato = {
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
									};
									await this.props.updateContratoGenerar(new_contrato, !this.props.generar.changeContrato);
									this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
									this.props.goCultivos();
								};

								if (resp) get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
								else this.setState({ isLoading: false });
							};
							//guardar en la base de datos
							save_recomendacion(this.props.user, recomendar, next, this.Loading.showLoading);
						}
					}
				], false);
			}
		}
	}

	volver() {
		this.props.removeGenerar();
		const preLastRoute = this.props.nav.routes[this.props.nav.routes.length - 2];
		const params = {recs: preLastRoute.params.recs, sups: preLastRoute.params.sups};
		if(preLastRoute.index === 0) this.props.goSincronizar(params);
		else if(preLastRoute.index === 1) this.props.goSupsSincronizar(params);
	}

	modificarRecomendacion(cond) {
		let recomendar = {
			rec_id: this.props.generar.rec.rec_id,
			email_id: this.props.generar.rec.email_id,
			...this.getState(),
			...this.prioridadesComp.getState(),
			...this.ubicacionComp.getState(),
			insumos: this.insumosComp.getState(),
			...this.notasFotosComp.getState(),
			...this.selectEmailsComp.getState()
		};
		//console.log(recomendar);
		const recomOld = this.props.generar.rec;
		//console.log(this.selectEmailsComp.getState().agricultor_emails, recomOld.agricultor_emails);
		//console.log(recomOld);
		const insumosOld = _.map(recomOld.insumos, i => {
			return {
				insumo_id: i.insumo_id,
				insumo_nombre: i.insumo_nombre,
				superficie: i.superficie,
				dosis: i.dosis,
				unidad_id: i.unidad_id,
				unidad_nombre: i.unidad_nombre
			};
		});
		//cambie recomOld.insumos2 por insumosOld
		//console.log(insumosOld, recomendar.insumos, insumosOld !== recomendar.insumos);
		//console.log(recomOld.prioridad_id !== recomendar.prioridad_id || !_.isEqual(insumosOld, recomendar.insumos) || !_.isEqual(recomOld.images, recomendar.images) || recomOld.notas !== recomendar.notas || recomOld.en_oficina !== recomendar.en_oficina || recomOld.lat != recomendar.lat || recomOld.lon != recomendar.lon || recomOld.alt != recomendar.alt || recomOld.agricultor_emails_selected !== recomendar.agricultor_emails_selected);
		if (cond) {
			if (recomendar.insumos.length === 0 && recomendar.tipo_insumo_nombre !== 'Análisis laboratorio') {
				this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar insumos para la recomendación', [{ text: 'OK', onPress: null}], false);
			} else if (recomendar.agricultor_emails_selected === '') {
				this.Loading.showLoading(true, 'Alerta', 'Seleccione algún correo electrónico para el envío de la notificación',
						[{ text: 'OK', onPress: null }], false);
			} else {
				this.setState({ isLoading: true });
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar los cambios y volver al Módulo de Sincronización?',
				[
					{ text: 'Cancelar',
						onPress: () => {
							this.setState({ isLoading: false });
							this.Loading.hideLoading();
						}
					},
					{ text: 'Si',
						onPress: async () => {
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);
							if (recomOld.prioridad_id !== recomendar.prioridad_id || !_.isEqual(insumosOld, recomendar.insumos) || !_.isEqual(recomOld.images, recomendar.images) || recomOld.notas !== recomendar.notas || recomOld.en_oficina !== recomendar.en_oficina || recomOld.lat != recomendar.lat || recomOld.lon != recomendar.lon || recomOld.alt != recomendar.alt || recomOld.agricultor_emails_selected !== recomendar.agricultor_emails_selected) {
								let next = async (resp) => {
									let nextt = async () => {
										let nexttt = async (data) => {
											if (data.recomendacionesSync.length > 0 || data.supervisionesSync.length > 0) {
												this.setState({ isLoading: false });
												this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
												if(data.recomendacionesSync.length === 0) await this.props.goSupsSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
												else await this.props.goSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
											} else {
												this.setState({ isLoading: false });
												this.Loading.showLoading(true, 'Notificación', 'No hay datos para sincronizar', [{ text: 'OK', onPress: null }], false);
												this.props.goHome();
											}
										};

										data_Sync(true, nexttt, this.Loading.showLoading);
									};

									if (resp) {
										await this.props.removeGenerar();
										get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
									} else this.setState({ isLoading: false });
								};
								edit_recomendacion(this.props.user, recomendar, next, this.Loading.showLoading);
							} else {
								this.setState({ isLoading: false });
								console.log('No cambio nada Recom');
								this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
								this.volver();
							}
						}
					}
				], false);
			}
		} else {
			this.setState({ isLoading: true });
			if(recomOld.prioridad_id !== recomendar.prioridad_id || !_.isEqual(insumosOld, recomendar.insumos) || !_.isEqual(recomOld.images, recomendar.images) || recomOld.notas !== recomendar.notas || recomOld.en_oficina !== recomendar.en_oficina || recomOld.lat != recomendar.lat || recomOld.lon != recomendar.lon || recomOld.alt != recomendar.alt || recomOld.agricultor_emails_selected !== recomendar.agricultor_emails_selected) {
				this.Loading.showLoading(true, 'Alerta',
					'Al volver perderá las modificaciones. ¿Desea continuar?',
					[{ text: 'No',
						onPress: () => {
							this.setState({ isLoading: false });
							this.Loading.hideLoading();
						}
				 	},
					{ text: 'Si',
						onPress: () => {
							console.log('No cambio nada Recom');
							this.setState({ isLoading: false });
							this.Loading.hideLoading();
							this.volver();
						}
					}], false);
			} else {
				console.log('No cambio nada Recom');
				this.setState({ isLoading: false });
				this.volver();
			}
		}
	}

	ampliarImage(image) {
		if (image) {
			this.setState({
				photoZoom: true,
				imageZoom: image
			});
		}
	}

	render() {
		console.log('Recomendar');
		const { contrato, norma } = this.state.generar,
					{ insumos, unidades } = this.props.insumos;
		const collect = this.props.generar.contrato.collect;

		const styles = {
			boton1: {
				backgroundColor: stylesApp.colorNaranja,
				width: '48%',
				marginRight: '2%',
				justifyContent: 'center',
			},
			boton2: {
				backgroundColor: stylesApp.colorNaranja,
				width: '48%',
				marginLeft: '2%',
				justifyContent: 'center',
			},
			botonText: {
				color: stylesApp.whitePrimary,
				fontFamily: stylesApp.fontBold,
				textAlign: 'center',
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11
			},
		};

		//if (this.state.isLoading) { return null; }
		return (
			<FondoTemplate>
				<ScrollView ref={c => this.scrollview = c}
					keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
					keyboardShouldPersistTaps='always'
				>
					<ContratoDetalle contrato={contrato} />
					{
						collect && collect.cto_num ? <ContratoCollectDetalle collect={collect} />
						: null
					}
					<Card style={stylesApp.cardContainer}>
						<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'column' }}>
							<Text style={stylesApp.cardTitleSectionText}>RECOMENDACIÓN PARA:</Text>
							<Text style={{ color: stylesApp.colorNaranja, fontFamily: stylesApp.fontExtraBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 20 : 18 }}>{norma.tipo_insumo_nombre ? norma.tipo_insumo_nombre.toUpperCase() : ''}</Text>
						</CardItem>
						<RecomendarCheckboxs ref={c => this.prioridadesComp = c} rec={this.state.rec} />
						<RecomendarPickers ref={c => (this.insumosComp = c)} changeNorma={this.state.changeNorma} changeCultivo={this.state.changeCultivo} changeContrato={this.state.changeContrato} insumos={_.orderBy(insumos, ['nombre'], ['asc'])} unidades={unidades} rec={this.state.rec} />
						<NotasFotos ref={c => this.notasFotosComp = c} color={stylesApp.colorNaranja} ampliarImage={this.ampliarImage.bind(this)} route='generar' info={this.state.rec} />
						<RecSupUbicacion ref={c => this.ubicacionComp = c} color={stylesApp.colorNaranja} info={this.state.rec} />
						<SelectEmails ref={c => this.selectEmailsComp = c} color={stylesApp.colorNaranja} agricultor_email={contrato.agricultor_email} info={this.state.rec} />
					</Card>
					<View style={stylesApp.cardContainer}>
							{
								this.props.generar.rec ?
									<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row' }}>
										<Button
											style={styles.boton1}
											onPress={this.state.isLoading ? () => {} : () => this.modificarRecomendacion(true)}
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
												<Text style={styles.botonText}>GUARDAR Y VOLVER</Text>
											}
										</Button>
										<Button
											style={styles.boton2}
											onPress={this.state.isLoading ? () => {} : () => this.modificarRecomendacion(false)}
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
												<Text style={styles.botonText}>VOLVER</Text>
											}
										</Button>
									</CardItem>
								:
									<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row' }}>
										<Button
											style={styles.boton1}
											onPress={this.state.isLoading ? () => {} : () => this.guardarRecomendacion(false)}
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
												<Text style={styles.botonText}>GUARDAR RECOMENDACIÓN</Text>
											}
										</Button>

										<Button
											style={styles.boton2}
											onPress={this.state.isLoading ? () => {} : () => this.guardarRecomendacion(true)}
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
												<Text style={styles.botonText}>GUARDAR Y SEGUIR RECOMENDANDO</Text>
											}
										</Button>
									</CardItem>
							}
					</View>
					{
						this.state.photoZoom ?
							<ZoomImage photoZoom={this.state.photoZoom} imageZoom={this.state.imageZoom} closeImage={() => { this.setState({photoZoom: false, imageZoom: ''}) }}/>
						: null
					}
				</ScrollView>
				<Loading ref={c => this.Loading = c} />
				<KeyboardSpacer topSpacing={Platform.OS === 'ios' ? -100 : -30} />
			</FondoTemplate>
		);
	}
}

function mapStateToProps(state) {
	return {
		data: state.data,
		nav: state.nav,
		generar: state.generar,
		user: state.auth,
		insumos: state.insumos,
	};
}

const mapDispatchToProps = dispatch => ({
	goHome: () => dispatch({ type: 'HOME_NAV' }),
	goCultivos: () => dispatch({ type: 'CULTIVOS_NAV' }),
	backCultivos: () => dispatch(NavigationActions.back({ routeName: 'Cultivos' })),
	goSincronizar: (data) => dispatch({ type: 'SINCRONIZAR_NAV', payload: data }),
	goSupsSincronizar: (data) => dispatch({ type: 'SUPSSINCRONIZAR_NAV', payload: data }),
	updateContratoGenerar: (contrato, changeContrato) => dispatch({ type: 'UPDATE_CONTRATO_GENERAR', payload: {contrato, changeContrato} }),
	removeGenerar: () => dispatch({ type: 'REMOVE_GENERAR' }),
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response }),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response }),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recomendar);
