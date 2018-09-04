import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card, CardItem, } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import stylesApp from '../assets/styles';

import DetalleListTemplate from './DetalleListTemplate';

export default class PotreroDetalle extends Component {

	renderInfo(title, info, marginTop) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>{info}
			</Text>
		);
	}

	render() {
		const campo = this.props.campo;
		let icon = {
		    	icon: 'check-box-outline-blank',
		    	color: stylesApp.blackSecondary,
		    };
		if (campo.selected) {
			icon = {
	    	icon: 'check-box',
	    	color: stylesApp.colorNaranja
	    };
		}

		const styles = {
			col1: {
				justifyContent: 'flex-start',
				alignItems: 'center',
				borderRightWidth: 1,
				borderRightColor: stylesApp.blackDisabled,
				flexDirection: 'row'
			},
			col2: {
				paddingLeft: 10,
				margin: 0,
				justifyContent: 'center',
				alignItems: 'center'
			}
		};

		return (
			<DetalleListTemplate
				title={` ${campo.nombre}`}
				icon={<MaterialIcons
					name='apps'
					color={stylesApp.blackSecondary}
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
				/>}
				right={null}
				left={null}
			>
				<Grid>
					<Col size={90} style={styles.col1}>
						<MaterialIcons
							onPress={() => this.props.pickCampo(campo)}
							name={icon.icon}
							color={icon.color}
							size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
						/>
						<View style={{ marginLeft: 10 }}>
							{this.renderInfo('Cultivo: ', campo.cultivos.length > 0 ? campo.cultivos[0].cultivo_nombre : '', '0%')}
							{this.renderInfo('Temporada: ', campo.cultivos.length > 0 ? campo.cultivos[0].temporada_nombre : '', '2%')}
						</View>
					</Col>
					<Col size={10}
						style={styles.col2}
					>
						<FontAwesome
							name='pencil'
							color={stylesApp.blackSecondary}
							size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
							onPress={() => this.props.editCampo(campo)}
						/>
					</Col>
				</Grid>
			</DetalleListTemplate>
		);
	}
}
