import React, { Component } from 'react';

import { View, Image, TouchableHighlight, TouchableOpacity, Modal, } from 'react-native';
import { Right } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';

class SliderImages extends Component {

	constructor(props) {
		super(props);

		this.state = {
			images: this.props.images,
			cantidad: this.props.images.length,
			imagen: 0
		};
	}

	render() {
		return (
			<Modal
				animationType={'slide'}
				transparent={false}
				visible={this.props.photosZoom}
				onRequestClose={() => { this.props.hideImages() }}
			>
				<FondoTemplate style={{ height: '100%', width: '100%'}}>
					<Image
						source={{ uri: this.state.images[this.state.imagen] }}
						resizeMode='stretch'
						style={{ flex: 1 }}
					>
						<View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', }}>
							<TouchableHighlight onPress={() => { this.props.hideImages() }}>
								<MaterialCommunityIcons name='close-circle' color={'red'} size={stylesApp.widthWindow > stylesApp.widthTablet ? 42 : 40} />
							</TouchableHighlight>
						</View>
						{
							this.state.cantidad > 1 ?
							<View style={{ flexDirection: 'row', flex: 1,}}>
								<TouchableOpacity style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-start'}} onPress={() => { this.setState({imagen: this.state.imagen !== 0 ? this.state.imagen - 1 : this.state.cantidad - 1}) }}>
									<MaterialCommunityIcons name='chevron-left' color={stylesApp.colorAzul} size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25} />
								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end'}} onPress={() => { this.setState({imagen: this.state.imagen !== this.state.cantidad - 1 ? this.state.imagen + 1 : 0}) }}>
									<MaterialCommunityIcons name='chevron-right' color={stylesApp.colorAzul} size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25} />
								</TouchableOpacity>
							</View>
							: null
						}
					</Image>
				</FondoTemplate>
			</Modal>
		);
	}
}
export default SliderImages;
