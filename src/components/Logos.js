import React from 'react';
import { Image, View } from 'react-native';

import stylesApp from '../assets/styles';

const Logos = (props) => {
	if (props.tipo === 'logoAgrobook') {
		return (
			<Image source={stylesApp.logoAgrobook} style={props.styles} />
		);
	} else if (props.tipo === 'cliente') {
		return (
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					width: stylesApp.widthWindow * 0.26,
					height: stylesApp.widthWindow * 0.26,
					borderRadius: (stylesApp.widthWindow * 0.26) / 2,
					borderWidth: 1,
					borderColor: stylesApp.whitePrimary,
				}}
			>
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						width: stylesApp.widthWindow * 0.24,
						height: stylesApp.widthWindow * 0.24,
						borderRadius: (stylesApp.widthWindow * 0.24) / 2,
						borderWidth: 1,
						borderColor: 'white',
						backgroundColor: 'white',
					}}
				>
					<Image
						source={stylesApp.logoCliente} 
						style={{
							width: stylesApp.widthWindow * 0.2,
							height: stylesApp.heightWindow * 0.08,
						}}
					/>
				</View>
			</View>
		);
	}
	return (
		<Image source={stylesApp.logoAgrosat} style={props.styles} />
	);
};

export default Logos;
