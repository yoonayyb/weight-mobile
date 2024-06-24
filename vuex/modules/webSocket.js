import socket from '../../utils/socket.js';

const state = {
	url: 'ws://192.168.8.66:9502',
	socket: null,
}
const mutations = {

}
const actions = {

	initSocket({
		state,
		dispatch
	}) {
		state.socket = new socket({
			url: state.url
		})
	},

	closeSocket({
		state
	}) {
		if (state.socket) {
			state.socket.close();
		}
	}

}

export default {
	state,
	mutations,
	actions
}