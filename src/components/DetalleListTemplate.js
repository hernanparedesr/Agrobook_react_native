import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, CardItem, Right, Item } from 'native-base';

import stylesApp from '../assets/styles';

class DetalleListTemplate extends Component {
	render() {
		const { icon, title, children, left, right, onPress, stylesBody, stylesCard, stylesHeader } = this.props;
		return (
			<Card style={{ ...styles.card, ...stylesCard }}>
				<CardItem
					header
					style={{ ...styles.cardHeader, ...stylesHeader }}
					onPress={onPress ? () => onPress() : () => {}}
					button={onPress ? true : false}
				>
					{left}
					<Item style={styles.itemHeader} onPress={onPress ? () => onPress() : () => {}}>
						{icon}
						<Text style={styles.textHeader}>
							{title}
						</Text>
						<Right>{right}</Right>
					</Item>
				</CardItem>
				<CardItem style={{ ...styles.cardBody, ...stylesBody }}>
					{children}
				</CardItem>
			</Card>
		);
	}
}

const styles = {
  card: {
    elevation: 0,
    backgroundColor: 'transparent',
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: 0,
    marginBottom: '5%',
    borderWidth: 0,
		flexDirection: 'column',
		flex: 1
  },
	cardHeader: {
		backgroundColor: stylesApp.cardHeaderColor,
		borderRadius: 0,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		paddingRight: 0,
		width: '100%',
	},
	itemHeader: {
		marginTop: 15,
		marginBottom: 15,
		marginLeft: 15,
		marginRight: 15,
		borderBottomWidth: 0,
	},
  textHeader: {
    fontFamily: stylesApp.fontExtraBold,
    color: stylesApp.blackSecondary,
  },
	cardBody: {
		width: '100%',
		backgroundColor: stylesApp.cardContentColor,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15
	},
};

export default DetalleListTemplate;
