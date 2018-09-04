import React, { Component } from 'react';
import _ from 'lodash';

import { Alert, View, Text, TouchableHighlight } from 'react-native';
import { List, ListItem, Right, } from 'native-base';
import stylesApp from './../assets/styles.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loading from './Loading';

export default class TablaInsumos extends Component {
	constructor(props) {
		super(props);

		this.insumos = this.props.insumos || [];

		this.state = {
			data: this.insumos,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.insumos && nextProps.insumos.length > 0) {
			this.setState({
				data: nextProps.insumos || []
			});
		}
	}

	agregarInsumo(i) {
		this.insumos.push(i);

		this.setState({
			data: this.insumos,
		});
	}

	eliminarInsumo(i) {
		this.Loading.showLoading(true, 'Eliminar', '¿Desea eliminar el insumo ' + i.insumo_nombre + '?', [
			{ text: 'Cancelar', onPress: null },
			{ text: 'Si', onPress: () => {
				this.insumos = _.filter(this.insumos, x => { return x.insumo_nombre !== i.insumo_nombre; });
				this.setState({
					data: this.insumos,
					height: this.insumos.length * 60
				});
				this.props.removeInsumo(i);
				this.Loading.hideLoading();
			} }], false);
	}

	resetTablaInsumos() {
    this.insumos = [];

    this.setState({
      data: this.insumos,
    });
  }

	renderInsumo(i, sectionID, rowID) {
		let styles = {backgroundColor: '#F2F2F2'};
		if (rowID%2 === 0) {
      styles = {backgroundColor: '#DDDDDD'};
    }
		let texto = `${i.dosis.toString().includes('.') || i.dosis.toString().includes(',') ? parseFloat(i.dosis.toString()).toFixed(4) : i.dosis} ${i.unidad_nombre}/ha${i.superficie && i.superficie !== "null" ? ', en ' + i.superficie + ' ha.' : ''}`;
		return (
			<ListItem style={{paddingLeft: '3%', flex: 1, ...styles}}>
				<Text
					style={{ fontFamily: stylesApp.fontRegular, color: stylesApp.blackSecondary, width: !this.props.route ? '92%' : '100%', paddingLeft: '2%', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, }}>
					<Text style={{fontFamily: stylesApp.fontBold, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12 }}>{i.insumo_nombre}</Text> {texto}
				</Text>
				{ !this.props.route ?
					<Right style={{flex:1}}>
						<TouchableHighlight onPress={() => this.eliminarInsumo(i)} underlayColor='#FF0000'>
							<MaterialCommunityIcons name='close-circle' color={stylesApp.colorRed} size={stylesApp.widthWindow > stylesApp.widthTablet ? 22 : 20} />
						</TouchableHighlight>
					</Right>
					: null
				}
			</ListItem>
		);
	}

	render() {
		return (
			<View>
				<List
					style={{ marginLeft: 0, marginRight: 0 }}
					dataArray={this.state.data}
					renderRow={this.renderInsumo.bind(this)}
				/>
				<Loading ref={c => this.Loading = c} />
			</View>
		);
	}
}
