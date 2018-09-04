import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import { Alert, ScrollView, ListView, View, Text, } from 'react-native';
import { Card, CardItem, CheckBox, } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import RecomendacionesDetalle from './RecomendacionesDetalle';
import ContratoDetalle from './ContratoDetalle';
import Loading from './Loading';
import { rec_finalizada } from './Utils';

class Recomendaciones extends Component {
	constructor(props) {
		super(props);

		this.recomendaciones = _.map(this.props.controlar.contrato.recomendaciones, r => _.assign(r, { selected: false }) );

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});

		this.state = {
			recs: this.recomendaciones,
			data: this.ds.cloneWithRows(_.orderBy(this.recomendaciones, ['fecha'], ['desc'])),
			isLoadingC: false,
			activeR: 0,
			changeContrato: this.props.controlar.changeContrato,
			estado: 'Todas',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.changeContrato !== nextProps.controlar.changeContrato && nextProps.controlar.contrato.id && this.props.controlar.contrato.id) {
			this.recomendaciones = _.map(nextProps.controlar.contrato.recomendaciones, r => _.assign(r, { selected: false }));
			this.setState({
				recs: this.recomendaciones,
				data: this.ds.cloneWithRows(this.recomendaciones),
				isLoadingC: false,
				activeR: 0,
				changeContrato: nextProps.controlar.changeContrato,
				estado: 'Todas',
			});
			this.scrollview.scrollTo({ y: 0 });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isLoadingC !== this.state.isLoadingC || nextState.activeR !== this.state.activeR || nextState.data !== this.state.data/* || nextProps.controlar.changeContrato !== this.state.changeContrato*/) return true;
    return false;
  }

	async selectRecomendacion(recomendacionSelected) {
		const routeGeneral = this.props.nav.routes[this.props.nav.routes.length - 1];
		if (routeGeneral.routeName === 'Controlar' && routeGeneral.index === 1) {
			let recomendaciones_array = _.map(this.props.controlar.contrato.recomendaciones, r => {
				if (r.id === recomendacionSelected.id) r.selected = true;
				else r.selected = false;
				return r;
			});
			let recomendaciones = _.filter(recomendaciones_array, r => {
				if (this.state.estado === 'Todas')
					return true;

				let finalizada = rec_finalizada(r);

				return this.state.estado === 'Cerradas' ? finalizada : !finalizada;
			});
			recomendacionSelected.selected = true;
			this.setState({
				recs: recomendaciones_array,
				data: this.ds.cloneWithRows(recomendaciones),
				isLoadingC: true,
				activeR: recomendacionSelected.id,
			});
			const recomendacion = {
				id: recomendacionSelected.id,
				fecha: moment(recomendacionSelected.fecha).format("DD/MM/YYYY"),
				tecnico_nombre: recomendacionSelected.tecnico_nombre,
				tipo_insumo_nombre: recomendacionSelected.tipo_insumo_nombre,
				rec_cultivos_campo_ids: recomendacionSelected.rec_cultivos_campo_ids,
				cultivos_campo: recomendacionSelected.cultivos_campo,
				prioridad_nombre: recomendacionSelected.prioridad_nombre,
				notas: recomendacionSelected.notas,
				foto1: recomendacionSelected.foto1,
				foto2: recomendacionSelected.foto2,
				foto3: recomendacionSelected.foto3,
				insumos: recomendacionSelected.insumos,
				supervisiones: recomendacionSelected.supervisiones,
			};
			if (this.props.controlar.recomendacion && this.props.controlar.recomendacion.id && this.props.controlar.recomendacion.id !== recomendacion.id){
				this.Loading.showLoading(true, 'Alerta', 'Cambiar de recomendacion eliminará la información actual. ¿Desea continuar?', [
					{ text: 'Cancelar',
						onPress: () => {
							_.map(recomendaciones_array, r => {
								if(r.id === this.props.controlar.recomendacion.id) r.selected = true;
								else r.selected = false;
								return r;
							});
							recomendaciones = _.filter(recomendaciones_array, r => {
								if (this.state.estado === 'Todas')
									return true;

								let finalizada = rec_finalizada(r);

								return this.state.estado === 'Cerradas' ? finalizada : !finalizada;
							});
							recomendacion.selected = false;
							this.setState({
								recs: recomendaciones_array,
								data: this.ds.cloneWithRows(recomendaciones),
								isLoadingC: false,
								activeR: this.props.controlar.recomendacion.id
							});
							this.Loading.hideLoading();
						}
					},
					{ text: 'Si',
						onPress: () => {
							this.props.updateRecomendacionControlar(this.props.controlar.contrato, recomendacion, !this.props.controlar.changeRecomendacion);
							this.setState({
								isLoadingC: false,
							});
							this.Loading.hideLoading();
							this.props.goSupervisar();
						}
					}
				], false);
			} else if(this.props.controlar.recomendacion && this.props.controlar.recomendacion.id && this.props.controlar.recomendacion.id === recomendacion.id) {
			this.setState({
				isLoadingC: false,
			});
				this.props.goSupervisar();
			} else {
				this.props.saveRecomendacionControlar(this.props.controlar.contrato, recomendacion);
				this.setState({
					isLoadingC: false,
				});
				this.props.goSupervisar();
			}
		}
	}

	searchRecomendaciones(texto) {
		let rs = _.filter(this.state.recs, r => {
			if (texto === 'Todas')
				return true;

			let finalizada = rec_finalizada(r);

			return texto === 'Cerradas' ? finalizada : !finalizada;
		});

		this.setState({
			data: this.ds.cloneWithRows(rs),
			estado: texto
		});
	}

	renderDetalle(recomendacion) {
		return <RecomendacionesDetalle
			recomendacion={recomendacion}
			cultivos_campo={this.props.controlar.contrato.cultivos_campo}
			press={this.selectRecomendacion.bind(this)}
			isLoading={this.state.isLoadingC}
			activeR={this.state.activeR}
		/>;
	}

	renderCheckBox(texto, cond){
		return (
			<View style={{ alignItems: 'center', justifyContent: 'center', width: '33.33%', }}>
				<CheckBox
					checked={cond}
					style={{
						borderColor:
						!cond === true
							? stylesApp.blackSecondary
							: stylesApp.colorAzul,
						backgroundColor:
						!cond === true
							? 'transparent'
							: stylesApp.colorAzul,
						margin: 0,
						padding: 0,
						left: 0,
					}}
					onPress={() => this.searchRecomendaciones(texto)}
				/>
				<Text style={{ fontFamily: stylesApp.fontSemiBold, marginTop: '3%', textAlign: 'center', color: stylesApp.blackSecondary }}>{texto}</Text>
			</View>
		);
	}

	render() {
		console.log('Recomendaciones');
		const data = this.state.data,
					contrato = this.props.controlar.contrato,
					estado = this.state.estado;
		return (
			<FondoTemplate>
				<ScrollView ref={c => this.scrollview = c}>
					<ContratoDetalle contrato={contrato} />
					<Card style={{ ...stylesApp.cardInfo, backgroundColor: stylesApp.cardContentColor, marginBottom: 0, marginTop: '5%', padding: 0 }}>
						<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: 0, marginBottom: '5%', borderRadius: 0 }}>
							<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>VER:</Text>
						</CardItem>
						<View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: '5%' }}>
							{estado === 'Abiertas' ? this.renderCheckBox('Abiertas', true) : this.renderCheckBox('Abiertas', false)}
							{estado === 'Cerradas' ? this.renderCheckBox('Cerradas', true) : this.renderCheckBox('Cerradas', false)}
							{estado === 'Todas' ? this.renderCheckBox('Todas', true) : this.renderCheckBox('Todas', false)}
						</View>
					</Card>
					<View>
						<ListView
							dataSource={data}
							renderRow={this.renderDetalle.bind(this)}
							enableEmptySections={true}
							pageSize={5}
						/>
					</View>
				</ScrollView>
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
	};
}

const mapDispatchToProps = dispatch => ({
	goSupervisar: () => dispatch({ type: 'SUPERVISAR_NAV' }),
	saveRecomendacionControlar: (contrato, recomendacion) => dispatch({ type: 'SET_RECOMENDACION_CONTROLAR', payload: { recomendacion, contrato } }),
	updateRecomendacionControlar: (contrato, recomendacion, changeRecomendacion) => dispatch({ type: 'UPDATE_RECOMENDACION_CONTROLAR', payload: { contrato, recomendacion, changeRecomendacion} }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recomendaciones);
