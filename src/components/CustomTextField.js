import React, { Component } from 'react';

import { Keyboard, TouchableHighlight } from 'react-native';
import { CardItem, Item, Input, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import stylesApp from '../assets/styles';

export default class CustomTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value:  ''
    };
  }

  getState() {
    return this.state.value.trim();
  }

  resetState() {
    this.setState({
      value: ''
    });
  }

	render() {
    const styles = {
      input: {
        fontFamily: stylesApp.fontRegular,
        color: stylesApp.blackSecondary,
        fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14
      },
      cardMensaje: {
        flexDirection: 'row',
        backgroundColor: stylesApp.cardContentColor,
        justifyContent: 'center',
        borderRadius: 0,
        width: '100%',
      }
    };
		const { name, placeholder, onchange, addNew } = this.props;
    const { value } = this.state;
		return (
			<Item>
				<MaterialIcons
					name='apps'
					color={stylesApp.blackSecondary}
					size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
				/>
				<Input
					name={name}
					placeholder={placeholder}
					placeholderTextColor={stylesApp.blackSecondary}
					style={styles.input}
					value={value}
					onChangeText={v => {
            this.setState({
              value: v.replace(/[^a-zA-ZñÑ 0-9]+/g, '')
            });
            if (onchange) onchange(v.trim());
          }}
					onSubmitEditing={Keyboard.dismiss}
				/>
				{ addNew &&
          <TouchableHighlight
            onPress={() => {
              Keyboard.dismiss();
              addNew(this.state.value.trim());
            }}
          >
						<MaterialIcons
							name='add-circle'
							color={stylesApp.blackSecondary}
							size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24}
						/>
					</TouchableHighlight>
        }
			</Item>
		);
	}
}
