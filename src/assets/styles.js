import { StyleSheet, Dimensions, Platform } from 'react-native';

const stylesApp = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8'
  }
});

const { height, width } = Dimensions.get('window');

const version = 'V 2.1',
		widthWindow = width,
		heightWindow = height,
    widthTablet = 641,
		whitePrimary = 'rgba(255, 255, 255, 1)',
		whiteSecondary = 'rgba(255, 255, 255, 0.7)',
		whiteDisabled = 'rgba(255, 255, 255, 0.5)',
		whiteAdd = '#EEEEEE',
		blackPrimary = 'rgba(0, 0, 0, 0.87)',
		blackSecondary = '#48A23A',
		blackDisabled = 'rgba(0, 0, 0, 0.38)',
		blackAdd = '#212121',
		colorNaranja = '#f29a02',
		colorAzul = '#0284f2',
		colorVerde = '#68AE00',
		appColor = '#BF0811',

		colorGreen = '#629530',
		colorYellow = '#e3b62a',
		colorRed = '#c53a03',

		logoAgrobook = require('../../assets/img/logoAgrobook.png'),
		logoAgrosat = require('../../assets/img/logoAgrosat.png'),
		logoCollect = require('../../assets/img/logoCollect.png'),
		fondoLogin = require('../../assets/img/fondo-login.png'),
		fondoMenu1 = require('../../assets/img/fondo-menu1.png'),
		fondoMenu2 = require('../../assets/img/fondo-menu2.png'),
		fondoInterior = require('../../assets/img/fondo-interiores.png'),
    loadingGif = require('./../../assets/img/loading.gif'),
		fondoExpoPhone = require('../../assets/img/phone/fondo-expo2.png'),
		fondoExpoTablet = require('../../assets/img/tablet/fondo-expo2.png'),
		fondoDimensiones = {
			width: widthWindow,
			height: heightWindow,
		},
		logoCliente = require('../../assets/img/logoCliente.png'),
    fontExtraBold = 'OpenSans-ExtraBold',
    fontBold = 'OpenSans-Bold',
    fontSemiBold = 'OpenSans-SemiBold',
    fontRegular = 'OpenSans-Regular',

		cardHeaderColor = '#d1d1d1',
		cardContentColor = '#fafafa',

    contentCenter = {
      alignItems: 'center',
			justifyContent: 'center',
    },
    cardContainer = {
      elevation: 0,
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 0,
      marginRight: '5%',
      marginLeft: '5%',
    },
    cardTitleSection = {
      backgroundColor: 'transparent',
      ...contentCenter,
      width: '100%'
    },
    cardTitleSectionText = {
      color: blackSecondary,
  		fontFamily: fontBold,
  		textAlign: 'center'
    },
    cardSubTitleSection = {
      backgroundColor: '#E4E4E4',
      ...contentCenter,
  		borderRadius: 0,
  		width: '100%',
    },
    cardSubTitleSectionText = {
      color: blackSecondary,
  		fontFamily: fontBold,
  		textAlign: 'center'
    },
    cardContent = {
      flexDirection: 'row',
  		backgroundColor: '#fafafa',
  		justifyContent: 'center',
  		borderRadius: 0,
  		width: '100%',
    },
    cardTextRegular = {
      textAlign: 'center',
  		color: blackSecondary,
  		fontFamily: fontRegular,
		},
		

		fondonewlogin = require('../../assets/img/fondo_blanco.png'),
		logonewagrosat = require('../../assets/img/Agrobook_collect.png'),
		logonewagrosatblanco = require('../../assets/img/agrobook_blanco.png'),
		fondoverde = require('../../assets/img/fondo.png'),
		logonewtepeyac = require('../../assets/img/tepeyac.png'),

		inputContainer= {
			//marginTop: stylesApp.heightWindow * 0.05,
			marginRight: stylesApp.widthWindow * 0.08,
			marginLeft: stylesApp.widthWindow * 0.08,
			marginBottom: stylesApp.heightWindow * 0.08,
		},
		input= {
			color: stylesApp.blackSecondary,
			fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 18 : 16,
			fontFamily: stylesApp.fontRegular,
		},
		textbtn = {
			color: '#fff',
			fontSize: 14,
			fontWeight: 'bold'
		},
		buttonStyleCreatestart = {
			backgroundColor: 'transparent',
			width: '80%',
			alignSelf: 'center',
			borderColor: 'white',
			borderWidth: 1,
			marginTop: 10,
			borderRadius: 177,
		},
		button = {
			backgroundColor: '#A9A9A9',
			width: '68%',
			alignSelf: 'center',
			marginTop: 10,
			borderRadius: 177,
		},
		buttongreen = {
			backgroundColor: '#48A23A',
			width: '68%',
			alignSelf: 'center',
			marginTop: 10,
			borderRadius: 177,
		},
		regform= {
        alignSelf: 'stretch',
    },
    title= {
        textAlign: 'center',
        fontSize: 21,
				color: '#A9A9A9',
				backgroundColor: 'transparent'
    },
    header= {
        fontSize: 24,
        color: '#fff',
        paddingBottom: 10,
        marginBottom: 20,
        borderBottomColor: '#199187',
        borderBottomWidth: 1,
    },
    textinput= {
        alignSelf: 'stretch',
        fontSize: 16,
        fontWeight: 'bold',
        height: 40,
        marginBottom: 30,
        color: '#fff',
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1,
    },
    titlegreen= {
        fontSize: 12,
				color: '#48A23A',
				backgroundColor: 'transparent'
    },
    headergreen= {
        textAlign: 'center',
        fontSize: 24,
        color: '#48A23A',
        paddingBottom: '10%' ,
				fontWeight: 'bold',
				backgroundColor: 'transparent'
        
    },
    textinputgreen= {
        alignSelf: 'stretch',
        fontSize: 16,
        fontWeight: 'bold',
        height: 40,
        marginBottom: 30,
        color: '#48A23A',
        borderBottomColor: '#48A23A',
        borderBottomWidth: 1,
		},
		container= {
			justifyContent: 'center',
			paddingLeft: 60,
			paddingRight: 60,
			alignItems: 'center',
		},
		imageBackgroundStyle= {
			height: '100%',
			width: '100%'
		},
		logo= {
			height: 110,
			width: 300
		},
		logoheader= {
			width: 140
		},
		imageStyle= {
			alignSelf: 'center',
			height: 300,
			width: 300
		},
		imageSingIn= {
			alignSelf: 'center',
			height: '30%',
			width: '120%'
		},
		imagetepeyac= {
			alignSelf: 'center',
			width: '50%'
		},
		singin= {
			marginTop: '10%',
			textAlign: 'center',
			color: '#FFFFFF',
			fontSize: 10
		},
		textStyle= {
			marginTop: '30%',
			textAlign: 'center',
			color: '#FFFFFF',
			fontSize: 20,
			backgroundColor: 'transparent'
		},








		cardItemButton = {
			...contentCenter,
			flexDirection: 'column',
			flex: 1,
		},
		cardInfo = {
			elevation: 0,
			backgroundColor: 'transparent',
			marginRight: '5%',
			marginLeft: '5%',
			marginTop: 0,
      borderWidth: 0
		},
    detalle = {
			cardContent: {
				elevation: 0,
				marginRight: '5%', //Platform.OS === 'ios' ? 20 : '5%',
				marginLeft: '5%', //Platform.OS === 'ios' ? 20 : '5%',
				marginTop: '5%', //Platform.OS === 'ios' ? 20 : '5%',
				marginBottom: 0,
				flex: 1,
				backgroundColor: 'transparent',
        flexDirection: 'column'
			},
			cardHeader: {
				backgroundColor: cardHeaderColor,
				borderRadius: 0,
				width: '100%',
				paddingTop: '3%',
				paddingBottom: '3%',
			},
			itemHeader: {
				borderBottomWidth: 0,
				flex: 1
			},
			botonHeader: {
				height: 30,
				width: 30,
				justifyContent: 'center'
			},
			textTitle: {
				color: blackSecondary,
				fontFamily: fontExtraBold,
			},
			cardBody: {
				backgroundColor: cardContentColor,
				borderRadius: 0,
				padding: 5,
			},
			textInfo: {
				fontFamily: fontRegular,
				color: blackSecondary,
        fontSize: 12
			},
			textInfoTitle: {
				fontFamily: fontBold,
				color: blackSecondary
			}
		},
		textInfo = {
			color: blackSecondary,
			fontSize: 12,
		},
		cardHeaderRecomendar = {
			backgroundColor: '#E4E4E4',
			justifyContent: 'center',
			marginTop: '8%',
			marginBottom: '8%',
			borderRadius: 0
		};

export default {
  widthTablet,
	version,
	stylesApp,
	blackPrimary,
	blackSecondary,
	blackDisabled,
	blackAdd,
	whitePrimary,
	whiteSecondary,
	whiteDisabled,
	whiteAdd,
	appColor,
	colorNaranja,
	colorAzul,
  colorVerde,
	colorGreen,
	colorRed,
	colorYellow,
	logoAgrobook,
	logoAgrosat,
	logoCollect,
	fondoLogin,
	fondoMenu1,
	fondoMenu2,
	fondoInterior,
  fondoExpoPhone,
  fondoExpoTablet,
	fondoDimensiones,
  fontExtraBold,
  fontBold,
  fontSemiBold,
  fontRegular,
	logoCliente,
	widthWindow,
	heightWindow,
	contentCenter,
	cardContainer,
  cardTitleSection,
  cardTitleSectionText,
  cardSubTitleSection,
  cardSubTitleSectionText,
  cardContent,
  cardTextRegular,


	fondonewlogin,
	logonewagrosat,
	logonewagrosatblanco,
	fondoverde,
	logonewtepeyac,

	inputContainer,
	input,
	textbtn,
	buttonStyleCreatestart,
	button,
	buttongreen,
	regform,
	title,
	header,
	textinput,
	titlegreen,
	headergreen,
	textinputgreen,
	container,
	imageBackgroundStyle,
	logo,
	logoheader,
	imageStyle,
	imageSingIn,
	imagetepeyac,
	singin,
	textStyle,


	cardItemButton,
	cardHeaderColor,
	cardContentColor,
	cardInfo,
	textInfo,
	cardHeaderRecomendar,
  loadingGif,
  detalle,
};
