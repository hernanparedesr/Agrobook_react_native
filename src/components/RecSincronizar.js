import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Alert, ScrollView, ListView, View, Text, Image, } from 'react-native';
import { Button } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import RecomendacionesDetalleSinc from './RecomendacionesDetalleSinc';
import Loading from './Loading';

import { eliminar_recomendacion, get_contratos, data_Sync, sync_data, select_recomendacion } from './Utils';

class RecSincronizar extends Component {
	constructor(props) {
		super(props);

		this.lastRoute = this.props.nav.routes[this.props.nav.routes.length - 1];
		this.recomendaciones = this.lastRoute.routes[0].params && this.lastRoute.routes[0].params.recs ? this.lastRoute.routes[0].params.recs : [];

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});

		this.state = {
			recs: this.recomendaciones,
			data: this.ds.cloneWithRows(this.recomendaciones),
			isLoading: false,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
    if(nextState.data !== this.state.data || this.state.isLoading !== nextState.isLoading) return true;
    return false;
  }

  editarRecomendacion(recc) {
		const next = async (recSelect) => {
			recSelect = recSelect[0];
			const agricultor_emails = recc.emails[0].emails + ',' + recSelect.agricultor_email;
			const contrato_cultivos_campo = _.find(this.props.contratos, { id: recSelect.id }) ?
			_.find(this.props.contratos, { id: recSelect.id }).cultivos_campo : [];
			const contrato = {
				cto_num: recSelect.cto_num,
				agricultor_nombre: recSelect.agricultor_nombre,
				agricultor_rut: recSelect.agricultor_rut,
				agricultor_email: recSelect.agricultor_email,
				calle: recSelect.calle,
				distrito: recSelect.distrito,
				zona_nombre: recSelect.zona_nombre,
				id: recSelect.id,
				collect: {},
			},
			cultivo = _.map(recSelect.rec_cultivos_campo_ids.split(','), ccid => {
				const ccs = _.find(contrato_cultivos_campo, { id: parseInt(ccid) });
				if (ccs) {
					return {
						campo_nombre: ccs.campo_nombre,
						cultivo_nombre: ccs.cultivo_nombre,
						temporada_nombre: ccs.temporada_nombre,
						sup_sembrada: ccs.sup_sembrada,
					};
				}
			}),
			tipo_insumo = {
				tipo_insumo_nombre: recSelect.tipo_insumo_nombre,
				tipo_insumo_id: recSelect.tipo_insumo_id,
			},
			rec = {
				rec_id: recSelect.rec_id,
				prioridad_id: recc.prioridad_id,
				prioridad_nombre: recc.prioridad_nombre,
				insumos: recc.insumos,
				insumos2: _.map(recc.insumos, i => {
					return {
						insumo_id: i.insumo_id,
						insumo_nombre: i.insumo_nombre,
						superficie: i.superficie,
						dosis: i.dosis,
						unidad_id: i.unidad_id,
						unidad_nombre: i.unidad_nombre
					};
				}),
				notas: recc.notas,
				images: recc.foto1 != 'null' && recc.foto1.length > 0 ?
					recc.foto2 != 'null' && recc.foto2.length > 0 ?
						recc.foto3 != 'null' && recc.foto3.length > 0 ?
							[{base64: recc.foto1},
								{base64: recc.foto2},
								{base64: recc.foto3}]
						: [{base64: recc.foto1},
								{base64: recc.foto2}]
					: [{base64: recc.foto1}]
				: [],
				lat: recc.lat,
				lon: recc.lon,
				alt: recc.alt,
				en_oficina: recc.en_oficina,
				email_id: recc.emails[0].id,
				agricultor_emails: agricultor_emails.includes(',') ?
					_.filter(agricultor_emails.split(','), (value, index, iteratee) => {
					   return _.includes(iteratee, value, index + 1);
					}).join(',')
					: agricultor_emails,
			};
			//console.log(rec);
			await this.props.updateGenerar(contrato, cultivo, tipo_insumo, rec);
			this.props.goRecomendar();
		};
		select_recomendacion(recc.id, next, this.Loading.showLoading);
	}

	refresh(data) {
		if(data.recomendacionesSync.length > 0 || data.supervisionesSync.length > 0) {
			if(data.recomendacionesSync.length > 0){
				this.recomendaciones = data.recomendacionesSync;
				this.setState({
					recs: this.recomendaciones,
					data: this.ds.cloneWithRows(this.recomendaciones),
					isLoading: false,
				});
				this.props.nav.routes[this.props.nav.routes.length - 1].routes[0].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
				this.props.nav.routes[this.props.nav.routes.length - 1].routes[1].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
			} else {
				this.recomendaciones = [];
				this.setState({
					recs: this.recomendaciones,
					data: this.ds.cloneWithRows(this.recomendaciones),
					isLoading: false,
				});
				this.props.nav.routes[this.props.nav.routes.length - 1].routes[0].params = { recs: data.recomendacionesSync, sups: data.supervisionesSync };
				this.props.goSupsSincronizar({ recs: data.recomendacionesSync, sups: data.supervisionesSync });
			}
		} else {
			this.props.goHome('nodatatosync');
			this.recomendaciones = [];
			this.setState({
				recs: this.recomendaciones,
				data: this.ds.cloneWithRows(this.recomendaciones),
				isLoading: false,
			});
		}
	}

	eliminarRecomendacion(rec) {
		this.setState({ isLoading: true });
		this.Loading.showLoading(true, '¿Desea eliminar esta recomendacion?', 'La supervisión pendiente por sincronizar y relacionada a esta recomendación también será eliminada', [
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

					eliminar_recomendacion(rec.id, next, this.Loading.showLoading);
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

	renderDetalle(recomendacion) {
		const recom = recomendacion;
		const contrato = _.find(this.props.contratos, { id: recomendacion.contrato_id });
		recom.cto_num = contrato && contrato.cto_num ? contrato.cto_num : '';
		return (
			<RecomendacionesDetalleSinc
				recomendacion={recom}
				cultivos_campo={contrato.cultivos_campo}
				editar={this.state.isLoading ? () => {} : this.editarRecomendacion.bind(this)}
				eliminar={this.state.isLoading ? () => {} : this.eliminarRecomendacion.bind(this)}
			/>
		);
	}

	render() {
		console.log('Sinc Recomendaciones');
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
					<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', marginTop: 15  }}>
						<Button
							style={{
								backgroundColor: stylesApp.colorNaranja,
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
	goSupsSincronizar: (data) => dispatch({ type: 'SUPSSINCRONIZAR_NAV', payload: data }),
	goHome: (info) => dispatch({ type: 'HOME_NAV', payload: info}),
	saveUsers: (response) => dispatch({ type: 'SAVE_USERS', payload: response}),
	saveTemporadas: (response) => dispatch({ type: 'SAVE_TEMPORADAS', payload: response}),
	saveInsumos: (insumos, tipo_insumos, unidades) => dispatch({ type: 'SAVE_INSUMOS', payload: { insumos, tipo_insumos, unidades }}),
	saveCultivos: (response) => dispatch({ type: 'SAVE_CULTIVOS', payload: response}),
	updateGenerar: (contrato, cultivo, insumo, rec) => dispatch({ type: 'EDITAR_GENERAR', payload: {contrato, cultivo, insumo, rec} }),
	goRecomendar: () => dispatch({ type: 'RECOMENDAR_NAV'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecSincronizar);
