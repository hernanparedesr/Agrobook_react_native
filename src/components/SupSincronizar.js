import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Alert, Image, ScrollView, ListView, View, Text,  } from 'react-native';
import { Button } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import SupervisionesDetalle from './SupervisionesDetalle';
import SliderImages from './SliderImages';
import ZoomObs from './ZoomObs';
import Loading from './Loading';

import {eliminar_supervision, get_contratos, data_Sync, sync_data, select_supervision} from './Utils';

class SupSincronizar extends Component {
	constructor(props) {
		super(props);

		this.lastRoute = this.props.nav.routes[this.props.nav.routes.length - 1];
		const routeSups = this.lastRoute.routes[1].params.sups,
					routeRecs = this.lastRoute.routes[1].params.recs;
		let sups = [];
		_.map(routeRecs, ({supervisiones}) => {
			if (supervisiones.length > 0) {
				sups = _.concat(sups, supervisiones);
			}
		});
		this.supervisiones = routeSups.length > 0 && sups.length > 0 ? _.concat(routeSups, sups) : routeSups.length >0 && sups.length === 0 ? routeSups : sups;
		this.supervisiones = this.supervisiones.length > 0 ?
			_.map(this.supervisiones, (s, key) => {
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
			sups: this.supervisiones,
			data: this.ds.cloneWithRows(this.supervisiones),
			photosZoom: false,
			imagesZoom: [],
			isLoading: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) return true;
    return false;
  }

	showImages(images) {
  	if (images.length > 0) {
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

	showSuper(sup) {
		if (sup.selected) {
			_.map(this.supervisiones, s => {
				s.selected = false;
				return s;
			});
		} else {
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

	editarSupervision(supp) {
		const next = async (supSelect) => {
			let cont = [], recomm = [];
			_.map(this.props.contratos, c => {
				if (c.recomendaciones.length > 0) {
					const recom = _.find(c.recomendaciones, { id: supp.rec_id });
					if (recom !== undefined) {
						cont = c;
						recomm = recom;
						return false;
					}
				}
			});
			console.log(recomm);
			supSelect = supSelect[0];
			const agricultor_emails = supp.emails[0].emails + ',' + supSelect.agricultor_email;
			const contrato = {
				cto_num: cont.cto_num,
				agricultor_nombre: cont.agricultor_nombre,
				agricultor_rut: cont.agricultor_rut,
				agricultor_email: cont.agricultor_email,
				calle: cont.calle,
				distrito: cont.distrito,
				zona_nombre: cont.zona_nombre,
				id: cont.id,
			},
			rec = {
				id: recomm.id,
				fecha: moment(recomm.fecha).format("DD/MM/YYYY"),
				tecnico_nombre: recomm.tecnico_nombre,
				tipo_insumo_nombre: recomm.tipo_insumo_nombre,
				rec_cultivos_campo_ids: recomm.rec_cultivos_campo_ids,
				cultivos_campo: recomm.cultivos_campo,
				prioridad_nombre: recomm.prioridad_nombre,
				notas: recomm.notas,
				foto1: recomm.foto1,
				foto2: recomm.foto2,
				foto3: recomm.foto3,
				insumos: recomm.insumos,
				supervisiones: [],
			},
			sup = {
				sup_id: supp.id,
				rec_id: supp.rec_id,
				inicio: supp.inicio,
				avance: supp.avance,
				nota_id: supp.nota_id,
				nota_nombre: supp.nota_nombre,
				notas: supp.observaciones,
				repeat_task: supp.repeat_task,
				images: supp.foto1 != 'null' && supp.foto1.length > 0 ?
					supp.foto2 != 'null' && supp.foto2.length > 0 ?
						supp.foto3 != 'null' && supp.foto3.length > 0 ?
							[{base64: supp.foto1},
								{base64: supp.foto2},
								{base64: supp.foto3}]
						: [{base64: supp.foto1},
								{base64: supp.foto2}]
					: [{base64: supp.foto1}]
				: [],
				lat: supp.lat,
				lon: supp.lon,
				alt: supp.alt,
				en_oficina: supp.en_oficina,
				email_id: supp.emails[0].id,
				agricultor_emails: agricultor_emails.includes(',') ?
					_.filter(agricultor_emails.split(','), (value, index, iteratee) => {
					   return _.includes(iteratee, value, index + 1);
					}).join(',')
					: agricultor_emails,
			};
			//console.log(contrato, rec, sup);
			await this.props.updateControlar(contrato, rec, sup);
			this.props.goSupervisar();
		};
		select_supervision(supp.id, next, this.Loading.showLoading);
	}

	refresh(data) {
		if (data.recomendacionesSync.length > 0 || data.supervisionesSync.length > 0) {
			if (data.recomendacionesSync.length > 0) {
				const routeSups = data.supervisionesSync.length > 0 ? data.supervisionesSync : [],
							routeRecs = data.recomendacionesSync;
				let sups = [];
				_.map(routeRecs, ({ supervisiones }) => {
					if (supervisiones.length > 0) {
						sups = _.concat(sups, supervisiones);
					}
				});
				this.supervisiones = routeSups.length > 0 && sups.length > 0 ? _.concat(routeSups, sups) : routeSups.length > 0 && sups.length === 0 ? routeSups : sups;
				this.supervisiones = this.supervisiones.length > 0 ?
					_.map(this.supervisiones, (s, key) => {
						key === 0 ?
							s.selected = true
						: s.selected = false;
						return s;
					})
				: [];

				if(this.supervisiones.length > 0) {
					this.props.nav.routes[this.props.nav.routes.length - 1].routes[0].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
					this.props.nav.routes[this.props.nav.routes.length - 1].routes[1].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
					this.setState({
						sups: this.supervisiones,
						data: this.ds.cloneWithRows(this.supervisiones),
						photosZoom: false,
						imagesZoom: [],
						isLoading: false,
					});
				} else {
					this.props.goSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
					this.supervisiones = [];
					this.setState({
						sups: this.supervisiones,
						data: this.ds.cloneWithRows(this.supervisiones),
						photosZoom: false,
						imagesZoom: [],
						isLoading: false,
					});
				}
			} else if(data.supervisionesSync.length > 0) {
				this.props.nav.routes[this.props.nav.routes.length - 1].routes[0].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
				this.props.nav.routes[this.props.nav.routes.length - 1].routes[1].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
				this.supervisiones = data.supervisionesSync;
				this.setState({
					sups: this.supervisiones,
					data: this.ds.cloneWithRows(this.supervisiones),
					photosZoom: false,
					imagesZoom: [],
					isLoading: false,
				});
			}
		} else {
			this.props.goHome('nodatatosync');
			this.supervisiones = [];
			this.setState({
				sups: this.supervisiones,
				data: this.ds.cloneWithRows(this.supervisiones),
				photosZoom: false,
				imagesZoom: [],
				isLoading: false,
			});
		}
	}

	eliminarSupervision(sup) {
		this.setState({ isLoading: true });
		this.Loading.showLoading(true, '¿Desea eliminar esta supervisión?', 'Esta supervisión será eliminada antes de sincronizar', [
			{ text: 'No',
				onPress: () => {
					this.setState({ isLoading: false });
					this.Loading.hideLoading();
				}
			},
			{ text: 'Si',
				onPress: async () => {
					this.Loading.showLoading(true, 'Alerta', 'Eliminando', [], true);
					const next = () => {
						const nextt = async () => {
							const nexttt = async (data) => {
								this.Loading.showLoading(true, 'Notificación', 'Eliminado con éxito', [{ text: 'OK', onPress: null }], false);
								this.setState({ isLoading: false });
								this.refresh(data);
							};
							data_Sync(true, nexttt, this.Loading.showLoading);
						};
						get_contratos(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, false, nextt, this.Loading.showLoading);
					};

					eliminar_supervision(sup.id, next, this.Loading.showLoading);
				}
			}
		], false);
	}

	sincronizar() {
		this.setState({ isLoading: true });
		this.Loading.showLoading(true, 'Alerta', '¿Desea sincronizar las recomendaciones y/o supervisiones?', [
			{ text: 'No',
				onPress: () => {
					this.setState({ isLoading: false });
					this.Loading.hideLoading();
				}
			},
			{ text: 'Si',
				onPress: async () => {
					const next = (resp) => {
						const nextt = (data) => {
							this.setState({ isLoading: false });
							this.refresh(data);
						};
						data_Sync(true, nextt, this.Loading.showLoading);
					};

					sync_data(this.props.user, this.props.setData, this.props.setRecomendaciones, this.props.setCollects, this.props.saveUsers, this.props.saveTemporadas, this.props.saveInsumos, this.props.saveCultivos, next, false, false, this.Loading.showLoading);
				}
			}
		], false);
	}

	renderDetalle(supervision) {
		let recomendacion = [], recomendaciones = [], contrato = [];
		_.map(this.props.contratos, c => {
			if(c.recomendaciones.length > 0) {
				const recom = _.find(c.recomendaciones, {id: supervision.rec_id});
				if(recom !== undefined) {
					contrato = c;
					recomendacion = recom;
					return false;
				}
			}
		});
		if (recomendacion && recomendacion.tipo_insumo_nombre) {
			recomendacion = {
				cto_num: contrato.cto_num,
				tecnico_nombre: recomendacion.tecnico_nombre,
				tipo_insumo_nombre: recomendacion.tipo_insumo_nombre,
				rec_cultivos_campo_ids: recomendacion.rec_cultivos_campo_ids,
				cultivos_campo: recomendacion.cultivos_campo,
			};
		} else recomendacion = [];
		supervision.recomendacion = recomendacion;
		return (
			<SupervisionesDetalle
				supervision={supervision}
				press={this.showSuper.bind(this)}
				pressObs={this.showObs.bind(this)}
				showImages={this.showImages.bind(this)}
				editar={this.state.isLoading ? () => {} : this.editarSupervision.bind(this)}
				eliminar={this.state.isLoading ? () => {} : this.eliminarSupervision.bind(this)}
				botones={true}
			/>
		);
	}

	render() {
		console.log('Sinc Supervisiones');
		const data = this.state.data;
		return (
			<FondoTemplate>
				<ScrollView ref={c => this.scrollview = c}>
					<ListView
						dataSource={data}
						renderRow={this.renderDetalle.bind(this)}
						enableEmptySections={true}
						pageSize={5}
					/>
					<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
						<Button
							style={{
								backgroundColor: stylesApp.colorAzul,
								width: '45%',
								justifyContent: 'center',
							}}
							onPress={() => this.sincronizar()}
						>
							{this.state.isLoading ?
								<Image
									source={stylesApp.loadingGif}
									style={{
										width: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.05 : stylesApp.widthWindow * 0.08,
										height: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.widthWindow * 0.05 : stylesApp.widthWindow * 0.08,
									}}
								/>
							:
								<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>SINCRONIZAR
									<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontExtraBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}> TODO</Text>
								</Text>
							}
						</Button>
					</View>
					{
						this.state.photosZoom ?
							<SliderImages images={this.state.imagesZoom} hideImages={this.hideImages.bind(this)} photosZoom={this.state.photosZoom} />
						: null
					}
					{
						this.state.obsZoom ?
							<ZoomObs obsZoom={this.state.obsZoom} closeObs={() => { this.setState({obsZoom: '',}) }} />
						: null
					}
				</ScrollView>
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

function mapStateToProps(state) {
	return {
		nav: state.nav,
		user: state.auth,
		contratos: state.data,
	};
}

const mapDispatchToProps = dispatch => ({
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response}),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response}),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
	goSincronizar: (data) => dispatch({ type: 'SINCRONIZAR_NAV', payload: data }),
	goHome: (info) => dispatch({ type: 'HOME_NAV', payload: info}),
	goSupervisar: () => dispatch({ type: 'SUPERVISAR_NAV' }),
	updateControlar: (contrato, recomendacion, sup) => dispatch({ type: 'EDITAR_CONTROLAR', payload: {contrato, recomendacion, sup}}),
	saveUsers: (response) => dispatch({ type: 'SAVE_USERS', payload: response}),
	saveTemporadas: (response) => dispatch({ type: 'SAVE_TEMPORADAS', payload: response}),
	saveInsumos: (insumos, tipo_insumos, unidades) => dispatch({ type: 'SAVE_INSUMOS', payload: { insumos, tipo_insumos, unidades }}),
	saveCultivos: (response) => dispatch({ type: 'SAVE_CULTIVOS', payload: response}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SupSincronizar);
