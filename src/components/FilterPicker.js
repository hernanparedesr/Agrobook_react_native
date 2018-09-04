import React, { Component, PropTypes } from 'react';
import { Modal, View, ListView, TouchableOpacity, Text } from 'react-native';
import { Body, Item, Input, Button, } from 'native-base';
import _ from 'lodash';

import { MaterialIcons } from '@expo/vector-icons';

import stylesApp from '../assets/styles';
import styles from '../assets/stylesFilterPicker';


export default class FilterPicker extends Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      filter: '',
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(props.options)
    }
  }

  componentWillReceiveProps(newProps) {
    if ((!this.props.visible && newProps.visible) || (this.props.options !== newProps.options)) {
      this.setState({
        filter: '',
        ds: this.state.ds.cloneWithRows(newProps.options),
      });
    }
  }

  onFilterChange = (text) => {
    const { options } = this.props;

    const filter = text.toLowerCase();

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? options
      : options.filter(({ searchKey, nombre, id }) => (
        0 <= nombre.toLowerCase().indexOf(filter) ||
          (searchKey && 0 <= searchKey.toLowerCase().indexOf(filter))
      ));

    this.setState({
      filter: text.toLowerCase(),
      ds: this.state.ds.cloneWithRows(filtered)
    });
  }

  renderList = () => {
    const filter = (
      <View style={{paddingHorizontal: '2%', height: 60, justifyContent: 'center'}}>
        <Body>
          <Item>
            <Input
              name="buscar"
              placeholder='Buscar'
              placeholderTextColor={stylesApp.blackSecondary}
              style={{
                color: stylesApp.blackSecondary,
                fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
                fontFamily: stylesApp.fontRegular,
              }}
              autoCorrect={false}
              blurOnSubmit={true}
              autoCapitalize="none"
              onChangeText={this.onFilterChange}
            />
            <MaterialIcons active name='search' color={stylesApp.colorNaranja} size={stylesApp.widthWindow > stylesApp.widthTablet ? 24 : 22} />
          </Item>
        </Body>
      </View>
    );

    return (
      <View style={styles.listContainer}>
        {filter}
        {this.renderOptionList()}
      </View>
    );
  }

  renderOptionList = () => {
    const {
      noResultsText,
      listViewProps,
    } = this.props;

    const { ds } = this.state;

    if (1 > ds.getRowCount()) {
      return (
        <ListView
          enableEmptySections={false}
          {...listViewProps}
          dataSource={ds.cloneWithRows([{ id: '_none' }])}
          renderRow={() => (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{noResultsText}</Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <ListView
          enableEmptySections={false}
          {...listViewProps}
          dataSource={ds}
          renderRow={this.renderOption}
        />
      );
    }
  }

  renderOption = (rowData) => {
    const {
      selectedOption,
      renderOption,
      optionTextStyle,
      selectedOptionTextStyle
    } = this.props;

    const { id, nombre } = rowData;

    let style = styles.optionStyle;
    let textStyle = optionTextStyle || styles.optionTextStyle;

    /*if (id === selectedOption) {
      style = styles.selectedOptionStyle;
      textStyle = selectedOptionTextStyle || styles.selectedOptionTextStyle;
    }*/

    if (_.find(selectedOption, { id: id })) {
      console.log('entro');
      style = styles.selectedOptionStyle;
      textStyle = selectedOptionTextStyle || styles.selectedOptionTextStyle;
    }

    if (renderOption) {
      return renderOption(rowData, id === selectedOption);
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={style}
        onPress={() => this.props.onSelect(rowData)}
      >
        <Text style={textStyle}>{nombre}</Text>
      </TouchableOpacity>
    );
  }

  renderCancelButton = () => {
    const {
      cancelButtonText
    } = this.props;

    return (
      <TouchableOpacity
        onPress={this.props.onCancel}
        activeOpacity={0.7}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      title,
      titleTextStyle,
      overlayStyle,
      cancelContainerStyle,
      renderList,
      renderCancelButton,
      visible,
      modal
    } = this.props

    const renderedTitle = (!title) ? null : (
      <Text style={titleTextStyle || styles.titleTextStyle}>{title}</Text>
    )

    return (
      <Modal
        {...modal}
        onRequestClose={this.props.onCancel}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={overlayStyle || styles.overlay}>
          {renderedTitle}
          {(renderList || this.renderList)()}
          <View style={cancelContainerStyle || styles.cancelContainer}>
            {(renderCancelButton || this.renderCancelButton)()}
          </View>
        </View>
      </Modal>
    )
  }

}

/*FilterPicker.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.number,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderList: PropTypes.func,
  listViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  cancelContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle:PropTypes.any,
  selectedOptionTextStyle:PropTypes.any,
}*/

FilterPicker.defaultProps = {
  placeholderText: 'Filter...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Cancel',
  noResultsText: '',
  visible: true,
  showFilter: true,
}
