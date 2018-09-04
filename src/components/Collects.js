import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import { Keyboard, StyleSheet, Alert, ListView, View, } from 'react-native';
import { Item, Input, Body, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import stylesApp from '../assets/styles';

import CollectsDetalle from './CollectsDetalle';
import FondoTemplate from './FondoTemplate';
import Loading from './Loading';

class Collects extends Component {
	constructor(props) {
		super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
		this.collects = this.props.collects;
		this.state = {
			data: this.ds.cloneWithRows(_.orderBy(this.collects, ['fecha'], ['desc'])),
			filter: '',
			isLoading: false,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state !== nextState) {
			return true;
		}
		return false;
	}

	searchCollect = (info) => {
		const filter = info.toLowerCase();

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? this.collects
      : this.collects.filter(({ fecha, agricultor_nombre, cto_num, potrero, zona, estadoTabla }) => {
				const estado = estadoTabla === 1 ? 'Recomendado' : 'Sin recomendar';
				const fechaNew = moment(new Date(fecha)).format('DD/MM/YYYY H:m');
				return 0 <= agricultor_nombre.toLowerCase().indexOf(filter) ||
        0 <= cto_num.toLowerCase().indexOf(filter) ||
        0 <= potrero.toLowerCase().indexOf(filter) ||
        0 <= zona.toLowerCase().indexOf(filter) ||
        0 <= estado.toLowerCase().indexOf(filter) ||
        0 <= fechaNew.toLowerCase().indexOf(filter);
      });

    this.setState({
    	filter: info,
      data: this.ds.cloneWithRows(_.orderBy(filtered, ['fecha'], ['desc']))
    });
	}

	selectCollect = async (collectSelected) => {
		this.setState({
			isLoading: true
		});
		await this.props.goCollectDetalle(collectSelected);
		this.setState({
			isLoading: false
		});
	}

	renderDetalle = (collect) => {
		return <CollectsDetalle collect={collect} press={this.state.isLoading ? () => {} : this.selectCollect} isLoading={this.state.isLoading} />;
	}

	render() {
		console.log('Collects');
		return (
			<FondoTemplate>
				<View style={{marginRight: '5%', marginLeft: '5%', marginTop: 5, height: 60, justifyContent: 'center'}}>
					<Body>
						<Item>
							<Input
								name="buscar"
								placeholder='Buscar'
								placeholderTextColor={stylesApp.blackSecondary}
								style={StyleSheet.flatten(styles.input)}
								onChangeText={this.searchCollect}
								value={this.state.filter}
								onSubmitEditing={Keyboard.dismiss}
							/>
							<MaterialIcons name='search' color={stylesApp.colorVerde} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} />
						</Item>
					</Body>
				</View>
				<View style={{ height: '85%'}}>
					<ListView
		        dataSource={this.state.data}
		        renderRow={this.renderDetalle}
		        enableEmptySections={true}
		      />
				</View>
				<Loading ref={c => this.Loading = c} />
			</FondoTemplate>
		);
	}
}

const styles = StyleSheet.create({
	inputContainer: {
		//marginTop: stylesApp.heightWindow * 0.05,
		marginRight: stylesApp.widthWindow * 0.05,
		marginLeft: stylesApp.widthWindow * 0.05,
	},
	input: {
		color: stylesApp.blackSecondary,
		fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
		fontFamily: stylesApp.fontRegular,
	},
});

function mapStateToProps(state) {
	return {
		data: state.data,
		cs_recomendaciones: state.cs_recomendaciones,
		collects: state.collects,
		nav: state.nav,
	};
}

const mapDispatchToProps = dispatch => ({
	//goNormas: () => dispatch({ type: 'NORMAS_NAV' }),
	goCollectDetalle: (response) => dispatch({ type: 'COLLECTDETALLE_NAV', payload: { collect: response } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Collects);
