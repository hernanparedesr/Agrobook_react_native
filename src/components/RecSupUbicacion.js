import React, { Component } from 'react';
import _ from 'lodash';

import { Alert, Text, View, TouchableHighlight, } from 'react-native';
import { CardItem, Item, Input, } from 'native-base';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Constants, Location, Permissions } from 'expo';

import stylesApp from './../assets/styles.js';

import Loading from './Loading';

export default class RecSupUbicacion extends Component {
	constructor(props) {
		super(props);

		this.watchID = null;

		this.state = {
			showGPS: this.props.info && this.props.info.lat && this.props.info.lon ? true : false,
			lat: this.props.info && this.props.info.lat ? this.props.info.lat.toString() : '0',
			lon: this.props.info && this.props.info.lon ? this.props.info.lon.toString() : '0',
			alt: this.props.info && this.props.info.alt ? this.props.info.alt.toString() : '0',
			oficina: this.props.info && this.props.info.en_oficina == 0 ? false : true
		};
	}

	getState() {
		if (this.state.oficina)
			return { en_oficina: 1, lat: 0, lon: 0, alt: 0 };
		else
			return {en_oficina: 0, lat: this.state.lat, lon: this.state.lon, alt: this.state.alt};
	}

	activeGPS() {
		console.log(this.state.showGPS);
		this.state.showGPS === false ? this.getPosition() : null;

		this.setState({
			oficina: false,
			showGPS: !this.state.showGPS,
		});
	}

	resetUbicacion() {
    this.setState({
			showGPS: false,
			lat: '0',
			lon: '0',
			alt: '0',
			oficina: true
		});
  }

	async getPosition() {
		//esta en false para que pueda prenderse
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.Loading.showLLoading(true, 'Alerta', 'Permisos de localización denegados', [{ text: 'OK', onPress: null }], false);
			this.setState({
				showGPS: false,
				lat: '0',
				lon: '0',
				alt: '0',
				oficina: true
			});
		} else {
			await Location.getCurrentPositionAsync({enableHighAccuracy: true}).then(location => {
				this.setState({
					lat: ''+location.coords.latitude,
					lon: ''+location.coords.longitude,
					alt: ''+location.coords.altitude,
					oficina: false
				});
			}).catch(error => {
				console.log(error);
				this.setState({
					showGPS: false,
					lat: '0',
					lon: '0',
					alt: '0',
					oficina: true
				});
				this.Loading.showLLoading(true, 'Alerta', 'Encienda el servicio de localización', [{ text: 'OK', onPress: null }], false);
			});
		}
	}

	render() {
		const lat = parseFloat(this.state.lat).toFixed(2).toString(),
					lon = parseFloat(this.state.lon).toFixed(2).toString(),
					alt = parseFloat(this.state.alt).toFixed(2).toString();
		const styles = {
			inputText: {
				fontFamily: stylesApp.fontRegular,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14,
				color: stylesApp.blackSecondary,
				textAlign: 'center'
			},
			textInputLabel: {
				fontFamily: stylesApp.fontSemiBold,
    		color: stylesApp.blackSecondary,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12,
				textAlign: 'center'
			},
			inputSeparetion: {
				width: '25%',
				marginRight: '1%',
			}
		}
		return (
			<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
				<CardItem style={stylesApp.cardHeaderRecomendar}>
					<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>UBICACIÓN ACTUAL:</Text>
				</CardItem>
				<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row',  }}>
					<TouchableHighlight
						style={{ width: '50%', }}
						onPress={() => this.setState({
							showGPS: false,
							lat: '0',
							lon: '0',
							alt: '0',
							oficina: true
						})}
						underlayColor={this.props.color}
					>
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
							<Text><MaterialIcons name='desktop-mac' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} /></Text>
							<Text style={{ fontFamily: stylesApp.fontSemiBold, marginTop: '3%', color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, }}>OFICINA</Text>
							{
								this.state.oficina ?
									<Text><MaterialCommunityIcons name='checkbox-marked-circle-outline' color={this.props.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} /></Text>
								: null
							}
						</View>
					</TouchableHighlight>
					<TouchableHighlight
						style={{ borderLeftWidth: 1, borderLeftColor: stylesApp.blackDisabled, width: '50%', }}
						onPress={() => this.activeGPS()}
						underlayColor={this.props.color}
					>
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
							<Text><MaterialIcons name='gps-fixed' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} /></Text>
							<Text style={{ fontFamily: stylesApp.fontSemiBold, marginTop: '3%', color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, }}>TERRENO</Text>
							{
								!this.state.oficina ?
									<Text><MaterialCommunityIcons name='checkbox-marked-circle-outline' color={this.props.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} /></Text>
								: null
							}
						</View>
					</TouchableHighlight>
				</View>
				{
					!this.state.oficina && this.state.showGPS ?
						<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '3%', marginBottom: '8%', width: '100%'}}>
							<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'}}>
								<Item style={styles.inputSeparetion}>
									<Input
										name="lat"
										placeholder='Latitud'
										placeholderTextColor={stylesApp.blackSecondary}
										style={styles.inputText}
										value={lat}
										onChangeText={lat => this.setState({ lat })}
										disabled
									/>
								</Item>
								<Item style={styles.inputSeparetion}>
									<Input
										name="lon"
										placeholder='Longitud'
										placeholderTextColor={stylesApp.blackSecondary}
										style={styles.inputText}
										value={lon}
										onChangeText={lon => this.setState({ lon })}
										disabled
									/>
								</Item>
								<Item style={styles.inputSeparetion}>
									<Input
										name="alt"
										placeholder='Altitud'
										placeholderTextColor={stylesApp.blackSecondary}
										style={styles.inputText}
										value={alt}
										onChangeText={alt => this.setState({ alt })}
										disabled
									/>
								</Item>
								<MaterialIcons name='create' color={this.props.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} onPress={() => this.getPosition()} />
							</View>
							<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'}}>
								<View style={styles.inputSeparetion}><Text style={styles.textInputLabel}>Latitud</Text></View>
								<View style={styles.inputSeparetion}><Text style={styles.textInputLabel}>Longitud</Text></View>
								<View style={styles.inputSeparetion}><Text style={styles.textInputLabel}>Altitud</Text></View>
								<MaterialIcons name='create' size={stylesApp.widthWindow > stylesApp.widthTablet ? 27 : 25} color={stylesApp.cardContentColor} />
							</View>
						</View>
					: null
				}
				<Loading ref={c => this.Loading = c} />
			</View>
		);
	}
}
