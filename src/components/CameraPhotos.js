import React, { Component } from 'react';
import _ from 'lodash';
import { View, TouchableHighlight, Text } from 'react-native';
import { Badge, } from 'native-base';
import { ImagePicker } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import stylesApp from './../assets/styles';

export default class CameraPhotos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: this.props.images && this.props.images.length > 0,
      photos: this.props.images && this.props.images.length > 0 ? this.props.images.length : 0,
      images: this.props.images ? this.props.images : [],
      active: false,
    };
  }

  getState() {
    return { images: this.state.images, show: this.state.show };
  }

  getState2() {
    return { images: this.state.images };
  }

  resetCamara() {
    this.setState({
      show: false,
      photos: 0,
      images: [],
      active: false,
    });
  }

  async deleteImage(image) {
    const images = _.filter(this.state.images, i => {
      return i.base64 !== image.base64;
    });
    await this.setState({
      images,
      photos: this.state.photos - 1
    });
    this.props.getImages();
  }

  takePhoto = async () => {
    if (this.state.photos < 3) {
      const result = await ImagePicker.launchCameraAsync({
        //allowsEditing: true,
        base64: true,
        quality: 0.4
      });
      if (!result.cancelled) {
        await this.setState({
          images: [...this.state.images, { base64: result.base64 }],
          photos: this.state.photos + 1,
          show: true
        });
      }
    } else {
      await this.setState({ show: !this.state.show });
    }
    this.props.getImages();
  }

  render() {
    const { photos, show } = this.state;
    return (
      <TouchableHighlight
        style={{ width: '50%', }}
        onPress={this.takePhoto}
        underlayColor={this.props.color}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <Text>
            <MaterialIcons name='add-a-photo' size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} color={stylesApp.blackSecondary} />
          </Text>
          <Text
            style={{
              fontFamily: stylesApp.fontSemiBold,
              marginTop: '3%',
              color: stylesApp.blackSecondary,
              fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12 }}
          >IMAGEN</Text>
          {
            photos > 0 && !show ?
              <View style={{ marginTop: 5 }}>
                <Badge style={{ backgroundColor: this.props.color }}>
                <Text
                  style={{ fontFamily: stylesApp.fontSemiBold, color: stylesApp.whiteSecondary }}
                >{photos}</Text>
              </Badge></View>
            : null
          }
        </View>
      </TouchableHighlight>
    );
  }
}
