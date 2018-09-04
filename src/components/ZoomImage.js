import React, { Component } from 'react';
import { View, Image, TouchableHighlight, Modal, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

class ZoomImage extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal
				animationType={'slide'}
				transparent={false}
				visible={this.props.photoZoom}
				onRequestClose={this.props.closeImage}
				>
				<Image
					source={{ uri: 'data:image/jpg;base64,'+this.props.imageZoom }}
					style={{ width: stylesApp.widthWindow, height: stylesApp.heightWindow, }}>
					<View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
						<TouchableHighlight onPress={this.props.closeImage}>
							<MaterialCommunityIcons name='close-circle' color='red' size={stylesApp.widthWindow > stylesApp.widthTablet ? 42 : 40} />
						</TouchableHighlight>
					</View>
				</Image>
			</Modal>
		);
	}
}

export default ZoomImage;
