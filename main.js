import Vue from 'vue'
import App from './App'
import store from './vuex/index'
import { request_v2 } from './utils/request.js'
import * as common from './utils/common.js'
import * as filters from './utils/filters.js'
import uView from 'uview-ui'

import { setimgUrl } from '@/mixins/setOss'
import impopup from './components/impopup.vue'
// 安装插件
 Vue.component('impopup',impopup)


const accoutInfo =  uni.getAccountInfoSync()
const platform =  uni.getSystemInfoSync().platform
console.log('platform',platform)
if (accoutInfo.miniProgram.envVersion === "release") {
	console.log = () => {}
}
Vue.prototype.$store = store
// Vue.prototype.tim = tim

Vue.prototype.$request = request_v2
Vue.prototype.$common = common

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
const upErrorLog = (err,info)=>{
	let stack =  parseErrorStack(err)
	request_v2({
		  url:'/ApiV3/Mobile/ClientLog/write',
		  method:'post',
		  data:{
			  type:'ERROR',
			  content:JSON.stringify(stack)
		  }
	}).then(res=>{
		 console.log(stack )
	})
}
const parseErrorStack = (error)=> {
	console.log('errorerrorerrorerror',error)
	return {
	    message:`平台为:${platform},`+ error.message,
	    stack: error.stack ? error.stack.split('\n').slice(1).map(line => line.trim()) : []
	  };
}
Vue.mixin(setimgUrl)
Vue.use(uView)
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
 console.log(err)
 console.log(info)
 console.log(vm)
 
  Vue.prototype.$u.debounce(()=>upErrorLog(err,info),5000)
  
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()
