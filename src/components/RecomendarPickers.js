import React, { Component } from 'react';
import _ from 'lodash';

import { Keyboard, Platform, TouchableOpacity, Text, View, } from 'react-native';
import { CardItem, Item, Input, Button, Right, Picker } from 'native-base';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import stylesApp from '../assets/styles';

import FilterPicker from './FilterPicker';
import TablaInsumos from './TablaInsumos';

class RecomendarPickers extends Component {

	constructor(props) {
		super(props);

		let ins = [], insumos = [];
		if(this.props.rec && this.props.rec.insumos2) {
			_.map(this.props.rec.insumos2, ii => {
				const insumo =  _.filter(this.props.insumos, {id: ii.insumo_id});
				if(insumo.length > 0) ins = _.concat(ins, insumo);
			});

			_.map(this.props.insumos, i => {
				if (_.findIndex(this.props.rec.insumos2, ii => { return ii.insumo_id == i.id }) === -1) {
					insumos.push(i);
				}
			});
		} else insumos = this.props.insumos;

		this.state = {
			insumos: insumos,
			visible: false,
			insumo: undefined,
			insumo_id: 0,
			insumo_nombre: '',
			superficie: '',
			dosis: '',
			unidad: {},
			unidad_id: '',
			unidad_nombre: '',
			agregados: this.props.rec && this.props.rec.insumos2 ? this.props.rec.insumos2 : [],
			eliminados: ins,
			changeContrato: this.props.changeContrato,
			changeCultivo: this.props.changeCultivo,
			changeNorma: this.props.changeNorma,
		};
		this.insumosAgregados = this.props.rec && this.props.rec.insumos2 ? this.props.rec.insumos2 : [];
		this.eliminados = ins;
	}

	componentDidMount() {
		if (this.props.rec && this.props.rec.insumos2) {
			_.map(this.props.rec.insumos2, ii => {
				this.tablaInsumos.agregarInsumo(ii);
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.changeNorma !== nextProps.changeNorma || this.state.changeContrato !== nextProps.changeContrato || this.state.changeCultivo !== nextProps.changeCultivo){
			this.insumos = this.state.insumos.concat(this.eliminados);
			this.insumos = _.sortBy(this.insumos, ['id']);
			this.setState({
				insumos: this.insumos,
				visible: false,
				insumo: undefined,
				insumo_id: 0,
				insumo_nombre: '',
				superficie: '',
				dosis: '',
				unidad: {},
				unidad_id: '',
				unidad_nombre: '',
				agregados: [],
				eliminados: [],
				changeContrato: nextProps.changeContrato,
				changeCultivo: nextProps.changeCultivo,
				changeNorma: nextProps.changeNorma,
			});
			this.insumosAgregados = [];
			this.eliminados = [];
			this.tablaInsumos.resetTablaInsumos();
		}
	}

	getState() {
		return this.state.agregados;
	}



	pickerShow = () => {
		this.setState({ visible: true });
	};

	pickerSelect(value) {
		if (value !== '') {
			this.setState({
				visible: false,
				insumo: value,
				insumo_id: value.id,
				insumo_nombre: value.nombre,
				superficie: '',
				dosis: '',
				unidad: {},
				unidad_id: 0,
				unidad_nombre: ''
			});
		}

		//this.tablaInsumos.resetTablaInsumos();
	}

	pickerCancel = () => {
		this.setState({ visible: false });
	};

	agregarInsumo() {
		const i = {
			insumo_id: this.state.insumo_id,
			insumo_nombre: this.state.insumo_nombre,
			superficie: this.state.superficie,
			dosis: this.state.dosis,
			unidad_id: this.state.unidad_id,
			unidad_nombre: this.state.unidad_nombre
		};
		this.insumosAgregados.push(i);
		this.tablaInsumos.agregarInsumo(i);
		let insumos = this.state.insumos;
		const ins = _.find(insumos, { id: i.insumo_id });
		this.eliminados.push(ins);
		_.remove(insumos, { id: i.insumo_id });

		this.setState({
			insumo: undefined,
			insumo_id: 0,
			insumo_nombre: '',
			superficie: '',
			dosis: '',
			unidad: {},
			unidad_id: 0,
			unidad_nombre: '',
			insumos,
			agregados: this.insumosAgregados,
			eliminados: this.eliminados
		});

		Keyboard.dismiss();
	}

	removeInsumo(i) {
    this.insumosAgregados = _.filter(this.insumosAgregados, x => { return x.insumo_nombre !== i.insumo_nombre; });
    let insumos = this.state.insumos.concat(_.find(this.eliminados, { id: i.insumo_id }));
    insumos = _.sortBy(insumos, ['id']);
		this.eliminados = _.filter(this.eliminados, x => { return x.nombre !== i.insumo_nombre; });
		this.setState({
      insumos,
			agregados: this.insumosAgregados,
			eliminados: this.eliminados
    });
  }

	pickerUnidad = (value) => {
		if (value !== '') {
			this.setState({
				unidad: value,
				unidad_id: value.id,
				unidad_nombre: value.nombre
			});
		}
		Keyboard.dismiss();
	}

	renderUnidades() {
		const styles = {
			text: {
				fontFamily: stylesApp.fontRegular,
				color: stylesApp.blackSecondary,
			},
			itemText: {
				fontFamily: stylesApp.fontRegular,
				color: stylesApp.blackSecondary,
			}
		};
		return (
			<View style={{ width: '35%' }}>
				{Platform.OS === 'ios' ?
					<Picker
						iosHeader="UNIDAD"
						mode='dropdown'
						placeholder='UNIDAD'
						selectedValue={this.state.unidad}
						onValueChange={this.pickerUnidad}
						textStyle={{ ...styles.text, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14 }}
						itemTextStyle={styles.itemText}
					>
						{_.map(this.props.unidades, u => {
							return <Picker.Item label={u.nombre} value={u} key={u.id} />;
						})}
					</Picker>
					:
					<Picker
						mode='dropdown'
						placeholder='UNIDAD'
						selectedValue={this.state.unidad}
						onValueChange={this.pickerUnidad}
						style={{ color: stylesApp.blackSecondary, }}
						textStyle={styles.text}
						itemTextStyle={{ ...styles.itemText, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14 }}
					>
						<Picker.Item label='UNIDAD' value='' key='0' />
						{_.map(this.props.unidades, u  => {
							return <Picker.Item label={u.nombre} value={u} key={u.id} />;
						})}
					</Picker>
				}
			</View>
		);
	}

	render() {
		const insumos = this.state.insumos;
		const numero = /^[0-9.,]+$/;
		const styles = {
			textInput: { fontFamily: stylesApp.fontRegular, color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14 }
		};
		return (
			<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
				<CardItem style={stylesApp.cardHeaderRecomendar}>
					<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>SELECCIONE:</Text>
				</CardItem>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '5%',
						marginRight: '5%',
					}}
				>
					{
						insumos.length > 0 ?
							<View style={{
								alignItems:'center',
								justifyContent: 'center',
								flexDirection: 'row',
								width: '100%',
							}}>
								<TouchableOpacity onPress={this.pickerShow} style={{ width: this.state.insumo_id ? '92%' : '100%', flexDirection: 'row' }}>
									<View style={{ width: '95%' }}>
										<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontRegular, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14 }}>
											{this.state.insumo_id > 0 ? this.state.insumo_nombre : 'INSUMOS'}
										</Text>
									</View>
									<View><MaterialIcons name='arrow-drop-down' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 22 : 20} /></View>
				        </TouchableOpacity>
								<FilterPicker
									visible={this.state.visible}
									onSelect={this.pickerSelect.bind(this)}
									onCancel={this.pickerCancel}
									options={insumos}
									selectedOption={this.state.insumo_id}
									placeholderText='INSUMOS'
									placeholderTextColor={stylesApp.blackSecondary}
									cancelButtonText='CANCELAR'
								/>
								{ this.state.insumo_id > 0 ? <MaterialCommunityIcons name='checkbox-marked-circle-outline' color={stylesApp.colorNaranja} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} /> : null }
							</View>
						: null
					}
					{
						insumos.length === 0 ?
							<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontRegular, }}>No hay insumos para seleccionar</Text>
						: null
					}
				</View>
				<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: '8%', marginBottom: '5%', borderRadius: 0 }}>
					<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>DEFINA:</Text>
				</CardItem>
				<View style={{ flexDirection: 'column', justifyContent: 'center', margin: 0, padding: 0 }}>
					<View style={{ flexDirection: 'row', marginRight: '5%', marginLeft: '5%', }}>
						<Item style={{ width: '100%' }}>
							<MaterialIcons name='apps' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
							<Input
								name="superficie"
								placeholder='HECTÁREAS'
								placeholderTextColor={stylesApp.blackSecondary}
								style={styles.textInput}
								value={this.state.superficie}
								onChangeText={superficie => { if (numero.test(superficie)) {this.setState({ superficie }); } else { this.setState({ superficie: this.state.superficie }); } }}
								keyboardType={'numeric'}
								onSubmitEditing={Keyboard.dismiss}
							/>
						</Item>
					</View>
					<View style={{ flexDirection: 'row', marginRight: '5%', marginLeft: '5%', }}>
						<Item>
							<View  style={{ width: '65%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<MaterialCommunityIcons name='flask' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
								<Input
									name="dosis"
									placeholder={!this.state.unidad_nombre ? 'DOSIS' : this.state.unidad_nombre}
									placeholderTextColor={stylesApp.blackSecondary}
									style={styles.textInput}
									value={this.state.dosis}
									onChangeText={dosis => { if (numero.test(dosis)) { this.setState({ dosis }); } else { this.setState({ dosis: this.state.dosis }); } }}
									keyboardType={'numeric'}
									onSubmitEditing={Keyboard.dismiss}
								/>
							</View>
							{this.renderUnidades()}
						</Item>
					</View>
					{this.state.insumo_id > 0 && this.state.unidad_id > 0 && this.state.dosis > 0 ?
							<View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', }}>
								<Button
									full
									onPress={() => this.agregarInsumo()}
									style={{
										elevation: 0,
										marginTop: '3%',
										marginRight: '20%',
										marginLeft: '20%',
										//width: '45%',
										borderRadius: 5,
										backgroundColor: stylesApp.colorNaranja,
									}}
								>
									<Text style={{ color: stylesApp.whitePrimary, fontFamily: stylesApp.fontBold, textAlign: 'center', fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 13 : 11 }}>AGREGAR</Text>
								</Button>
							</View>
						: null
					}
					<View style={{ marginTop: '3%', paddingRight: 20, }}>
						<TablaInsumos removeInsumo={this.removeInsumo.bind(this)} ref={c => this.tablaInsumos = c} />
					</View>
				</View>
			</View>
		);
	}
}

export default RecomendarPickers;
