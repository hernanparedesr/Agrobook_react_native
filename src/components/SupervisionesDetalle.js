import React, { Component } from 'react';

import moment from 'moment';

import { Text, Alert, TouchableHighlight, View, Image, TouchableWithoutFeedback, Platform } from 'react-native';
import { Card, CardItem, Item, Right, Button, } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import stylesApp from '../assets/styles';

import { MaterialIcons } from '@expo/vector-icons';

import DetalleListTemplate from './DetalleListTemplate';

var Buffer = require('buffer/').Buffer;

class SupervisionesDetalle extends Component {
	constructor(props) {
		super(props);
	}

	renderImages(supervision) {
		let images = [], foto = '';
		if (!this.props.botones) {
			if(supervision.foto1 != 'null' && supervision.foto1.length > 0) {
				foto = Buffer.from(supervision.foto1.toString(), 'binary').toString('base64');
				images.push('data:image/jpg;base64,'+foto);
			}
			if(supervision.foto2 != 'null' && supervision.foto2.length > 0) {
				foto = Buffer.from(supervision.foto2.toString(), 'binary').toString('base64');
				images.push('data:image/jpg;base64,'+foto);
			}
			if(supervision.foto3 != 'null' && supervision.foto3.length > 0) {
				foto = Buffer.from(supervision.foto3.toString(), 'binary').toString('base64');
				images.push('data:image/jpg;base64,'+foto);
			}
		} else {
			if(supervision.foto1 != 'null' && supervision.foto1.length > 0) {
				images.push('data:image/jpg;base64,'+supervision.foto1);
			}
			if(supervision.foto2 != 'null' && supervision.foto2.length > 0) {
				images.push('data:image/jpg;base64,'+supervision.foto2);
			}
			if(supervision.foto3 != 'null' && supervision.foto3.length > 0) {
				images.push('data:image/jpg;base64,'+supervision.foto3);
			}
		}
		this.props.showImages(images);
	}

	render() {
		const supervision = this.props.supervision,
					cultivos_campo_info = _.map(supervision.recomendacion.cultivos_campo, c => {
						return `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`;
					});
		let colorFondo = stylesApp.cardHeaderColor,
				colortexto = stylesApp.blackPrimary,
				texto = 'SUPERVISAR';
		if (supervision.selected){
			colorFondo = stylesApp.colorAzul;
			colortexto = stylesApp.whitePrimary;
			texto = 'SUPERVISANDO';
		}
		let styleInfo = {}, icon = '';
		if(!supervision.selected){
			styleInfo = { backgroundColor: stylesApp.cardContentColor, width: '100%', flexDirection: 'column', display: 'none' };
			icon = 'arrow-drop-down';
		} else {
			styleInfo = { backgroundColor: stylesApp.cardContentColor, width: '100%', flexDirection: 'column' };
			icon = 'arrow-drop-up';
		}
		const avance = supervision.avance === 1 ? 'Logrado' : 'No logrado';
		const styles = {
			col1: { borderRightColor: stylesApp.whitePrimary, borderRightWidth: 1, justifyContent: 'center' },
			col2: { height: 60, borderRightColor: stylesApp.whitePrimary, borderRightWidth: 1, justifyContent: 'center' },
			colText: { fontFamily: stylesApp.fontSemiBold, ...stylesApp.textInfo, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 12 : 10 },
			col2Text: { color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 17 : 15 }
		}
		return (
			<DetalleListTemplate
				onPress={() => this.props.press(supervision)}
				title={` Supervisión (${moment(supervision.fecha).format('DD/MM/YYYY')})`}
				icon={<MaterialIcons
					name='format-list-bulleted'
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
					color={stylesApp.blackSecondary}
				/>}
				right={
					<MaterialIcons
						name={icon}
						onPress={() => this.props.press(supervision)}
						color={stylesApp.blackSecondary}
						size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25}
					/>
				}
				stylesBody={{ flexDirection: 'column', ...styleInfo }}
				stylesCard={{ marginTop: '5%', marginBottom: 0 }}
				stylesHeader={{
					borderTopWidth: 2,
					borderTopColor: supervision.nota_id === 1
						? stylesApp.colorGreen
						: supervision.nota_id === 2
							? stylesApp.colorYellow
							: stylesApp.colorRed,
				}}
			>
				<View style={styleInfo}>
					{
						this.props.botones ?
							<View style={{ width: '100%', flexDirection: 'column', padding: 5, }}>
								<Text style={{ fontFamily: stylesApp.fontBold, color: stylesApp.blackSecondary, textAlign: 'center' }}>
									RECOMENDACIÓN
								</Text>
								<Text style={{...stylesApp.detalle.textInfo, marginTop: Platform.OS === 'ios' ? 8 : '2%' }}>
									<Text style={stylesApp.detalle.textInfoTitle}>Norma: </Text>{supervision.recomendacion.tipo_insumo_nombre}
								</Text>
								<Text style={{...stylesApp.detalle.textInfo, marginTop: Platform.OS === 'ios' ? 8 : '2%' }}>
									<Text style={stylesApp.detalle.textInfoTitle}>Técnico: </Text>{supervision.recomendacion.tecnico_nombre}
								</Text>
								<Text style={{...stylesApp.detalle.textInfo, marginTop: Platform.OS === 'ios' ? 8 : '2%' }}>
									<Text style={stylesApp.detalle.textInfoTitle}>Destinatario: </Text>{supervision.recomendacion.cto_num}
								</Text>
								<Text style={{...stylesApp.detalle.textInfo, marginTop: Platform.OS === 'ios' ? 8 : '2%'}}>
									<Text style={stylesApp.detalle.textInfoTitle}>Potrero: </Text>{cultivos_campo_info.join(', ')}
								</Text>
								{supervision.emails && supervision.emails.length > 0 ?
									supervision.emails[0].emails ?
										<Text style={{ ...stylesApp.detalle.textInfo, marginTop: Platform.OS === 'ios' ? 8 : '2%' }}>
											<Text style={stylesApp.detalle.textInfoTitle}>E-mails: </Text>
											{supervision.emails[0].emails.includes(',') ? supervision.emails[0].emails.replace(/,/g, '\n') : supervision.emails[0].emails}
										</Text>
										: null
									: null
								}
							</View>
						: null
					}
					<Row style={{ padding: 10, backgroundColor: '#F2F2F2' }}>
						<Col style={styles.col1}><Text style={styles.colText}>INICIO DE FAENA</Text></Col>
						<Col style={styles.col1}><Text style={styles.colText}>AVANCE</Text></Col>
						<Col style={{ justifyContent: 'center' }}><Text style={styles.colText}>EVALUACIÓN</Text></Col>
					</Row>
					<Row style={{ padding: 10, }}>
						<Col style={styles.col2}><Text style={styles.col2Text}>{moment(supervision.fecha).format("DD/MM/YYYY")}</Text></Col>
						<Col style={styles.col2}><Text style={styles.col2Text}>{avance}</Text></Col>
						<Col style={{ height: 60, justifyContent: 'center' }}><Text style={styles.col2Text}>{supervision.nota_nombre}</Text></Col>
					</Row>
					<Row style={{ padding: 10, backgroundColor: '#F2F2F2' }}>
						<Col style={styles.col1}><Text style={styles.colText }>OBSERVACIONES</Text></Col>
						<Col style={styles.col1}><Text style={styles.colText}>IMÁGENES</Text></Col>
						<Col style={{ justifyContent: 'center' }}><Text style={styles.colText}>UBICACIÓN</Text></Col>
					</Row>
					<Row style={{ padding: 10, }}>
						<Col style={styles.col2}>
							{supervision.observaciones.length > 15 ?
								<TouchableWithoutFeedback
									onPress={() => this.props.pressObs(supervision)}
								>
									<View><Text style={styles.col2Text}>{supervision.observaciones.substring(0, 5) + ' ...'}</Text></View>
								</TouchableWithoutFeedback>
								: <Text style={styles.col2Text}>{supervision.observaciones}</Text>
							}
						</Col>
						<Col style={{ height: 60, borderRightColor: stylesApp.whitePrimary, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={styles.col2Text}>{supervision.foto1 !== 'null' && supervision.foto1.length > 0 ? supervision.foto2 !== 'null' && supervision.foto2.length > 0 ? supervision.foto3 !== 'null' && supervision.foto3.length > 0 > 0 + ' ' ? 3 + ' ' : 2 + ' ' : 1 + ' ' : 0 + ' '}</Text>
							{
								(supervision.foto1 != 'null' && supervision.foto1.length > 0) || (supervision.foto2 != 'null' && supervision.foto2.length > 0) || (supervision.foto3 != 'null' && supervision.foto3.length > 0) ?
									<Text
										style={{color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: 15}}
										onPress={() => this.renderImages(supervision)}
									>
										Ver imagenes
										<MaterialIcons
											name='camera-alt'
											size={stylesApp.widthWindow > stylesApp.widthTablet ? 20 : 18}
											color={stylesApp.blackSecondary}
											onPress={() => this.renderImages(supervision)}
										/>
									</Text>
								: null
							}
						</Col>
						<Col style={{ height: 60, justifyContent: 'center' }}>
							<Text style={styles.col2Text}>{supervision.en_oficina ? 'Oficina' : `Terreno \n ${supervision.lat.toFixed(2)}, ${supervision.lon.toFixed(2)}, ${supervision.alt.toFixed(2)}`}</Text>
						</Col>
					</Row>
					{this.props.botones ?
						<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', padding: '2%' }}>
							<Button
								style={{
									backgroundColor: stylesApp.colorAzul,
									width: '48%',
									marginRight: Platform.OS === 'ios' ? 8 : '2%',
									justifyContent: 'center',
								}}
								onPress={() => this.props.editar(supervision)}
							>
								<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>EDITAR</Text>
							</Button>
							<Button
								style={{
									backgroundColor: stylesApp.colorAzul,
									width: '48%',
									marginLeft: Platform.OS === 'ios' ? 8 : '2%',
									justifyContent: 'center',
								}}
								onPress={() => this.props.eliminar(supervision)}
							>
								<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>ELIMINAR</Text>
							</Button>
						</View>
					: null
					}
				</View>
			</DetalleListTemplate>
		);
	}
}

export default SupervisionesDetalle;
