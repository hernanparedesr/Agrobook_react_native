import React, { Component } from 'react';

import moment from 'moment';

import { Text, TouchableHighlight, View, Image, } from 'react-native';
import { Item, } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import stylesApp from '../assets/styles';

import { MaterialIcons } from '@expo/vector-icons';

import DetalleListTemplate from './DetalleListTemplate';

class RecomendacionesDetalle extends Component {

	renderInfo(title, info, marginTop) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>{info}
			</Text>
		);
	}

	render() {
		const recomendacion = this.props.recomendacion,
					cultivos_campo_info = recomendacion.cultivos_campo;
    let colorFondo = stylesApp.cardHeaderColor,
				colortexto = stylesApp.blackSecondary,
				texto = 'SUPERVISAR',
				adicional = '',
				avance = 'No tiene';
		if (recomendacion.selected){
			colorFondo = stylesApp.colorAzul;
			colortexto = stylesApp.whiteSecondary;
			texto = recomendacion.supervisiones.length > 0 ? 'VIENDO' : 'SUPERVISANDO';
		} else {
			texto = recomendacion.supervisiones.length > 0 ? 'VER' : 'SUPERVISAR';
		}
		if (recomendacion.supervisiones.length > 0) {
			avance = recomendacion.supervisiones[0].avance === 1 ? 'Logrado' : 'No logrado';
			if (recomendacion.supervisiones[0].repeat_task) {
				adicional = 'Repetir recomendación';
			}
    }
		const styles = {
			col1: {
				borderRightWidth: 1,
				borderRightColor: stylesApp.blackDisabled,
				paddingRight: 10,
			},
			col2: {
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 10,
				paddingRight: 0,
				marginRight: 0,
			},
			boton: {
				backgroundColor: colorFondo,
				opacity: 1,
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 4,
			},
			botonText: {
				fontFamily: stylesApp.fontBold,
				marginTop: '2%',
				color: colortexto,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 12 : 10,
				textAlign: 'center',
			}
		};

		return (
			<DetalleListTemplate
				title=' Recomendación'
				icon={<MaterialIcons
					name='announcement'
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
					color={stylesApp.blackSecondary}
				/>}
				right={<Text style={{ fontFamily: stylesApp.fontExtraBold, color: stylesApp.blackSecondary }}>{moment(recomendacion.fecha).format("DD/MM/YYYY")}</Text>}
				left={<Item
					style={{
						backgroundColor: recomendacion.prioridad_nombre === 'Alta' ? stylesApp.colorRed : recomendacion.prioridad_nombre === 'Media' ? stylesApp.colorYellow : stylesApp.colorGreen,
						width: 10,
						height: '100%',
						marginLeft: 0,
						marginRight: 0,
						padding: 0,
						borderBottomWidth: 0
					}}
				></Item>}
			>
				<Grid>
					<Col size={65} style={styles.col1}>
						{this.renderInfo('Técnico: ', recomendacion.tecnico_nombre, '2%')}
						{this.renderInfo('Potrero:: ', cultivos_campo_info.length > 1 ? 'Varios' : cultivos_campo_info.length > 0 ? cultivos_campo_info[0].campo_nombre : '', '2%')}
						{this.renderInfo('Cultivo: ', cultivos_campo_info.length > 1 ? 'Varios' : cultivos_campo_info.length > 0 ? cultivos_campo_info[0].cultivo_nombre : '', '2%')}
						{this.renderInfo('Temporada: ', cultivos_campo_info.length > 1 ? 'Varios' : cultivos_campo_info.length > 0 ? cultivos_campo_info[0].temporada_nombre : '', '2%')}
						{this.renderInfo('Norma: ', recomendacion.tipo_insumo_nombre, '2%')}
						{this.renderInfo('Prioridad: ', recomendacion.prioridad_nombre, '2%')}
						{this.renderInfo('Supervisión: ', avance, '2%')}
						{ adicional !== '' ? this.renderInfo('Información adicional: ', adicional, '2%') : null}
					</Col>
					<Col size={35}
						style={styles.col2}
					>
						<TouchableHighlight
							onPress={this.props.isLoading ? () => {} : () => this.props.press(recomendacion)}
							style={styles.boton}
							underlayColor={stylesApp.colorAzul}
						>
							{
								this.props.isLoading && this.props.activeR === recomendacion.id ?
								<Image
									source={stylesApp.loadingGif}
									style={{
										width: stylesApp.widthWindow * 0.1,
										height: stylesApp.widthWindow * 0.1,
									}}
								/>
								:
								<View style={{ paddingTop: 10, paddingBottom: 10 }}>
									<Text style={{ textAlign: 'center', }}>
										<MaterialIcons
											name='check-circle'
											size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
											color={colortexto}
										/>
									</Text>
									<Text style={styles.botonText}>{texto}</Text>
								</View>
							}
						</TouchableHighlight>
					</Col>
				</Grid>
			</DetalleListTemplate>
		);
	}
}

export default RecomendacionesDetalle;
