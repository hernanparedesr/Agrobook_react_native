import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Text, } from 'react-native';
import { Card, CardItem, Button, Right, Item, Body, } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

class ContratoDetalle extends Component {

	constructor(props) {
		super(props);
		this.route = this.props.nav.routes[this.props.nav.routes.length - 1].routeName;
		this.state = {
			route: this.route,
			contrato: this.route === 'Generar' ? this.props.generar.contrato : this.props.controlar.contrato,
			cultivos: this.route === 'Generar' ? this.props.generar.cultivo : [],
			campo: this.route === 'Generar' ?
				this.props.generar.cultivo && this.props.generar.cultivo.length > 0 ?
					_.map(this.props.generar.cultivo, c => {
						return `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`;
					}).join(', ') : '' : '',
			showContrato: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.route === 'Generar') {
			//if(nextProps.generar.contrato.id !== this.state.contrato.id || (nextProps.generar.cultivo.cultivo_nombre && nextProps.generar.cultivo.cultivo_nombre !== this.state.cultivo) || (nextProps.generar.cultivo.campo_nombre && nextProps.generar.cultivo.campo_nombre !== this.state.campo) || (nextProps.generar.cultivo.temporada_nombre && nextProps.generar.cultivo.temporada_nombre !== this.state.temporada) || (nextProps.generar.cultivo.sup_sembrada && nextProps.generar.cultivo.sup_sembrada !== this.state.sup_sembrada)) {
			if (nextProps.generar.contrato.id !== this.state.contrato.id || !_.isEqual(nextProps.generar.cultivo, this.state.cultivos)) {
				this.setState({
						contrato: nextProps.generar.contrato,
						cultivos: nextProps.generar.cultivo,
						campo: nextProps.generar.cultivo && nextProps.generar.cultivo.length > 0 ?
							_.map(nextProps.generar.cultivo, c => {
								return `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`;
							}).join(', ') : '',
						showContrato: false
					});
			}
		} else if (this.state.route === 'Controlar') {
			if (nextProps.controlar.contrato.id !== this.state.contrato.id) {
				this.setState({
						contrato: nextProps.controlar.contrato,
						showContrato: false
					});
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.route === 'Generar') {
			if (nextProps.generar.contrato.id !== this.state.contrato.id || nextState.cultivo !== this.state.cultivo || nextState.showContrato !== this.state.showContrato || nextState.campo !== this.state.campo || nextState.temporada !== this.state.temporada || nextState.sup_sembrada !== this.state.sup_sembrada) {
					return true;
			}
		} else if (nextState.route === 'Controlar') {
			if (nextProps.controlar.contrato.id !== this.state.contrato.id || nextState.showContrato !== this.state.showContrato) {
					return true;
			}
		}
		return false;
	}

	showContrato() {
		this.setState({ showContrato: !this.state.showContrato });
	}

	render() {
		const contrato = this.state.contrato,
					cultivo = this.state.cultivo,
					campo = this.state.campo,
					temporada = this.state.temporada;
		let styleInfo = {}, icon = '';
		if (!this.state.showContrato) {
			styleInfo = { display: 'none', };
			icon = 'arrow-drop-down';
		} else {
			icon = 'arrow-drop-up';
		}
		return (
			<Card style={stylesApp.detalle.cardContent}>
				<CardItem
					button
					header
					style={stylesApp.detalle.cardHeader}
					onPress={() => this.showContrato()}
				>
					<Item style={stylesApp.detalle.itemHeader} onPress={() => this.showContrato()}>
						<MaterialCommunityIcons name='briefcase' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14} />
						<Text style={stylesApp.detalle.textTitle}> No. {contrato.cto_num}</Text>
					</Item>
					<Right>
						<Button
							transparent
							onPress={() => this.showContrato()}
							style={stylesApp.detalle.botonHeader}
						>
							<MaterialIcons name={icon} color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 25} />
						</Button>
					</Right>
				</CardItem>
				<CardItem style={{ ...stylesApp.detalle.cardBody, ...styleInfo}}>
					<Body>
						<Text style={stylesApp.detalle.textInfo}>
							<Text style={stylesApp.detalle.textInfoTitle}>Agricultor: </Text>{contrato.agricultor_nombre}
						</Text>
						<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
							<Text style={stylesApp.detalle.textInfoTitle}>Rut: </Text>{contrato.agricultor_rut}
						</Text>
						<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
							<Text style={stylesApp.detalle.textInfoTitle}>Ubicación: </Text>{contrato.calle + ' (' + contrato.distrito + ')'}
						</Text>
						{
							campo !== '' ?
								<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
									<Text style={stylesApp.detalle.textInfoTitle}>Potrero: </Text>{campo}
								</Text>
							: null
						}
						<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
							<Text style={stylesApp.detalle.textInfoTitle}>Sucursal: </Text>{contrato.zona_nombre}
						</Text>
					</Body>
				</CardItem>
			</Card>
		);
	}
}

function mapStateToProps(state) {
	return {
		generar: state.generar,
		controlar: state.controlar,
		nav: state.nav,
	};
}

export default connect(mapStateToProps)(ContratoDetalle);
