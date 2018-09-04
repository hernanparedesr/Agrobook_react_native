import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Platform, Image, Text, Alert, ScrollView, View, ListView, } from 'react-native';
import { Card, CardItem, Button, } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import ContratoDetalle from './ContratoDetalle';
import RecomendacionDetalle from './RecomendacionDetalle';
import SupervisionesDetalle from './SupervisionesDetalle';
import Supervision from './Supervision';
import RecSupUbicacion from './RecSupUbicacion';
import NotasFotos from './NotasFotos';
import SliderImages from './SliderImages';
import ZoomImage from './ZoomImage';
import ZoomObs from './ZoomObs';
import SelectEmails from './SelectEmails';
import Loading from './Loading';
import KeyboardSpacer from './KeyboardSpacer';

import { save_supervision, get_contratos, data_Sync, edit_supervision } from './Utils';

class Supervisar extends Component {

	constructor(props) {
		super(props);

		this.supervisiones = this.props.controlar.recomendacion.supervisiones ?
			_.map(this.props.controlar.recomendacion.supervisiones, (s, key) => {
				key === 0 ?
					s.selected = true
				: s.selected = false;
				return s;
			})
		: [];

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});

		this.state = {
			newSup: this.supervisiones.length === 0,
			sups: this.supervisiones,
			data: this.ds.cloneWithRows(this.supervisiones ? this.supervisiones : []),
			recID: this.props.controlar.recomendacion.id,
			controlar: this.props.controlar,
			changeContrato: this.props.controlar.changeContrato,
			changeRecomendacion: this.props.controlar.changeRecomendacion,
			photoZoom: false,
			imageZoom: '',
			photosZoom: false,
			imagesZoom: [],
			sup: this.props.controlar.sup !== undefined ? this.props.controlar.sup : [],
			isLoading: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.controlar.contrato && this.state.controlar.contrato.id){
			if(this.state.changeRecomendacion !== nextProps.controlar.changeRecomendacion || this.state.recID === undefined || this.state.changeContrato !== nextProps.controlar.changeContrato || this.state.controlar.recomendacion.id !== nextProps.controlar.recomendacion.id){
				this.supervisiones = nextProps.controlar.recomendacion.supervisiones ?
					_.map(nextProps.controlar.recomendacion.supervisiones, (s, key) => {
						key === 0 ?
							s.selected = true
						: s.selected = false;
						return s;
					})
				: [];

		    if (!this.state.recID && this.supervisiones.length === 0) {
					if (this.supervisionComp) this.supervisionComp.resetSupervision();
					if (this.notasFotosComp) this.notasFotosComp.resetNotasFotos();
					if (this.ubicacionComp) this.ubicacionComp.resetUbicacion();
					if (this.selectEmailsComp) this.selectEmailsComp.resetSelectEmails();
				}

				this.setState({
					newSup: this.supervisiones.length === 0,
					sups: this.supervisiones,
					data: this.ds.cloneWithRows(this.supervisiones ? this.supervisiones : []),
					recID: nextProps.controlar.recomendacion.id,
					controlar: nextProps.controlar,
					changeContrato: nextProps.controlar.changeContrato,
					changeRecomendacion: nextProps.controlar.changeRecomendacion,
					photoZoom: false,
					imageZoom: '',
					photosZoom: false,
					imagesZoom: [],
					sup: nextProps.controlar.sup !== undefined ? nextProps.controlar.sup : [],
					isLoading: false,
				});

				this.scrollview.scrollTo({y: 0});
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.controlar.contrato && !nextProps.controlar.contrato.id){
    	return false;
    } else if(nextProps.controlar.contrato && nextProps.controlar.contrato.id){
    	if(nextProps.controlar.recomendacion && !nextProps.controlar.recomendacion.id) {
	    	return false;
    	} //else if(this.state.data !== nextState.data || this.state.recID !== nextState.recID || this.state.controlar !== nextProps.controlar || this.state.changeContrato !== nextProps.controlar.changeContrato || this.state.changeRecomendacion !== nextState.controlar.changeRecomendacion || this.state.photoZoom !== nextState.photoZoom || this.state.imageZoom !== nextState.imageZoom || this.state.photosZoom !== nextState.photosZoom || this.state.imagesZoom !== nextState.imagesZoom || this.state.newSup !== nextState.newSup || this.state.sups !== nextState.sups || this.state.hasSup !== nextState.hasSup || this.state.addSup !== nextState.addSup || this.state.lastAvance !== nextState.lastAvance) {
    		else if (nextState !== this.state) {
				return true;
			}
  	}
    return false;
  }

  ampliarImage(image) {
  	if(image) {
  		this.setState({
				photoZoom: true,
				imageZoom: image
			});
  	}
	}

	showImages(images) {
  	if(images.length > 0) {
  		this.setState({
				photosZoom: true,
				imagesZoom: images
			});
  	}
	}

	hideImages() {
		this.setState({
			photosZoom: false,
			imagesZoom: []
		});
	}

	getState() {
		return {
			contrato_id: this.props.controlar.contrato.id,
			tecnico_id: this.props.user.id,
			tecnico_nombre: this.props.user.nombre,
			rec_id: this.props.controlar.recomendacion.id,
			cto_num: this.props.controlar.contrato.cto_num,
			agricultor_nombre: this.props.controlar.contrato.agricultor_nombre,
			agricultor_rut: this.props.controlar.contrato.agricultor_rut,
			agricultor_email: this.props.controlar.contrato.agricultor_email,
			recomendacion: this.state.controlar.recomendacion
		};
	}

	guardarSupervision(cond) {
		const supervisar = {
			...this.getState(),
			...this.supervisionComp.getState(),
			...this.ubicacionComp.getState(),
			...this.notasFotosComp.getState(),
			...this.selectEmailsComp.getState()
		};
		//console.log(supervisar);
		if (supervisar.fecha === '') {
			this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar la Fecha de inicio de la faena', [{ text: 'OK', onPress: null }], false);
		} else if (supervisar.avance === -1) {
			this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar el Avance de la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervisar.nota_id === 0) {
			this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar la Ponderación de la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervisar.notas === '') {
			this.Loading.showLoading(true, 'Alerta', 'Debe agregar observaciones a la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervisar.agricultor_emails_selected === '') {
			this.Loading.showLoading(true, 'Alerta', 'Seleccione algún correo electrónico para el envío de la notificación',
					[{ text: 'OK', onPress: null }], false);
		} else {
			if (!cond) {
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar la supervisión y volver al Menú Principal?',
				[
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si',
						onPress: async () => {
							this.setState({ isLoading: true });
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);
							const next = (resp) => {
								const nextt = async () => {
									await this.props.removeControlar();
									this.setState({ isLoading: false });
									this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
									this.props.goHome();
								};

								if (resp) {
									get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
								} else this.setState({ isLoading: false });
							};
							//guardar en la base de datos
							save_supervision(this.props.user, supervisar, next, this.Loading.showLoading);
						}
					}
				], false);
			} else {
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar la supervision y seguir supervisando para esta recomendación?',
				[
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si',
						onPress: async () => {
							this.setState({ isLoading: true });
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);
							const next = (resp) => {
								const nextt = async () => {
									this.setState({
										newSup: false,
										isLoading: false,
									});
									const contratoSelected = _.find(this.props.data, {id: this.props.controlar.contrato.id});
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

									await this.props.updateContratoControlar(new_contrato, !this.props.controlar.changeContrato);
									this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
									this.props.goRecomendaciones();
								};

								if (resp) {
									get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
								} else this.setState({ isLoading: false });
							};
							//guardar en la base de datos
							save_supervision(this.props.user, supervisar, next, this.Loading.showLoading);
						}
					}
				], false);
			}
		}
	}

	volver() {
		this.props.removeControlar();
		const preLastRoute = this.props.nav.routes[this.props.nav.routes.length - 2];
		const params = { recs: preLastRoute.routes[1].params.recs, sups: preLastRoute.routes[1].params.sups };
		if (preLastRoute.index === 0) this.props.goSincronizar(params);
		else if (preLastRoute.index === 1) this.props.goSupsSincronizar(params);
	}

	modificarSupervision(cond) {
		const supervi = {
			sup_id: this.props.controlar.sup.sup_id,
			email_id: this.props.controlar.sup.email_id,
			...this.getState(),
			...this.supervisionComp.getState(),
			...this.ubicacionComp.getState(),
			...this.notasFotosComp.getState(),
			...this.selectEmailsComp.getState()
		};
		//console.log(supervi);
		const superOld = this.props.controlar.sup;
		if (supervi.fecha === '') {
			this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar la Fecha de inicio de la faena', [{ text: 'OK', onPress: null }], false);
		} else if (supervi.avance === -1) {
		this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar el Avance de la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervi.nota_id === 0) {
		this.Loading.showLoading(true, 'Alerta', 'Debe seleccionar la Ponderación de la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervi.notas === '') {
		this.Loading.showLoading(true, 'Alerta', 'Debe agregar observaciones a la supervisión', [{ text: 'OK', onPress: null }], false);
		} else if (supervi.agricultor_emails_selected === '') {
			this.Loading.showLoading(true, 'Alerta', 'Seleccione algún correo electrónico para el envío de la notificación',
					[{ text: 'OK', onPress: null }], false);
		} else {
			this.setState({ isLoading: true });
			if (cond) {
				this.Loading.showLoading(true, 'Notificación',
				'¿Desea guardar los cambios y volver al Módulo de Sincronización?',
				[
					{ text: 'Cancelar', onPress: () => {
						this.setState({ isLoading: false });
						this.Loading.hideLoading();
					} },
					{ text: 'Si',
						onPress: async () => {
							this.Loading.showLoading(true, 'Notificación', 'Guardando', [], true);

							if(superOld.inicio !== supervi.inicio || superOld.avance !== supervi.avance || superOld.nota_id !== supervi.nota_id || superOld.repeat_task !== supervi.repeat_task || superOld.images !== supervi.images || superOld.notas !== supervi.notas || superOld.en_oficina !== supervi.en_oficina || superOld.lat != supervi.lat || superOld.lon != supervi.lon || superOld.alt != supervi.alt || superOld.agricultor_emails_selected !== supervi.agricultor_emails_selected) {
								const next = async (resp) => {
									const nextt = async () => {
										const nexttt = async (data) => {
											if (data.recomendacionesSync.length > 0 || data.supervisionesSync.length > 0) {
												this.setState({ isLoading: false });
												this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
												if(data.supervisionesSync.length === 0) await this.props.goSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
												else await this.props.goSupsSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
											} else {
												this.setState({ isLoading: false });
												this.Loading.showLoading(true, 'Notificación', 'No hay datos para sincronizar', [{ text: 'OK', onPress: null }], false);
												this.props.goHome();
											}
										};

										data_Sync(true, nexttt, this.Loading.showLoading);
									};

									if (resp) {
										await this.props.removeControlar();
										get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
									} else this.setState({ isLoading: false });
								};
								edit_supervision(this.props.user, supervi, next, this.Loading.showLoading);
							} else {
								this.setState({ isLoading: false });
								console.log('No cambio nada Super');
								this.Loading.showLoading(true, 'Notificación', 'Guardado con éxito', [{ text: 'OK', onPress: null }], false);
								this.volver();
							}
						}
					}
				], false);
			} else {
				if(superOld.inicio !== supervi.inicio || superOld.avance !== supervi.avance || superOld.nota_id !== supervi.nota_id || superOld.repeat_task !== supervi.repeat_task || superOld.images !== supervi.images || superOld.notas !== supervi.notas || superOld.en_oficina !== supervi.en_oficina || superOld.lat != supervi.lat || superOld.lon != supervi.lon || superOld.alt != supervi.alt || superOld.agricultor_emails_selected !== supervi.agricultor_emails_selected) {
					this.Loading.showLoading(true, 'Alerta',
					'Al volver perderá las modificaciones. ¿Desea continuar?',
					[{ text: 'No', onPress: () => {
						this.setState({ isLoading: false });
						this.Loading.hideLoading();
					} },
					{ text: 'Si',
						onPress: () => {
							console.log('No cambio nada Super');
							this.setState({ isLoading: false });
							this.Loading.hideLoading();
							this.volver();
						}
					}], false);
				} else {
					console.log('No cambio nada Super');
					this.setState({ isLoading: false });
					this.volver();
				}
			}
		}
	}

	showSuper(sup) {
		if (sup.selected) {
			_.map(this.supervisiones, s => {
				s.selected = false;
				return s;
			});
		} else{
			_.map(this.supervisiones, s => {
				s.id === sup.id ?
					s.selected = true
				: s.selected = false;
				return s;
			});
		}
		this.setState({
			sups: this.supervisiones,
			data: this.ds.cloneWithRows(this.supervisiones ? this.supervisiones : []),
		});
	}

	showObs(sup) {
		this.setState({
			obsZoom: sup
		});
	}

	renderDetalle(supervision) {
		const rec = _.find(this.state.controlar.recomendacion, { id: supervision.rec_id });
		supervision.recomendacion = { cultivos_campo: [] };
		if (rec) {
			supervision.recomendacion.cultivos_campo = rec.cultivos_campo;
		} else {
			const cultivos_campo_ids = supervision.rec_cultivos_campo_ids.split(',');
			_.map(cultivos_campo_ids, ccid => {
				if (parseInt(ccid) > 0) {
					const cc_info = _.find(this.props.controlar.contrato.cultivos_campo, { id: parseInt(ccid) });
					if (cc_info !== null && cc_info !== undefined) supervision.recomendacion.cultivos_campo.push(cc_info);
				}
			});
		}
		return (
			<SupervisionesDetalle
				supervision={supervision}
				press={this.showSuper.bind(this)}
				pressObs={this.showObs.bind(this)}
				showImages={this.showImages.bind(this)}
				botones={false}
			/>
		);
	}

	render() {
		console.log('Supervisar');
		const contrato = this.state.controlar.contrato,
					recomendacion = this.state.controlar.recomendacion,
					data = this.state.data;
		return (
			<FondoTemplate>
				<ScrollView
					ref={c => this.scrollview = c}
					keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
					keyboardShouldPersistTaps='always'
				>
					<ContratoDetalle contrato={contrato} />
					<RecomendacionDetalle
						cultivos_campo={contrato.cultivos_campo}
						recomendacion={recomendacion}
						showImages={this.showImages.bind(this)}
					/>
					{
						this.state.sups.length > 0 && !this.state.newSup ?
							<View style={{ width: '100%'}}>
								<Card style={{...stylesApp.cardInfo, marginBottom: 0}}>
									<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'column' }}>
										<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>SUPERVISIONES:</Text>
									</CardItem>
								</Card>
								<View>
									<ListView
										dataSource={data}
										renderRow={this.renderDetalle.bind(this)}
										enableEmptySections={true}
									/>
								</View>
							</View>
						:
							<View style={{width:'100%'}}>
								<Card style={stylesApp.cardInfo}>
									<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'column' }}>
										<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>{this.props.controlar.sup !== undefined ? 'MODIFICAR SUPERVISIÓN:' : 'AÑADIR SUPERVISIÓN'}</Text>
									</CardItem>
									<Supervision ref={c => this.supervisionComp = c} sup={this.state.sup} />
									<NotasFotos ref={c => this.notasFotosComp = c} color={stylesApp.colorAzul} ampliarImage={this.ampliarImage.bind(this)} route='controlar' info={this.state.sup} />
									<RecSupUbicacion ref={c => this.ubicacionComp = c} color={stylesApp.colorAzul} info={this.state.sup} />
									<SelectEmails ref={c => this.selectEmailsComp = c} color={stylesApp.colorAzul} agricultor_email={contrato.agricultor_email} info={this.state.sup} />
								</Card>
								<View style={stylesApp.cardInfo}>
									{
										this.props.controlar.sup ?
											<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row' }}>
												<Button
													style={{
														backgroundColor: stylesApp.colorAzul,
														width: '48%',
														marginRight: '2%',
														justifyContent: 'center',
													}}
													onPress={this.state.isLoading ? () => {} : () => this.modificarSupervision(true)}
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
														<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>GUARDAR Y VOLVER</Text>
													}
												</Button>
												<Button
													style={{
														backgroundColor: stylesApp.colorAzul,
														width: '48%',
														marginLeft: '2%',
														justifyContent: 'center',
													}}
													onPress={this.state.isLoading ? () => {} : () => this.modificarSupervision(false)}
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
														<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>VOLVER</Text>
													}
												</Button>
											</CardItem>
										:
											<CardItem header style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row' }}>
												<Button
													style={{
														backgroundColor: stylesApp.colorAzul,
														width: '48%',
														marginRight: '2%',
														justifyContent: 'center',
													}}
													onPress={this.state.isLoading ? () => {} : () => this.guardarSupervision(false)}
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
														<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>GUARDAR SUPERVISIÓN</Text>
													}
												</Button>

												<Button
													style={{
														backgroundColor: stylesApp.colorAzul,
														width: '48%',
														marginLeft: '2%',
														justifyContent: 'center',
													}}
													onPress={this.state.isLoading ? () => {} : () => this.guardarSupervision(true)}
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
														<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>GUARDAR Y SEGUIR SUPERVISANDO</Text>
													}
												</Button>
											</CardItem>
									}
								</View>
							</View>
					}
					{
						this.state.photoZoom ?
							<ZoomImage photoZoom={this.state.photoZoom} imageZoom={this.state.imageZoom} closeImage={() => { this.setState({photoZoom: false, imageZoom: ''}) }}/>
						: null
					}
					{
						this.state.photosZoom ?
							<SliderImages images={this.state.imagesZoom} hideImages={this.hideImages.bind(this)} photosZoom={this.state.photosZoom} />
						: null
					}
					{
						this.state.obsZoom ?
							<ZoomObs obsZoom={this.state.obsZoom} closeObs={() => { this.setState({obsZoom: ''}) }} />
						: null
					}
				</ScrollView>
				<KeyboardSpacer topSpacing={Platform.OS === 'ios' ? -100 : -30} />
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

function mapStateToProps(state) {
	return {
		data: state.cs_recomendaciones,
		nav: state.nav,
		controlar: state.controlar,
		user: state.auth,
	};
}

const mapDispatchToProps = dispatch => ({
	goHome: () => dispatch({ type: 'HOME_NAV' }),
	goRecomendaciones: () => dispatch({ type: 'RECOMENDACIONES_NAV' }),
	goSincronizar: (data) => dispatch({ type: 'SINCRONIZAR_NAV', payload: data }),
	goSupsSincronizar: (data) => dispatch({ type: 'SUPSSINCRONIZAR_NAV', payload: data }),
	updateContratoControlar: (contrato, changeContrato) => dispatch({ type: 'UPDATE_CONTRATO_CONTROLAR', payload: {contrato, changeContrato} }),
	//updateRecomendacionControlar: (contrato, recomendacion, changeRecomendacion) => dispatch({ type: 'UPDATE_RECOMENDACION_CONTROLAR', payload: { contrato, recomendacion, changeRecomendacion} }),
	removeControlar: () => dispatch({ type: 'REMOVE_CONTROLAR' }),
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response}),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response}),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Supervisar);
