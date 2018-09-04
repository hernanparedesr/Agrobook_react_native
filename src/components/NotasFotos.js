import React, { Component } from 'react';
import _ from 'lodash';

import { Keyboard, Platform, Alert, Text, View, TouchableHighlight, Image, } from 'react-native';
import { CardItem, Item, Input, Button, } from 'native-base';

import CameraPhotos from './CameraPhotos';

import stylesApp from './../assets/styles.js';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';


export default class NotasFotos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addNota: false,
			notas: this.props.info && this.props.info.notas ? this.props.info.notas : '',
			notasZoom: '',
			addPhoto: this.props.info && this.props.info.images && this.props.info.images.length > 0 ? true : false,
			images: this.props.info && this.props.info.images ? this.props.info.images : [],
		};
	}

  getImages() {
		const {show, images} = this.camaraComp.getState();
		this.setState({
			addPhoto: show,
			images: images
		});
	}

	getState() {
		return {
			notas: this.state.notas,
			...this.camaraComp.getState2(),
		};
	}

	resetNotasFotos() {
    this.setState({
			addNota: false,
			notas: '',
			notasZoom: '',
			addPhoto: false,
			images: [],
		});

		this.camaraComp.resetCamara();
  }

	renderImage(image) {
		return (
			<View style={{ width: '30%', backgroundColor: 'transparent', borderRadius: 2, justifyContent: 'center', alignItems: 'center',}}>
				<TouchableHighlight onPress={() => this.props.ampliarImage(image.base64)}>
					<Image source={{ uri: 'data:image/jpg;base64,'+image.base64 }} style={{ width: 80, height: 150 }}>
						<View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
							<TouchableHighlight onPress={() => this.camaraComp.deleteImage(image, true)}>
								<MaterialCommunityIcons name='close-circle' color='red' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
							</TouchableHighlight>
						</View>
					</Image>
				</TouchableHighlight>
			</View>
		);
	}

	render() {
		const { images, addPhoto } = this.state;
		let nombre = '', input = '';
		if(this.props.route === 'controlar') {
			nombre = 'OBSERVACIÓN';
			input = 'Observaciones';
		} else {
			nombre = 'NOTA';
			input = 'Notas';
		}
		return (
			<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
				<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: '6%', marginBottom: '8%', borderRadius: 0 }}>
					<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>ADJUNTE:</Text>
				</CardItem>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
					<CameraPhotos ref={c => this.camaraComp = c} getImages={() => this.getImages()} color={this.props.color} images={this.state.images}/>
					<TouchableHighlight
						style={{ borderLeftWidth: 1, borderLeftColor: stylesApp.blackDisabled, width: '50%', }}
						onPress={() => this.setState({addNota: !this.state.addNota})}
						underlayColor={this.props.color}
					>
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
							<Text><MaterialIcons name='note-add' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={stylesApp.blackSecondary} /></Text>
							<Text style={{ fontFamily: stylesApp.fontSemiBold, marginTop: '3%', color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, }}>{nombre}</Text>
							{
								this.state.notas.length > 0 && !this.state.addNota ?
									<Text><MaterialCommunityIcons name='checkbox-marked-circle-outline' color={this.props.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} /></Text>
								: null
							}
						</View>
					</TouchableHighlight>
				</View>
				{
					this.state.addNota ?
						<View style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginLeft: 15,
							marginRight: 15,
							marginTop: '5%'
						}}>
							<Item style={{ width: '100%', paddingRight: '2%', backgroundColor: '#E4E4E4', borderRadius: 2 }}>
								<MaterialIcons name='insert-drive-file' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} style={{paddingLeft: 15 }} />
								<Input
									name="notas"
									placeholder={input}
									placeholderTextColor={stylesApp.blackSecondary}
									style={{ fontFamily: stylesApp.fontRegular, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14, color: stylesApp.blackSecondary, }}
									value={this.state.notas}
									onChangeText={notas => this.setState({ notas })}
									multiline={Platform.OS === 'android' ? true : null}
									numberOfLines={Platform.OS === 'android' ? 6 : null}
									blurOnSubmit={false}
								/>
							</Item>
							{ this.state.notas.length > 0 ?
								<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%', marginTop: '5%'}}>
									<Button
										name='checkmark-circle'
										style={{ backgroundColor: this.props.color, width: '45%', marginRight: '2%', justifyContent: 'center' }}
										onPress={() => {
											Keyboard.dismiss();
											this.setState({ addNota: false });
										}}
									>
										<Text style={{ fontFamily: stylesApp.fontBold, textAlign: 'center', color: stylesApp.whiteSecondary }}>Guardar</Text>
									</Button>
									<Button
										name='close-circle'
										style={{ backgroundColor: this.props.color, width: '45%', marginLeft: '2%', justifyContent: 'center' }}
										onPress={() => {
											Keyboard.dismiss();
											this.setState({ notas: '' });
										}}
									>
										<Text style={{ fontFamily: stylesApp.fontBold, textAlign: 'center', color: stylesApp.whiteSecondary }}>Borrar</Text>
									</Button>
								</View>
							: null }
						</View>
					: null
				}
				{
					addPhoto && images.length > 0 ?
						<View style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginLeft: 15,
							marginRight: 15,
							marginTop: '5%',
							flexDirection: 'row'
						}}>
							{
								images[0] ?
									this.renderImage(images[0])
								: null
							}
							{
								images[1] ?
									this.renderImage(images[1])
								: null
							}
							{
								images[2] ?
									this.renderImage(images[2])
								: null
							}
						</View>
					: null
				}
			</View>
		);
	}
}
