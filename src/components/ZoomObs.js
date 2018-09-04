import React, { Component } from 'react';
import moment from 'moment';

import { Text, View, TouchableHighlight, Modal, ScrollView, } from 'react-native';
import { Card, CardItem, Item, Right, } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

class ZoomObs extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal
				animationType={'none'}
				transparent={false}
				visible={this.props.obsZoom ? true : false}
				onRequestClose={() => this.props.closeObs()}
				>
				<FondoTemplate style={{ height: '100%', width: '100%'}}>
					<Card style={{ elevation: 0, backgroundColor: 'transparent', }}>
						<CardItem
							header
							style={{
								backgroundColor: stylesApp.cardHeaderColor,
								paddingTop: 0,
								paddingBottom: 0,
								borderRadius: 0,
								borderTopWidth: 2,
								borderTopColor: this.props.obsZoom.nota_id === 1
									? stylesApp.colorGreen
									: this.props.obsZoom.nota_id === 2
										? stylesApp.colorYellow
										: stylesApp.colorRed,
							}}
						>
							<Item style={{ marginTop: 10, marginBottom: 10 }}>
								<MaterialIcons name='format-list-bulleted' size={14} color={stylesApp.blackSecondary} />
								<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, }}> Supervisión {moment(this.props.obsZoom.fecha).format("DD/MM/YYYY")}</Text>
							</Item>
							<Right style={{flex:1}}>
								<TouchableHighlight onPress={this.props.closeObs}>
									<MaterialCommunityIcons name='close-circle' color='red' size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25} />
								</TouchableHighlight>
							</Right>
						</CardItem>
						<ScrollView>
							<View style={{backgroundColor: stylesApp.cardContentColor, width: '100%', marginBottom: '5%'}}>
									<Text style={{ fontFamily: stylesApp.fontBold, ...stylesApp.textInfo, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16 }}>{'\n'}OBSERVACIONES{'\n'}</Text>
									<Text style={{ fontFamily: stylesApp.fontSemiBold, color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16, paddingLeft: '5%', paddingRight: '5%' }}>{this.props.obsZoom.observaciones}</Text>
							</View>
						</ScrollView>
					</Card>
				</FondoTemplate>
			</Modal>
		);
	}
}

export default ZoomObs;
