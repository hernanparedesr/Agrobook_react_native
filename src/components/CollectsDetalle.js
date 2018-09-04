import React, { Component } from 'react';
import moment from 'moment';

import { Text, TouchableHighlight, View, Image, } from 'react-native';
import { Grid, Col } from 'react-native-easy-grid';
import stylesApp from '../assets/styles';
import { MaterialIcons } from '@expo/vector-icons';

import DetalleListTemplate from './DetalleListTemplate';

class CollectsDetalle extends Component {

	renderInfo(title, info, marginTop) {
		return (
			<Text style={{ fontFamily: stylesApp.fontRegular, ...stylesApp.textInfo, marginTop }}>
				<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo }}>{title} </Text>{info}
			</Text>
		);
	}

	render() {
		const collect = this.props.collect;
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
				backgroundColor: stylesApp.cardHeaderColor,
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
				color: stylesApp.blackSecondary,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 12 : 10,
				textAlign: 'center',
			}
		};
		return (
			<DetalleListTemplate
				title={` No. ${collect.cto_num}`}
				icon={<MaterialIcons
					name='folder'
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
					color={stylesApp.blackSecondary}
				/>}
				left={null}
				right={<Text style={{ fontFamily: stylesApp.fontExtraBold, color: stylesApp.blackSecondary }}>{ moment(new Date(collect.fecha)).format('DD/MM/YYYY H:mm')}</Text>}
			>
				<Grid>
					<Col size={70} style={styles.col1}>
						{this.renderInfo('Agricultor: ', collect.agricultor_nombre, '0%')}
						{this.renderInfo('Potrero: ', collect.potrero, '2%')}
						{this.renderInfo('Sucursal: ', collect.zona, '2%')}
						{this.renderInfo('Estado: ', collect.estadoTabla === 1 ? 'Recomendado' : 'Sin recomendar', '2%')}
					</Col>
					<Col size={30}
						style={styles.col2}
					>
						<TouchableHighlight
							onPress={this.props.isLoading ? () => {} : () => this.props.press(collect)}
							style={styles.boton}
							underlayColor={stylesApp.colorVerde}
						>
							{
								this.props.isLoading && this.props.active === collect.id ?
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
										<MaterialIcons name='check-circle' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
									</Text>
									<Text style={styles.botonText}>Ver detalle</Text>
								</View>
							}
						</TouchableHighlight>
					</Col>
				</Grid>
			</DetalleListTemplate>
		);
	}
}

export default CollectsDetalle;
