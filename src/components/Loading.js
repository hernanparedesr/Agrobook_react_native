import React, { Component } from 'react';
import { View, Image, TouchableHighlight, Modal, Text } from 'react-native';
import { Card, CardItem, Body, Button, } from 'native-base';
import stylesApp from '../assets/styles';

class Loading extends Component {

	constructor(props) {
		super(props);

    this.state = {
      show: false,
			title: '',
			msg: '',
			botones: [],
			cancelable: false
    };
	}

	showLoading = (show, title, msg, botones, cancelable) => {
		this.setState({ show, title, msg, botones, cancelable });
	}

	hideLoading = () => {
		this.setState({
			show: false,
			title: '',
			msg: '',
			botones: [],
			cancelable: false
		});
	}

	render() {
    if (this.state.show) {
			const styles = {
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
					width: stylesApp.widthWindow,
					height: stylesApp.heightWindow,
				},
				cardContainer: {
					width: stylesApp.widthWindow * 0.8,
					backgroundColor: 'white',
			    position: 'absolute',
			    top: stylesApp.widthWindow > stylesApp.widthTablet ? stylesApp.heightWindow * 0.38 : stylesApp.heightWindow * 0.32,
			    left: stylesApp.widthWindow * 0.1,
			    zIndex: 100000,
					flex: 1,
					paddingTop: '5%',
					paddingLeft: '2%',
					flexDirection: 'column'
				},
				header: {
					width: '100%',
				},
				headerText: {
					fontFamily: stylesApp.fontBold,
					fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 20 : 18,
				},
				body: {
					width: '100%',
				},
				bodyText: {
					fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
					fontFamily: stylesApp.fontRegular,
				},
				footer: {
					alignItems: 'center',
					justifyContent: 'flex-end',
					width: '100%',
				},
				footerText: {
					color: stylesApp.blackSecondary,
					fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
					fontFamily: stylesApp.fontRegular,
				}
			};

			return (
				<Modal
					animationType={'fade'}
					transparent
					visible={this.state.show}
					onRequestClose={this.hideLoading}
				>
					<View style={styles.overlay}>
						<Card style={styles.cardContainer}>
							<CardItem style={styles.header}>
								<Text style={styles.headerText}>{this.state.title}</Text>
							</CardItem>
							<CardItem style={styles.body}>
								<Body>
									<Text style={styles.bodyText}>{this.state.msg}</Text>
								</Body>
							</CardItem>
							<CardItem footer style={styles.footer}>
								{
									this.state.botones.length > 0 && !this.state.cancelable ?
										this.state.botones.map((boton, key) => {
											return (
												<Button transparent key={key} onPress={boton.onPress === null ? this.hideLoading : () => boton.onPress()}>
													<Text style={styles.footerText}>{boton.text}</Text>
												</Button>
											);
										})
									: this.state.cancelable ? null
									: null
								}
							</CardItem>
						</Card>
					</View>
				</Modal>
			);
    }
    return null;
	}
}

export default Loading;
