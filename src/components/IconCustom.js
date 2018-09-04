import React, { Component } from 'react';
import { Font } from 'expo';
import { createIconSetFromFontello } from '@expo/vector-icons';
import fontelloConfig from '../../assets/fonts/config.json';
const CustomIcon = createIconSetFromFontello(fontelloConfig, 'custom');

class IconCustom extends Component {

	constructor(props){
		super(props);

		this.state = {
			fontLoaded: false
		};
	}

	async componentDidMount() {
    await Font.loadAsync({
      'custom': require('../../assets/fonts/custom.ttf')
    });

    this.setState({ fontLoaded: true });
  }

	render(){
		if (!this.state.fontLoaded) { return null; }
		return (<CustomIcon name={this.props.name} size={this.props.size ? this.props.size : 24} color={this.props.color} />);
	}
}

export default IconCustom;
