import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import { Card, CardItem, Button, Right, Item, Body, } from 'native-base';
import moment from 'moment';
import stylesApp from '../assets/styles';
import ZoomImage from './ZoomImage';

const Buffer = require('buffer/').Buffer;

class ContratoCollectDetalle extends Component {

	constructor(props) {
		super(props);

		this.state = {
			generar: this.props.generar,
			collect: this.props.collect,
			showCollect: false,
			photoZoom: false,
			imageZoom: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.generar.contrato.id !== this.state.generar.contrato.id || (nextProps.generar.cultivo.campo_nombre && nextProps.generar.cultivo.campo_nombre !== this.state.campo)) {
			this.setState({
					generar: nextProps.generar,
					collect: nextProps.collect,
					showCollect: false,
					photoZoom: false,
					imageZoom: '',
				});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.generar.contrato.id !== this.state.generar.contrato.id || nextProps.generar.cultivo.campo_nombre !== this.state.generar.cultivo.campo || nextState !== this.state) {
				return true;
		}
		return false;
	}

	showCollect() {
		this.setState({ showCollect: !this.state.showCollect });
	}

	ampliarImage(image) {
		if (image) {
			this.setState({
				photoZoom: true,
				imageZoom: image
			});
		}
	}

	renderImage(image) {
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
				<TouchableHighlight onPress={() => this.ampliarImage(foto)}>
					<Image
						source={{ uri: `data:image/jpg;base64,${foto}` }} style={{ width: 80, height: 150 }}
					/>
				</TouchableHighlight>
			</View>
		);
	}

	render() {
		const collect = this.state.collect;
		let styleInfo = {};
		let icon = '';
		if (!this.state.showCollect) {
			styleInfo = { display: 'none', };
			icon = 'arrow-drop-down';
		} else {
			icon = 'arrow-drop-up';
		}
		return (
			<Card style={stylesApp.detalle.cardContent}>
				<CardItem
					header
					button
					style={stylesApp.detalle.cardHeader}
					onPress={() => this.showCollect()}
				>
					<Item style={stylesApp.detalle.itemHeader} onPress={() => this.showCollect()}>
						<Image
							source={stylesApp.logoCollect}
							style={{
								width: stylesApp.widthWindow * 0.25,
								height: stylesApp.widthWindow * 0.05,
							}}
						/>
					</Item>
					<Right>
						<Button
							transparent
							onPress={() => this.showCollect()}
							style={stylesApp.detalle.botonHeader}
						>
							<MaterialIcons name={icon} color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
						</Button>
					</Right>
				</CardItem>
				<CardItem style={{ ...stylesApp.detalle.cardBody, ...styleInfo, flexDirection: 'column', }}>
					<Body>
						<Text style={stylesApp.detalle.textInfo}>
							<Text style={stylesApp.detalle.textInfoTitle}>Fecha: </Text>{moment(collect.fecha).format('DD/MM/YYYY h:mm a')}
						</Text>
						<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
							<Text style={stylesApp.detalle.textInfoTitle}>Realizado por: </Text>{collect.agricultor_nombre} - {collect.agricultor_rut}
						</Text>
						<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
							<Text style={stylesApp.detalle.textInfoTitle}>Nota: </Text>{collect.observacion}
						</Text>
						{
							(collect.foto1 !== 'null' && collect.foto1.length > 0)
							|| (collect.foto2 !== 'null' && collect.foto2.length > 0)
							|| (collect.foto3 !== 'null' && collect.foto3.length > 0) ?
								<View>
									<Text style={{ ...stylesApp.detalle.textInfo, marginTop: '2%' }}>
										<Text style={stylesApp.detalle.textInfoTitle}>Imagenes: </Text>
									</Text>
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											//margin: '5%',
											flexDirection: 'row',
											width: '100%'
										}}
									>
										{
											collect.foto1 !== 'null' && collect.foto1.length > 0 ?
												this.renderImage(collect.foto1)
											: null
										}
										{
											collect.foto2 !== 'null' && collect.foto2.length > 0 ?
												this.renderImage(collect.foto2)
											: null
										}
										{
											collect.foto3 !== 'null' && collect.foto3.length > 0 ?
												this.renderImage(collect.foto3)
											: null
										}
									</View>
								</View>
							: null
						}
					</Body>
				</CardItem>
				{
					this.state.photoZoom ?
						<ZoomImage
							photoZoom={this.state.photoZoom}
							imageZoom={this.state.imageZoom}
							closeImage={() => { this.setState({ photoZoom: false, imageZoom: '' }); }}
						/>
					: null
				}
			</Card>
		);
	}
}

function mapStateToProps(state) {
	return {
		generar: state.generar,
	};
}

export default connect(mapStateToProps)(ContratoCollectDetalle);
