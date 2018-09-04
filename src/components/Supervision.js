import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { Text, View, DatePickerAndroid, Platform } from 'react-native';
import { CardItem, CheckBox, Picker, Item, Button, Right, } from 'native-base';
import { Grid, Col, Row, } from 'react-native-easy-grid';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';

import stylesApp from '../assets/styles';

class Supervision extends Component {

	constructor(props) {
		super(props);
		//console.log(this.props.sup.avance);
		this.state = {
			fecha: this.props.sup && this.props.sup.inicio ? this.props.sup.inicio : '',
			avance: this.props.sup && this.props.sup.avance >= 0 ? this.props.sup.avance : -1,
			repeat_task: this.props.sup && this.props.sup.repeat_task ? this.props.sup.repeat_task == 0 ? false : true : false,
			nota_id: this.props.sup && this.props.sup.nota_id ? this.props.sup.nota_id : 0,
			nota_nombre: this.props.sup && this.props.sup.nota_nombre ? this.props.sup.nota_nombre : '',
		};
	}

	getState() {
		return {
			inicio: this.state.fecha,
			avance: this.state.avance,
			repeat_task: this.state.repeat_task ? 1 : 0,
			nota_id: this.state.nota_id,
			nota_nombre: this.state.nota_nombre,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
    if(nextState === this.state && nextProps.controlar === this.props.controlar) {
    	return false;
  	}
    return true;
  }

	resetSupervision() {
		this.setState({
			fecha: '',
			avance: -1,
			repeat_task: false,
			nota_id: 0,
			nota_nombre: '',
		});
	}

	render() {
		return (
			<View style={{ width: '100%' }}>
				<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
					<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: 0, marginBottom: '5%', borderRadius: 0 }}>
						<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>INICIO DE FAENA:</Text>
					</CardItem>
					<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginLeft: '5%', marginRight: '5%', }}>
						<MaterialCommunityIcons name='calendar' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
						<DatePicker
							style={{ borderWidth: 0 }}
							date={this.state.fecha}
							mode="date"
							placeholder="FECHA"
							format="DD/MM/YYYY"
							//minDate={new Date()}
							//maxDate="2016-06-01"
							confirmBtnText="Ok"
							cancelBtnText="Cancelar"
							showIcon={false}
							customStyles={{
								dateInput: {
									margin: 0,
									padding: 0,
									borderWidth: 0,
								},
								dateText: {
									padding: 0,
									textAlign: 'center',
									color: stylesApp.blackSecondary,
									paddingTop: 0,
									marginTop: 0,
									fontFamily: stylesApp.fontSemiBold,
									fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14
								},
								placeholderText: {
									textAlign: 'center',
									color: stylesApp.blackSecondary,
									paddingTop: 0,
									marginTop: 0,
									fontFamily: stylesApp.fontSemiBold,
									fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14
								}
							}}
							onDateChange={(date) => {this.setState({fecha: date})}}
						/>
					</View>
				</View>
				<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
					<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: '5%', marginBottom: '8%', borderRadius: 0 }}>
						<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>SELECCIONE:</Text>
					</CardItem>
					<Row style={{ marginLeft: '5%', marginRight: '5%', marginTop: 0, marginBottom: '2%' }}>
						<Col style={{ borderRightWidth: 1, borderColor: stylesApp.blackSecondary, paddingRight: '2%' }}>
							{Platform.OS === 'ios' ?
								<Picker
									iosHeader='AVANCE'
									mode='dropdown'
									placeholder='AVANCE'
									selectedValue={this.state.avance}
									onValueChange={a => {
										this.setState({
											avance: a,
										});
									}}
								>
									<Picker.Item label='Logrado' value={1} key='1' />
									<Picker.Item label='No logrado' value={0} key='2' />
								</Picker>
							:
								<Picker
									mode='dropdown'
									placeholder='AVANCE'
									selectedValue={this.state.avance}
									onValueChange={a => {
										this.setState({
											avance: a,
										});
									}}
									style={{
										color: stylesApp.blackSecondary,
									}}
								>
									<Picker.Item label='AVANCE' value={-1} key='0' />
									<Picker.Item label='Logrado' value={1} key='1' />
									<Picker.Item label='No logrado' value={0} key='2' />
								</Picker>
							}
						</Col>
						<Col style={{ paddingLeft: '2%' }}>
							{Platform.OS === 'ios' ?
								<Picker
									iosHeader='PONDERAR'
									mode='dropdown'
									placeholder='PONDERAR'
									selectedValue={this.state.nota_id}
									onValueChange={n => {
										this.setState({
											nota_id: n,
											nota_nombre: n === 1 ? 'Malo' : n === 2 ? 'Regular' : 'Bueno'
										});
									}}
								>
									<Picker.Item label='Malo' value={1} key='1' />
									<Picker.Item label='Regular' value={2} key='2' />
									<Picker.Item label='Bueno' value={3} key='3' />
								</Picker>
							:
								<Picker
									mode='dropdown'
									placeholder='PONDERAR'
									selectedValue={this.state.nota_id}
									onValueChange={n => {
										this.setState({
											nota_id: n,
											nota_nombre: n === 1 ? 'Malo' : n === 2 ? 'Regular' : 'Bueno'
										});
									}}
									style={{
										color: stylesApp.blackSecondary,
									}}
								>
									<Picker.Item label='PONDERAR' value={0} key='0' />
									<Picker.Item label='Malo' value={1} key='1' />
									<Picker.Item label='Regular' value={2} key='2' />
									<Picker.Item label='Bueno' value={3} key='3' />
								</Picker>
							}
						</Col>
					</Row>
				</View>
				{
					this.state.nota_id === 1 ?
						<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
							<Row style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%', }}>
								<CheckBox
									checked={this.state.repeat_task}
									style={{
										borderColor:
										!this.state.repeat_task === true
											? stylesApp.blackSecondary
											: stylesApp.colorAzul,
										backgroundColor:
										!this.state.repeat_task === true
											? 'transparent'
											: stylesApp.colorAzul,
										margin: 0,
										padding: 0,
										//marginLeft: '-20%',
									}}
									onPress={() => this.setState({repeat_task: !this.state.repeat_task})}
								/>
								<Text style={{ fontFamily: stylesApp.fontSemiBold, marginLeft: '5%', textAlign: 'center', color: stylesApp.blackSecondary }}>Repetir recomendación</Text>
							</Row>
						</View>
					: null
				}
			</View>

		);
	}
}

export default Supervision;
