import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { StyleSheet, Text, View, ImageBackground, Image, Animated } from 'react-native';
import stylesApp from '../assets/styles';
import { Button, } from 'native-base';


class FadeInView extends React.Component {
    state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    }
  
    componentDidMount() {
      Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 4000,              // Make it take a while
        }
      ).start();                        // Starts the animation
    }
  
    render() {
      let { fadeAnim } = this.state;
  
      return (
        <Animated.View                 // Special animatable View
          style={{
            ...this.props.style,
            opacity: fadeAnim,         // Bind opacity to animated value
          }}
        >
          {this.props.children}
        </Animated.View>
      );
    }
  }


class StartScreen extends Component {

	render() {
		return (

            <ImageBackground source={stylesApp.fondoverde} style={stylesApp.imageBackgroundStyle} >

      <View style={stylesApp.container}>
          
            <Text style={stylesApp.textStyle}>BIENVENIDOS</Text>

            <FadeInView>
            <Image style={stylesApp.imageStyle} resizeMode="contain" source={stylesApp.logonewagrosat}/>
            </FadeInView>

            <Button style={stylesApp.buttonStyleCreatestart} onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={stylesApp.textbtn}>Promotor</Text>
            </Button>

            <Button style={stylesApp.buttonStyleCreatestart} onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={stylesApp.textbtn}>Cliente</Text>
            </Button>
            
            <Image style={stylesApp.imagetepeyac} resizeMode="contain" source={stylesApp.logonewtepeyac}/>
       
      </View>
      
      </ImageBackground>



								
		);
	}
}


function mapStateToProps(state) {
	return {
		user: state.auth,
		data: state.data,
		users: state.users,
		cs_recomendaciones: state.cs_recomendaciones,
	};
}

const mapDispatchToProps = dispatch => ({
	saveUser: (response) => dispatch({ type: 'SAVE_USER', payload: response }),
	goHome: () => dispatch({ type: 'HOME_NAV' }),
	setData: (response) => dispatch({ type: 'SET_DATA', payload: response }),
	setRecomendaciones: (response) => dispatch({ type: 'SET_RECOMENDACIONES', payload: response }),
	setCollects: (response) => dispatch({ type: 'SET_COLLECTS', payload: response }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
