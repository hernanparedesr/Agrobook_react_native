import React, { Component } from 'react';

import { Text, View, } from 'react-native';
import { CardItem, CheckBox, } from 'native-base';
import stylesApp from '../assets/styles';

class RecomendarCheckboxs extends Component {

	constructor(props) {
		super(props);

		this.state = {
			prioridadId: this.props.rec && this.props.rec.prioridad_id ? this.props.rec.prioridad_id : 2,
			prioridadNombre: this.props.rec && this.props.rec.prioridad_id ? this.props.rec.prioridad_nombre : 'Media',
		};
	}

	getState() {
		return { prioridad_id: this.state.prioridadId, prioridad_nombre: this.state.prioridadNombre };
	}

	resetPrioridades() {
    this.setState({
      prioridadId: 2,
			prioridadNombre: 'Media',
    });
  }

	renderCheckBox(texto, id, cond){
		return (
			<View style={{ alignItems: 'center', justifyContent: 'center', width: '33.33%', }}>
				<CheckBox
					checked={cond}
					style={{
						borderColor:
						!cond === true
							? stylesApp.blackSecondary
							: texto === 'Baja'
								? stylesApp.colorGreen
								: texto === 'Media'
									? stylesApp.colorYellow
									: stylesApp.colorRed,
						backgroundColor:
						!cond === true
							? 'transparent'
							: texto === 'Baja'
								? stylesApp.colorGreen
								: texto === 'Media'
									? stylesApp.colorYellow
									: stylesApp.colorRed,
						margin: 0,
						padding: 0,
						left: 0
					}}
					onPress={() => this.setState({ prioridadNombre: texto, prioridadId: id })}
				/>
				<Text style={{ fontFamily: stylesApp.fontRegular, marginTop: '3%', textAlign: 'center', color: stylesApp.blackSecondary }}>{texto}</Text>
			</View>
		);
	}

	render() {
		prioridad = this.state.prioridadNombre;
		return (
			<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
				<CardItem style={{ backgroundColor: '#E4E4E4', justifyContent: 'center', marginTop: 0, marginBottom: '8%', borderRadius: 0 }}>
					<Text style={stylesApp.cardSubTitleSectionText}>PRIORIDAD:</Text>
				</CardItem>
				<View style={{ justifyContent: 'center', flexDirection: 'row', }}>
					{prioridad === 'Baja' ? this.renderCheckBox('Baja', 1, true) : this.renderCheckBox('Baja', 1, false)}
					{prioridad === 'Media' ? this.renderCheckBox('Media', 2, true) : this.renderCheckBox('Media', 2, false)}
					{prioridad === 'Alta' ? this.renderCheckBox('Alta', 3, true) : this.renderCheckBox('Alta', 3, false)}
				</View>
			</View>
		);
	}
}


export default RecomendarCheckboxs;
