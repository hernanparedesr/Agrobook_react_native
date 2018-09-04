import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { CardItem, } from 'native-base';
import { MaterialIcons, } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

import IconCustom from './IconCustom';

class HomeBotones extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<CardItem style={stylesApp.cardItemButton} button
				onPress={this.props.isLoading ? () => {} : this.props.press }
			>
			{
				this.props.isLoading && this.props.actionLoading === this.props.action ?
					<Image
						source={stylesApp.loadingGif}
						style={{
							width: stylesApp.widthWindow * 0.08,
							height: stylesApp.widthWindow * 0.08,
						}}
					/>
				:
					<View style={{ alignItems: 'center', }}>
						{
							this.props.action === 'sync' ?
								<IconCustom
									name={this.props.icon}
									size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
									color={stylesApp.blackSecondary}
								/>
							:
								<MaterialIcons
									name={this.props.icon}
									size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
									color={stylesApp.blackSecondary}
								/>
						}
						<Text style={{ fontFamily: stylesApp.fontBold, marginTop: '3%', color: stylesApp.blackDisabled, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>{this.props.texto}</Text>
					</View>
			}
			</CardItem>
		);
	}
}

export default HomeBotones;
