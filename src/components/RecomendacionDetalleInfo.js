import React, { Component } from 'react';

const Buffer = require('buffer/').Buffer;

import { Text, View, Platform } from 'react-native';
import { Body, } from 'native-base';
import stylesApp from '../assets/styles';

import { MaterialIcons } from '@expo/vector-icons';

import TablaInsumos from './TablaInsumos';

class RecomendacionDetalleInfo extends Component {

	constructor(props) {
		super(props);
	}

	renderInfo(title, info, marginTop, recomendacion = null) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>
				{info}
				{title === 'Imágenes: ' ?
					info !== 0 ?
						<MaterialIcons name='camera-alt' size={stylesApp.widthWindow > stylesApp.widthTablet ? 25 : 23} color={stylesApp.blackSecondary} onPress={() => this.renderImages(recomendacion)} />
					: null
				: null}
			</Text>
		);
	}

	renderImages(recomendacion) {
		let images = [], foto = '';
		if (this.props.editar) {
			if (recomendacion.foto1 != 'null' && recomendacion.foto1.length > 0) {
				images.push(`data:image/jpg;base64,${recomendacion.foto1}`);
			}
			if (recomendacion.foto2 != 'null' && recomendacion.foto2.length > 0) {
				images.push(`data:image/jpg;base64,${recomendacion.foto2}`);
			}
			if (recomendacion.foto3 != 'null' && recomendacion.foto3.length > 0) {
				images.push(`data:image/jpg;base64,${recomendacion.foto3}`);
			}
		} else {
			if (recomendacion.foto1 != 'null' && recomendacion.foto1.length > 0) {
				foto = Buffer.from(recomendacion.foto1.toString(), 'binary').toString('base64');
				images.push(`data:image/jpg;base64,${foto}`);
			}
			if (recomendacion.foto2 != 'null' && recomendacion.foto2.length > 0) {
				foto = Buffer.from(recomendacion.foto2.toString(), 'binary').toString('base64');
				images.push(`data:image/jpg;base64,${foto}`);
			}
			if (recomendacion.foto3 != 'null' && recomendacion.foto3.length > 0) {
				foto = Buffer.from(recomendacion.foto3.toString(), 'binary').toString('base64');
				images.push(`data:image/jpg;base64,${foto}`);
			}
		}
		this.props.showImages(images);
	}

	render() {
		const recomendacion = this.props.recomendacion,
					insumos = recomendacion.insumos,
					cultivos_campo_ids = recomendacion.rec_cultivos_campo_ids.split(',');
		let cultivos_campo_info = [];
		if (cultivos_campo_ids.length > 0 && this.props.cultivos_campo && this.props.cultivos_campo.length > 0) {
			_.map(cultivos_campo_ids, ccid => {
				if (parseInt(ccid) > 0) {
					const cc_info = _.find(this.props.cultivos_campo, { id: parseInt(ccid) });
					if (cc_info !== null && cc_info !== undefined) {
						cultivos_campo_info.push(`${cc_info.campo_nombre} (${cc_info.cultivo_nombre} - ${cc_info.temporada_nombre})`);
					}
				}
			});
		} else if (recomendacion.cultivos_campo && recomendacion.cultivos_campo.length > 0) {
			cultivos_campo_info = _.map(recomendacion.cultivos_campo, c => {
				return `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`;
			});
		}
		let cto_num = undefined;
		if (recomendacion.cto_num) {
			cto_num = recomendacion.cto_num;
		}
    let adicional = '', avance = 'No tiene';
    if (recomendacion.supervisiones.length > 0) {
			if (recomendacion.supervisiones[0].repeat_task) adicional = 'Repetir recomendación';
			if (recomendacion.supervisiones[0].avance === 1) avance = 'Logrado';
			else avance = 'No logrado';
    }
		return (
			<View style={{ margin: 0, padding: 0, width: '100%' }}>
				<View style={{ ...stylesApp.contentCenter, marginBottom: 10 }}>
					<Text style={{ ...stylesApp.detalle.textInfoTitle, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 22 : 20 }}>
						{recomendacion.tipo_insumo_nombre}
					</Text>
				</View>
				<View style={{ width: '100%', flexDirection: 'column', marginBottom: Platform.OS === 'ios' ? 5 : 20 }}>
					{this.renderInfo('Técnico: ', recomendacion.tecnico_nombre, '0%')}
					{cto_num ? this.renderInfo('Destinatario: ', cto_num, '2%') : null}
					{this.renderInfo('Potrero: ', cultivos_campo_info.join(', '), '2%')}
					{this.renderInfo('Prioridad: ', recomendacion.prioridad_nombre, '2%')}
					{this.renderInfo('Supervisión: ', avance, '2%')}
					{this.renderInfo('Notas: ', recomendacion.notas, '2%')}
					{adicional !== '' ? this.renderInfo('Información adicional: ', adicional, '2%') : null}
					{this.renderInfo('Imágenes: ', recomendacion.foto1 != 'null' && recomendacion.foto1.length > 0 ?
						recomendacion.foto2 != 'null' && recomendacion.foto2.length > 0 ?
							recomendacion.foto3 != 'null' && recomendacion.foto3.length > 0 ? '3 - ver imágenes '
							: '2 - ver imágenes '
						: '1 - ver imágenes '
					: 0, '2%', recomendacion)}
					{
						recomendacion.emails && recomendacion.emails.length > 0 ?
							recomendacion.emails[0].emails ?
								this.renderInfo('E-mails: ', recomendacion.emails[0].emails.includes(',') ? recomendacion.emails[0].emails.replace(/,/g, '\n') : recomendacion.emails[0].emails, '2%')
							: null
						: null
					}
				</View>
				{
					insumos.length > 0 ?
					<View style={{ width: '100%', marginBottom: 20, marginRight: 0, marginLeft: -5 }}>
						<TablaInsumos insumos={insumos} route='controlar' />
					</View>
					: null
				}
			</View>
		);
	}
}

export default RecomendacionDetalleInfo;
