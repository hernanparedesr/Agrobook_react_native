import React, { Component } from 'react';
import _ from 'lodash';

import { Platform, Keyboard } from 'react-native';
import { Picker, } from 'native-base';

import stylesApp from '../assets/styles';

class CustomPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      data: this.props.data
    };
  }

  setNewState(state) {
    this.setState(state);
  }

  resetState() {
    this.setState({
      value: ''
    });
  }

  changeValue = (value) => {
    const { onchange } = this.props;
    if (value !== '') {
      this.setState({
        value
      });
      if (onchange) onchange(value);
    }
    Keyboard.dismiss();
  }

	renderIos(placeholder, value, styles, data) {
		return (
			<Picker
				mode='dropdown'
				iosHeader={placeholder}
				placeholder={placeholder}
				selectedValue={value}
				onValueChange={this.changeValue}
				style={{ width: '100%' }}
				textStyle={styles.text}
				itemTextStyle={styles.text}
			>
				{_.map(_.orderBy(data, ['nombre'], ['asc']), c => {
          if (c.value === 'otro') {
						return <Picker.Item label='Otro' value={c.value} key={c.id} />;
					}
          if (c.value === 'todos') {
						return <Picker.Item label='Todos' value={c.value} key={c.id} />;
					}
					return <Picker.Item label={c.nombre} value={c} key={c.id} />;
				})}
			</Picker>
		);
	}

	renderAndroid(placeholder, value, styles, data) {
		return (
			<Picker
				mode='dropdown'
				placeholder={placeholder}
				selectedValue={value}
				onValueChange={this.changeValue}
				style={{
					width: value !== 'otro' ? '90%' : '95%',
					color: stylesApp.blackSecondary,
				}}
				itemTextStyle={styles.text}
			>
				<Picker.Item label={placeholder} value='' key='0' />
				{_.map(_.orderBy(data, ['nombre'], ['asc']), c => {
            if (c.value === 'otro') {
  						return <Picker.Item label='Otro' value={c.value} key={c.id} />;
  					}
            if (c.value === 'todos') {
  						return <Picker.Item label='Todos' value={c.value} key={c.id} />;
  					}
            return <Picker.Item label={c.nombre} value={c} key={c.id} />;
          }
				)}
			</Picker>
		);
	}

	render() {
		const { placeholder, otro, todos } = this.props;
    const { value, data } = this.state;
		const styles = {
			text: {
				fontFamily: stylesApp.fontRegular,
				color: stylesApp.blackSecondary
			}
		};
    if (otro) {
      const existeOtro = _.find(data, { value: 'otro' });
      if (existeOtro === undefined) data.push({ nombre: 'zzzzzzOtro', value: 'otro', id: '-1' });
    }
    if (todos) {
      const existeTodos = _.find(data, { value: 'todos' });
      if (existeTodos === undefined) data.push({ nombre: 'zzzzzzTodos', value: 'todos', id: '-2' });
    }
		if (Platform.OS === 'ios') {
			return this.renderIos(placeholder, value, styles, data);
		}
		return this.renderAndroid(placeholder, value, styles, data);
	}
}

export default CustomPicker;
