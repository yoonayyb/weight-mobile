import $store from '@/vuex/index.js';
class common {
	constructor(arg) {
		this.url = arg.url
		this.isOnline = false
		this.socket = null
		this.reconnectTime = 0
		this.isOpenReconnect = false
		this.loadFinish = false;
		// 连接和监听
		this.connectSocket()
	}
	// 断线重连
	reconnect() {
		
		console.log(this.isOnline)
		console.log("进入reconnect准备重新链接")
		
		if (this.isOnline) {
			return
		}
		if (this.reconnectTime >= 3) {
			console.log("重连失败超过三次，重置失败次数")
			return this.reconnectConfirm()
		}
		this.reconnectTime += 1
		console.log("重新链接，次数"+this.reconnectTime)
		this.connectSocket();

	}
	// 连接socket
	connectSocket() {
		console.log("链接connectSocket")
		this.socket = uni.connectSocket({
			url: this.url,
			complete: () => {}
		})
		// 监听连接成功
		this.socket.onOpen(() => this.onOpen())
		// 监听接收信息
		this.socket.onMessage((res) => this.onMessage(res))
		// 监听断开
		this.socket.onClose((e) => this.onClose(e))
		// 监听错误
		this.socket.onError(() => this.onError())
	}
	sendMessage(message) {
		console.log('发送的message',message)
		this.socket.send({
			data:JSON.stringify(message) ,
			success() {
				console.log('success')
			},
			fail() {
				console.log('fail')
			}
		})
	}
	onOpen() {
		// 用户上线
		this.isOnline = true
		console.log('websocket连接成功')
		this.isOpenReconnect = true
		 
		if (this.socket != null) {
			var initSocket = {
				type:'initSocket'
			};
			// this.socket.send({
			// 	data: JSON.stringify(initSocket),
			// 	success() {
					
			// 	},
			// 	fail(e) {
			// 		console.log('失败fail:' + e)
			// 	}
			// }) 
			
			
			 // var that = this;
			 // var login = {
			 // 	type:'login',
			 // 	client_name:this.user.username,
			 // 	uid:this.user._id,
			 // };
			 // that.initSocketLogin(login);
		}
	}
	
	// 监听关闭
	onClose(e) {
		// 用户下线
		this.isOnline = false
		this.socket = null
		console.log('socket连接已关闭')
		if (this.isOpenReconnect) {
			console.log("3秒后重新链接")
			var that = this;
			setTimeout(function() {
				that.reconnect();
			}, 3000);
		}
	}
	// 监听连接错误
	onError() {
		// 用户下线
		this.isOnline = false
		this.socket = null
		console.log('socket连接错误')
		if (!this.socket) {
			var that = this;
			setTimeout(function() {
				that.reconnect();
			}, 3000);
		}
	}
	// 监听接收消息
	onMessage(data) {
		let res = JSON.parse(data.data)
		console.log('收到的消息',res)
		switch (res['type']) {
			case 'ping':
				this.socket.send({
					data: '{"type":"pong"}',
					async success() {
						console.log("Socket心跳：" + new Date());
					}
				})
				break;
			case 'initSocket':
				 
				uni.setStorageSync("s_client_id",res.client_id);
				break;
			case 'login':
				break;
			case 'say':
				this.handleOnMessage(res)
				break;
			case 'getLivingPool':
				this.handleOnMessage(res)
				break;
			case 'SocketLivingInfo':
				this.handleOnMessage(res)
				break;
			case 'sendCallback':
				this.handleSendCallBack(res);
				break;
			case 'kickout':
				this.kickout(res);
				break;
			case 'logout':

		}
	}
	// 处理消息
	async handleOnMessage(message, vibrateLong = true) {
		if (message.type == "say") {
			uni.$emit('onMessage', message)
		}else if(message.type == "getLivingPool"){
			uni.$emit('onLibingPool', message)
		}else if(message.type == "SocketLivingInfo"){
			 
			uni.$emit('SocketLivingInfo', message)
			
		}
	}
	async handleSendCallBack(message) {
		
		if(message.chat_type == 'user'){
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "updateChatDetailStatus",
					token: this.user_token,
					data: message
				},
			}).then((res) => {

			}).catch((err) => {
				console.log(err);
			
			});
		}else{
			uniCloud.callFunction({
				name: 'user',
				data: {
					$url: "updateChatGroupDetailStatus",
					token: this.user_token,
					data: message
				},
			}).then((res) => {
				 
			
			}).catch((err) => {
				console.log(err);
			});
			
		}
	}
	//踢下线
	kickout(){
		$store.dispatch("logout")
	}
	// 关闭连接
	close() {
		if (this.socket) {
			this.socket.close()
		}
		this.destoryChatObject();
		this.isOpenReconnect = false
	}
	initSocketLogin(login){
		this.socket.send({
			data: JSON.stringify(login),
			success() {
				console.log('用户IM登录成功:success')
			},
			fail(e) {
				console.log('用户IM登录失败fail:' + e)
			}
		}) 
	}
	// 创建聊天对象
	createChatObject(detail) {
		this.TO = detail
	}
	// 销毁聊天对象
	destoryChatObject() {
		this.TO = false
	}
	// 断线重连提示
	reconnectConfirm() {
		this.connectSocket()
		this.reconnectTime = 0
	}
	// 验证是否上线
	checkOnline() {
		if (!this.isOnline) {
			// 断线重连提示
			this.reconnectConfirm()
			return false
		}
		return true
	} 
	// 发送消息
	send(message, onProgress = false) {
		uni.sendSocketMessage({
			data: JSON.stringify(message),
			success: () => {
				 
			},
			fail: () => {
					
			}
		})
	}    
	logout(){
		uniCloud.callFunction({
			name: 'login',
			data: {
				$url: "logout",
				data: {
					token: this.user_token
				}
			},
		}).then((res) => {
			 
		}).catch((err) => {
			 
		})
	}
	// 数组置顶
	listToFirst(arr, index) {
		if (index != 0) {
			arr.unshift(arr.splice(index, 1)[0]);
		}
		return arr;
	}
	checkResultData(res){
		if(typeof res != 'undefined' && typeof res['result'] != 'undefined' && typeof res['result']['data'] != 'undefined' && typeof res['result']['data'][0] != 'undefined'){
			return true;
		}else{
			return false;
		}
	}
}
export default common
