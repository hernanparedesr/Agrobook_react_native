import React, { Component } from 'react';
import { connect } from 'react-redux';

var Buffer = require('buffer/').Buffer;

import { Text, View, } from 'react-native';
import { Card, CardItem, Button, Right, Left, Item, } from 'native-base';
import stylesApp from '../assets/styles';

import RecomendacionDetalleInfo from './RecomendacionDetalleInfo';
import { MaterialIcons } from '@expo/vector-icons';

class RecomendacionDetalle extends Component {

	constructor(props) {
		super(props);
		this.state = {
			recomendacion: this.props.controlar.recomendacion,
			showRecomendacion: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.controlar.recomendacion.id !== this.state.recomendacion.id) {
			this.setState({
				recomendacion: nextProps.controlar.recomendacion,
				showRecomendacion: false
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.controlar.recomendacion.id !== this.state.recomendacion.id || nextState.showRecomendacion !== this.state.showRecomendacion) {
			return true;
  	}
    return false;
  }

	showRecomendacion() {
		this.setState({showRecomendacion: !this.state.showRecomendacion});
	}

	render() {
		const recomendacion = this.state.recomendacion;
		let styleInfo = {}, icon = '';
		if(this.state.showRecomendacion){
			styleInfo = { display: 'none' };
			icon = 'arrow-drop-down';
		} else {
			icon = 'arrow-drop-up';
		}
		return (
			<Card style={stylesApp.detalle.cardContent}>
				<CardItem
					button
					header
					style={{ ...stylesApp.detalle.cardHeader, paddingTop: 0, paddingBottom: 0, paddingLeft: 0 }}
					onPress={() => this.showRecomendacion()}
				>
					<View
						style={{
							backgroundColor: recomendacion.prioridad_nombre === 'Alta' ? stylesApp.colorRed : recomendacion.prioridad_nombre === 'Media' ? stylesApp.colorYellow : stylesApp.colorGreen,
							width: 10,
							height: '100%',
							marginLeft: 0,
							marginRight: 2,
							padding: 0,
						}}
					/>
					<View style={{paddingTop: '3%', paddingBottom: '3%',flexDirection: 'row', flex: 1, }}>
						<Item style={{borderBottomWidth: 0}} onPress={() => this.showRecomendacion()} >
							<MaterialIcons name='announcement' size={stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14} color={stylesApp.blackSecondary} />
							<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontExtraBold, }}> Recomendación ({recomendacion.fecha})</Text>
						</Item>
						<Right style={{ flex: 1 }} >
		          <Button
		          	transparent
		          	onPress={() => this.showRecomendacion()}
		          	style={stylesApp.detalle.botonHeader}
		          >
		            <MaterialIcons name={icon} color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 25} />
		          </Button>
	        	</Right>
					</View>
				</CardItem>
				<CardItem style={{ ...stylesApp.detalle.cardBody, flexDirection: 'column', ...styleInfo }}>
					<RecomendacionDetalleInfo
						recomendacion={recomendacion}
						cultivos_campo={this.props.cultivos_campo}
						showImages={this.props.showImages}
					/>
				</CardItem>
			</Card>
		);
	}
}

function mapStateToProps(state) {
	return {
		controlar: state.controlar,
	};
}

export default connect(mapStateToProps)(RecomendacionDetalle);
