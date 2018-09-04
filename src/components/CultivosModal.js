import React, { Component } from 'react';
import { Text, Modal, View, ScrollView, Platform } from 'react-native';
import { Card, CardItem, Button } from 'native-base';
import stylesApp from '../assets/styles';

import FondoTemplate from './FondoTemplate';
import CustomPicker from './CustomPicker';
import CustomTextField from './CustomTextField';
import KeyboardSpacer from './KeyboardSpacer';

import { MaterialCommunityIcons } from '@expo/vector-icons';

class CultivosModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			campo: ''
		};
	}

	render() {
		const { visible, closeModal, addNewRelacion, campo, cultivo, pickRubro, setDataCultivosGenerales, pickCultivoGeneral, showNewCultivo, newCultivo, temporadas, pickTemporada } = this.props;
		let marginTopAdd = 0;
		if (campo.id === undefined) marginTopAdd = 0.08;
		const marginTop = showNewCultivo ?
			stylesApp.heightWindow * (0.18 - marginTopAdd) :
		cultivo.tipo_cultivo_id && cultivo.tipo_cultivo_id > 0 ?
			stylesApp.heightWindow * (0.28 - marginTopAdd) :
		stylesApp.heightWindow * (0.34 - marginTopAdd);
		const styles = {
			overlay: {
				backgroundColor: 'rgba(0,0,0,0.5)',
				width: stylesApp.widthWindow,
				height: stylesApp.heightWindow,
			},
			footer: {
				borderRadius: 0,
				alignItems: 'center',
				justifyContent: 'flex-end',
				width: '100%',
			},
			footerText: {
				color: stylesApp.blackSecondary,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
				fontFamily: stylesApp.fontRegular,
			},
			card: {
				...stylesApp.cardContainer,
				top: /*stylesApp.heightWindow * 0.2,*/marginTop,
				zIndex: 100000,
				flex: 1,
				position: 'absolute',
			},
			cardContent: {
				paddingTop: 0,
				marginTop: 0,
				paddingBottom: 0,
				marginBottom: 0,
			}
		};

		return (
			<Modal
				animationType={'fade'}
				transparent
				visible={visible}
				onRequestClose={() => closeModal()}
			>
				<View style={styles.overlay}>
					<Card
						style={styles.card}
					>
						<CardItem style={stylesApp.cardSubTitleSection}>
							<Text style={stylesApp.cardSubTitleSectionText}>DEFINA:</Text>
						</CardItem>
						<View>
									{
										campo.id === undefined &&
										<CardItem style={{ ...stylesApp.cardContent, ...styles.cardContent, paddingLeft: '8%', paddingRight: '8%' }}>
											<CustomTextField
												ref={c => this.inputCampo = c}
												name='inputCampo'
												placeholder='NUEVO POTRERO'
												onchange={(v) => {
													this.setState({
														campo: v
													});
												}}
												addNew={null}
												width='100%'
											/>
										</CardItem>
									}
									<CardItem style={{ ...stylesApp.cardContent, ...styles.cardContent }}>
										<CustomPicker
											ref={c => this.pickerRubro = c}
											name='pickerRubro'
											placeholder='RUBROS'
											data={[{
												id: 1,
												nombre: 'Pradera y Forrajera'
											}, {
												id: 2,
												nombre: 'Cultivo'
											}, {
												id: 3,
												nombre: 'Frutal'
											}]}
											onchange={pickRubro}
											otro={false}
											todos={false}
										/>
										{
											cultivo.tipo_cultivo_id && cultivo.tipo_cultivo_id > 0 &&
											<MaterialCommunityIcons
												name='checkbox-marked-circle-outline'
												color={stylesApp.colorNaranja}
												size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
											/>
										}
									</CardItem>
									{
										cultivo.tipo_cultivo_id && cultivo.tipo_cultivo_id > 0 &&
										<CardItem style={{ ...stylesApp.cardContent, ...styles.cardContent }}>
											<CustomPicker
												ref={c => this.pickerCultivoGeneral = c}
												name='pickerCultivoGeneral'
												placeholder='CULTIVOS'
												data={setDataCultivosGenerales(cultivo.tipo_cultivo_id)}
												onchange={pickCultivoGeneral}
												otro={true}
												todos={false}
											/>
											{
												cultivo.cultivo_id && cultivo.cultivo_id > 0 &&
												<MaterialCommunityIcons
													name='checkbox-marked-circle-outline'
													color={stylesApp.colorNaranja}
													size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
												/>
											}
										</CardItem>
									}
									{
										showNewCultivo &&
										<CardItem style={{ ...stylesApp.cardContent, ...styles.cardContent, paddingLeft: '8%', paddingRight: '8%' }}>
											<CustomTextField
												ref={c => this.inputCultivo = c}
												name='inputCultivo'
												placeholder='NUEVO CULTIVO'
												onchange={newCultivo}
												addNew={null}
											/>
										</CardItem>
									}
									{
										(cultivo.tipo_cultivo_id > 0) &&
										<CardItem style={{ ...stylesApp.cardContent, ...styles.cardContent }}>
											<CustomPicker
												ref={c => this.pickerTemporada = c}
												name='pickerTemporada'
												placeholder='TEMPORADAS'
												data={temporadas}
												onchange={pickTemporada}
												otro={false}
												todos={false}
											/>
											{
												cultivo.temporada_id && cultivo.temporada_id > 0 &&
												<MaterialCommunityIcons
													name='checkbox-marked-circle-outline'
													color={stylesApp.colorNaranja}
													size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22}
												/>
											}
										</CardItem>
									}
						</View>
						<CardItem footer style={styles.footer}>
							<Button transparent onPress={() => closeModal()}>
								<Text style={styles.footerText}>Cancelar</Text>
							</Button>
							{
								(campo.id !== undefined || (campo.id === undefined && this.state.campo !== '')) && cultivo.tipo_cultivo_id && cultivo.cultivo_nombre && cultivo.temporada_id &&
								<Button transparent onPress={() => addNewRelacion(campo)}>
									<Text style={styles.footerText}>Aceptar</Text>
								</Button>
						}
						</CardItem>
					</Card>
				</View>
			</Modal>

		);
	}
}

export default CultivosModal;
