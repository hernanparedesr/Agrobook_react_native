import React, { Component } from 'react';
import _ from 'lodash';

import { Keyboard, Text, View, TouchableHighlight, ListView } from 'react-native';
import { CardItem, Item, Input, ListItem, Right } from 'native-base';

import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import stylesApp from './../assets/styles.js';

import Loading from './Loading';

export default class SelectEmails extends Component {
	constructor(props) {
		super(props);

		this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

		if (this.props.agricultor_email.includes(',')) {
	    this.emails = _.map(this.props.agricultor_email.split(','), (e, k) => {
				if (k === 0) {
					return {
						email: e,
						selected: true,
						new: false
					};
				}
				return {
					email: e,
					selected: false,
						new: false
				};
			});
	  } else {
	  	if (this.props.agricultor_email) {
	  		this.emails = [{
					email: this.props.agricultor_email,
					selected: true,
					new: false
				}];
			} else this.emails = [];
		}

		if (this.props.info && this.props.info.agricultor_emails) {
			const emails_emails = [];
			if (this.props.info.agricultor_emails.includes(',')) {
				emails_emails = _.map(this.props.info.agricultor_emails.split(','), e => {
					return {
						email: e,
						selected: true,
						new: false
					}
				});
			} else emails_emails = { email: this.props.info.agricultor_emails, selected: true, new: false };

			const emails_agri2 = _.map(this.emails, e => {
				e.selected = false;
				return e;
			});
			this.emails = _.concat(emails_emails, emails_agri2);
			this.emails = _.uniqBy(this.emails, 'email');
		}

		this.state = {
			email: '',
			emails: this.ds.cloneWithRows(this.emails),
			selecteds: _.map(this.emails, e => { if (e.selected) return e.email; }),
			news: ''
		};
	}

	getState() {
		return {
			agricultor_emails_selected: this.state.selecteds.length > 1 ?
				this.state.selecteds.join(',') :
				this.state.selecteds.length > 0 ?
					this.state.selecteds[0] :
					'',
		 	agricultor_emails_new: this.state.news.length > 1 ?
				this.state.news.join(',') :
				this.state.news.length > 0 ?
					this.state.news[0] :
					'',
			agricultor_emails: this.emails.length > 1 ?
				_.map(this.emails, e => (e.email)).join(',') :
				this.emails.length > 0 ?
					_.map(this.emails, e => (e.email))[0] :
					''
		};
	}

	resetSelectEmails() {
    if (this.props.agricultor_email) {
    	if (this.props.agricultor_email.includes(',')) {
    		this.emails = _.map(this.props.agricultor_email.split(','), (e, k) => {
					if (k === 0) {
						return {
							email: e,
							selected: true,
							new: false
						};
					}
					return {
						email: e,
						selected: false,
							new: false
					};
				});
		  } else {
		  	if (this.props.agricultor_email) {
		  		this.emails = [{
						email: this.props.agricultor_email,
						selected: true,
						new: false
					}];
				} else this.emails = [];
			}
    }

		this.setState({
			email: '',
			emails: this.ds.cloneWithRows(this.emails),
			selecteds: _.map(this.emails, e => { if (e.selected) return e.email; }),
			news: ''
		});
  }

  selectEmail(e) {
		const emails = _.map(this.emails, es => {
			if(es.email === e.email) {
				es.selected = !es.selected;
			}
			return es;
		});

		this.emails = emails;

		const emails_selected = _.filter(this.emails, {selected: true});
		const selecteds = _.map(emails_selected, e => { return e.email; });

		const emails_news = _.filter(this.emails, {selected: true, new: true});
		const news = _.map(emails_news, e => (e.email));
		this.setState({
			emails: this.ds.cloneWithRows(this.emails),
			selecteds: selecteds,
			news
		});
	}

	addEmail = () => {
		if (this.state.email !== '') {
			const re = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
			if (re.test(this.state.email)) {
				const newEmail = {
					email: this.state.email,
					selected: true,
					new: true
				};

				this.emails = _.concat(this.emails, newEmail);
				const emails_selected = _.filter(this.emails, {selected: true});
				const selecteds = _.map(emails_selected, e => { return e.email; });


				const emails_news = _.filter(this.emails, {selected: true, new: true});
				const news = _.map(emails_news, e => (e.email));

				this.setState({
					email: '',
					emails: this.ds.cloneWithRows(this.emails),
					selecteds: selecteds,
					news: news
				});
				Keyboard.dismiss();
			} else {
				this.Loading.showLoading(true, 'Alerta', 'Ingrese un e-mail válido', [{ text: 'OK', onPress: null }], false);
			}
		}
	}

	removeEmail(e) {
		this.Loading.showLoading(true, 'Eliminar', '¿Desea eliminar el e-mail ' + e.email + '?', [
			{ text: 'Cancelar', onPress: null },
			{ text: 'Si', onPress: () => {
				this.emails = _.filter(this.emails, x => { return x.email !== e.email; });
				const emails_selected = _.filter(this.emails, { selected: true });
				const selecteds = _.map(emails_selected, e => { return e.email; });
				const emails_news = _.filter(this.emails, { selected: true, new: true });
				const news = _.map(emails_news, e => (e.email));
				this.setState({
					emails: this.ds.cloneWithRows(this.emails),
					selecteds: selecteds,
					news: news
				});
				this.Loading.hideLoading();
			} }], false);
	}

  renderEmail(e, sectionID, rowID) {
		let styles = {backgroundColor: '#F2F2F2'};
		if (rowID%2 === 0) {
      styles = {backgroundColor: '#DDDDDD'};
    }
    let icon = {
    	icon: 'check-box-outline-blank',
    	color: stylesApp.blackSecondary,
    }
    if(e.selected) icon = {
    	icon: 'check-box',
    	color: this.props.color
    };
		return (
			<ListItem style={{paddingLeft: '3%', flex: 1, ...styles}}>
				<View style={{ width: !this.props.route ? '90%' : '100%', paddingLeft: '2%', flexDirection: 'row', alignItems: 'center' }}>
					<MaterialIcons onPress={() => this.selectEmail(e)} name={icon.icon} color={icon.color} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
					<Text
						style={{ fontFamily: stylesApp.fontRegular, color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12, }}>
						{e.email}
					</Text>
				</View>
				{ !this.props.route ?
					<View style={{ width: '10%', flexDirection: 'row', }}>
						<MaterialCommunityIcons onPress={() => this.removeEmail(e)} name='close-circle' color={stylesApp.colorRed} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
					</View>
					: null
				}
			</ListItem>
		);
	}


	render() {
		const styles = {
			inputText: {
				fontFamily: stylesApp.fontSemiBold,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14,
				color: stylesApp.blackSecondary,
				textAlign: 'center'
			},
			textInputLabel: {
				fontFamily: stylesApp.fontSemiBold,
    		color: stylesApp.blackSecondary,
				fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 14 : 12,
				textAlign: 'center'
			},
			inputSeparetion: {
				width: '25%',
				marginRight: '1%',
			}
		}

		return (
			<View style={{ backgroundColor: stylesApp.cardContentColor, margin: 0, padding: 0, width: '100%' }}>
				<CardItem style={stylesApp.cardHeaderRecomendar}>
					<Text style={{ color: stylesApp.blackSecondary, fontFamily: stylesApp.fontBold, textAlign: 'center' }}>ENVIAR A:</Text>
				</CardItem>
				<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '8%', paddingRight: 20, }}>
					<Item style={{ marginLeft: '5%' }}>
						<FontAwesome name='envelope' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
						<Input
							name="email"
							placeholder='E-mail'
							placeholderTextColor={stylesApp.blackSecondary}
							style={{ fontFamily: stylesApp.fontRegular, color: stylesApp.blackSecondary, fontSize: stylesApp.widthWindow > stylesApp.widthTablet ? 16 : 14 }}
							value={this.state.email}
							onChangeText={email => { if (!email.includes(',')) { this.setState({ email }); } }}
							onSubmitEditing={Keyboard.dismiss}
						/>
						<TouchableHighlight onPress={this.addEmail}>
							<MaterialIcons name='add-circle' color={stylesApp.blackSecondary} size={stylesApp.widthWindow > stylesApp.widthTablet ? 26 : 24} />
						</TouchableHighlight>
					</Item>
					<Item style={{ borderBottomWidth: 0, marginTop: 10, }}>
						<ListView
							style={{width: '100%'}}
							dataSource={this.state.emails}
							renderRow={this.renderEmail.bind(this)}
							enableEmptySections={true}
						/>
					</Item>
				</View>
				<Loading ref={c => this.Loading = c} />
			</View>
		);
	}
}
