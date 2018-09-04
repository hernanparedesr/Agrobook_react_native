import { Platform, Alert, BackHandler, AsyncStorage, NetInfo } from 'react-native';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import Expo, { SQLite } from 'expo';

import config from '../config';
import stylesApp from '../assets/styles';

const Buffer = require('buffer/').Buffer;

const db = SQLite.openDatabase('agrobookCooprinsem.db');

export function contratos_user(contratos, usuario) {
	if (usuario.perfil_nombre === 'Tecnico') {
		return _.filter(contratos, (c) => {
			return _.includes(usuario.contratos_id, c.id);
		});
	} else if (usuario.perfil_nombre === 'Zonal') {
		return _.filter(contratos, (c) => { return _.includes(usuario.zonas_id, c.zona_id); });
	}
	else if (usuario.perfil_nombre === 'Gerente') {
		return contratos;
	}
	//return [];
}

export function rec_finalizada(rec) {
	if (rec.supervisiones.length === 0)
		return false;

	return _.filter(rec.supervisiones, (s) => {
		return s.avance === 1 || s.avance === 0 || s.repeat_task;
	}).length > 0;
}

export function volver_ruta(nav, dispatch, generar, controlar) {
	const lastRoute = nav.routes[nav.routes.length - 1];
	const lastRouteName = lastRoute.routeName;
	if (lastRouteName === 'Login' || lastRouteName === 'Home') {
		BackHandler.exitApp();
		return true;
	} else if(lastRouteName === 'Generar'){
		if (lastRoute.index === 0){				//generar - contratos
			const lastLastRoute = lastRoute.routes[0];
			if (lastLastRoute.index === 0) {
				/*dispatch({type: 'SHOW_LOADING', payload: {
				  show: true,
				  title: 'Regresar',
				  msg: '¿Desea regresar? Perderá la recomendación',
				  botones: [
						{ text: 'Cancelar', onPress: null },
						{ text: 'Si', onPress: async () => {
							await dispatch({type: 'REMOVE_GENERAR'});
							dispatch({type: 'HIDE_LOADING'});
							await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
							return true;
							}
						}],
				  cancelable: false,
					aux: false
				}});*/
				/*showLoading(true, 'Regresar', '¿Desea regresar? Perderá la recomendación', [
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si',
						onPress: async () => {
							await dispatch({type: 'REMOVE_GENERAR'});
							showLoading(false, '', '', [], false);
							await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
							return true;
						}
					}
				], false);]*/
				Alert.alert('Regresar', '¿Desea regresar? Perderá la recomendación', [
					{ text: 'Cancelar' },
					{ text: 'Si',
						onPress: async () => {
							await dispatch({type: 'REMOVE_GENERAR'});
							await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
							return true;
						}
					}
				]);
			} else if (lastLastRoute.index === 1) {
				dispatch(NavigationActions.back({ routeName: 'Cons' }));
			}
		} else if (lastRoute.index === 1) {				//generar - normas
			if(generar.isCollect && generar.isCollect !== 0) {
				const preLastRoute = nav.routes[nav.routes.length - 2];
				const params = { collect: preLastRoute.routes[1].params.collect };
				Alert.alert('Regresar', '¿Desea regresar? Perderá la recomendación', [
					{ text: 'Cancelar' },
					{ text: 'Si',
						onPress: async () => {
							await dispatch({type: 'REMOVE_GENERAR'});
							dispatch(NavigationActions.navigate({ routeName: 'CollectDetalle', params: params }));
							return true;
						}
					}
				]);
			} else dispatch(NavigationActions.back({ routeName: 'Cultivos' }));
		} else if (lastRoute.index === 2) { 				//generar - recomendar
			if(generar.rec) {
				const preLastRoute = nav.routes[nav.routes.length - 2];
				const params = {recs: preLastRoute.params.recs, sups: preLastRoute.params.sups};
				if (preLastRoute.index === 0) {
					/*dispatch({type: 'SHOW_LOADING', payload: {
					  show: true,
					  title: 'Regresar',
					  msg: '¿Desea regresar? Perderá la modificación',
					  botones: [
							{ text: 'Cancelar', onPress: null },
							{ text: 'Si', onPress: async () => {
								await dispatch({type: 'REMOVE_GENERAR'});
								dispatch({type: 'HIDE_LOADING'});
								dispatch(NavigationActions.navigate({ routeName: 'Sincronizar', params: params }));
								return true;
								}
							}],
					  cancelable: false
					}});*/
					Alert.alert('Regresar', '¿Desea regresar? Perderá la modificación', [
						{ text: 'Cancelar' },
						{ text: 'Si',
							onPress: async () => {
								await dispatch({type: 'REMOVE_GENERAR'});
								dispatch(NavigationActions.navigate({ routeName: 'Sincronizar', params: params }));
								return true;
							}
						}
					]);
				} else if(preLastRoute.index === 1) dispatch(NavigationActions.navigate({ routeName: 'SupSincronizar', params: params }));
			} else dispatch(NavigationActions.back({ routeName: 'Normas'}));
		}
	} else if(lastRouteName === 'Controlar'){
		if (lastRoute.index === 0){				//CONTROLAR - contratos
			/*dispatch({type: 'SHOW_LOADING', payload: {
				show: true,
				title: 'Regresar',
				msg: '¿Desea regresar? Perderá la supervisión',
				botones: [
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si', onPress: async () => {
						await dispatch({type: 'REMOVE_CONTROLAR'});
						dispatch({type: 'HIDE_LOADING'});
						await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
						return true;
						}
					}],
				cancelable: false
			}});*/
			Alert.alert('Regresar', '¿Desea regresar? Perderá la supervisión', [
				{ text: 'Cancelar' },
				{ text: 'Si',
					onPress: async () => {
						await dispatch({type: 'REMOVE_CONTROLAR'});
						await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
						return true;
					}
				}
			]);
		} else if (lastRoute.index === 1) {				//controlar - recomendaciones
			dispatch(NavigationActions.back({ routeName: 'Controlar' }));
		} else if (lastRoute.index === 2) { 				//controlar - supervisar
			if(controlar.sup) {
				const preLastRoute = nav.routes[nav.routes.length - 2];
				const params = {recs: preLastRoute.routes[1].params.recs, sups: preLastRoute.routes[1].params.sups};
				if(preLastRoute.index === 1){
					/*dispatch({type: 'SHOW_LOADING', payload: {
						show: true,
						title: 'Regresar',
						msg: '¿Desea regresar? Perderá la modificación',
						botones: [
							{ text: 'Cancelar', onPress: null },
							{ text: 'Si', onPress: async () => {
								await dispatch({type: 'REMOVE_CONTROLAR'});
								dispatch({type: 'HIDE_LOADING'});
								dispatch(NavigationActions.navigate({ routeName: 'SupSincronizar', params: params }));
								return true;
								}
							}],
						cancelable: false
					}});*/
					Alert.alert('Regresar', '¿Desea regresar? Perderá la modificación', [
						{ text: 'Cancelar' },
						{ text: 'Si',
							onPress: async () => {
								await dispatch({type: 'REMOVE_CONTROLAR'});
								dispatch(NavigationActions.navigate({ routeName: 'SupSincronizar', params: params }));
								return true;
							}
						}
					]);
				} else if(preLastRoute.index === 0) dispatch(NavigationActions.navigate({ routeName: 'Sincronizar', params: params }));
			} else dispatch(NavigationActions.back({ routeName: 'Recomendaciones'}));
		}
	} else if (lastRouteName === 'Sincronizar') {
		if (lastRoute.index === 0){				//sicronizar
			/*dispatch({type: 'SHOW_LOADING', payload: {
				show: true,
				title: 'Regresar',
				msg: '¿Desea regresar?',
				botones: [
					{ text: 'Cancelar', onPress: null },
					{ text: 'Si', onPress: async () => {
						dispatch({type: 'HIDE_LOADING'});
						await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
						return true;
						}
					}],
				cancelable: false
			}});*/
			Alert.alert('Regresar', '¿Desea regresar?', [
				{ text: 'Cancelar' },
				{ text: 'Si',
					onPress: async () => {
						await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
						return true;
					}
				}
			]);
		} else if (lastRoute.index === 1) {
			dispatch(NavigationActions.back({ routeName: 'Sincronizar' }));
		}
	} else if (lastRouteName === 'Collect' ) {
		const lastLastRoute = lastRoute.routes[0];
		if (lastRoute.index === 0) {
			Alert.alert('Regresar', '¿Desea regresar?', [
				{ text: 'Cancelar' },
				{ text: 'Si',
					onPress: async () => {
						await dispatch(NavigationActions.navigate({ routeName: 'Home'}));
						return true;
					}
				}
			]);
		} else if (lastRoute.index === 1) {
			dispatch(NavigationActions.navigate({ routeName: 'Collect' }));
		}
	} else {
		return false;
	}
}

function errorDB(msg, next = () => {}) {
	return function(err) {
		console.log(msg);
		Alert.alert('Error en ' + msg + ', ' + err);
		console.log(err);
		return false;
	};
}

export function create_query(tx) {
	console.log('Creando tablas');
	/*tx.executeSql(
		'CREATE TABLE IF NOT EXISTS usuario (' +
		'id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'rut	TEXT NOT NULL UNIQUE,' +
		'pass	TEXT NOT NULL,' +
		'nombre	TEXT NOT NULL,' +
		'email	TEXT,' +
		'telefono	TEXT,' +
		'cargo	TEXT,' +
		'perfil_id	INTEGER NOT NULL,' +
		'uuid TEXT NOT NULL UNIQUE,' +
		'habilitado	INTEGER NOT NULL,' +
		'perfil_nombre TEXT NOT NULL,' +
		'zonas_id TEXT,' +
		'zonas_nombre TEXT,' +
		'contratos_id TEXT);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS insumo (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`nombre`	TEXT NOT NULL,' +
		'`unidad_id`	INTEGER NOT NULL,' +
		'`tipo_insumo_id`	INTEGER NOT NULL,' +
		'`es_servicio`	INTEGER NOT NULL,' +
		'unidad_nombre TEXT,' +
		'tipo_insumo_nombre TEXT);'
	);*/


	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS cultivo (' +
		'`cultivo_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`cultivo_nombre`	TEXT NOT NULL,' +
		'`tipo_cultivo_id`	INTEGER NOT NULL,' +
		'`tipo_cultivo_nombre` TEXT NOT NULL,' +
		'tipo_insumo_ids TEXT,' +
		'estado INTEGER NOT NULL);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS campo (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`nombre`	TEXT NOT NULL,' +
		'`sup_sembrada`	DOUBLE NOT NULL,' +
		'`contrato_id` INTEGER NOT NULL,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS contrato (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`cto_num`	TEXT NOT NULL UNIQUE,' +
		'`calle`	TEXT,' +
		'`distrito`	TEXT,' +
		'`agricultor_id`	INTEGER NOT NULL,' +
		'`zona_id`	INTEGER NOT NULL,' +
		'`habilitado`	INTEGER NOT NULL,' +
		'agricultor_nombre TEXT,' +
		'agricultor_rut TEXT,' +
		'agricultor_email TEXT,' +
		'zona_nombre TEXT,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		`CREATE TABLE IF NOT EXISTS collect (
		id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
		fecha TEXT NOT NULL,
		observacion TEXT NOT NULL,
		foto1 BLOB,
		foto2 BLOB,
		foto3 BLOB,
		lat	DOUBLE NOT NULL,
		lon	DOUBLE NOT NULL,
		alt	DOUBLE NOT NULL,
		agricultor_id INTEGER NOT NULL,
		campo_id INTEGER NOT NULL,
		tecnicos_id TEXT NOT NULL,
		estadoTabla INTEGER NOT NULL,
		agricultor_nombre	TEXT,
		agricultor_rut TEXT,
		cto_num TEXT,
		calle TEXT,
		distrito TEXT,
		zona TEXT,
		potrero TEXT,
		estado INTEGER);`
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS cultivos_campo (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`cultivo_id`	INTEGER NOT NULL,' +
		'`campo_id`	INTEGER NOT NULL,' +
		'`temporada_id`	INTEGER NOT NULL,' +
		'`estadoTabla` integer NOT NULL,' +
		'cultivo_nombre	TEXT NOT NULL,' +
		'tipo_cultivo_id INTEGER NOT NULL,' +
		'tipo_cultivo_nombre TEXT NOT NULL,' +
		'campo_nombre	TEXT NOT NULL,' +
		'contrato_id INTEGER NOT NULL,' +
		'sup_sembrada DOUBLE NOT NULL,' +
		'temporada_nombre	TEXT NOT NULL,' +
		'tipo_insumo_ids TEXT,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS recomendacion (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`contrato_id`	INTEGER NOT NULL,' +
		'`rec_cultivos_campo_ids`	TEXT NOT NULL,' +
		'`tecnico_id`	INTEGER NOT NULL,' +
		'`fecha`	TEXT NOT NULL,' +
		'`lat`	DOUBLE NOT NULL,' +
		'`lon`	DOUBLE NOT NULL,' +
		'`alt`	DOUBLE NOT NULL,' +
		'`en_oficina`	INTEGER NOT NULL,' +
		'`tipo_insumo_id`	INTEGER NOT NULL,' +
		'`prioridad_id`	INTEGER NOT NULL,' +
		'`notas`	TEXT NOT NULL,' +
		'foto1 BLOB,' +
		'foto2 BLOB,' +
		'foto3 BLOB,' +
		'`habilitado`	INTEGER NOT NULL,' +
		'tecnico_nombre TEXT,' +
		'tipo_insumo_nombre TEXT,' +
		'prioridad_nombre TEXT,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS insumos_recomendacion (' +
		'`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`rec_id`	INTEGER NOT NULL,' +
		'`insumo_id`	INTEGER NOT NULL,' +
		'`superficie`	DOUBLE,' +
		'`dosis`	DOUBLE NOT NULL,' +
		'unidad_id INTEGER NOT NULL,' +
		'insumo_nombre TEXT,' +
		'unidad_nombre TEXT,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS supervision (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'`rec_id`	INTEGER NOT NULL,' +
		'`tecnico_id`	INTEGER NOT NULL,' +
		'`contrato_id`	INTEGER NOT NULL,' +
		'`rec_cultivos_campo_ids`	TEXT NOT NULL,' +
		'`fecha`	TEXT NOT NULL,' +
		'`title`	TEXT NOT NULL,' +
		'`inicio`	TEXT NOT NULL,' +
		'`avance`	INTEGER NOT NULL,' +
		'`nota_id`	INTEGER NOT NULL,' +
		'`observaciones`	TEXT NOT NULL,' +
		'`repeat_task`	INTEGER NOT NULL,' +
		'`en_oficina`	INTEGER NOT NULL,' +
		'`lat`	DOUBLE NOT NULL,' +
		'`lon`	DOUBLE NOT NULL,' +
		'`alt`	DOUBLE NOT NULL,' +
		'`habilitado`	INTEGER NOT NULL,' +
		'tecnico_nombre TEXT,' +
		'nota_nombre TEXT,' +
		'foto1 BLOB,' +
		'foto2 BLOB,' +
		'foto3 BLOB,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS	emails_recomendacion (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'rec_id INTEGER NOT NULL,' +
		'agricultor_nombre TEXT NOT NULL,' +
		'prioridad_nombre TEXT NOT NULL,' +
		'mensaje TEXT NOT NULL,' +
		'emails TEXT,' +
		'estado INTEGER);'
	);

	tx.executeSql(
		'CREATE TABLE IF NOT EXISTS	emails_supervision (' +
		'`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
		'sup_id INTEGER NOT NULL,' +
		'agricultor_nombre TEXT NOT NULL,' +
		'mensaje	TEXT NOT NULL,' +
		'emails TEXT,' +
		'estado INTEGER);'
	);
}

export function get_connection(next, showLoading) {
	if(Platform.OS === 'ios') {
		next(true);
	} else {
		NetInfo.isConnected.fetch().then(async isConnected => {
			console.log('Conexion a internet ' + isConnected);
			if (isConnected) {
				next(true);
			} else {
				showLoading(true, 'Alerta', 'Verifique su conexión a internet, no se pueden leer los datos', [{text: 'OK', onPress: null}], false);
				next(false);
			}
		});
	}
}

//Es llamada al instalar la app por primera vez y cuando se sincroniza para actualizar usuarios e insumos
async function getUserInsumosFunc(install = false, saveUsers, saveTemporadas, saveInsumos, saveCultivos, user = [], next = () => {}, showLoading) {
	console.log('----------GETTING DATOS FROM SERVER----------');
	const url = `${config.ROOT_URL}get-install/`;

	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	let usersInsumosFunction = async () => {
		await axios.get(url)
		.then(async (response) => {
			if(response.data){
				usuarios = response.data.usuarios;
				temporadas = response.data.temporadas;
				tipo_insumos = response.data.tipo_insumos;
				insumos = response.data.insumos;
				unidades = response.data.unidades;
				cultivos = response.data.cultivos;

				const cultivosValues = _.map(cultivos, c => {
					return '(' + c.cultivo_id + ', \'' + c.cultivo_nombre + '\', ' + c.tipo_cultivo_id + ', \'' + c.tipo_cultivo_nombre + '\', \'' + c.tipo_insumo_ids + '\', ' + 1 + ')';
				});
				if (install){
					let success = async () => {
		   			console.log('Instalación exitosa');
						await saveUsers(usuarios);
						await saveTemporadas(temporadas);
						await saveInsumos(insumos, tipo_insumos, unidades);
						await saveCultivos(cultivos);
						next(true);
					}

					const saveInstallFunc = async () => {
						await AsyncStorage.setItem(
							'installAgrobookCooprinsem',
							JSON.stringify({ usuarios, temporadas, insumos, tipo_insumos, unidades })
						).then(async () => {
							console.log('Save ok install');
							await AsyncStorage.setItem(
								'licenciaAgrobookCooprinsem',
								JSON.stringify({ hora: moment() })
							).then(async () => {
								console.log('Save ok licencia');
								success();
							}).catch(async (error) => {
								console.log('Save Error install ' + JSON.stringify(error));
								errorFunc('Instalación');
							});
						}).catch(async (error) => {
							console.log('Save Error install ' + JSON.stringify(error));
							errorFunc('Instalación');
						});
					};

					db.transaction(create_query,
						(error) => {
							console.log('Error creando tablas install ' + JSON.stringify(error));
							errorFunc('Instalación');
						},
						async () => {
							await db.transaction(tx => {
								tx.executeSql(
									'INSERT INTO cultivo (cultivo_id, cultivo_nombre, tipo_cultivo_id, tipo_cultivo_nombre, tipo_insumo_ids, estado) VALUES ' + cultivosValues.join(', ') + ';');
							}, (error) => {
								console.log('Error insert cultivo install ' + JSON.stringify(error));
								errorFunc('Instalación');
							}, saveInstallFunc);
						}
					);
				} else {
					await AsyncStorage.mergeItem(
						'installAgrobookCooprinsem',
						JSON.stringify({ usuarios, temporadas, insumos, tipo_insumos, unidades })
					).then(async () => {
						console.log('Save ok sync user insumos');
						await db.transaction(tx => {
							tx.executeSql('DELETE FROM cultivo');
							tx.executeSql(
								'INSERT INTO cultivo (cultivo_id, cultivo_nombre, tipo_cultivo_id, tipo_cultivo_nombre, tipo_insumo_ids, estado) VALUES ' + cultivosValues.join(', ') + ';'
							);
						}, (error) => {
							console.log('Error sync cultivos ' + JSON.stringify(error));
							errorFunc('sincronización');
						}, async () => {
							console.log('Save cultivos sycn');
							await saveUsers(usuarios);
							await saveTemporadas(temporadas);
							await saveInsumos(insumos, tipo_insumos, unidades);
							await saveCultivos(cultivos);
							if(user) {
								const newUser = _.find(usuarios, {rut: user.rut, pass: user.pass});
								if(newUser){
									await AsyncStorage.mergeItem(
										'lastLoginAgrobookCooprinsem',
										JSON.stringify({lastLogin: user.lastLogin, ...newUser})
									).catch((error) => {
										console.log('Save user sync Error merge '+JSON.stringify(error));
										errorFunc('sincronización');
									}).then(async () => {
										console.log('Save user sync ok merge');
										next(true);
									});
								} else {
									console.log('No habia last login');
									next(true);
								}
							} else {
								console.log('No habia last login');
								next(true);
							}
						});
					}).catch(async (error) => {
						console.log('Save Error sync insumos user '+JSON.stringify(error));
						errorFunc('sincronización');
					});
				}
			} else {
				if (install) {
					showLoading(true, 'Alerta', 'No se encontraron datos para importar', [{text: 'OK', onPress: null}], false);
				}
				next(false);
			}
		}).catch((error) => {
			console.log('Error insumos - user insumos '+JSON.stringify(error));
			let msg = '';
			if(install){
				msg = 'Instalación';
			} else {
				msg = 'Sincronización';
			}
			errorFunc(msg);
		});
	};

	const nextNext = (resp) => {
		if(resp) {
			usersInsumosFunction();
		} else {
			next(false);
		}
	};

	get_connection(nextNext, showLoading);
}

//es para leer los ussuarios e insumos que estan en la bd local del telef
export async function get_userInsumos(saveUsers, saveTemporadas, saveInsumos, saveCultivos, next, showLoading) {
	const install_string = await AsyncStorage.getItem('installAgrobookCooprinsem');
	const install_json = JSON.parse(install_string);
	if(install_json && install_json.usuarios) {
		await saveUsers(install_json.usuarios);
		await saveTemporadas(install_json.temporadas);
		await saveInsumos(install_json.insumos, install_json.tipo_insumos, install_json.unidades);
		db.transaction(tx => {
			tx.executeSql(
			'SELECT * FROM cultivo', [],
			async (txx, { rows }) => {
				console.log("Gotten cultivos to reducer " + rows.length);
				if(rows._array.length > 0){
					cultivos = rows._array;
					await saveCultivos(cultivos);
					next(true);
				} else {
					await saveCultivos([]);
					next(true);
				}
			}, (error) => {
				console.log('Error sync cultivos ' + JSON.stringify(error));
				next(true);
			});
		});
	} else {
		showLoading(true, 'Alerta', 'Verifica la conexión', [{text: 'OK', onPress: null}], false);
		next(true);
	}
}

//para ver si esta instlada la app
export async function install_query(saveUsers, saveTemporadas, saveInsumos, saveCultivos, install, user = [], next, showLoading) {
	console.log('----------INSTALACION - INICIO----------');
	if(install) {
		console.log('Primera vez');
	} else {
		console.log('Ya esta instalado');
	}
	getUserInsumosFunc(install, saveUsers, saveTemporadas, saveInsumos, saveCultivos, user, next, showLoading);
}

//limpia todas las tablas
export function clear_tables(user, setData, setRec, setCollects, sync, next, salir, splash = false, showLoading) {
	console.log('Clear tables');
	db.transaction( async tx => {
		tx.executeSql('DELETE FROM contrato');
		tx.executeSql('DELETE FROM collect');
		tx.executeSql('DELETE FROM campo');
		tx.executeSql('DELETE FROM cultivos_campo');
		tx.executeSql('DELETE FROM recomendacion');
		tx.executeSql('DELETE FROM insumos_recomendacion');
		tx.executeSql('DELETE FROM emails_recomendacion');
		tx.executeSql('DELETE FROM supervision');
		tx.executeSql('DELETE FROM emails_supervision');
	}, (error) => {
		console.log('Error clearing tables to sync ' + JSON.stringify(error));
		showLoading(true, 'Error', 'Hubo un error en la sincronización', [{text: 'OK', onPress: null}], false);
		next(false);
	}, insert_tables(user, setData, setRec, setCollects, sync, next, salir, splash, showLoading));
}

//inserta la info de la bd del serv en la local
function insert_tables(user, setData, setRec, setCollects, sync, next, salir, splash = false, showLoading) {
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	if(!salir) {
		const insertFunction = async () => {
			//if(splash) {
				showLoading(true, 'Notificación', 'Recibiendo datos del servidor', [], true);
			//}
			console.log('----------GETTING DATA FROM SERVER----------');
			const url = `${config.ROOT_URL}get-data/?user=${user.rut}&pass=${user.pass}`;
			let contratos_serv = [];
			await axios.get(url)
			.then(async (response) => {
				if(response.data){
					console.log('Obtuve contratos, recomendaciones, supervisiones, del servidor');
					contratos_serv = response.data;
					let values_collects = [],
							signos_collects = [],
							values_campos = [],
							signos_campos = [],
							values_cults = [],
							signos_cults = [],
							values_recs = [],
							signos_recs = [],
							signos_insumos = [],
							values_insumos = [],
							values_sups = [],
							signos_sups = [];

					//contratos_serv = await contratos_user(response.data, user);
					let saveContratos = () => {
						console.log('Éxito saving datos in base phone, Solicitando get datos to reducer');
						get_contratos(user, setData, setRec, setCollects, sync, next, showLoading);
					};

					let insertSups = () => {
						if(values_sups.length > 0) {
							//if(splash) {
							showLoading(true, 'Notificación', 'Recibiendo supervisiones del servidor (3/3)', [{text: 'OK', onPress: null}], false);
							//}
							console.log('Insert supervisiones from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM supervision');
								_.map(values_sups, (sups, key) => {
									const supValuesChunk = _.chunk(sups, 10);
									const supSignosChunk = _.chunk(signos_sups[key], 10);
									_.map(supValuesChunk, (s, k) => {
										tx.executeSql(
											'INSERT INTO supervision (id, rec_id, tecnico_id, contrato_id, rec_cultivos_campo_ids, fecha, title, inicio, avance, nota_id, observaciones, repeat_task, en_oficina, lat, lon, alt, habilitado, tecnico_nombre, nota_nombre, foto1, foto2, foto3, estado) VALUES ' + supSignosChunk[k].join(', ') + ';',
											[].concat.apply([], s)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización de supervisiones');
								console.log(error);
							}, saveContratos);
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM supervision');
							}, (error) => {
								errorFunc('la Sincronización de supervisiones');
								console.log(error);
							}, saveContratos);
						}
					};

					let insertInsumos = () => {
						if(values_insumos.length > 0) {
							console.log('Insert insumos de recomendaciones from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM insumos_recomendacion');
								_.map(values_insumos, (ins, key) => {
									const insValuesChunk = _.chunk(ins, 10);
									const insSignosChunk = _.chunk(signos_insumos[key], 10);
									_.map(insValuesChunk, (i, k) => {
										tx.executeSql(
											'INSERT INTO insumos_recomendacion (id, rec_id, insumo_id, superficie, dosis, unidad_id, insumo_nombre, unidad_nombre, estado) VALUES ' + insSignosChunk[k].join(', ') + ';',
											[].concat.apply([], i)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, () => {
								insertSups();
							});
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM recomendacion');
								tx.executeSql('DELETE FROM insumos_recomendacion');
								tx.executeSql('DELETE FROM supervision');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, saveContratos);
						}
					};

					let insertRecs = () => {
						if(values_recs.length > 0) {
							showLoading(true, 'Notificación', 'Recibiendo recomendaciones del servidor (2/3)', [{text: 'OK', onPress: null}], false);
							console.log('Insert recomendaciones from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM recomendacion');
								_.map(values_recs, (recs, key) => {
									const recValuesChunk = _.chunk(recs, 10);
									const recSignosChunk = _.chunk(signos_recs[key], 10);
									_.map(recValuesChunk, (r, k) => {
										tx.executeSql(
											//orden segun como estan en la tabla!!
											'INSERT INTO recomendacion (id, contrato_id, rec_cultivos_campo_ids, tecnico_id, fecha, lat, lon, alt, en_oficina, tipo_insumo_id, prioridad_id, notas, habilitado, tecnico_nombre, tipo_insumo_nombre, prioridad_nombre, foto1, foto2, foto3, estado) VALUES ' + recSignosChunk[k].join(', ') + ';',
											[].concat.apply([], r)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertInsumos);
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM recomendacion');
								tx.executeSql('DELETE FROM insumos_recomendacion');
								tx.executeSql('DELETE FROM supervision');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, saveContratos);
						}
					};

					let insertCults = () => {
						if(values_cults.length > 0) {
							console.log('Insert cultivos de contratos from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM cultivos_campo');
								_.map(values_cults, (cults, key) => {
									const cultValuesChunk = _.chunk(cults, 18);
									const cultSignosChunk = _.chunk(signos_cults[key], 18);
									_.map(cultValuesChunk, (cl, k) => {
										tx.executeSql(
											'INSERT INTO cultivos_campo (id, cultivo_id, campo_id, temporada_id, estadoTabla, cultivo_nombre, tipo_cultivo_id, tipo_cultivo_nombre, campo_nombre, contrato_id, sup_sembrada, temporada_nombre, tipo_insumo_ids, estado) VALUES ' + cultSignosChunk[k].join(', ') + ';',
											[].concat.apply([], cl)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, () => {
								insertRecs();
							});
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM cultivos_campo');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertRecs);
						}
					};

					let insertCampos = () => {
						if(values_campos.length > 0) {
							console.log('Insert campos from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM campo');
								_.map(values_campos, (campos, key) => {
									const campValuesChunk = _.chunk(campos, 25);
									const campSignosChunk = _.chunk(signos_campos[key], 25);
									_.map(campValuesChunk, (cp, k) => {
										tx.executeSql(
											'INSERT INTO campo (id, nombre, sup_sembrada, contrato_id, estado) VALUES ' + campSignosChunk[k].join(', ') + ';',
											[].concat.apply([], cp)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertCults);
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM campo');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertCults);
						}
					};

					let insertCollects = () => {
						if(values_collects.length > 0) {
							console.log('Insert collects from server');
							db.transaction(tx => {
								tx.executeSql('DELETE FROM collect');
								_.map(values_collects, (collects, key) => {
									const collectsValuesChunk = _.chunk(collects, 10);
									const collectsSignosChunk = _.chunk(signos_collects[key], 10);
									_.map(collectsValuesChunk, (cl, k) => {
										tx.executeSql(
											//orden segun como estan en la tabla!!
											'INSERT INTO collect (id, fecha, observacion, foto1, foto2, foto3, lat, lon, alt, agricultor_id, campo_id, tecnicos_id, agricultor_nombre, agricultor_rut, cto_num, calle, distrito, zona, potrero, estadoTabla, estado) VALUES ' + collectsSignosChunk[k].join(', ') + ';',
											[].concat.apply([], cl)
										);
									});
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertCampos);
						} else {
							db.transaction(tx => {
								tx.executeSql('DELETE FROM collect');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertCampos);
						}
					};

					let insertConts = () => {
						if(contratos_serv.length > 0) {
							showLoading(true, 'Notificación', 'Recibiendo destinatarios del servidor (1/3)', [{text: 'OK', onPress: null}], false);
							console.log('Insert contratos from server');
							db.transaction( async tx => {
								tx.executeSql('DELETE FROM contrato');
								_.map(contratos_serv, c => {
									if (c.recomendaciones && c.recomendaciones.length > 0) {
										let values_recs_array = [], values_recs_array2 = [];
										const signos_recs_array = _.map(c.recomendaciones, r => {
											if(r.foto1) {
												r.foto1 = Buffer.from(r.foto1, 'base64').toString('binary');
											}
											if(r.foto2) {
												r.foto2 = Buffer.from(r.foto2, 'base64').toString('binary');
											}
											if(r.foto3) {
												r.foto3 = Buffer.from(r.foto3, 'base64').toString('binary');
											}

											let values_insumos_array = [];
											const signos_insumos_array = _.map(r.insumos, i => {
												values_insumos_array.push([i.id, i.rec_id, i.insumo_id, i.superficie, i.dosis, i.unidad_id, i.insumo_nombre, i.unidad_nombre, 1]);
												return '(?,?,?,?,?,?,?,?,?)';
											});

											if(signos_insumos_array.length > 0) signos_insumos.push(signos_insumos_array);
											if(values_insumos_array.length > 0) values_insumos.push(values_insumos_array);

											let values_sups_array = [];
											const signos_sups_array = _.map(r.supervisiones, sup => {
												if(sup.foto1) {
													sup.foto1 = Buffer.from(sup.foto1, 'base64').toString('binary');
												}
												if(sup.foto2) {
													sup.foto2 = Buffer.from(sup.foto2, 'base64').toString('binary');
												}
												if(sup.foto3) {
													sup.foto3 = Buffer.from(sup.foto3, 'base64').toString('binary');
												}
												values_sups_array.push([sup.id, sup.rec_id, sup.tecnico_id, sup.contrato_id, sup.rec_cultivos_campo_ids, sup.fecha, sup.title, sup.inicio, sup.avance, sup.nota_id, sup.observaciones.replace(/'/g, "''"), sup.repeat_task, sup.en_oficina, sup.lat, sup.lon, sup.alt, sup.habilitado, sup.tecnico_nombre, sup.nota_nombre, sup.foto1, sup.foto2, sup.foto3, 1]);
												return '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
											});

											if(signos_sups_array.length > 0) signos_sups.push(signos_sups_array);
											if(values_sups_array.length > 0) values_sups.push(values_sups_array);

											values_recs_array.push([r.id, r.contrato_id, r.rec_cultivos_campo_ids, r.tecnico_id, r.fecha, r.lat, r.lon, r.alt, r.en_oficina, r.tipo_insumo_id, r.prioridad_id, r.notas.replace(/'/g, "''"), r.habilitado, r.tecnico_nombre, r.tipo_insumo_nombre, r.prioridad_nombre, r.foto1, r.foto2, r.foto3, 1]);
											return '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
										});

										if(signos_recs_array.length > 0) signos_recs.push(signos_recs_array);
										if(values_recs_array.length > 0) values_recs.push(values_recs_array);
									}

									if (c.campos && c.campos.length > 0) {
										let values_campos_array = [], signos_campos_array = [];
										_.map(c.campos, cp => {
											values_campos_array.push([cp.id, cp.nombre, cp.sup_sembrada, cp.contrato_id, 1]);
											signos_campos_array.push('(?,?,?,?,?)');
										});

										if(signos_campos_array.length > 0) signos_campos.push(signos_campos_array);
										if(values_campos_array.length > 0) values_campos.push(values_campos_array);
									}

									if(c.cultivos_campo.length > 0) {
										let values_cults_array =[];
										const signos_cults_array = _.map(c.cultivos_campo, cu => {
											//console.log({ estodo: cu.estado });
											const estado = cu.estado ? 1 : 0;
											values_cults_array.push([cu.id, cu.cultivo_id, cu.campo_id, cu.temporada_id, estado, cu.cultivo_nombre, cu.tipo_cultivo_id, cu.tipo_cultivo_nombre, cu.campo_nombre, cu.contrato_id, cu.sup_sembrada, cu.temporada_nombre, cu.tipo_insumo_ids, 1]);
											return '(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
										});

										if(signos_cults_array.length > 0) signos_cults.push(signos_cults_array);
										if(values_cults_array.length > 0) values_cults.push(values_cults_array);
									}

									if (c.collect && c.collect.length > 0) {
											let values_collects_array = [], signos_collects_array = [];
										_.map(c.collect, cl => {
											if(cl.foto1) {
												cl.foto1 = Buffer.from(cl.foto1, 'base64').toString('binary');
											}
											if(cl.foto2) {
												cl.foto2 = Buffer.from(cl.foto2, 'base64').toString('binary');
											}
											if(cl.foto3) {
												cl.foto3 = Buffer.from(cl.foto3, 'base64').toString('binary');
											}
											const estado = cl.estado ? 1 : 0;
											values_collects_array.push([cl.id, cl.fecha, cl.observacion, cl.foto1, cl.foto2, cl.foto3, cl.lat, cl.lon, cl.alt, cl.agricultor_id, cl.campo_id, cl.tecnicos_id, cl.agricultor_nombre, cl.agricultor_rut, cl.cto_num, cl.calle, cl.distrito, cl.zona, cl.potrero, estado, 1]);
											signos_collects_array.push('(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
										});

										if(signos_collects_array.length > 0) signos_collects.push(signos_collects_array);
										if(values_collects_array.length > 0) values_collects.push(values_collects_array);
									}

									const values_contratos = '(' + c.id + ', \'' + c.cto_num + '\', \'' + c.calle + '\', \'' + c.distrito + '\', ' + c.agricultor_id + ', ' + c.zona_id + ', ' + c.habilitado + ', \'' + c.agricultor_nombre + '\', \'' + c.agricultor_rut + '\', \'' + c.agricultor_email + '\', \'' + c.zona_nombre + '\', ' + 1 + ')';

									tx.executeSql(
										//orden segun lo que esta entre ()
										'INSERT INTO contrato (id, cto_num, calle, distrito, agricultor_id, zona_id, habilitado, agricultor_nombre, agricultor_rut, agricultor_email, zona_nombre, estado) VALUES ' + values_contratos + ';'
									);
								});
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, insertCollects);
						} else {
							showLoading(true, 'Alerta', 'No hay datos para importar', [{text: 'OK', onPress: null}], false);
							db.transaction(tx => {
								tx.executeSql('DELETE FROM contrato');
								tx.executeSql('DELETE FROM collect');
								tx.executeSql('DELETE FROM campo');
								tx.executeSql('DELETE FROM cultivos_campo');
								tx.executeSql('DELETE FROM recomendacion');
								tx.executeSql('DELETE FROM insumos_recomendacion');
								tx.executeSql('DELETE FROM emails_recomendacion');
								tx.executeSql('DELETE FROM supervision');
								tx.executeSql('DELETE FROM emails_supervision');
							}, (error) => {
								errorFunc('la Sincronización');
								console.log(error);
							}, () => next(false));
						}
					};

					insertConts();
				} else {
					console.log('No hay datos del servidor ' + JSON.stringify(error));
					showLoading(true, 'Alerta', 'No hay datos para importar', [{text: 'OK', onPress: null}], false);
					db.transaction(tx => {
						tx.executeSql('DELETE FROM contrato');
						tx.executeSql('DELETE FROM collect');
						tx.executeSql('DELETE FROM campo');
						tx.executeSql('DELETE FROM cultivos_campo');
						tx.executeSql('DELETE FROM recomendacion');
						tx.executeSql('DELETE FROM insumos_recomendacion');
						tx.executeSql('DELETE FROM emails_recomendacion');
						tx.executeSql('DELETE FROM supervision');
						tx.executeSql('DELETE FROM emails_supervision');
					}, (error) => {
						errorFunc('la Sincronización');
						console.log(error);
					}, () => next(false));
				}
			})
			.catch(async (error) => {
				console.log('Datos del servidor error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		};

		let goNext = (resp) => {
			if(resp) {
				insertFunction();
			} else {
				next(false);
			}
		};

		get_connection(goNext, showLoading);
	}	else {
		//pa que salga de la app
		next(true);
	}
}

//lee los datos que estan en la bd local del telef y lo guarda en los reducers para usarla en la app
export function get_contratos(user, setData, setRec, setCollects, sync = false, next = () => {}, showLoading) {
	console.log('----------GETTING DATOS FROM TABLES TO SAVE----------');
	let contratos = [],
			collects = [],
			campos = [],
			cultivos = [],
			recomendaciones = [],
			insumos = [],
			supervisiones = [],
			cs_id =[],
			cps_id = [];

	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	let saveData = async () => {
		if(recomendaciones.length > 0){
			_.map(contratos, c => {
				let rec = _.filter(recomendaciones, {contrato_id: c.id});
				c.recomendaciones = rec.length > 0 ? rec : [];
			});
			await setData(contratos);
			let mis_cs_recomendaciones = [];
			mis_cs_recomendaciones = _.filter(contratos, c => {
				return c.recomendaciones.length > 0;
			});
			await setRec(mis_cs_recomendaciones);
			await setCollects(collects);
			console.log('Segun ya se guardo todo');
			if(sync) {
				showLoading(true, 'Éxito', 'Sincronización Exitosa', [{text: 'OK', onPress: null}], false);
			}
			next(true);
		} else {
			console.log('Contratos set sin recomendaciones');
			_.map(contratos, c => c.recomendaciones = []);
			await setData(contratos);
			console.log('Segun ya se guardo todo');
			if(sync) {
				showLoading(true, 'Éxito', 'Sincronización Exitosa', [{text: 'OK', onPress: null}], false);
			}
			next(true);
		}
	};

	let setSupevisiones = (txx, { rows }) => {
		if(rows._array.length > 0){
			console.log("Gotten supervisiones " + rows.length);
			_.map(recomendaciones, r => {
				let sup = _.filter(rows._array, {rec_id: r.id});
				r.supervisiones = sup.length > 0 ? sup : [];
			});
		} else {
			console.log('No supervisiones');
			_.map(recomendaciones, r => r.supervisiones = []);
		}
	};

	let setInsumos = (txx, { rows }) => {
		if(rows._array.length > 0){
			console.log("Gotten insumos recomendaciones " + rows.length);
			_.map(recomendaciones, r => {
				let rin = _.filter(rows._array, {rec_id: r.id});
				r.insumos = rin.length > 0 ? rin : [];
			});
		} else {
			console.log('No insumos');
			_.map(recomendaciones, r => r.insumos = []);
		}
	};

	let setCultivosCamposRec = async () => {
		console.log("Getting cultivos campos de rec");
		if(cultivos.length > 0) {
			await _.map(recomendaciones, r => {
				const rec_cultivos_campo_ids = r.rec_cultivos_campo_ids.split(',');
				r.cultivos_campo = [];
				_.map(rec_cultivos_campo_ids, rc => {
					let rec_cult_camp = _.find(cultivos, { id: parseInt(rc) });
					if (rec_cult_camp) r.cultivos_campo = _.concat(r.cultivos_campo, rec_cult_camp);
				});
			});
			saveData();
		} else {
			await _.map(recomendaciones, r => {
				r.cultivos_campo = [];
			});
			saveData();
		}
	};

	let getInsumosSuper = async (txx, { rows }) => {
		if(rows._array.length > 0){
			console.log("Gotten recomendaciones " + rows.length);
			recomendaciones = rows._array;


			let rs_id = _.map(rows._array, r => r.id),
					sql1 = `SELECT * FROM insumos_recomendacion WHERE insumos_recomendacion.rec_id IN (${rs_id.join(', ')});`,
					sql2 = `SELECT * FROM supervision WHERE supervision.rec_id IN (${rs_id.join(', ')});`;
			db.transaction( async tx => {
				console.log("Getting insumos");
				await tx.executeSql(sql1, [], setInsumos, (error) => {
					console.log('Error getting insumos de recs to reducer ' + JSON.stringify(error));
					errorFunc('el proceso');
				});
				console.log("Getting supervisiones");
				await tx.executeSql(sql2, [], setSupevisiones, (error) => {
					console.log('Error getting supervisiones to reducer ' + JSON.stringify(error));
					errorFunc('el proceso');
				});
			}, (error) => {
				console.log('Error getting insumos y supervisiones to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			}, setCultivosCamposRec);
		} else {
			console.log('Contratos set sin recomendaciones');
			_.map(contratos, c => c.recomendaciones = []);
			await setData(contratos);
			await setRec([]);
			console.log('Segun ya se guardo todo');
			if(sync) {
				showLoading(true, 'Éxito', 'Sincronización Exitosa', [{text: 'OK', onPress: null}], false);
			}
			next(true);
		}
	};

	let getRecomen = () => {
		console.log("Getting recomendaciones to save in reducer");
		let sql = `SELECT * FROM recomendacion WHERE recomendacion.contrato_id IN (${cs_id.join(', ')});`;
		db.transaction( tx => {
			tx.executeSql(sql, [], getInsumosSuper, (error) => {
				console.log('Error getting recomendaciones  to save in reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		});
	};

	let getCultivos = () => {
		console.log("Getting cultivos de campo to save in reducer");
		cps_id = _.map(campos, c => c.id);
		let sql = `SELECT * FROM cultivos_campo WHERE cultivos_campo.campo_id IN (${cps_id.join(', ')});`;
		db.transaction( tx => {
			tx.executeSql(sql, [], async (txx, { rows }) => {
				console.log("Gotten cultivos de campos to save in reducer " + rows.length);
				if(rows._array.length > 0){
					cultivos = rows._array;
					await _.map(contratos, c => {
						//let cul = _.filter(rows._array, {contrato_id: c.id});
						if(c.campos.length > 0) {
							_.map(c.campos, cp => {
								const culcps = _.filter(cultivos, { campo_id: cp.id, estadoTabla: 1 });
								//let culcps = _.filter(cul, {campo_id: cp.id});
								cp.cultivos = culcps.length > 0 ? culcps : [];
							});
						}
						const culcps = _.filter(cultivos, { contrato_id: c.id });
						c.cultivos_campo = culcps.length > 0 ? culcps : [];
					});
					getRecomen();
				} else {
					_.map(contratos, c => {
						if(c.campos.length > 0) {
							_.map(c.campos, cp => {
								cp.cultivos = [];
							});
						}
						c.cultivos_campo = [];
					});
					getRecomen();
				}
			}, (error) => {
				console.log('Error getting cultivos de campos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		});
	};

	let getCampos = () => {
		console.log("Getting campos to save in reducer");
		cs_id = _.map(contratos, c => c.id),
			sql = `SELECT * FROM campo WHERE campo.contrato_id IN (${cs_id.join(', ')});`;
		db.transaction( tx => {
			tx.executeSql(sql, [], (txx, { rows }) => {
				console.log("Gotten campos to save in reducer " + rows.length);
				if(rows._array.length > 0){
					campos = rows._array;
					_.map(contratos, c => {
						let cps = _.filter(rows._array, {contrato_id: c.id});
						c.campos = cps.length > 0 ? cps : [];
					});
					getCultivos();
				} else {
					_.map(contratos, c => c.campos = []);
					getCultivos();
				}
			}, (error) => {
				console.log('Error getting campos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		});
	};

	let getCollects = async (txx, { rows }) => {
		console.log("Gotten contratos to save in reducer " + rows.length);
		if(rows._array.length > 0){
			contratos = rows._array;
			console.log("Getting collects");
			sql = `SELECT * FROM collect;`;
			db.transaction( tx => {
				tx.executeSql(sql, [], (txx, { rows }) => {
					console.log("Gotten collects to save in reducer " + rows.length);
					if(rows._array.length > 0){
						collects = rows._array;
						_.map(contratos, c => {
							let cls = _.filter(collects, {cto_num: c.cto_num});
							c.collects = cls.length > 0 ? cls : [];
						});
						getCampos();
					} else {
						_.map(contratos, c => c.collects = []);
						getCampos();
					}
				}, (error) => {
					console.log('Error getting collects to reducer ' + JSON.stringify(error));
					errorFunc('el proceso');
				});
			});
		} else {
			if (sync) {
				showLoading(true, 'Alerta', 'No se encontraron datos para importar', [{text: 'OK', onPress: null}], false);
			}
			await setData([]);
			await setRec([]);
			await setCollects([]);
			next(true);
		}
	};

	console.log('Entro a getting contratos');
	db.transaction( tx => {
		console.log("Getting contratos");
		let sql = '';
		sql = 'SELECT * FROM contrato WHERE contrato.habilitado = 1;';
		tx.executeSql(sql, [], getCollects, (error) => {
			console.log('Error getting tecnicos to reducer ' + JSON.stringify(error));
			errorFunc('el proceso');
		});
		/*if (user.perfil_id === 1) {         //Gerente
			sql = 'SELECT * FROM contrato WHERE contrato.habilitado = 1;';
			tx.executeSql(sql, [], getCollects, (error) => {
				console.log('Error getting tecnicos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		} else if (user.perfil_id === 2) {  //Tecnico/Asesor
			sql = `SELECT * FROM contrato WHERE contrato.habilitado = 1 AND contrato.id IN (${user.contratos_id})`;
			tx.executeSql(sql, [], getCollects, (error) => {
				console.log('Error getting tecnicos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		} else if (user.perfil_id === 3) {  //Zonal
			sql = `SELECT * FROM contrato WHERE contrato.habilitado = 1 AND contrato.zona_id IN (${user.zonas_id});`;
			tx.executeSql(sql, [], getCollects, (error) => {
				console.log('Error getting contratos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		} else {
			sql = 'SELECT * FROM contrato WHERE contrato.habilitado = 1;';
			tx.executeSql(sql, [], getCollects, (error) => {
				console.log('Error getting tecnicos to reducer ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		}*/
	});
}


//verifica la licencia
async function getLicenciaSync(user, next, showLoading) {
	console.log('---------------GETTING LICENCIA-----------------');

	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	const url = `${config.ROOT_URL}get-licencia/?user=${user.rut}&pass=${user.pass}&empresa_lic=${config.EMPRESA}&user_lic=${config.USER_LIC}&pass_lic=${config.PASS_LIC}&app=agro`;
	await axios.get(url)
	.then(async (response) => {
		console.log('Response get licencia ' + JSON.stringify(response.data));
		if(response.data.error){
			errorFunc('la Sincronización');
		} else {
			if(response.data && response.data.licencia && response.data.licencia.user_lic) {
				const hoy = moment(),
							exp = moment(new Date(response.data.licencia.fecha_expiracion)),
							diff = exp.diff(hoy, 'days');
				console.log('Dias ' + diff);
				if(diff > 30) {
					next(true);
				} else if (diff < 30 && diff > 0) {
					const licencia_string = await AsyncStorage.getItem('licenciaAgrobookCooprinsem');
					const licencia_json = JSON.parse(licencia_string);
					console.log(licencia_json.hora);
					if (licencia_json && licencia_json.hora) {
						if (hoy.isAfter(licencia_json.hora)) {
							showLoading(true, 'Sincronizando', `Licencia expira en ${diff} dias`, [{text: 'OK', onPress: null}], false);
							await AsyncStorage.mergeItem(
								'licenciaAgrobookCooprinsem',
								JSON.stringify({ hora: hoy.add(config.INTERVAL, 'h') })
							).catch((error) => {
								console.log('Save licencia ERROT to 1 '+JSON.stringify(error));
							}).then(async () => {
								console.log('Save licencia OK to 1');
							});
						}
					}
					next(true);
				} else {
					showLoading(true, 'Alerta', 'Licencia expirada. Contacte al encargado', [{text: 'OK', onPress: null}], false);
					next(false);
				}
			} else {
				showLoading(true, 'Error', 'No se encontro licencia. Contacte al encargado', [{text: 'OK', onPress: null}], false);
				next(false);
			}
		}
	}).catch((error) => {
		console.log('Licencia error ' + JSON.stringify(error));
		errorFunc('la Sincronización');
	});
}

//cuando se va sincronizar sabiendo que no hay nada para enviar, solo actualizar lo que este en el serv para el telef
export async function sync_data2(user, setData, setRec, setCollects, saveUsers, saveTemporadas, saveInsumos, saveCultivos, next, splash = false, showLoading) {
	const syncFunction = () => {
		let nextNext = async (resp) => {
			if(resp) {
				let lastLogin_string = await AsyncStorage.getItem('lastLoginAgrobookCooprinsem');
				const user = JSON.parse(lastLogin_string);
				if(user.pass) insert_tables(user, setData, setRec, setCollects, true, next, false, splash, showLoading);
				else next(true);
			} else next(false);
		};
		getUserInsumosFunc(false, saveUsers, saveTemporadas, saveInsumos, saveCultivos, user, nextNext, showLoading);
	};

	let nextNextNext = (resp) => {
		if(resp) {
			syncFunction();
		} else {
			next(false);
		}
	};

	let goNext = (resp) => {
		if (resp) {
			showLoading(true, 'Alerta', 'Sincronizando', [], true);
			getLicenciaSync(user, nextNextNext, showLoading);
		} else {
			next(false);
		}
	};

	get_connection(goNext, showLoading);
}

//sincronizar y enviar lo nuevo del telef al server
export async function sync_data(user, setData, setRec, setCollects, saveUsers, saveTemporadas, saveInsumos, saveCultivos, next, salir = false, splash = false, showLoading) {
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	const getUserInsumos = () => {
		const nextNext = async (resp) => {
			if (resp) {
				const lastLogin_string = await AsyncStorage.getItem('lastLoginAgrobookCooprinsem');
				const user = JSON.parse(lastLogin_string);
				insert_tables(user, setData, setRec, setCollects, true, next, false, splash, showLoading);
			}
			else next(false);
		};
		getUserInsumosFunc(false, saveUsers, saveTemporadas, saveInsumos, saveCultivos, user, nextNext, showLoading);
	}

	let syncSupervisiones = async (dataSync) => {
		if(dataSync.supervisionesSync.length > 0) {
			console.log('Enviando al servidor supervisiones');
			showLoading(true, 'Notificación', 'Enviando supervisiones al servidor', [{text: 'OK', onPress: null}], false);
			const url = `${config.ROOT_URL}post-supervisiones/`;
			await axios.post(url, {
				user: user.rut,
				pass: user.pass,
				docs: dataSync.supervisionesSync
			}).then((response) => {
				console.log('Response sync supervisiones ' + JSON.stringify(response.data));
				if(response.data.error){
					errorFunc('la Sincronización');
				} else {
					db.transaction( async tx => {
						tx.executeSql('UPDATE supervision SET estado=1 WHERE estado=0;');
					});
					getUserInsumos();
				}
			}).catch((error) => {
				console.log('Supervisiones sync error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		} else getUserInsumos();
	};

	let syncCollects = async (dataSync) => {
		if(dataSync.collectsSync.length > 0) {
			console.log('Enviando al servidor collects');
			//if(splash) {
				showLoading(true, 'Notificación', 'Enviando registros Collect al servidor', [{ text: 'OK', onPress: null }], false);
			//}
			const url = `${config.ROOT_URL}post-collects-rec/`;
			await axios.post(url, {
				user: user.rut,
				pass: user.pass,
				docs: dataSync.collectsSync
			}).then((response) => {
				console.log('Response sync collects ' + JSON.stringify(response.data));
				if (response.data.error) {
					errorFunc('la Sincronización');
				} else {
					db.transaction( async tx => {
						tx.executeSql('UPDATE collect SET estado=1 WHERE estado=0;');
					});
					syncSupervisiones(dataSync);
				}
			}).catch((error) => {
				console.log('recomendaciones error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		} else {
			syncSupervisiones(dataSync);
		};
	};

	let syncRecomendaciones = async (dataSync) => {
		if(dataSync.recomendacionesSync.length > 0) {
			console.log('Enviando al servidor recomendaciones');
			//if(splash) {
				showLoading(true, 'Notificación', 'Enviando recomendaciones al servidor', [{text: 'OK', onPress: null}], false);
			//}
			const url = `${config.ROOT_URL}post-recomendaciones/`;
			await axios.post(url, {
				user: user.rut,
				pass: user.pass,
				docs: dataSync.recomendacionesSync
			}).then((response) => {
				console.log('Response sync recomendaciones ' + JSON.stringify(response.data));
				if (response.data.error) {
					errorFunc('la Sincronización');
				} else {
					db.transaction( async tx => {
						tx.executeSql('UPDATE recomendacion SET estado=1 WHERE estado=0;');
						tx.executeSql('UPDATE insumos_recomendacion SET estado=1 WHERE estado=0;');
					});
					syncCollects(dataSync);
				}
			}).catch((error) => {
				console.log('recomendaciones error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		} else {
			syncSupervisiones(dataSync);
		};
	};

	let syncCultivos = async (dataSync) => {
		if(dataSync.camposSync.length > 0 || dataSync.cultivosCamposSync.length > 0 || dataSync.cultivosSync.length > 0) {
			console.log('Enviando al servidor campos, cultivos y cultivos de campos');
			const url = `${config.ROOT_URL}post-cultivos/`;
			await axios.post(url, {
				user: user.rut,
				pass: user.pass,
				docs: {campos: dataSync.camposSync, cultivos: dataSync.cultivosSync, cultivosCampos: dataSync.cultivosCamposSync}
			}).then(async (response) => {
				console.log('Response sync campos, cultivos y cultivos campos ' + JSON.stringify(response.data));
				if (response.data.error) {
					errorFunc('la Sincronización');
				} else {
					db.transaction( async tx => {
						tx.executeSql('UPDATE campo SET estado=1 WHERE estado=0;');
						tx.executeSql('UPDATE cultivo SET estado=1 WHERE estado=0;');
						tx.executeSql('UPDATE cultivos_campo SET estado=1 WHERE estado=0;');
					});
					if (response.data.cultivosnuevos && response.data.cultivosnuevos.length > 0) {
						_.map(dataSync.recomendacionesSync, async r => {
							const rec_cultivos_campo_ids = r.rec_cultivos_campo_ids.split(',');
							let new_rec_cultivos_campo_ids = [];
							r.rec_cultivos_campo_ids = await _.map(rec_cultivos_campo_ids, rcc => {
								const idNew = _.find(response.data.cultivosnuevos, { idold: rcc });
								if (idNew) {
									return idNew;
								}
							}).join(',');
							db.transaction( async tx => {
								tx.executeSql(`UPDATE recomendacion SET rec_cultivos_campo_ids='${r.rec_cultivos_campo_ids}' WHERE id=${r.id};`);
							});
						});
					}
					syncRecomendaciones(dataSync);
				}
			}).catch(async (error) => {
				console.log('cultivos y cultivos de campos error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		} else {
			syncRecomendaciones(dataSync);
		}
	};

	let syncContratos = async (dataSync) => {
		if(dataSync.contratosSync.length > 0) {
			console.log('Enviando al servidor contratos');
			const url = `${config.ROOT_URL}post-contratos/`;
			await axios.post(url, {
				user: user.rut,
				pass: user.pass,
				docs: dataSync.contratosSync
			}).then((response) => {
				console.log('Response sync contratos ' + JSON.stringify(response.data));
				if(response.data.error){
					errorFunc('la Sincronización');
				} else {
					db.transaction( async tx => {
						tx.executeSql('UPDATE contrato SET estado=1 WHERE estado=0;');
					});
					syncCultivos(dataSync);
				}
			}).catch((error) => {
				console.log('Contratos error ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		} else {
			syncCultivos(dataSync);
		}
	};

	const syncFunction = () => {
		console.log('----------GETTING DATA FROM PHONE TO SYNC TO SERVER----------');
		const goNext = (resp) => {
			if(resp) syncContratos(resp);
			else next(false);
		};

		data_Sync(true, goNext, showLoading);
	};

	let nextNext = (resp) => {
		if(resp) {
			syncFunction();
		} else {
			next(false);
		}
	};

	let goNext = (resp) => {
		if (resp) {
			showLoading(true, 'Alerta', 'Sincronizando', [], true);
			getLicenciaSync(user, nextNext, showLoading);
		} else {
			next(false);
		}
	};

	get_connection(goNext, showLoading);
}


//ver si hay cosas para enviar
export function data_Sync(sync = false, next = () => {}, showLoading) {

	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	let contratosSync = [],
			camposSync = [],
			cultivosSync = [],
			cultivosCamposSync = [],
			recomendacionesSync = [],
			collectsSync = [],
			supervisionesSync = [];

	let response = () => {
		if(sync) {
			console.log('Enviando datos para sync');
			next({contratosSync, camposSync, cultivosSync, cultivosCamposSync, recomendacionesSync, collectsSync, supervisionesSync});
		} else {
			console.log('Enviando respuesta de si hay datos para sync');
			if (contratosSync.length > 0 || camposSync.length > 0 || cultivosSync.length > 0 || cultivosCamposSync.length > 0 || recomendacionesSync.length > 0 || collectsSync.length > 0 || supervisionesSync.length > 0){
				next(contratosSync.length + camposSync.length + cultivosSync.length + cultivosCamposSync.length + recomendacionesSync.length + supervisionesSync.length);
			} else next(0);
		}
	}

	const getSupervisionesSync = () => {
		console.log('Getting supervisiones to sync');
		let sql = `SELECT * FROM supervision WHERE supervision.estado = 0`;
		db.transaction(tx => {
			tx.executeSql(sql, [], async (txx, { rows }) => {
				if(rows._array.length > 0){
					const queryEmailsSup = () => {
						console.log('Getting emails sup to sync');
						sql = `SELECT * FROM emails_supervision WHERE emails_supervision.estado = 0`;
						db.transaction( async tx => {
							tx.executeSql(sql, [], (txx, { rows }) => {
								if(recomendacionesSync.length > 0){
									_.map(recomendacionesSync, r => {
										if(r.supervisiones.length > 0){
											_.map(r.supervisiones, s => {
												let semails = _.filter(rows._array, {sup_id: s.id});
												s.emails = semails;
											});
										}
									});
								}
								if(supervisionesSync.length > 0){
									_.map(supervisionesSync, s => {
										let semails = _.filter(rows._array, {sup_id: s.id});
										s.emails = semails;
									});
								}
								response();
							}, (error) => {
								console.log('Error getting email de sups to sync ' + JSON.stringify(error));
								errorFunc('la Sincronización');
							});
						});
					}
					await _.map(rows._array, s => {
						s.foto1 = Buffer.from(s.foto1, 'binary').toString('base64');
						s.foto2 = Buffer.from(s.foto2, 'binary').toString('base64');
						s.foto3 = Buffer.from(s.foto3, 'binary').toString('base64');
						return s;
					});
					if (recomendacionesSync.length > 0) {
						let sups = [], supsRec = [];
						await _.map(recomendacionesSync, r => {
							let rsup = _.filter(rows._array, { rec_id: r.id });
							r.supervisiones = rsup;
							supsRec = _.concat(supsRec, rsup);
						});
						sups = _.differenceWith(rows._array, supsRec, _.isEqual);
						supervisionesSync = sups;
						queryEmailsSup();
					}	else {
						supervisionesSync = rows._array;
						queryEmailsSup();
					}
				} else {
					console.log('No hay supervisiones to sync');
					if(recomendacionesSync.length > 0){
						_.map(recomendacionesSync, r => {
							r.supervisiones = [];
						});
					}
					response();
				}
			}, (error) => {
				console.log('Error getting supervisiones to sync ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		});
	}

	const getRecomendacionesInfoSync = () => {
		const queryEmailsRec = () => {
			console.log('Getting emails rec to sync');
			sql = `SELECT * FROM emails_recomendacion WHERE emails_recomendacion.estado = 0`;
			db.transaction( async tx => {
				tx.executeSql(
					sql,
					[],
					(txx, {rows}) => {
						if(rows._array.length > 0){
							_.map(recomendacionesSync, r => {
								let remails = _.filter(rows._array, {rec_id: r.id});
								r.emails = remails;
							});
							getSupervisionesSync();
						} else {
							console.log('No emails rec to sync');
							_.map(recomendacionesSync, r => {
								r.emails = [];
							});
							getSupervisionesSync();
						}
					},
					(error) => {
						console.log('Error getting email de recs to sync ' + JSON.stringify(error));
						errorFunc('la Sincronización');
					}
				);
			});
		}

		const queryCollect = () => {
			console.log('Getting collect to sync');
			sql = `SELECT * FROM collect WHERE collect.estado = 0`;
			db.transaction( async tx => {
				tx.executeSql(
					sql,
					[],
					(txx, {rows}) => {
						if (rows._array.length > 0) {
							collectsSync = rows._array;
							console.log('Hay collects to sync: ' + rows._array.length);
							queryEmailsRec();
						} else {
							console.log('No hay collects to sync');
							queryEmailsRec();
						}
					},
					(error) => {
						console.log('Error getting collects to sync ' + JSON.stringify(error));
						errorFunc('la Sincronización');
					}
				);
			});
		}

		const queryInsu = () => {
			console.log('Getting insumos to sync');
			sql = `SELECT * FROM insumos_recomendacion WHERE insumos_recomendacion.estado = 0`;
			db.transaction( async tx => {
				tx.executeSql(
					sql,
					[],
					(txx, {rows}) => {
						if(rows._array.length > 0){
							_.map(recomendacionesSync, r => {
								let rin = _.filter(rows._array, { rec_id: r.id });
								r.insumos = rin;
							});
							queryCollect();
						} else {
							console.log('No hay insumos to sync');
							_.map(recomendacionesSync, r => {
								r.insumos = [];
								r.emails = [];
							});
							queryCollect();
						}
					},
					(error) => {
						console.log('Error getting insumos de recomes to sync ' + JSON.stringify(error));
						errorFunc('la Sincronización');
					}
				);
			});
		}

		const queryCult = () => {
			console.log('Getting cultivo to sync');
			sql = `SELECT * FROM cultivo WHERE cultivo.estado = 0`;
			db.transaction( async tx => {
				tx.executeSql(sql, [], async (txx, { rows }) => {
					cultivosSync = rows._array;
					if(cultivosSync.length > 0){
						console.log('Hay cultivo nuevos to sync: ' + rows._array.length);
						let cults = [], cultsCamps = [];
						cultivosSync = await _.map(cultivosSync, c => {
							let cultss = _.filter(cultivosCamposSync, { cultivo_id: c.cultivo_id });
							c.cultivos_campo = cultss;
							cultsCamps = _.concat(cultsCamps, cultss);
							return c;
						});
						cultivosCamposSync = _.differenceWith(cultivosCamposSync, cultsCamps, _.isEqual);
					}	else {
						console.log('No hay cultivo nuevos to sync');
					}
					queryInsu();
				}, (error) => {
					console.log('Error getting cultivos nuevos to sync ' + JSON.stringify(error));
					errorFunc('la Sincronización');
				});
			});
		}

		const queryCamp = () => {
			console.log('Getting potreros to sync');
			sql = `SELECT * FROM campo WHERE campo.estado = 0`;
			db.transaction(tx => {
				tx.executeSql(sql, [], (txx, { rows }) => {
					if(rows._array.length > 0){
						camposSync = rows._array;
						console.log('Hay campos nuevos to sync: ' + rows._array.length);
					}	else {
						console.log('No hay campos nuevos to sync');
					}
					queryCult();
				}, (error) => {
					console.log('Error getting campos nuevos to sync ' + JSON.stringify(error));
					errorFunc('la Sincronización');
				});
			});
		}

		const queryCultCamp = () => {
			console.log('Getting relacion nuevas cultivos de campo to sync');
			const sql = `SELECT * FROM cultivos_campo WHERE cultivos_campo.estado = 0`;
			db.transaction(tx => {
				tx.executeSql(sql, [], (txx, { rows }) => {
					cultivosCamposSync = rows._array;
					if (cultivosCamposSync.length > 0) {
						console.log('Hay relacion nuevas cultivos de campo to sync: ' + rows._array.length);
						/*_.map(recomendacionesSync, r => {
							const cultivos_campo_ids = r.rec_cultivos_campo_ids.split(',');
							r.cultivos_campo = [];
							_.map(cultivos_campo_ids, ccid => {
								const cultivo_campo = _.find(cultivosCamposSync, { id: ccid });
								if (cultivo_campo) r.cultivos_campo.push(cultivo_campo);
							});
							console.log(r.cultivos_campo);
						});*/
						queryCamp();
					} else {
						console.log('No hay relacion nuevas cultivos de campos to sync');
						queryInsu();
					}
				}, (error) => {
					console.log('Error getting cultivos de campo to sync ' + JSON.stringify(error));
					errorFunc('la Sincronización');
				});
			});
		}

		queryCultCamp();
	};

	const getRecomendacionesSync = () => {
		// INSERT LAS NUEVAS RECOMENDACIONES
		console.log('Getting recomendaciones to sync');
		let sql = `SELECT * FROM recomendacion WHERE recomendacion.estado = 0`;
		db.transaction(tx => {
			tx.executeSql(sql, [], (txx, { rows }) => {
				if (rows._array.length > 0) {
					console.log('Hay recomendacion nuevas to sync: ' + rows._array.length);
					recomendacionesSync = _.map(rows._array, r => {
						r.foto1 = Buffer.from(r.foto1, 'binary').toString('base64');
						r.foto2 = Buffer.from(r.foto2, 'binary').toString('base64');
						r.foto3 = Buffer.from(r.foto3, 'binary').toString('base64');
						return r;
					});
					//console.log(recomendacionesSync);
					getRecomendacionesInfoSync();
				}	else {
					console.log('No hay recomendaciones to sync');
					getSupervisionesSync();
				}
			}, (error) => {
				console.log('Error getting recomendaciones to sync ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		});
	}

	const getContratosSync = () => {
		db.transaction(tx => {
			console.log('Getting contratos to sync');
			let sql = `SELECT * FROM contrato WHERE contrato.estado = 0`;
			tx.executeSql(sql, [], (txx, { rows }) => {
				if(rows._array.length > 0){
					contratosSync = rows._array;
					getRecomendacionesSync();
				}	else {
					console.log('No hay contratos to sync');
					getRecomendacionesSync();
				}
			}, (error) => {
				console.log('Error getting contratos to sync ' + JSON.stringify(error));
				errorFunc('la Sincronización');
			});
		});
	};

	getContratosSync()
}

function fotosMail(id, images) {
	let fotosMail = '';
	if(images.length === 1) {
		fotosMail = `<td><img src="cid:foto1${id}" style="width:150px; height: auto;" /></td>`;
		return fotosMail;
	} else if(images.length === 2) {
		fotosMail = `<td><img src="cid:foto1${id}" style="width:150px; height: auto;" /></td><td><img src="cid:foto2${id}" style="width:150px; height: auto;" /></td>`;
		return fotosMail;
	} else if(images.length === 3) {
		fotosMail = `<td><img src="cid:foto1${id}" style="width:150px; height: auto;" /></td><td><img src="cid:foto2${id}" style="width:150px; height: auto;" /></td><td><img src="cid:foto3${id}" style="width:150px; height: auto;" /></td>`;
		return fotosMail;
	}
	return '';
}

function emailMensajeRec(rec, insumosText, colorPrioridad, fotosMail) {
	const mensaje = `<!doctype html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width" />
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
				<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
				<title>Recomendación</title>
				<style>
					body { color: grey; background-color: white; font-family: "Open Sans", sans-serif; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; }
					.footer { clear: both; padding-top: 10px; text-align: center; width: 100%; }
					.footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; }
					p, ul, ol {  color: grey; font-family: "Open Sans", sans-serif; margin: 0; margin-bottom: 15px; }
					span {color: grey;}
					a {  color: grey; text-decoration: underline; }
				</style>
			</head>
			<body>
				<div style="margin: 5%; min-width: 400px; max-width: 1000px;">
					<img src="cid:mailHeader" style="width: 100%; height: auto;" />
					<div style="width: 200px; font-weight: bold; margin:0 auto; text-align:center; ">
						<img src="cid:logoCliente" style="border: 1px solid grey; width: 100px; height: 100px; border-radius: 50px; margin-top: 20px" />
					</div>
					<div style="width: 200px; font-weight: bold; margin:0 auto; text-align:center; background-color: rgba(0, 0, 0, 0.30); ">
						<h2 style="color: white; border-left: 8px solid ${colorPrioridad}; padding: 5px;">Recomendación</h2>
					</div>
					<div style="color: grey;font-size: 13px; text-align:right">Fecha ${moment(new Date()).format('DD/MM/YYYY')}</div>
					<div style="color: grey;font-size: 13px; text-align:right">Hora ${moment(new Date()).format('H:mm')}</div>
					<div style="width: 100%; ">
						<span style="font-weight: bold; font-size: 16px;">${rec.tipo_insumo_nombre}</span>
					</div>
					<div style="margin-top: 20px; margin-bottom: 20px">
						<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Creada por</span>: ${rec.tecnico_nombre}</span><br>
						<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Para el destinatario</span>: ${rec.cto_num}</span><br>
						<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Potrero</span>: ${_.map(rec.cultivo, c => { return  `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`; }).join(', ')}</span><br>
						<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Agricultor</span>: ${rec.agricultor_nombre} ${rec.agricultor_rut}</span>
					</div>
					<hr>
					<div><h2 style="color: grey; font-style: italic; font-weight: bold">Detalle</h2></div>
					<div>
						<ul>
							<li><span style="font-weight: bold">Prioridad</span>: ${rec.prioridad_nombre}</li>
							<li><span style="font-weight: bold">Insumos y/o servicios</span>:
								<ul>
									${insumosText.join('')}
								</ul>
							</li>
							<li><span style="font-weight: bold">Notas</span>: ${rec.notas.replace(/\n/g, "<br />")}</li>
						</ul>
					</div>
					<div>
						<table>
							<tr>
								${fotosMail}
							</tr>
						</table>
					</div>
					<img src="cid:mailFooter" style="width: 100%; height: auto;" />
				</div>
			</body>
		</html>`;

	return mensaje;
}

function emailMensajeSup(sup, rec, insumosText, fotosMail) {
	console.log(rec);
	const mensaje = `<!doctype html>
				<html>
					<head>
						<meta name="viewport" content="width=device-width" />
						<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
						<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
						<title>Recomendación</title>
						<style>
							body { color: grey; background-color: white; font-family: "Open Sans", sans-serif; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; }
							.footer { clear: both; padding-top: 10px; text-align: center; width: 100%; }
							.footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; }
							p, ul, ol {  color: grey; font-family: "Open Sans", sans-serif; margin: 0; margin-bottom: 15px; }
							span {color: grey;}
							a {  color: grey; text-decoration: underline; }
						</style>
					</head>
					<body>
						<div style="margin: 5%; min-width: 400px; max-width: 1000px;">
							<img src="cid:mailHeader" style="width: 100%; height: auto;" />
							<div style="width: 200px; font-weight: bold; margin:0 auto; text-align:center; ">
								<img src="cid:logoCliente" style="border: 1px solid grey; width: 100px; height: 100px; border-radius: 50px; margin-top: 20px" />
							</div>
							<div style="width: 200px; font-weight: bold; margin:0 auto; text-align:center; ">
								<h2 style="color: grey; border: 1px solid grey; padding: 5px;">Supervisión</h2>
							</div>
							<div style="color: grey;font-size: 13px; text-align:right">Fecha ${moment(new Date()).format('DD/MM/YYYY')}</div>
							<div style="color: grey;font-size: 13px; text-align:right">Hora ${moment(new Date()).format('H:mm')}</div>
							<div style="width: 100%; text-align:center;">
								<span style="font-weight: bold; ">${rec.tipo_insumo_nombre}</span>
							</div>
							<div style="margin-top: 20px; margin-bottom: 20px">
								<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Creada por</span>: ${sup.tecnico_nombre}</span><br>
								<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Destinatario</span>: ${sup.cto_num}</span><br>
								<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Potrero</span>: ${_.map(rec.cultivos_campo, c => { return  `${c.campo_nombre} (${c.cultivo_nombre} - ${c.temporada_nombre})`; }).join(', ')}</span><br>
								<span style="font-size: 13px; font-style: italic;"><span style="font-style: italic; font-weight: bold">Agricultor</span>: ${sup.agricultor_nombre} ${sup.agricultor_rut}</span>
							</div>
							<hr>
							<div><h2 style="color: grey; font-style: italic; font-weight: bold">Detalle</h2></div>
							<div>
								<ul>
									<li><span style="font-weight: bold">Avance</span>: ${sup.avance === '1' ? 'Logrado' : 'No logrado'}</li>
									<li><span style="font-weight: bold">Ponderación</span>: ${sup.nota_nombre}</li>
									<li><span style="font-weight: bold">Observaciones</span>: ${sup.notas}</li>
								</ul>
							</div>
							<hr>
							<div><h2 style="color: grey; font-style: italic; font-weight: bold">Recomendación</h2></div>
							<div>
								<ul>
									<li><span style="font-weight: bold">Prioridad</span>: ${rec.prioridad_nombre}</li>
									<li><span style="font-weight: bold">Insumos y/o servicios</span>:
										<ul>
											${insumosText}
										</ul>
									</li>
									<li><span style="font-weight: bold">Notas</span>: ${rec.notas.replace(/\n/g, "<br />")}</li>
								</ul>
							</div>
							<div>
								<table>
									<tr>
										${fotosMail}
									</tr>
								</table>
							</div>
							<img src="cid:mailFooter" style="width: 100%; height: auto;" />
						</div>
					</body>
				</html>`;

	return mensaje;
}

export async function save_recomendacion(user, rec, next = () => {}, showLoading) {
	console.log('Entro guardar recomendacion');
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{text: 'OK', onPress: null}], false);
		next(false);
	};

	let foto1 = '', foto2 = '', foto3 = '', fotosMailText = '', relacion_ids = [];
	if(rec.images.length === 1) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
	} else if(rec.images.length === 2) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(rec.images[1].base64, 'base64').toString('binary');
	} else if(rec.images.length === 3) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(rec.images[1].base64, 'base64').toString('binary');
		foto3 = Buffer.from(rec.images[2].base64, 'base64').toString('binary');
	}

	let saveInsumos = (txx, results) => {
		if(results.rowsAffected === 1) {
			console.log('Recomendacion guardada en el cel ' + results.insertId);
			console.log('Entro guardar insumos');
			let insumosText = [];
			const insumos = _.map(rec.insumos, i => {
				const texto = i.superficie && i.superficie !== 'null' ?
				i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha, en ' + i.superficie + ' ha.'
				: i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha';
				insumosText.push(`<li>${texto}</li>`);

				if(i.superficie === '') i.superficie = null;
				return '(' + results.insertId + ', ' + i.insumo_id + ', ' + i.superficie + ', ' + i.dosis + ', ' + i.unidad_id + ', \'' + i.insumo_nombre + '\', \'' + i.unidad_nombre + '\', ' + 0 + ')';
			});

			let emails = [], colorPrioridad = stylesApp.colorGreen;
			if (rec.prioridad_nombre === 'Alta'){
				colorPrioridad = stylesApp.colorRed;
				//emails.push('example@hotmail.com');
			} else if(rec.prioridad_nombre === 'Media'){
				colorPrioridad = stylesApp.colorYellow;
			}

			if(user.email) emails.push(user.email);

			let agricultor_emails = '';
			if (rec.agricultor_emails !== '') {
				if (rec.agricultor_emails_selected !== '') {
					emails.push(rec.agricultor_emails_selected);
					if (rec.agricultor_emails_new !== '') {
						const emails_total = rec.agricultor_emails + ',' + rec.agricultor_emails_new;
						agricultor_emails = _.uniq(emails_total.split(',')).join(',');
					} else {
						agricultor_emails = rec.agricultor_emails;
					}
				} else {
					emails.push(rec.agricultor_emails);
					agricultor_emails = rec.agricultor_emails;
				}
			}
			//console.log(emails.join(','));
			//console.log(agricultor_emails);

			fotosMailText = fotosMail(results.insertId, rec.images);

			const mensaje = emailMensajeRec(rec, insumosText, colorPrioridad, fotosMailText);
			console.log(rec);
			db.transaction(tx => {
				if (agricultor_emails !== '') {
					tx.executeSql(
						'UPDATE contrato SET agricultor_email=?, estado=0 WHERE agricultor_rut=?;',
						[agricultor_emails, rec.agricultor_rut]
					);
				}
				if(rec.insumos.length > 0) {
					tx.executeSql(
						'INSERT INTO insumos_recomendacion (rec_id, insumo_id, superficie, dosis, unidad_id, insumo_nombre, unidad_nombre, estado) VALUES ' + insumos.join(', ') + ';'
					);
				}
				tx.executeSql(
					//'INSERT INTO emails_recomendacion (rec_id, tipo_insumo_nombre, tecnico_nombre, tecnico_rut, fecha_rec, campo_nombre, cultivo_nombre, temporada_nombre, cto_num, agricultor_nombre, agricultor_rut, prioridad_nombre, notas, insumos, emails, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [results.insertId, rec.tipo_insumo_nombre, user.nombre, user.rut, moment(new Date()).format('DD/MM/YYYY'), rec.cultivo.campo_nombre, rec.cultivo.cultivo_nombre, rec.cultivo.temporada_nombre, rec.cto_num, rec.agricultor_nombre, rec.agricultor_rut, rec.prioridad_nombre, rec.notas, insumosText.join(''), emails.join(';'), 0]
					//'INSERT INTO emails_recomendacion (rec_id, mensaje, emails, estado) VALUES (?,?,?,?);', [results.insertId, insumosText.join(''), emails.join(';'), 0]
					'INSERT INTO emails_recomendacion (rec_id, mensaje, agricultor_nombre, prioridad_nombre, emails, estado) VALUES (?,?,?,?,?,?);', [results.insertId, mensaje, rec.agricultor_nombre, rec.prioridad_nombre, emails.join(','), 0]
				);

				if(rec.isCollect && rec.isCollect !== 0) {
					tx.executeSql(
						`UPDATE collect SET estadoTabla = 1, estado = 0 WHERE id = ${rec.isCollect};`
					);
				}
			}, (error) => {
				console.log('Error insert insumos email rec ' + JSON.stringify(error));
				db.transaction( async tx => {
					tx.executeSql(
						`DELETE FROM recomendacion WHERE id=${results.insertId};`
					);
				}, (error) => {
					console.log('Error eliminar recomendacion ' + JSON.stringify(error));
				});
				errorFunc('el proceso');
			}, () => next(true));
		} else {
			console.log('Error insert recomendacion ' + JSON.stringify(error));
			errorFunc('el proceso');
		}
	};

	const recomendacionQuery = (rec_cultivos_campo_ids) => {
		db.transaction(tx => {
			console.log('Relacion cultivo campo guardad en el cel '+ rec_cultivos_campo_ids);
			console.log('guardando recomendacioon');
			tx.executeSql(
				//orden segun como estan en la tabla!!
				'INSERT INTO recomendacion (contrato_id, rec_cultivos_campo_ids, tecnico_id, fecha, lat, lon, alt, en_oficina, tipo_insumo_id, prioridad_id, notas, habilitado, tecnico_nombre, tipo_insumo_nombre, prioridad_nombre, foto1, foto2, foto3, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
				[rec.contrato_id, rec_cultivos_campo_ids, rec.tecnico_id, new Date(), rec.lat, rec.lon, rec.alt, rec.en_oficina, rec.tipo_insumo_id, rec.prioridad_id, rec.notas, 1, rec.tecnico_nombre, rec.tipo_insumo_nombre, rec.prioridad_nombre, foto1, foto2, foto3, 0],
				saveInsumos,
				(error) => {
					console.log('Error insert recomendacion con relacion cultivo campo nuevo ' + JSON.stringify(error));
					errorFunc('el proceso');
				}
			);
		});
	};

	const saveCultivo = (cultivo, count) => {
		const relacionNuevaQuery = async (cultivo, cultivo_id, count) => {
			console.log('guardando relacion cultivo campo');
			db.transaction(async tx => {
				tx.executeSql(`UPDATE cultivos_campo SET estadoTabla = 0 WHERE campo_id = ${cultivo.campo_id};`, [], () => {}, (error) => {
					console.log('Error update relacion cultivo campo nueva ' + JSON.stringify(error));
					errorFunc('el proceso');
				});
				tx.executeSql(
					`INSERT INTO cultivos_campo (cultivo_id, campo_id, temporada_id, estadoTabla, cultivo_nombre, tipo_cultivo_id, tipo_cultivo_nombre, campo_nombre, contrato_id, sup_sembrada, temporada_nombre, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
					[cultivo_id, cultivo.campo_id, cultivo.temporada_id, 1, cultivo.cultivo_nombre, cultivo.tipo_cultivo_id, cultivo.tipo_cultivo_nombre, cultivo.campo_nombre, rec.contrato_id, cultivo.sup_sembrada, cultivo.temporada_nombre, 0],
					(txx, results) => {
						//console.log('Guardo nueva relacion ' + results);
						if(results.rowsAffected === 1) {
							relacion_ids.push(results.insertId);
							if (count === rec.cultivo.length) {
								console.log('IS DE RELACIONES ' + relacion_ids.join(','));
								recomendacionQuery(relacion_ids.join(','));
							}
						} else {
							console.log('No insert relacion nueva en el cel');
							errorFunc('el proceso');
						}
					}, (error) => {
						console.log('Error insert relacion cultivo campo nueva ' + JSON.stringify(error));
						errorFunc('el proceso');
					}
				);
			}, (error) => {
				console.log('Error insert relacion cultivo campo nueva ' + JSON.stringify(error));
				errorFunc('el proceso');
			});
		};

		if(!cultivo.relacionExiste && cultivo.relacionNueva && !cultivo.nuevoCultivo) {
			relacionNuevaQuery(cultivo, cultivo.cultivo_id, count);
		} else if(!cultivo.relacionExiste && !cultivo.relacionNueva && cultivo.nuevoCultivo) {
			//nuevo cultivo
			db.transaction( async tx => {
				console.log('guardando cultivo nuevo');
				tx.executeSql(
					`INSERT INTO cultivo (cultivo_nombre, tipo_cultivo_id, tipo_cultivo_nombre, tipo_insumo_ids, estado) VALUES (?,?,?,?,?);`,
					[cultivo.cultivo_nombre, cultivo.tipo_cultivo_id, cultivo.tipo_cultivo_nombre, cultivo.tipo_insumo_ids, 0],
					(txx, results) => {
						if(results.rowsAffected === 1) {
							console.log('Cultivo nuevo guardado en el cel '+ results.insertId);
							relacionNuevaQuery(cultivo, results.insertId, count);
						} else {
							console.log('No insert cultivo nuevo en el cel');
							errorFunc('el proceso');
						}
					},
					(error) => {
						console.log('Error insert cultivo nuevo en el cel ' + JSON.stringify(error));
						errorFunc('el proceso');
					}
				);
			});
		} else {
			console.log('guardando relacion existente');
			//resto relacion exitetne
			//recomendacionQuery(cultivo, cultivo.cultivos_campo_id);
			relacion_ids.push(cultivo.cultivos_campo_id);
			if (count === rec.cultivo.length) {
				console.log('IS DE RELACIONES ' + relacion_ids.join(','));
				recomendacionQuery(relacion_ids.join(','));
			}
		}
	}

	await _.map(rec.cultivo, (c, k) => {
		if(c.campo_id > 0) {
			//potrero existente
			saveCultivo(c, k+1);
		} else {
			//nuevo potrero
			db.transaction( async tx => {
				console.log('guardando potrero nuevo');
				tx.executeSql(
					`INSERT INTO campo (nombre, sup_sembrada, contrato_id, estado) VALUES (?,?,?,?);`,
					[c.campo_nombre, c.sup_sembrada, rec.contrato_id, 0],
					(txx, results) => {
						if(results.rowsAffected === 1) {
							console.log('Campo nuevo guardado en el cel '+ results.insertId);
							c.campo_id = results.insertId;
							saveCultivo(c, k+1);
						} else {
							console.log('guardando campo nuevo hubo un error');
							errorFunc('el proceso');
						}
					}
				);
			});
		}
		/*if (k+1 === rec.cultivo.length) {
			console.log('IS DE RELACIONES ' + relacion_ids.join(','));
			recomendacionQuery(relacion_ids.join(','));
		}*/
	});
}

export function select_recomendacion(rec_id, next = () => {}, showLoading) {
	db.transaction(tx => {
		tx.executeSql(`SELECT contrato.agricultor_nombre, contrato.agricultor_rut, contrato.agricultor_email, contrato.cto_num, contrato.calle, contrato.distrito, contrato.zona_nombre, recomendacion.contrato_id AS id, recomendacion.rec_cultivos_campo_ids, recomendacion.tipo_insumo_nombre, recomendacion.id AS rec_id FROM recomendacion INNER JOIN contrato ON recomendacion.contrato_id = contrato.id WHERE recomendacion.id = ${rec_id};`,
		[],
		(txx, { rows }) => {
			if(rows._array.length > 0){
				next(rows._array);
			} else next([]);
		},
		(error) => {
			console.log('Error select recomendacion ' + JSON.stringify(error));
			showLoading(true, 'Error', 'Hubo un error en el proceso', [{ text: 'OK', onPress: null }], false);
		});
	});
}

export function edit_recomendacion(user, rec, next = () => {}, showLoading) {
	console.log('Entro modificar recomendacion');
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{ text: 'OK', onPress: null }], false);
		next(false);
	};

	let foto1 = '', foto2 = '', foto3 = '', fotosMailText = '';

	if(rec.images.length === 1) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
	} else if(rec.images.length === 2) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(rec.images[1].base64, 'base64').toString('binary');
	} else if(rec.images.length === 3) {
		foto1 = Buffer.from(rec.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(rec.images[1].base64, 'base64').toString('binary');
		foto3 = Buffer.from(rec.images[2].base64, 'base64').toString('binary');
	}

	let insumosText = [];
	const insumos = _.map(rec.insumos, i => {
			const texto = i.superficie && i.superficie !== 'null' ?
			i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha, en ' + i.superficie + ' ha.'
			: i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha';
			insumosText.push(`<li>${texto}</li>`);
		//}

		if(i.superficie === '') i.superficie = null;
		return '(' + rec.rec_id + ', ' + i.insumo_id + ', ' + i.superficie + ', ' + i.dosis + ', ' + i.unidad_id + ', \'' + i.insumo_nombre + '\', \'' + i.unidad_nombre + '\', ' + 0 + ')';
	});

	let emails = [], colorPrioridad = stylesApp.colorGreen;
	if(rec.prioridad_nombre === 'Alta'){
		colorPrioridad = stylesApp.colorRed;
		//emails.push('example@hotmail.com');
	} else if(rec.prioridad_nombre === 'Media'){
		colorPrioridad = stylesApp.colorYellow;
	}

	if(user.email) emails.push(user.email);

	let agricultor_emails = '';
	if (rec.agricultor_emails !== '') {
		if (rec.agricultor_emails_selected !== '') {
			emails.push(rec.agricultor_emails_selected);
			if (rec.agricultor_emails_new !== '') {
				const emails_total = rec.agricultor_emails + ',' + rec.agricultor_emails_new;
				agricultor_emails = _.uniq(emails_total.split(',')).join(',');
			} else {
				agricultor_emails = rec.agricultor_emails;
			}
		} else {
			emails.push(rec.agricultor_emails);
			agricultor_emails = rec.agricultor_emails;
		}
	}
	console.log(emails);
	console.log(agricultor_emails);

	let emailsText = '';
	if(emails.length > 0) emailsText = emails.join(',');

	fotosMailText = fotosMail(rec.rec_id, rec.images);

	const mensaje = emailMensajeRec(rec, insumosText, colorPrioridad, fotosMailText);

	db.transaction(tx => {
		if(agricultor_emails !== '') {
			tx.executeSql(
				'UPDATE contrato SET agricultor_email=?, estado=0 WHERE agricultor_rut=?;',
				[agricultor_emails, rec.agricultor_rut]
			);
		}
		tx.executeSql(
			`UPDATE recomendacion SET lat=?, lon=?, alt=?, en_oficina=?, prioridad_id=?, notas=?, prioridad_nombre=?, foto1=?, foto2=?, foto3=?, estado=? WHERE id=?;`,
			[rec.lat, rec.lon, rec.alt, rec.en_oficina, rec.prioridad_id, rec.notas, rec.prioridad_nombre, foto1, foto2, foto3, 0, rec.rec_id]
		);
		tx.executeSql(`DELETE FROM insumos_recomendacion WHERE rec_id = ${rec.rec_id}`);
		tx.executeSql('INSERT INTO insumos_recomendacion (rec_id, insumo_id, superficie, dosis, unidad_id, insumo_nombre, unidad_nombre, estado) VALUES ' + insumos.join(', ') + ';');
		tx.executeSql(`UPDATE emails_recomendacion SET mensaje='${mensaje}', emails='${emailsText}', estado = 0 WHERE rec_id=${rec.rec_id} AND id=${rec.email_id};`);
	}, (error) => {
		console.log('Error update recomendacion ' + JSON.stringify(error));
		errorFunc('el proceso');
	}, () => next(true));
}

export function eliminar_recomendacion(rec_id, next, showLoading) {
	db.transaction(tx => {
		tx.executeSql(`DELETE FROM recomendacion WHERE id = ${rec_id};`);
		tx.executeSql(`DELETE FROM insumos_recomendacion WHERE rec_id = ${rec_id};`);
		tx.executeSql(`DELETE FROM supervision WHERE rec_id = ${rec_id};`);
	}, (error) => {
		console.log('Error eliminar recomendacion, insumo y supervision ' + JSON.stringify(error));
		showLoading(true, 'Error', 'Hubo un error en el proceso', [{ text: 'OK', onPress: null }], false);
	}, next);
}

export function save_supervision(user, sup, next = () => {}, showLoading) {
	console.log('Entro guardar supervision');
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{ text: 'OK', onPress: null }], false);
		next(false);
	};

	let foto1 = '', foto2 = '', foto3 = '', rec = sup.recomendacion, fotosMailText = '';
	let saveEmails = (txx, results) => {
		if(results.rowsAffected === 1) {
			console.log(results.insertId);
			console.log('Entro guardar emails');

			let insumosText = [], emails = [];
			_.map(rec.insumos, i => {
				/*if(i.unidad_nombre === 'Ha.' || i.unidad_nombre === 'Unidad'){
					const texto = i.superficie && i.superficie !== 'null' ? i.insumo_nombre + ': en ' + i.superficie + ' ' + i.unidad_nombre : i.insumo_nombre + '.';
					insumosText.push(`<li>${texto}</li>`);
				} else{*/
					const texto = i.superficie && i.superficie !== 'null' ?
					i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha, en ' + i.superficie + ' ha.'
					: i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha';
					insumosText.push(`<li>${texto}</li>`);
				//}
			});

			if(user.email) emails.push(user.email);

			//console.log(sup.agricultor_email, ' - ', sup.agricultor_emails, ' - ', sup.agricultor_emails_selected);
			let agricultor_emails = '';
			if (sup.agricultor_emails !== '') {
				if (sup.agricultor_emails_selected !== '') {
					emails.push(sup.agricultor_emails_selected);
					if (sup.agricultor_emails_new !== '') {
						const emails_total = sup.agricultor_emails + ',' + sup.agricultor_emails_new;
						agricultor_emails = _.uniq(emails_total.split(',')).join(',');
					} else {
						agricultor_emails = sup.agricultor_emails;
					}
				} else {
					emails.push(sup.agricultor_emails);
					agricultor_emails = sup.agricultor_emails;
				}
			}
			console.log(emails.join(','));
			console.log(agricultor_emails);

			fotosMailText = fotosMail(results.insertId, sup.images);

			const mensaje = emailMensajeSup(sup, rec, insumosText, fotosMailText);

			db.transaction( async tx => {
				if (agricultor_emails !== '') {
					tx.executeSql(
						'UPDATE contrato SET agricultor_email=?, estado=0 WHERE agricultor_rut=?;',
						[agricultor_emails, sup.agricultor_rut]
					);
				}
				tx.executeSql(
					//'INSERT INTO emails_supervision (sup_id, tipo_insumo_nombre, tecnico_nombre, tecnico_rut, fecha_rec, cto_num, agricultor_nombre, agricultor_rut, prioridad_nombre, notas, insumos, fecha_sup, avance, nota_nombre, observaciones, emails, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [results.insertId, rec.tipo_insumo_nombre, user.nombre, user.rut, rec.fecha, sup.cto_num, sup.agricultor_nombre, sup.agricultor_rut, rec.prioridad_nombre, rec.notas, insumosEmails.join(';'), moment(new Date()).format('DD/MM/YYYY H:mm'), sup.avance, sup.nota_nombre, sup.notas, emails.join(';'), 0]
					'INSERT INTO emails_supervision (sup_id, mensaje, agricultor_nombre, emails, estado) VALUES (?,?,?,?,?);',
					[results.insertId, mensaje, sup.agricultor_nombre, emails.join(','), 0]
				);
			}, (error) => {
				console.log('Error insert email sup' + JSON.stringify(error));
				db.transaction( async tx => {
					tx.executeSql(
						`DELETE FROM supervision WHERE id=${results.insertId};`
					);
				}, (error) => {
					console.log('Error eliminar supervision ' + JSON.stringify(error));
				});
				errorFunc('el proceso');
			}, () => next(true));
		} else {
			errorFunc('el proceso');
		}
	};

	if(sup.images.length === 1) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
	} else if(sup.images.length === 2) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(sup.images[1].base64, 'base64').toString('binary');
	} else if(sup.images.length === 3) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(sup.images[1].base64, 'base64').toString('binary');
		foto3 = Buffer.from(sup.images[2].base64, 'base64').toString('binary');
	}
	db.transaction( async tx => {
		tx.executeSql(
			'INSERT INTO supervision (rec_id, tecnico_id, contrato_id, rec_cultivos_campo_ids, fecha, title, inicio, avance, nota_id, observaciones, repeat_task, en_oficina, lat, lon, alt, habilitado, tecnico_nombre, nota_nombre, foto1, foto2, foto3, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
			[sup.rec_id, sup.tecnico_id, sup.contrato_id, rec.rec_cultivos_campo_ids, new Date(), 'Supervisión ' + moment(new Date()).format('DD/MM/YYYY H:mm'), sup.inicio, sup.avance, sup.nota_id, sup.notas, sup.repeat_task, sup.en_oficina, sup.lat, sup.lon, sup.alt, 1, sup.tecnico_nombre, sup.nota_nombre, foto1, foto2, foto3, 0],
			saveEmails,
			(error) => {
				console.log('Error insert supervision ' + JSON.stringify(error));
				errorFunc('el proceso');
			}
		);
	});
}

export function select_supervision(sup_id, next = () => {}, showLoading) {
	db.transaction(tx => {
		tx.executeSql(`SELECT supervision.tecnico_nombre, supervision.nota_nombre FROM supervision WHERE supervision.id = ${sup_id};`,
		[],
		(txx, { rows }) => {
			if(rows._array.length > 0){
				next(rows._array);
			} else next([]);
		},
		(error) => {
			console.log('Error select supervision ' + JSON.stringify(error));
			showLoading(true, 'Error', 'Hubo un error en el proceso', [{ text: 'OK', onPress: null }], false);
		});
	});
}

export function edit_supervision(user, sup, next = () => {}, showLoading) {
	console.log('Entro modificar supervision');
	let errorFunc = (texto) => {
		showLoading(true, 'Error', 'Hubo un error en '+texto, [{ text: 'OK', onPress: null }], false);
		next(false);
	};

	let foto1 = '', foto2 = '', foto3 = '', rec = sup.recomendacion, fotosMailText = '';

	if(sup.images.length === 1) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
	} else if(sup.images.length === 2) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(sup.images[1].base64, 'base64').toString('binary');
	} else if(sup.images.length === 3) {
		foto1 = Buffer.from(sup.images[0].base64, 'base64').toString('binary');
		foto2 = Buffer.from(sup.images[1].base64, 'base64').toString('binary');
		foto3 = Buffer.from(sup.images[2].base64, 'base64').toString('binary');
	}

	let insumosText = [], emails = [];
	_.map(rec.insumos, i => {
		/*if(i.unidad_nombre === 'Ha.' || i.unidad_nombre === 'Unidad'){
			const texto = i.superficie && i.superficie !== 'null' ? i.insumo_nombre + ': en ' + i.superficie + ' ' + i.unidad_nombre : i.insumo_nombre + '.';
			insumosText.push(`<li>${texto}</li>`);
		} else{*/
			const texto = i.superficie && i.superficie !== 'null' ?
			i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha, en ' + i.superficie + ' ha.'
			: i.insumo_nombre + ': ' + i.dosis + ' ' + i.unidad_nombre + '/ha';
			insumosText.push(`<li>${texto}</li>`);
		//}
	});

	if(user.email) emails.push(user.email);

	//console.log(sup.agricultor_email, ' - ', sup.agricultor_emails, ' - ', sup.agricultor_emails_selected);
	let agricultor_emails = '';
	if (sup.agricultor_emails !== '') {
		if (sup.agricultor_emails_selected !== '') {
			emails.push(sup.agricultor_emails_selected);
			if (sup.agricultor_emails_new !== '') {
				const emails_total = sup.agricultor_emails + ',' + sup.agricultor_emails_new;
				agricultor_emails = _.uniq(emails_total.split(',')).join(',');
			} else {
				agricultor_emails = sup.agricultor_emails;
			}
		} else {
			emails.push(sup.agricultor_emails);
			agricultor_emails = sup.agricultor_emails;
		}
	}
	console.log(emails);
	console.log(agricultor_emails);

	let emailsText = '';
	if(emails.length > 0) emailsText = emails.join(',');

	fotosMailText = fotosMail(sup.sup_id, sup.images);

	const mensaje = emailMensajeSup(sup, rec, insumosText, fotosMailText);

	db.transaction( async tx => {
		if(agricultor_emails !== '') {
			tx.executeSql(
				'UPDATE contrato SET agricultor_email=?, estado=0 WHERE agricultor_rut=?;',
				[agricultor_emails, sup.agricultor_rut]
			);
		}
		tx.executeSql(
			`UPDATE supervision SET inicio=?, avance=?, nota_id=?, repeat_task=?, lat=?, lon=?, alt=?, en_oficina=?, observaciones=?, nota_nombre=?, foto1=?, foto2=?, foto3=?, estado=? WHERE id=?;`,
			[sup.inicio, sup.avance, sup.nota_id, sup.repeat_task, sup.lat, sup.lon, sup.alt, sup.en_oficina, sup.notas, sup.nota_nombre, foto1, foto2, foto3, 0, sup.sup_id]
		);
		tx.executeSql(`UPDATE emails_supervision SET mensaje='${mensaje}', emails='${emailsText}', estado = 0 WHERE sup_id=${sup.sup_id} AND id=${sup.email_id};`);
	}, (error) => {
		console.log('Error update supervision ' + JSON.stringify(error));
		errorFunc('el proceso');
	}, () => next(true));
}

export function eliminar_supervision(sup_id, next, showLoading) {
	db.transaction(tx => {
		tx.executeSql(`DELETE FROM supervision WHERE id = ${sup_id};`);
	}, (error) => {
		console.log('Error eliminar supervision ' + JSON.stringify(error));
		showLoading(true, 'Error', 'Hubo un error en el proceso', [{ text: 'OK', onPress: null }], false);
	}, next);
}
