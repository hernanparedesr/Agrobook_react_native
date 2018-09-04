import React, { Component } from 'react';

import moment from 'moment';

import { Text, View, Platform, } from 'react-native';
import { Card, CardItem, Button, Right, Item, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

import RecomendacionDetalleInfo from './RecomendacionDetalleInfo';
import SliderImages from './SliderImages';
import DetalleListTemplate from './DetalleListTemplate';

class RecomendacionesDetalleSinc extends Component {

	constructor(props) {
		super(props);
		this.state = {
			recomendacion: this.props.recomendacion,
			showRecomendacion: false,
			photosZoom: false,
			imagesZoom: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.recomendacion !== this.state.recomendacion) {
			this.setState({
				recomendacion: nextProps.recomendacion,
				showRecomendacion: false,
				photosZoom: false,
				imagesZoom: []
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.recomendacion !== this.state.recomendacion || nextState.showRecomendacion !== this.state.showRecomendacion || nextState.photosZoom !== this.state.photosZoom || nextState.imagesZoom !== this.state.imagesZoom) {
			return true;
  	}
    return false;
  }

	showInfo = () => {
		this.setState({ showRecomendacion: !this.state.showRecomendacion });
	}

	showImages(images) {
		if (images.length > 0) {
			this.setState({
				photosZoom: true,
				imagesZoom: images
			});
  	}
	}

	hideImages() {
		this.setState({
			photosZoom: false,
			imagesZoom: []
		});
	}

	render() {
		const recomendacion = this.state.recomendacion;
		const { cultivos_campo } = this.props;
		let styleInfo = {}, icon = '';
		if (this.state.showRecomendacion) {
			styleInfo = { display: 'none' };
			icon = 'arrow-drop-down';
		} else {
			icon = 'arrow-drop-up';
		}
		return (
			<DetalleListTemplate
				onPress={this.showInfo}
				title={` Recomendación (${moment(recomendacion.fecha).format('DD/MM/YYYY')})`}
				icon={<MaterialIcons
					name='announcement'
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14}
					color={stylesApp.blackSecondary}
				/>}
				right={
					<MaterialIcons
						name={icon}
						onPress={this.showInfo}
						color={stylesApp.blackSecondary}
						size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25}
					/>
				}
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
				stylesBody={{ flexDirection: 'column', ...styleInfo }}
				stylesCard={{ marginTop: '5%', marginBottom: 0 }}
			>
				<RecomendacionDetalleInfo
					recomendacion={recomendacion}
					cultivos_campo={cultivos_campo}
					showImages={this.showImages.bind(this)}
					editar={true}
				/>
				<View style={{ backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'row', }}>
					<Button
						style={{
							backgroundColor: stylesApp.colorNaranja,
							width: '48%',
							marginRight: Platform.OS === 'ios' ? 8 : '2%',
							justifyContent: 'center',
						}}
						onPress={() => this.props.editar(recomendacion)}
					>
						<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>EDITAR</Text>
					</Button>
					<Button
						style={{
							backgroundColor: stylesApp.colorNaranja,
							width: '48%',
							marginLeft: Platform.OS === 'ios' ? 8 : '2%',
							justifyContent: 'center',
						}}
						onPress={() => this.props.eliminar(recomendacion)}
					>
						<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>ELIMINAR</Text>
					</Button>
				</View>
				{
					this.state.photosZoom ?
						<SliderImages images={this.state.imagesZoom} hideImages={this.hideImages.bind(this)} photosZoom={this.state.photosZoom} />
					: null
				}
			</DetalleListTemplate>
		);
	}
}

export default RecomendacionesDetalleSinc;
