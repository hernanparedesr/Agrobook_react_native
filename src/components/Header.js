import React, { Component } from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import stylesApp from '../assets/styles';

import HomeBoton from '../components/HomeBoton';

class Header extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<View style={{height: 24, backgroundColor: stylesApp.blackSecondary}} />
				<View style={styles.header}>
					<View style={{ paddingLeft: '15%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={styles.titleHeader}>{this.props.title}</Text>
					</View>
					<View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end'}}>
						<HomeBoton />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  header: {
		paddingRight: 15,
		paddingLeft: 15,
		backgroundColor: stylesApp.blackSecondary,
		borderBottomColor: stylesApp.blackSecondary,
		flexDirection: 'row',
		height: 68,
		/*...Platform.select({
      ios: {
        height: 60,
      },
      android: {
        height: 60,
      },
    }),*/
		elevation: 0,
	},
	titleHeader: {
		fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14,
		color: stylesApp.whiteSecondary,
		fontFamily: stylesApp.fontSemiBold,
	}
});

export default  Header;
