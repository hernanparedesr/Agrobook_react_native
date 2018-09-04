import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Grid, Row, Col } from 'react-native-easy-grid';

import { Platform, Text, View, TouchableHighlight, Image, ScrollView } from 'react-native';
import { Button, Body } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import stylesApp from '../assets/styles';

import ZoomImage from './ZoomImage';
import DetalleListTemplate from './DetalleListTemplate';
import FondoTemplate from './FondoTemplate';
import Loading from './Loading';

const Buffer = require('buffer/').Buffer;

class CollectDetalle extends Component {

	constructor(props) {
		super(props);

		const lastRoute = this.props.nav.routes[this.props.nav.routes.length - 1],
					lastRouteName = lastRoute.routeName,
					collect = lastRouteName === 'Collect' ? lastRoute.routes[lastRoute.routes.length - 1].params && lastRoute.routes[lastRoute.routes.length - 1].params.collect ? lastRoute.routes[lastRoute.routes.length - 1].params.collect : {} : {};

		this.state = {
			collect,
			photoZoom: false,
			imageZoom: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const lastRoute = nextProps.nav.routes[nextProps.nav.routes.length - 1],
					lastRouteName = lastRoute.routeName;
		if (lastRoute.routes && lastRoute.routes.length > 0 && lastRouteName === 'Collect') {
			const collect = lastRoute.routes[lastRoute.routes.length - 1].params && lastRoute.routes[lastRoute.routes.length - 1].params.collect ? lastRoute.routes[lastRoute.routes.length - 1].params.collect : {};
			if (!_.isEqual(collect, this.state.collect)) {
				this.setState({
					collect,
					photoZoom: false,
					imagsZoom: ''
				});
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const lastRoute = nextProps.nav.routes[nextProps.nav.routes.length - 1],
					lastRouteName = lastRoute.routeName;
		if (this.state.photoZoom !== nextState.photoZoom) {
			return true;
		} else if (lastRoute.routes && lastRoute.routes.length > 0 && lastRouteName === 'Collect') {
			const collect = lastRoute.routes[lastRoute.routes.length - 1].params && lastRoute.routes[lastRoute.routes.length - 1].params.collect ? lastRoute.routes[lastRoute.routes.length - 1].params.collect : {};
			if (!_.isEqual(this.state.collect, collect) && collect !== {} && this.state.collect !== {}) {
				return true;
			}
		}
		return false;
	}

	showImages(image) {
		if (image) {
			this.setState({
				photoZoom: true,
				imageZoom: image
			});
  	}
	}

	hideImages = () => {
		this.setState({
			photoZoom: false,
			imageZoom: ''
		});
	}

	recomendar = async (collectSelected) => {
		const contratoSelected = _.find(this.props.contratos, { cto_num: collectSelected.cto_num });
		let cultivo_campo = {};
		if (contratoSelected) {
			cultivo_campo = _.find(contratoSelected.cultivos_campo, { campo_id: collectSelected.campo_id, estadoTabla: 1 });
			if (cultivo_campo) {
				const contrato = {
					cto_num: contratoSelected.cto_num,
					agricultor_nombre: contratoSelected.agricultor_nombre,
					agricultor_rut: contratoSelected.agricultor_rut,
					agricultor_email: contratoSelected.agricultor_email,
					calle: contratoSelected.calle,
					distrito: contratoSelected.distrito,
					zona_nombre: contratoSelected.zona_nombre,
					id: contratoSelected.id,
					collect: collectSelected,
				},
				cultivo = [{
					cultivos_campo_id: cultivo_campo.id,
					cultivo_id: cultivo_campo.cultivo_id,
					cultivo_nombre: cultivo_campo.cultivo_nombre,
					tipo_insumo_ids: cultivo_campo.tipo_insumo_ids,
					tipo_cultivo_id: cultivo_campo.tipo_cultivo_id,
					tipo_cultivo_nombre: cultivo_campo.tipo_cultivo_nombre,
					temporada_id: cultivo_campo.temporada_id,
					temporada_nombre: cultivo_campo.temporada_nombre,
					campo_id: cultivo_campo.campo_id,
					campo_nombre: cultivo_campo.campo_nombre,
					sup_sembrada: cultivo_campo.sup_sembrada,
					relacionExiste: true,
					relacionNueva: false,
					nuevoCultivo: false
				}];
				//console.log(rec);
				await this.props.updateGenerar(contrato, cultivo, collectSelected.id);
				this.props.goNormas();
			} else {
				this.Loading.showLoading(
					true,
					'Alerta',
					'Se se ha encontrado la información',
					[{ text: 'OK', onPress: null }],
					false
				);
			}
		} else {
			this.Loading.showLoading(
				true,
				'Alerta',
				'Se se ha encontrado la información',
				[{ text: 'OK', onPress: null }],
				false
			);
		}
	}

	renderImage(image) {
		//console.log(image);
		const foto = Buffer.from(image.toString(), 'binary').toString('base64');
		return (
			<View
				style={{
					width: '30%',
					backgroundColor: 'transparent',
					borderRadius: 2,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<TouchableHighlight onPress={() => this.showImages(foto)}>
					<Image source={{ uri: `data:image/jpg;base64,${foto}` }} style={{ width: 80, height: 150 }} />
				</TouchableHighlight>
			</View>
		);
	}

	renderInfo(title, info, marginTop) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>
				{info}
			</Text>
		);
	}

	render() {
		console.log('Collect Detalle');
		const collect = this.state.collect,
					contrato = _.find(this.props.contratos, { cto_num: collect.cto_num });
		let cultivo = '',
				temporada = '';
		if (contrato) {
			const cultivo_campo = _.find(contrato.cultivos_campo, { campo_id: collect.campo_id, estadoTabla: 1 });
			if (cultivo_campo) {
				cultivo = cultivo_campo.cultivo_nombre;
				temporada = cultivo_campo.temporada_nombre;
			}
		}

		return (
			<FondoTemplate>
				<ScrollView
					ref={c => this.scrollview = c}
					keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
					keyboardShouldPersistTaps='always'
				>
					<DetalleListTemplate
						title={` No. ${collect.cto_num}`}
						icon={<MaterialIcons
							name='folder'
							size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
							color={stylesApp.blackSecondary}
						/>}
						left={null}
						right={<Text style={{ fontFamily: stylesApp.fontExtraBold, color: stylesApp.blackSecondary }}>{ moment(new Date(collect.fecha)).format('DD/MM/YYYY H:mm')}</Text>}
						stylesCard={{ marginTop: '5%' }}
						stylesBody={{ flexDirection: 'column' }}
					>
						<Grid style={{ width: '100%' }}>
							<Row style={{ flexDirection: 'column', width: '100%', justifyContent: 'flex-start' }}>
								{this.renderInfo('Agricultor: ', collect.agricultor_nombre, '0%')}
								{this.renderInfo('RUT: ', collect.agricultor_rut, '2%')}
								{this.renderInfo('Ubicación: ', collect.calle + ' (' + collect.distrito + ')', '2%')}
								{this.renderInfo('Potrero: ', collect.potrero, '2%')}
								{this.renderInfo('Cultivo: ', cultivo, '2%')}
								{this.renderInfo('Temporada: ', temporada, '2%')}
								{this.renderInfo('Sucursal: ', collect.zona, '2%')}
								{this.renderInfo('Observaciones: ', collect.observacion, '2%')}
							</Row>
							{
								collect.foto1 || collect.foto2 || collect.foto3 ?
										<View style={{ flexDirection: 'column', width: '100%', justifyContent: 'flex-start' }}>
											{this.renderInfo('Imágenes: ', '', '2%')}
											<View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row' }}>
												{
													collect.foto1 ?
														this.renderImage(collect.foto1)
													: null
												}
												{
													collect.foto2 ?
														this.renderImage(collect.foto2)
													: null
												}
												{
													collect.foto3 ?
														this.renderImage(collect.foto3)
													: null
												}
											</View>
										</View>
								: null
							}
						</Grid>
					</DetalleListTemplate>
					<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', margin: '5%' }}>
						<Button
							style={{
								backgroundColor: stylesApp.colorVerde,
								width: '48%',
								marginRight: Platform.OS === 'ios' ? 8 : '2%',
								justifyContent: 'center',
							}}
							onPress={() => this.props.goCollect()}
						>
							<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>VOLVER</Text>
						</Button>
						{
							collect.estadoTabla === 0 &&
							<Button
								style={{
									backgroundColor: stylesApp.colorVerde,
									width: '48%',
									marginLeft: Platform.OS === 'ios' ? 8 : '2%',
									justifyContent: 'center',
								}}
								onPress={() => this.recomendar(collect)}
							>
								<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>RECOMENDAR</Text>
							</Button>
						}
					</View>
					{
						this.state.photoZoom ?
						<ZoomImage
							photoZoom={this.state.photoZoom}
							imageZoom={this.state.imageZoom}
							closeImage={() => { this.setState({ photoZoom: false, imageZoom: '' }); }}
						/>
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
		contratos: state.data
	};
}

const mapDispatchToProps = dispatch => ({
	goCollect: () => dispatch({ type: 'COLLECTS_NAV' }),
	updateGenerar: (contrato, cultivo, collect) => dispatch({ type: 'COLLECT_GENERAR', payload: { contrato, cultivo, collect } }),
	goNormas: () => dispatch({ type: 'NORMAS_NAV' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectDetalle);
