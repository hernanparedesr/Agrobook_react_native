import React, { Component } from 'react';

import { Text, TouchableHighlight, View, Image, } from 'react-native';
import { Grid, Col } from 'react-native-easy-grid';
import stylesApp from '../assets/styles';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import DetalleListTemplate from './DetalleListTemplate';

class ContratosDetalle extends Component {
	renderInfo(title, info, marginTop) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>{info}
			</Text>
		);
	}

	render() {
		const contrato = this.props.contrato;
		let colorFondo = stylesApp.cardHeaderColor,
				colortexto = stylesApp.blackSecondary,
				texto = 'Seleccionar destinatario';
		if (contrato.selected){
			colorFondo = this.props.route === 'Generar' ? stylesApp.colorNaranja : stylesApp.colorAzul;
			colortexto = stylesApp.whiteSecondary;
			texto = 'Destinatario Seleccionado';
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
				title={` No. ${contrato.cto_num}`}
				icon={<MaterialCommunityIcons
					name='briefcase'
					color={stylesApp.blackSecondary}
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
				/>}
				right={null}
				left={null}
			>
				<Grid>
					<Col size={70} style={styles.col1}>
						{this.renderInfo('Cliente: ', contrato.agricultor_nombre, '0%')}
						{this.renderInfo('Rut: ', contrato.agricultor_rut, '2%')}
						{this.renderInfo('Ubicación: ', contrato.calle + ' (' + contrato.distrito + ')', '2%')}
						{this.renderInfo('Sucursal: ', contrato.zona_nombre, '2%')}
					</Col>
					<Col size={30}
						style={styles.col2}
					>
						<TouchableHighlight
							onPress={this.props.isLoading ? () => {} : () => this.props.press(contrato)}
							style={styles.boton}
							underlayColor={this.props.route === 'Generar' ? stylesApp.colorNaranja : stylesApp.colorAzul}
						>
							{
								this.props.isLoading && this.props.activeC === contrato.id ?
								<Image
									source={stylesApp.loadingGif}
									style={{
										width: stylesApp.widthWindow * 0.08,
										height: stylesApp.widthWindow * 0.08,
									}}
								/>
								:
								<View>
									<Text style={{ textAlign: 'center', }}>
										<MaterialIcons name='check-circle' color={colortexto} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
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

export default ContratosDetalle;
