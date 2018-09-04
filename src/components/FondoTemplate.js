import React, { Component } from 'react';

import { Image, View } from 'react-native';
import { Container, } from 'native-base';
import stylesApp from '../assets/styles';

import Logos from './Logos';

class FondoTemplate extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Image source={stylesApp.fondoInterior} style={{ width: '100%', height: '100%' }} >
				<Container>
					<View
						style={{ height: '90%', }}
					>
						{this.props.children}
					</View>
					<View style={{ ...stylesApp.contentCenter, height: '10%' }}>
						<Logos
							tipo='logoAgrobook'
							styles={{
								width: stylesApp.widthWindow * 0.25,
								height: stylesApp.widthWindow * 0.051
							}}
						/>
					</View>
				</Container>
			</Image>
		);
	}
}

export default FondoTemplate;
