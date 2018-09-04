import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Image } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      font: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      /*'Raleway-Black': require('./assets/fonts/Raleway-Black.ttf'),
      //'Raleway-BlackItalic': require('./assets/fonts/Raleway-BlackItalic.ttf'),
      'Raleway-Bold': require('./assets/fonts/Raleway-Bold.ttf'),
      //'Raleway-BoldItalic': require('./assets/fonts/Raleway-BoldItalic.ttf'),
      'Raleway-ExtraBold': require('./assets/fonts/Raleway-ExtraBold.ttf'),
      //'Raleway-ExtraBoldItalic': require('./assets/fonts/Raleway-ExtraBoldItalic.ttf'),
      'Raleway-ExtraLight': require('./assets/fonts/Raleway-ExtraLight.ttf'),
      //'Raleway-ExtraLightItalic': require('./assets/fonts/Raleway-ExtraLightItalic.ttf'),
      //'Raleway-Italic': require('./assets/fonts/Raleway-Italic.ttf'),
      'Raleway-Light': require('./assets/fonts/Raleway-Light.ttf'),
      //'Raleway-LightItalic': require('./assets/fonts/Raleway-LightItalic.ttf'),
      'Raleway-Medium': require('./assets/fonts/Raleway-Medium.ttf'),
      //'Raleway-MediumItalic': require('./assets/fonts/Raleway-MediumItalic.ttf'),
      'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
      'Raleway-SemiBold': require('./assets/fonts/Raleway-SemiBold.ttf'),
      //'Raleway-SemiBoldItalic': require('./assets/fonts/Raleway-SemiBoldItalic.ttf'),
      'Raleway-Thin': require('./assets/fonts/Raleway-Thin.ttf'),
      //'Raleway-ThinItalic': require('./assets/fonts/Raleway-ThinItalic.ttf'),*/
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'OpenSans-BoldItalic': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
      'OpenSans-ExtraBold': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
      'OpenSans-ExtraBoldItalic': require('./assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
      'OpenSans-Italic': require('./assets/fonts/OpenSans-Italic.ttf'),
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      'OpenSans-LightItalic': require('./assets/fonts/OpenSans-LightItalic.ttf'),
      'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
      'OpenSans-SemiBoldItalic': require('./assets/fonts/OpenSans-SemiBoldItalic.ttf'),
      'Ionicons': require('./assets/fonts/Ionicons.ttf'),
    });

    this.setState({ font: true });
  }

  store = createStore(AppReducer, {}, compose(applyMiddleware(thunk)));

  async loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/img/logoCollect.png'),
      require('./assets/img/logoAgrosat.png'),
      require('./assets/img/logoAgrobook.png'),
      require('./assets/img/logoCliente.png'),
      require('./assets/img/fondo.png'),
      require('./assets/img/fondo-menu1.png'),
      require('./assets/img/fondo-menu2.png'),
      require('./assets/img/fondo-interiores.png'),
      require('./assets/img/loading.gif'),
      require('./assets/img/phone/fondo-expo.png'),
      require('./assets/img/tablet/fondo-expo.png'),
      require('./assets/img/phone/fondo-expo2.png'),
      require('./assets/img/tablet/fondo-expo2.png')
    ]);

    const fontAssets = cacheFonts([MaterialIcons.font, MaterialCommunityIcons.font, FontAwesome.font]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    if (!this.state.font) return null;
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default App;
