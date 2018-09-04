import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

import stylesApp from '../assets/styles';

const optionStyle = {
  flex: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: '5%',
  paddingHorizontal: '5%',
  borderBottomWidth: 1,
  borderBottomColor: '#eee'
};

const optionTextStyle = {
  flex: 1,
  textAlign: 'left',
  color: stylesApp.blackSecondary,
  fontSize: 16,
  fontFamily: stylesApp.fontRegular,
};

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTextStyle: {
    flex: 0,
    color: '#fff',
    fontSize: 20,
    marginBottom: 15
  },
  listContainer: {
    flex: 1,
    width: width * 0.95,
    maxHeight: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 15
  },
  cancelContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButton: {
    flex: 0,
    backgroundColor: stylesApp.colorNaranja,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  cancelButtonText: {
    textAlign: 'center',
    fontFamily: stylesApp.fontBold,
    color: '#fff',
    fontSize: 14
  },
  filterTextInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#999'
  },
  filterTextInput: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 0,
    height: 50
  },
  categoryStyle: {
    ...optionStyle
  },
  categoryTextStyle: {
    ...optionTextStyle,
    color: '#999',
    fontStyle: 'italic',
    fontSize: 16
  },
  optionStyle: {
    ...optionStyle
  },
  optionStyleLastChild: {
    borderBottomWidth: 0
  },
  optionTextStyle: {
    ...optionTextStyle
  },
  selectedOptionStyle: {
    ...optionStyle
  },
  selectedOptionStyleLastChild: {
    borderBottomWidth: 0
  },
  selectedOptionTextStyle: {
    ...optionTextStyle,
    fontWeight: 'bold'
  },
  noResults: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  noResultsText: {
    flex: 1,
    textAlign: 'center',
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 16,
    fontFamily: stylesApp.fontRegular,
  }
});
