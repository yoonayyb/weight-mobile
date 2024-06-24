import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user.js'
import message from './modules/message.js'
import app from './modules/app.js'
import tabbar from './modules/tabbar.js'
import common from './modules/common.js'
import webSocket from './modules/webSocket.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user,
		message,
		app,
		tabbar,
        common,
		webSocket
	},
	getters
})
export default store
