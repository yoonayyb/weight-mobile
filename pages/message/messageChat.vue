<template>
	<view class="container">
		<scroll-view refresher-enabled :refresher-threshold="100" :refresher-triggered="triggered"
			@refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
			@refresherabort="onAbort"
			:style="'height: calc(100vh - 40rpx - var(--safe-area-inset-bottom) - ' + footerBoxHeight + 'rpx)'+';bottom:'+inputHeight+'px'+';position:relative'"
			:scroll-y="true" class="messages" :scroll-with-animation="scrollAnimation" @click="hideOperationBox"
			:scroll-top="scrollTop" :scroll-into-view="scrollToView" :upper-threshold="50">
			<!-- <view class="message_list"> -->
			<view class="message_container" :id="'message_item' +item.id" v-for="(item, index) in messageList"
				:key="index">
				<!-- <view class="loading_mask" v-show="messageShowIndex > index ? 'show_index' : ''"></view> -->
				<view v-if="item.created_at && item.showTime" class="date_title u-flex">
					<text class="u-flex">{{ item.created_at | showTimePipe }}</text>
				</view>
				<view class="message_item" :class="item.is_me_send ? 'self' : 'others'">
					<!-- 头像 -->
					<image class="avatar" v-if="item.avatar" :src="item.avatar" mode="aspectFill"></image>
					<image class="avatar" v-else :src="`${imgUrl}defaultHead.png`" mode="aspectFill"></image>
					<!-- 文本消息 -->
					<view v-if="item.body && item.body.type === 'TEXT'" class="message_content triangle">
						<!-- <text>{{item.body.text}}</text> -->
						<bolck v-for="(item2, index2) in item.virtualDom" :key="index2">
							<text v-if="item2.name === 'text'">{{ item2.text  }}</text>

							<image v-if="item2.name === 'img'" :src="item2.src" style="width: 40rpx; height: 40rpx" />

						</bolck>
					</view>
					<!-- 特殊问卷消息 -->
					<view v-if="item.body && item.body.type === 'ASSESSMENT_REPORT_ASK'"
						class="message_content triangle">
						<text>{{item.body.text}}</text>
						<view class="u-flex u-m-t-16">
							<u-button @click="getAction(1,item.body.id);targetAskId = item.body.id"
							    :disabled="item.operation"
								:custom-style="item.operation?disableStyleNot: item.is_me_send ?customStyleNot1:customStyleNot" size="mini"
								shape="circle">否</u-button>
							<u-button @click="getAction(1,item.body.id);targetAskId = item.body.id"
								:disabled="item.operation"
								:custom-style="item.operation?disableStyleYes: item.is_me_send ?customStyleYes1:customStyleYes" :ripple="true"
								size="mini" shape="circle">是</u-button>
						</view>

					</view>
					<!-- 语音消息 -->
					<!-- width: 30 * item.body.s + 'rpx' -->
					<view v-if="item.body && item.body.type === 'AUDIO'" :style="{minWidth: '120rpx'}"
						class="message_content u-flex" @click="handlePlayAudio(item)">
						<arc color="#4a4a4a" :reverse="!item.is_me_send" :play="item.id=== playVoiceId"></arc>
						<!-- <image class="audit_icon" :src="`${imgUrl}audio.png`" mode="aspectFit"></image> -->
						<text style="font-size: 24rpx">{{ item.body.s + "''" }}</text>
					</view>
					<!-- 图片消息 -->
					<view v-if="item.body && item.body.type === 'IMAGE'" class="message_image">
						<image style="width: 240rpx; height: 240rpx; border-radius: 10rpx"
							@click="handlePreviewImage(item.body.url)" :src="item.body.url" mode="aspectFill"></image>
						<!-- <u-image border-radius="10" width="240" height="240" @click="handlePreviewImage(item.payload.imageInfoArray[0].imageUrl)"
						 :src="item.payload.imageInfoArray[1].imageUrl" mode="aspectFill">
							<u-loading slot="loading"></u-loading>
						</u-image> -->
					</view>
					<!-- 视频消息 -->
					<view @click="openPreviewVideo(item.body.url)" v-if="item.body && item.body.type === 'VIDEO'"
						class="message_video">
						<image :src="item.body.thumb" mode="aspectFill"></image>
						<image class="u-abso" :src="`${imgUrl}v3_video_play.png`"
							style="width:48rpx;height:48rpx;bottom: 16rpx;right: 16rpx;"></image>
						<!-- <video :src="item.body.url"></video> -->
						<!-- item.payload.videoUrl -->
					</view>
					<!-- 文件消息 -->
					<view @click="openFile(item.body.url)" v-if="item.body && item.body.type === 'FILE'"
						class="message_file triangle u-flex border">
						<u-icon size="40" name="file-text"></u-icon>
						<text class="u-line-1">文件</text>
					</view>
					<!-- <consent :item="item"></consent> -->
					<!-- 问卷消息模板 -->
					 <consent :item="item"></consent>
					 <!-- 特殊问卷消息模板 -->
					 <consent1 @click="targetAskId = item.body.id" :item="item"></consent1>
					<!-- 分享评估消息 -->
					<view class="message_share_assess triangle u-flex" v-if="item.payload.data === 'shareAssess'"@click="handleJumpAssess(item)">
						<view class="u-flex">
							<text class="share_assess_title">{{
                item.payload.description == 1
                  ? '肥胖分期评估'
                  : item.payload.description == 2
                  ? '行为方式评估'
                  : item.payload.description == 3
                  ? '膳食评估'
                  : item.payload.description == 4
                  ? '运动评估'
                  : '评估'
              }}</text>
							<text class="share_assess_desc u-line-2">快来评估吧</text>
						</view>
						<image v-if="item.payload.description == 1" class="u-m-l-40" :src="`${imgUrl}assessIcon.png`"
							mode="aspectFit"></image>
						<image v-if="item.payload.description == 2" class="u-m-l-40" :src="`${imgUrl}assessIcon2.png`"
							mode="aspectFit"></image>
						<image v-if="item.payload.description == 3" class="u-m-l-40" :src="`${imgUrl}assessIcon3.png`"
							mode="aspectFit"></image>
						<image v-if="item.payload.description == 4" class="u-m-l-40" :src="`${imgUrl}assessIcon4.png`"
							mode="aspectFit"></image>
					</view>
					
				</view>
			</view>
		</scroll-view>
		<view class="footer u-relative" :style="{bottom:inputHeight + 'px'}">
			<view class="send_message u-flex">
				<image @click="showVoice = !showVoice;showEmoji = false;showMenu = false" class="u-m-r-20"
					:src="`${imgUrl}v3_messageIconVoice.png`" mode="aspectFit"></image>
				<input :adjust-position="false" style="background: #F5F5F5;border-radius: 20rpx;height: 58rpx;"
					v-if="!showVoice" @blur="textInputFocus = false;inputHeight = 0" @focus="inputBindFocus"
					v-model="text" @confirm="sendTextMessage" confirm-type="发送" />
				<view @touchcancel="audioDeleteFlag = true;maskshow = false" hover-start-time="200"
					@touchstart="recordVoiceStart" @touchend="recordVoiceEnd" @touchmove="recordVoiceMove"
					:custom-style="{height: '58rpx'}" style="flex:1;height: '58rpx'" class="voicebtn" v-else>按住 说话
				</view>
				<image @click="showCurrentOperationBox('showEmoji')" class="u-m-l-20"
					:src="`${imgUrl}v3_messageIconFace.png`" mode="aspectFit"></image>
				<image v-if="text === ''" @click="showCurrentOperationBox('showMenu')" class="u-m-l-20"
					:src="`${imgUrl}v3_messageIconAdd.png`" mode="aspectFit"></image>
				<view v-else class="send_btn u-flex" @click="sendTextMessage">
					<text>发送</text>
				</view>
				<!-- <view  class="send_btn u-flex" @click="sendTextMessage">
		  <text>发送</text>
		</view> -->
			</view>
			<!-- 发送语音消息 -->
			<!-- <view v-if="showVoice" class="audio_content u-flex">
				
				<image class="delete_icon" v-if="audioDeleteFlag" :src="`${imgUrl}delete.png`" mode="aspectFit">
				</image>
				<image class="delete_icon" v-else :src="`${imgUrl}delete2.png`" mode="aspectFit"></image>
				<view class="record_audio" @touchstart="recordVoiceStart" @touchend="recordVoiceEnd"
					@touchmove="recordVoiceMove($event)">
					<image v-if="recording" :src="`${imgUrl}voice.png`" mode="aspectFit"></image>
					<image v-else :src="`${imgUrl}voice2.png`" mode="aspectFit"></image>
				</view>
				<text :style="{
            color: audioDeleteFlag ? '#E30909' : recording ? '#00B8A2' : '#4a4a4a'
          }">{{ audioDeleteFlag ? '松开取消' : recording ? '松开发送' : '按住说话' }}</text>
			</view> -->
			<!-- 菜单 -->
			<view v-if="showMenu" class="menu_content u-flex">
				<view class="menu_item_operation u-flex" @click="handleChooseImage('image','album')">
					<image :src="`${imgUrl}v3_messageImg.png`" mode=""></image>
					<text>相册</text>
				</view>
				<view class="menu_item_operation u-flex" @click="handleChooseImage( 'video','camera')">
					<image :src="`${imgUrl}v3_messagePhoto.png`" mode=""></image>
					<text>拍摄</text>
				</view>
				<view class="menu_item_operation u-flex" @click="handleChooseImage( 'video','album')">
					<image :src="`${imgUrl}v3_messageVideo.png`" mode=""></image>
					<text>视频</text>
				</view>

				<!-- <view class="menu_item_operation u-flex">
					<image :src="`${imgUrl}messageCard.png`" mode=""></image>
					<text>名片</text>
				</view> -->
				<!-- <view class="menu_item_operation u-flex" @click="chooseFile">
					<image :src="`${imgUrl}v3_messageFile.png`" mode=""></image>
					<text>文件</text>
				</view> -->
				<!-- v-if="userInfo.role_id == 2" -->
				<view class="menu_item_operation u-flex" v-if="userInfo.role_id == 2"
					@tap="questionnairePopupShow = true">
					<image :src="`${imgUrl}v3_messageAsk.png`" mode=""></image>
					<text>问卷</text>
				</view>
			</view>
			<!-- emoji表情 -->
			<view v-if="showEmoji" class="emoji_content">
				<view class="emojis">
					<view v-for="(emojiItem, index3) in emojiName" class="emoji_item" :key="emojiItem"
						@click="chooseEmoji(emojiItem)">
						<image :src="emojiUrl + emojiMap[emojiItem]" style="width: 100%; height: 100%" />
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<tki-file-manager ref="filemanager" @result="fileResultPath"></tki-file-manager>
		<!-- #endif -->
		<preview-video :url="videoUrl" v-model="previewVideoShow"></preview-video>
		<u-mask :show="maskshow" @click="maskshow = false">
			<view class="warp">
				<view class="rect u-flex" @tap.stop>

					{{audioDeleteFlag?'松开停止发送':'正在录制语音'}}
					<arc color="#fff" v-if="!audioDeleteFlag" :reverse="true" :play="!audioDeleteFlag"></arc>
				</view>
				<!-- <view class="u-flex-xy-center u-absolute" style="bottom:200rpx;left:-30%;width: 100%;">
					<image @click.stop="audioDeleteFlag = true" :src="`${imgUrl}v3_record_close.png`" style="width: 80rpx;height: 80rpx;" mode=""></image>
				</view> -->
			</view>
		</u-mask>
		<puestionnaire-popup @questionnaireCreate="questionnaireCreateHandler" @questionAsk="questionnairePopupShow = false" :friendUid="friend_user_id"
			@open="questionnairePopupShow = true" @close="questionnairePopupShow = false"
			:show="questionnairePopupShow">
		</puestionnaire-popup>
	</view>
</template>

<script>
	import consent from '@/pages/message/components/consent.vue'
	import consent1 from '@/pages/message/components/consent1.vue'
	import puestionnairePopup from '@/pages/message/components/puestionnairePopup.vue'
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import {
		emojiName,
		emojiMap,
		emojiUrl
	} from '@/utils/emojiMap'
	import previewVideo from './components/previewVideo.vue'
	import arc from './components/arc.vue'
	const getRecorderManager = uni.getRecorderManager()
	// #ifdef APP-PLUS
	import tkiFileManager from '@/components/tki-file-manager.vue'

	// #endif
	export default {
		data() {
			return {
				targetAskId:'',//广西问卷的id 防止重复请求详情渲染列表
				disableStyleNot:{
					padding: '0 86rpx',
					background: '#e4e4e4',
					color: '#c4c4c4',
				},
				disableStyleYes:{
					padding: '0 86rpx',
					background: '#e4e4e4',
					color: '#c4c4c4',
					marginLeft: '40rpx',
				},
				customStyleNot: {
					padding: '0 86rpx',
					background: '#ECECEC',
					color: '#06291C',
				},
				customStyleYes: {
					padding: '0 86rpx',
					background: '#00B8A2',
					marginLeft: '40rpx',
					color: '#fff'
				},
				customStyleNot1: {
					padding: '0 86rpx',
					background: '#ECECEC',
					color: '#06291C',
				},
				customStyleYes1: {
					padding: '0 86rpx',
					background: '#ECECEC',
					marginLeft: '40rpx',
					color: '#06291C'
				},
				btnLoading:false,
				maskshow: false, //语音蒙层
				tenMinutesTimeStamp: 60 * 1000,
				triggered: false,
				_freshing: false,
				friend_user_id: '', //用户id
				min_id: 0, //消息id
				page: 1,
				length: 0,
				friendUid: 0,
				sendMsgLoading: false, //发送消息标识
				questionnairePopupShow: false,
				cursorSpacing: uni.upx2px(20), //输入框距离键盘的高度
				userID: '', //对方id
				avatar: '', //对方头像
				messageList: [], //消息列表
				text: '', //发送的文本消息
				isHistoryLoading: false, //参数作为进入请求标识，防止重复请求
				scrollAnimation: true, //scrollView滑动动画
				scrollTop: 0, //scroll-view滚动条位置
				scrollToView: '', //滚动到当前id元素的位置
				nextReqMessageID: '', //用于续拉，分页续拉时需传入该字段。
				isCompleted: false, //表示是否已经拉完所有消息
				showVoice: false, //是否显示语音发送
				recording: false, //是否正在录音中
				recordTime: 0, //录音时长
				recordTimer: null, //增加录音时长的定时器
				AUDIO: uni.createInnerAudioContext(), //全局语音播放器
				playVoiceId: null, //当前正在播放的语音id
				audioDeleteTop: null, //取消语音的按钮距离页面顶部的值
				audioDeleteLeft: null, //取消语音的按钮距离页面左边的值
				audioDeleteFlag: false, //是否取消语音发送
				showMenu: false, //是否显示菜单
				textInputFocus: false, //文本框焦点
				showEmoji: false, //是否显示表情框
				emojiName: emojiName, //表情名字
				emojiMap: emojiMap, //表情数据
				emojiUrl: emojiUrl, //表情url
				// videoUrl: 'http://vfx.mtime.cn/Video/2019/03/19/mp4/190319222227698228.mp4',
				videoUrl: null, //预览视频url
				previewVideoShow: false, //显示预览视频
				messageShowIndex: -1, //用于上拉加载消息时出现的遮罩
				pageNumber: 1, //当前拉取本地记录的页码
				pageSize: 15, //每次拉取本地记录的条数
				messageTotal: 0, //本地记录总条数
				currentMessageStorageName: null, //当前记录本都存储的名字
				unreadCount: 0, // 未读数量
				is_chat: 0, // 是否可发送消息  0 开启 1 关闭
				pageStartY: 0, //语音发送起始位置
				inputHeight: 0, //软键盘高度,
				getRequestScene:'',//onshow的时候请求一次接口
			}
		},
		components: {
			puestionnairePopup,
			consent,
			consent1,
			previewVideo,
			arc,
			// #ifdef APP-PLUS
			tkiFileManager
			// #endif
		},
		watch: {
			// '$store.state.message.currentMessageList': {
			//   // 每次消息列表数据更新
			//   handler(value) {
			//     if (!this.isHistoryLoading) {
			//       // 滚动到底部
			//       this.scrollToBottom()
			//     }
			//     // 设置消息已读
			//     this.setMessageRead()
			//   },
			//   deep: true
			// },
			'$store.state.message.msg': {
				
				handler(val) {
					console.log('val: ', val)
					if (val.length) {
						this.$store.commit('setnewMsgId', val[0].id)

						//找到当前用户发的消息
						let arr = val.filter(v => v.from_user_id == this.friend_user_id && !v.is_me_send)
						console.log('arr: ', arr)
						if (val && arr.length && !this.isHistoryLoading) {
							this.buildMessagList(arr)
							// 设置消息已读
							this.setMessageRead()
							this.scrollBottom()

						}


					}


				}
			},
			// 显示预览视频的弹框
			previewVideoShow(val) {
				if (!val) this.videoUrl = null
			},
			// 显示发送语音的box
			showVoice(value) {
				if (value) {
					// #ifdef MP-WEIXIN
					uni.getSetting({
						success: (res) => {
							let auth = res.authSetting['scope.record']
							if (auth === false) {
								this.$common
									.showModal({
										content: '请前往设置页打开麦克风'
									})
									.then((res) => {
										uni.openSetting()
									})
									.catch(() => {
										this.showVoice = false
									})
							}
						},
						fail: () => {}
					})
					// #endif
				}
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			...mapState({
				// messageList: (state) => state.message.currentMessageList,
				toUserId: (state) => state.message.currentConversationID
			}),
			// 底部操作区域的高度
			footerBoxHeight() {
				let height = 58

				if (this.showVoice) {
					height = 58
				} else if (this.showMenu) {
					// height = 420 + 58
					height = 210 + 58
				} else if (this.showEmoji) {
					height = 420 + 58
				}
				return height
			}
		},
		//离开页面清楚数据
		onUnload() {
			this.playVoiceId = null
			this.AUDIO.destroy()
			clearInterval(this.recordTimer)
			this.$store.commit('resetMessageList')
			this.$store.commit('setCurrentConversationID', '')
		},
		async onLoad(option) {
			
			if(option.scene == 'ASSESSMENT_REPORT_ASK'){
				this.getRequestScene = 'ASSESSMENT_REPORT_ASK'
			}else{
				this.friend_user_id = option.friend_user_id // 用户id
				this.avatar = option.avatar ? decodeURIComponent(option.avatar) : ''
				uni.setNavigationBarTitle({
					title: option.nick || '匿名用户'
				})
			}
			
			//获取消息列表
			this.getmessageList()
			// // 进入页面使未读消息总数量减去当前会话未读的数量
			// const unreadCountTotal = this.$store.state.message.unreadCountTotal
			// const unreadCount = Number(option.unreadCount)
			// this.unreadCount = unreadCount
			// 
			// if (unreadCount) {
			//   this.$store.commit('setUnreadCount', parseInt(unreadCountTotal - unreadCount))
			// }
			// await this.sdkGetMessageList() // 拉取sdk漫游消息记录
			// // this.getMessageList()

			// this.firstGetMessageList() // 第一次拉取本地记录
			this.setMessageRead() //设置已读
			// //
			this.setRecordVoice() //设置录音

			this.initAudio() // 初始化录音器
			// this.isChat()
		},
		async onShow() {
			if(this.getRequestScene === 'ASSESSMENT_REPORT_ASK'){ //扫码进来的时候去掉已读 不然轮询获取不到消息 导致消息列表没有此用户
				this.btnLoading = false
				//获取扫码后的好友id
				this.friend_user_id =  (await this.getAction(0)).friend_id
				
				let result =  await this.getFriendMsg(this.friend_user_id)
				
				this.friend_user_id = result.friend_user_id // 用户id
				this.avatar = result.avatar
				uni.setNavigationBarTitle({
					title:result.nickname || '匿名用户'
				})
				this.getRequestScene = ''
				await this.getmessageList()
				// let obj = this.messageList[this.messageList.length-1] || {}
				// let msg = [
				// 	{
				// 		...obj,
				// 		from_user_id:this.friend_user_id
				// 	}
				// ]
				// console.log('msg: ', msg)
				
				// this.$store.commit('setMessage',msg)
				
				// this.setMessageRead() //设置已读
				this.setRecordVoice() //设置录音
				this.initAudio() // 初始化录音器
			}
		},
		methods: {
			
			//获取问卷详情接口
			getASKDetail(id) {
				if(!id) return
				return new Promise((resolve,reject)=>{
					this.$request({
						url: '/ApiV3/Mobile/AssessmentReport/v2Show',
						method: 'get',
						data: {
							id
						}
					}).then((res) => {
							resolve(res.data) 
					}).catch(err => {
							reject(err) 
					})
				})
					
			},
			setQuestion(id) {
				
				this.messageList.forEach((v, i) => {
					if (v.body?.id == id) {
						v.is_consent_user_sign = 1
						this.$set(this.messageList[i], 'is_consent_user_sign', 1)
						this.$forceUpdate()
						
					}
				})
			},
			inputBindFocus(e) {
				this.showEmoji = false
				this.showMenu = false
				this.showVoice = false
				this.scrollBottom()
				if (e.detail.height) {
					this.inputHeight = e.detail.height
					
				}
			},
			// 解析小程序text, 表情信息也是[嘻嘻]文本
			parseText(message) {
				let renderDom = []
				let temp = message
				let left = -1
				let right = -1
				while (temp !== '') {
					left = temp.indexOf('[')
					right = temp.indexOf(']')
					switch (left) {
						case 0:
							if (right === -1) {
								renderDom.push({
									name: 'text',
									text: temp
								})
								temp = ''
							} else {
								let _emoji = temp.slice(0, right + 1)
								if (emojiMap[_emoji]) {
									renderDom.push({
										name: 'img',
										src: emojiUrl + emojiMap[_emoji]
									})
									temp = temp.substring(right + 1)
								} else {
									renderDom.push({
										name: 'text',
										text: '['
									})
									temp = temp.slice(1)
								}
							}
							break
						case -1:
							renderDom.push({
								name: 'text',
								text: temp
							})
							temp = ''
							break
						default:
							renderDom.push({
								name: 'text',
								text: temp.slice(0, left)
							})
							temp = temp.substring(left)
							break
					}
				}
				return renderDom
			},
			onPulling(e) {
				
			},
			onRefresh() {
				
				if (this._freshing) return;
				this._freshing = true;
				this.triggered = true;
				this.isHistoryLoading = true
				setTimeout(async () => {
					if (this.length) {
						const firstChildrenId = this.messageList[0].id
						this.scrollAnimation = false //关闭滑动动画
						this.page++
						await this.getmessageList(firstChildrenId)
						this.triggered = false;
						this._freshing = false;
					} else {
						this.triggered = false;
						this._freshing = false;

					}
					this.isHistoryLoading = false
				}, 1000)
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				this.isHistoryLoading = false
				
			},
			onAbort() {
				
			},
			scrollBottom() {
				// this.textInputFocus = true
				this.scrollAnimation = true //恢复动画
				this.scrollToView = ''
				setTimeout(() => {
					this.scrollToView = 'message_item' + this.messageList[this.messageList.length - 1].id
					
				}, 10)

			},

			buildMessagList(arr) {
				
				let timeStamp;
				if (arr) {
					let maxId = Math.max(...this.messageList.map(v => v.id))
					//过滤掉原来有的数据
					let unqureArr = arr.filter(v => maxId < v.id)
					this.messageList.push(...unqureArr.reverse())
				}
				
				this.messageList.forEach(async (v, i) => {
					

					if (v?.body?.type === 'TEXT') {
						v.virtualDom = this.parseText(v.body.text)

					}
					if (v?.body?.type === 'IMAGE') {
						// v.virtualDom = this.parseText(v.body.text)
					}
					if (v?.body?.type === 'VIDEO') {
						// v.virtualDom = this.parseText(v.body.text)

						// try{
						// 	v.body.thumb = await this.base64(v.body.thumb)

						// }catch(e){
						// 	//TODO handle the exception

						// 		

						// }	
					}
					if (v?.body?.type === 'ASSESSMENT_REPORT_ASK') {//获取问卷按钮是否可以点击
						if( arr && v?.body?.id === this.targetAskId){//修改广西问卷的时候 如果是已完成的话 重复修改后端会一直发消息 这里过滤一下 只刷新发的那条
							
							this.$set(v,'operation',(await  this.getASKDetail(this.targetAskId))?.operation || 0)
						}else if(!arr && (v.operation == undefined || v.operation == null) ){ //arr为空时 第一次刷新全部
							this.$set(v,'operation',(await  this.getASKDetail(v?.body?.id))?.operation || 0)
							// this.$set(v,'operation', 0)
							
						}
					
					}
					if (v?.body?.type === 'QUESTION1') {
						// v.is_consent_user_sign = this.getis_consent_user_sign(v.body.id)

					}
					if (i === 0) {
						timeStamp = new Date(v.created_at.replaceAll(/-/g, '/')).getTime() + this
							.tenMinutesTimeStamp
						v.showTime = true
					} else {
						let dataTimeStamp = new Date(v.created_at.replaceAll(/-/g, '/')).getTime()


						if (timeStamp > dataTimeStamp && !v.showTime) { //1分钟内的时间不显示（ 排除掉原来已显示的时间
							v.showTime = false
						} else {

							//超过1分钟的时间显示。并以当前时间往前每隔1分钟显示一次时间
							v.showTime = true
							timeStamp = new Date(v.created_at.replaceAll(/-/g, '/')).getTime() + this
								.tenMinutesTimeStamp
						}

					}

					if (v.is_me_send) {
						v.avatar = this.userInfo.avatar

					} else {
						v.avatar = this.avatar
					}

				})

				

				this.sendMsgLoading = false

			},
			getmessageList(firstChildrenId) {
				this.isHistoryLoading = true
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Chat/history',
						method: 'get',
						loading:true,
						data: {
							page: this.page,
							friend_id: this.friend_user_id,
							// min_id:this.min_id//根据id往前搜索记录
						}
					}).then((res) => {
						let data = res.data.data.reverse()
						this.scrollAnimation = false //关闭滑动动画
						if (data.length) {
							if (this.page === 1) {
								this.messageList = data
								//滚动到底部
								this.$nextTick(() => {
									setTimeout(()=>{
										this.scrollToView = 'message_item' + data[data.length - 1].id
										
									},10)
								})
								
							} else {
								this.messageList.unshift(...data)
								this.$nextTick(() => {
									if (firstChildrenId){
										setTimeout(()=>{
											this.scrollToView = 'message_item' +firstChildrenId
											
										},10)
									} 
								})

							}

							
							

							this.buildMessagList()

							this.length = res.data.next_page_url
						}
						
						this.isHistoryLoading = false
						resolve()

					}).catch(err => {
						this.isHistoryLoading = false
						reject()
					})
				})

			},
			isChat() {
				this.$request({
					url: '/ApiV3/Mobile/User/info',
					method: 'get',
					data: {
						role_id: uni.getStorageSync('currentRoleId')
					}
				}).then((res) => {
					this.is_chat = res.data.is_chat
				})
			},
			// 跳转评估
			handleJumpAssess(item) {
				const type = Number(item.payload.description)
				if (type === 1) {
					this.jump({
						url: 'mine/invite/updatePersonalInfo',
						data: {
							from: 'healthAssessment'
						}
					})
				} else {
					this.jump({
						url: 'home/healthAssessment/assessContent',
						data: {
							type
						}
					})
				}
			},
			// 打开文件
			openFile(url) {
				this.$common.openFile(url)
			},
			// 预览视频
			openPreviewVideo(url) {
				this.videoUrl = url
				this.previewVideoShow = true
			},
			// 选择视频 发送消息
			chooseVideo() {
				uni.chooseVideo({
					sourceType: ['album', 'camera'], // 来源相册或者拍摄
					maxDuration: 60, // 设置最长时间60s
					camera: 'back', // 后置摄像头
					success: (res) => {
						
						// res.videoFile.second = Number(res.videoFile.second)
						
						let message = this.tim.createVideoMessage({
							to: this.toUserId,
							conversationType: TIM.TYPES.CONV_C2C,
							payload: {
								file: res
							}
						})
						this.sendMessage(message)
					}
				})
			},
			// 安卓选择文件回调
			fileResultPath(e) {
				const path = plus.io.convertLocalFileSystemURL(e)
				
				
				const index = e.lastIndexOf('/')
				const name = e.substring(index + 1, e.length)
				this.$axios({
					url: '/api/upload_file_info.html',
					file: 'file://' + path,
					upload: true,
					errMsg: true,
					loading: true
				}).then((res) => {
					const fileUrl = res.url
					let message = this.tim.createCustomMessage({
						to: this.toUserId,
						conversationType: TIM.TYPES.CONV_C2C,
						payload: {
							data: 'file',
							description: fileUrl,
							extension: name
						}
					})
					this.sendMessage(message)
				})
			},
			// 选择文件
			chooseFile() {
				let that = this
				// #ifdef MP-WEIXIN
				wx.chooseMessageFile({
					count: 1,
					type: 'all',
					success: (result) => {
						const file = result.tempFiles[0]
						
						that.uploadImages(file.path, 'FILE').then(res => {

						})
						// this.$axios({
						// 	url: '/api/upload_file_info.html',
						// 	file,
						// 	upload: true,
						// 	errMsg: true,
						// 	loading: true
						// }).then((res) => {
						// 	const fileUrl = res.url
						// 	let message = this.tim.createCustomMessage({
						// 		to: this.toUserId,
						// 		conversationType: TIM.TYPES.CONV_C2C,
						// 		payload: {
						// 			data: 'file',
						// 			description: fileUrl,
						// 			extension: file.name
						// 		}
						// 	})
						// 	this.sendMessage(message)
						// })
					}
				})
				// #endif
				// #ifdef APP-PLUS
				this.$refs.filemanager._openFile()
				// #endif
			},
			// 预览图片
			handlePreviewImage(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			// 发消息选中emoji
			chooseEmoji(item) {
				this.text += item
			},

			//上传单个或多个图片
			uploadImages(filePath, type, second, thumb) { //转换本地图片路径

				//暂时只能多次调用filePath
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				return new Promise((resolve, reject) => {
					this.$common.uploadParams(filePath, 'CHAT').then(async (data) => {

						let params = {
							type,
							url: data.key
						}
						if (type === 'AUDIO') params.s = second
						if (type === 'VIDEO') {
							//拿到临时地址重新上传到服务器
							params.thumb = (await this.$common.uploadParams(thumb, 'CHAT')).key
						}
						await this.sendMessage(params)
						console.log('上传成功', {
							...res,
							...data,
							filePath
						})
					}).catch(err => {

					})
					// const {
					// 	data
					// } = await this.$request({
					// 	url: '/ApiV3/Mobile/Upload/uploadParams',
					// 	data: {
					// 		type: 'CHAT'
					// 	}
					// })
					// uni.uploadFile({
					// 	url: data.host, // 开发者服务器的URL。
					// 	filePath,
					// 	name: 'file', // 必须填file。
					// 	formData: {
					// 		key: data.key,
					// 		policy: data.policy,
					// 		OSSAccessKeyId: data.OSSAccessKeyId,
					// 		signature: data.signature,
					// 		// 'x-oss-security-token': securityToken // 使用STS签名时必传。
					// 	},
					// 	success: async (res) => {
					// 		
					// 		if(res.statusCode === 204){
					// 			let params = {
					// 				type,
					// 				url: data.key
					// 			}
					// 			if (type === 'AUDIO') params.s = second
					// 			if (type === 'VIDEO'){
					// 				params.thumb = thumb
					// 			} 
					// 			await that.sendMessage(params)
					// 			console.log('上传成功', {
					// 				...res,
					// 				...data,
					// 				filePath
					// 			})
					// 			resolve(data)
					// 		}else{
					// 			reject(res)
					// 		}

					// 	},
					// 	fail(res) {
					// 		
					// 		reject(res)
					// 	}
					// })

				})

			},
			// 选择照片、视频
			handleChooseImage(mediaType, type) {
				let that = this
				uni.chooseMedia({
					count: 9,
					sourceType: [type],
					mediaType,
					maxDuration: 30,
					success: async (res) => {
						
						let taskPromises = res.tempFiles.map((item, index) => {
							let paramsType = item.fileType === 'image' ? 'IMAGE' : 'VIDEO'
							return that.uploadImages(item.tempFilePath, paramsType, '', item
								.thumbTempFilePath)

						})
						Promise.all(taskPromises).then(res => {
							uni.hideLoading()
							
						}).catch(err => {
							this.$common.toast(err)
							uni.hideLoading()
						})

					}

				})
			},
			// 初始化音频播放器
			initAudio() {

				this.AUDIO.onEnded((res) => {
					this.playVoiceId = null
					
				})
				this.AUDIO.onError((res) => {
					
					// this.playVoiceId = null
					this.$common.toast('音频过期')
				})
				this.AUDIO.onPlay((res) => {
					
				})
			},
			// 播放音频
			handlePlayAudio(item) {

				if (this.playVoiceId) this.AUDIO.stop()

				if (this.playVoiceId !== item.id) {
					
					
					this.playVoiceId = item.id
					this.AUDIO.src = item.body.url
					this.$nextTick(() => {
						
						this.AUDIO.play()
					})
				} else {
					this.playVoiceId = null
				}
			},
			// 录音设置
			setRecordVoice() {
				getRecorderManager.onStart((res) => {
					this.recording = true
					this.audioDeleteFlag = false
					this.maskshow = true
					this.recordTimer = setInterval(() => {
						this.recordTime += 100
					}, 100)
				})
				getRecorderManager.onStop((res) => {
					
					this.recording = false
					this.maskshow = false
					clearInterval(this.recordTimer)
					const recordTime = this.recordTime
					this.recordTime = 0
					if (this.audioDeleteFlag) return
					// #ifdef MP-WEIXIN
					if (res.duration < 1000) {
						return this.$common.toast('录音时间过短')
					}
					// #endif
					// #ifdef APP-PLUS
					if (recordTime < 1000) {
						return this.$common.toast('录音时间过短')
					}
					// #endif
					res.duration = recordTime
					res.fileSize = 66666
					this.$common.showLoading('发送中')
					// const message = this.tim.createAudioMessage({
					// 	to: this.toUserId,
					// 	conversationType: TIM.TYPES.CONV_C2C,
					// 	payload: {
					// 		file: res
					// 	}
					// })
					this.uploadImages(res.tempFilePath, 'AUDIO', parseInt(res.duration / 1000)).finally((err) => {
						this.$common.toast(err)
						uni.hideLoading()
					})

					// this.sendMessage(message)
				})
				getRecorderManager.onError((err) => {
					this.recording = false
					this.maskshow = false
					clearInterval(this.recordTimer)
					this.$common.toast(err)
				})
			},
			// 开始录音
			recordVoiceStart(e) {
				
				this.pageStartY = e.touches[0].pageY
				getRecorderManager.start({
					duration: 60000,
					sampleRate: 8000,
					numberOfChannels: 1,
					format: 'mp3'
				})
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: (res) => {
						let auth = res.authSetting['scope.record']

						if (auth === false) {
							this.$common
								.showModal({
									content: '请前往设置页打开麦克风'
								})
								.then((res) => {
									uni.openSetting()
								})
								.catch(() => {
									this.showVoice = false
								})
						}
					},
					fail: () => {}
				})
				// #endif
			},
			// 结束录音并发送语音
			recordVoiceEnd() {
				getRecorderManager.stop()
			},
			// 滑动到取消按钮时
			recordVoiceMove(e) {

				const x = e.touches[0].pageX
				const y = e.touches[0].pageY
				if (this.pageStartY - y > uni.upx2px(40)) {
					this.audioDeleteFlag = true
				} else {
					this.audioDeleteFlag = false
				}
				
				// const width = uni.upx2px(70)
				// if (
				// 	x > this.audioDeleteLeft &&
				// 	x < this.audioDeleteLeft + width &&
				// 	y > this.audioDeleteTop &&
				// 	y < this.audioDeleteTop + width
				// ) {
				// 	this.audioDeleteFlag = true
				// } else {
				// 	this.audioDeleteFlag = false
				// }
			},
			// 点击语音或点击菜单等操作时显示对应盒子
			showCurrentOperationBox(type) {
				if (this[type]) {
					this[type] = false
					this.scrollToBottom()
				} else {
					this.showEmoji = false
					this.showMenu = false
					this.showVoice = false
					this[type] = true
					this.scrollToBottom()
					if (type === 'showVoice') {
						if (this.audioDeleteTop !== null) return false
						// this.$nextTick(() => {
						// 	// 获取取消按钮在页面的位置
						// 	this.$common.queryDom('.delete_icon', (res) => {
						// 		this.audioDeleteTop = res.top
						// 		this.audioDeleteLeft = res.left
						// 	})
						// })
					}
				}
			},

			// 滚动到顶部时然后拉取记录
			// handleScrolltoupper(e) {
			//   if (this.isHistoryLoading || this.pageNumber * this.pageSize >= this.messageTotal || this.isCompleted)
			//     return false
			//   this.pageNumber++
			//   this.isHistoryLoading = true //参数作为进入请求标识，防止重复请求
			//   this.scrollAnimation = false //关闭滑动动画
			//   const firstChildrenId = this.messageList[0].ID
			//   this.$common.showLoading()
			//   const messageList = uni.getStorageSync(this.currentMessageStorageName) || []
			//   messageList.reverse()

			//   const currentPageData = messageList.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize)
			//   currentPageData.reverse()

			//   this.$store.commit('unshiftMessageList', currentPageData)
			//   //在数据插入列表，渲染之后，
			//   //没有滚动到下拉之前位置时，采用相对定位，设置同背景色遮罩层盖住消息
			//   //设置为14意思是，每次拿15条数据，遮住前15条，用数组循环下标判断从0开始，初始化为-1
			//   //可解决一闪而过的问题
			//   this.messageShowIndex = 14
			//   this.$nextTick(() => {
			//     //使滚动条回到加载数据前的之前的位置
			//     this.scrollToView = firstChildrenId
			//     this.messageShowIndex = -1 //去掉遮罩层
			//     this.$common.hideLoading()
			//     setTimeout(() => {
			//       this.isHistoryLoading = false
			//     }, 500)
			//     this.$nextTick(() => {
			//       this.scrollAnimation = true //恢复滚动动画
			//     })
			//   })
			// },
			// sdk拉取漫游消息记录 包括离线消息
			sdkGetMessageList(lastList = []) {
				this.$common.showLoading()
				return new Promise((resolve, reject) => {
					let params = {}
					if (this.nextReqMessageID) {
						params = {
							conversationID: 'C2C' + this.toUserId,
							count: 15,
							nextReqMessageID: this.nextReqMessageID
						}
					} else {
						params = {
							conversationID: 'C2C' + this.toUserId,
							count: 15
						}
					}
					this.tim.getMessageList(params).then(async (imResponse) => {
						
						// this.$store.commit('unshiftMessageList', imResponse.data.messageList)
						this.nextReqMessageID = imResponse.data.nextReqMessageID
						this.isCompleted = imResponse.data.isCompleted
						if (
							imResponse.data.messageList.length === 15 &&
							imResponse.data.messageList[0].isRead === false &&
							this.isCompleted === false
						) {
							// 如果最后15条消息的第一条都未读 则递归继续拉取 直到拉取到有已读的为止
							await this.sdkGetMessageList([...imResponse.data.messageList, ...lastList])
						} else {
							// noReadMessageList 所有未读的消息
							const noReadMessageList = imResponse.data.messageList.filter((item) => !
								item
								.isRead)
							const {
								timLoginUserId,
								currentConversationID
							} = this.$store.state.message
							this.currentMessageStorageName =
								`MESSAGELIST_${timLoginUserId}_${currentConversationID}`
							// 存储未读的消息到本地
							if (uni.getStorageSync(this.currentMessageStorageName)) {
								let messageList = uni.getStorageSync(this.currentMessageStorageName)
								messageList = [...messageList, ...noReadMessageList, ...lastList]
								uni.setStorageSync(this.currentMessageStorageName, messageList)
							} else {
								uni.setStorageSync(this.currentMessageStorageName, [...
									noReadMessageList,
									...lastList
								])
							}
							this.$common.hideLoading()
						}
						resolve()
					})
				})
			},
			// 第一次获取消息记录
			firstGetMessageList() {
				const messageList = uni.getStorageSync(this.currentMessageStorageName) || []
				this.messageTotal = messageList.length
				if (this.messageTotal <= this.pageSize) {
					this.$store.commit('unshiftMessageList', messageList)
				} else {
					const currentPageData = messageList.slice(-15)
					this.$store.commit('unshiftMessageList', currentPageData)
				}
			},
			// 使操作框隐藏
			hideOperationBox() {
				this.$nextTick(() => {
					this.showEmoji = false
					this.showMenu = false
					// this.showVoice = false
				})
			},
			// 发送文本消息
			sendTextMessage() {
				if (this.$u.trim(this.text) === '') return false
				// const message = this.tim.createTextMessage({
				//   to: this.toUserId,
				//   conversationType: TIM.TYPES.CONV_C2C,
				//   payload: {
				//     text: this.text
				//   }
				// })
				this.sendMessage({
					type: 'TEXT',
					text: this.text
				}).then((res) => {
					this.text = ''
				})
			},
			// 自定义消息
			questionnaireCreateHandler(id, end, type = 'TOSIGN') {
				
				this.sendMessage({
					type: 'QUESTION1',
					id,
					end
				})
				this.questionnairePopupShow = false
				return
				switch (type) {
					case 'TOSIGN':
						// uni.navigateTo({
						//   url: '/pages/other/signature?id=' + id
						// })
						break
					case 'REPLY':
						let message = this.tim.createTextMessage({
							to: this.toUserId,
							conversationType: TIM.TYPES.CONV_C2C,
							payload: {
								text: '我已确认知情同意书'
							}
						})
						this.sendMessage(message).then((res) => {
							this.text = ''
						})
						break
					case 'SEND':
						this.sendCustomMessage('QUESTIONNAIRE', {
							id: id,
							end: end
						})
						break
					default:
						break
				}
			},
			sendCustomMessage(type, data) {
				let message = null
				switch (type) {
					case 'QUESTIONNAIRE':
						message = this.tim.createCustomMessage({
							to: this.toUserId,
							conversationType: TIM.TYPES.CONV_C2C,
							payload: {
								data: type,
								description: data.id,
								extension: data.end
							}
						})
						break

					default:
						break
				}

				this.sendMessage(message).then((res) => {})
			},
			getAction(action,id){ //	0=扫码后触发1=点击是2=点击否
				
				
				if(this.btnLoading) return
				if(id){
					let index =  this.messageList.findIndex(v=>v.body.id === id)
					
					if(index>-1){
						this.$set(this.messageList[index],'operation',1)
					}
					
				}
				return new Promise((resolve, reject) => {
					let data = {
						action
					}
					if(id) data.id = id
					this.btnLoading  = true
					this.$request({
						url: '/ApiV3/Mobile/AssessmentReport/chat',
						method: 'post',
						loading:true,
						data
					}).then(res => {
						this.btnLoading  = false
						resolve(res.data)
					})
				})
			},
			//获取好友聊天信息
			getFriendMsg(friend_id) {
				if(!friend_id) return
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Chat/friendInfo',
						method: 'get',
						data: {
							friend_id
						}
					}).then(res => {
						resolve(res.data)
					})
				})

			},
			// 发送消息
			sendMessage(content) {
				// 
				// if (this.is_chat == 1) return
				this.$common.showLoading('发送中')
				this.sendMsgLoading = true
				

				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Chat/send',
						data: {
							to: this.friend_user_id,
							content
						}
					}).then(async res => {


						this.$common.hideLoading()
						if (res.data.msg) {
							// this.messageList.push(res.data.msg)
							this.buildMessagList([res.data.msg])
							//缓存到messageList
							await this.$store.dispatch('addMessageList', {
								msg: res.data.msg,
								id: this.friend_user_id
							})
							//滚动到底部
							this.scrollBottom()
						}

						resolve()

					}).catch(err => {
						
						this.$common.hideLoading()
						this.$common.toast('发送失败，请稍后再试')
						reject(err)
					})
					// this.tim
					//   .sendMessage(message)
					//   .then((imResponse) => {
					//     this.$store.commit('pushUpdateMessageList', imResponse.data.message)
					//     // this.messageList.push(imResponse.data.message)
					//     this.$common.hideLoading()
					//     resolve(imResponse)
					//     this.scrollToBottom()
					//     
					//   })
					//   .catch((imError) => {
					//     
					//     this.$common.hideLoading()
					//     this.$common.toast('发送失败，请稍后再试')
					//     reject(imError)
					//   })
				})
			},
			// 设置为已读消息
			setMessageRead() {
				this.$request({
					url: '/ApiV3/Mobile/Chat/read',
					data: {
						friend_id: this.friend_user_id
					}
				}).then(res => {
					//把缓存的消息列表全部设置为已读
					this.$store.commit('setMessageRead', this.friend_user_id)
					//  let messageListAll =  uni.getStorageSync('messageList') && JSON.parse(uni.getStorageSync('messageList')) || []
					//  let messageList =  messageListAll.filter(v=>v.imUid == uni.getStorageSync('imUid'))

					//  let msgAll =  uni.getStorageSync('msg') && JSON.parse(uni.getStorageSync('msg')) || []
					//  let msg =   msgAll.filter(v=>v.imUid == uni.getStorageSync('imUid'))
					//  messageList.forEach(v=>{
					// 	 if(v.friend_user_id == this.friend_user_id){
					// 		 v.num = 0
					// 	 }
					//  })
					//  msg.forEach(v=>{
					// 	 if(v.from_user_id == this.friend_user_id){
					// 		 v.status = 1
					// 	 }
					//  })
					//  uni.setStorageSync('messageList',JSON.stringify(messageList))

					//  uni.setStorageSync('msg',JSON.stringify(msg))
					//  this.$store.commit('setRead',this.friend_user_id)

				})
				// const conversationID = 'C2C' + this.toUserId
				// this.tim
				//   .setMessageRead({
				//     conversationID
				//   })
				//   .then((imResponse) => {
				//     let val = this.$store.state.message.unreadCountTotal
				//     let readNum = val - val
				//     readNum = readNum < 0 ? 0 : readNum
				//     this.$store.commit('setUnreadCount', readNum)
				//     
				//   })
				//   .catch(function (imError) {
				//     
				//   })
			},
			// 使滚动条滚动到底部
			scrollToBottom() {
				this.$nextTick(() => {
					// #ifdef MP-WEIXIN
					if (this.messageList.length) {
						this.scrollToView = this.messageList[this.messageList.length - 1].ID
					}
					// #endif
					// #ifdef APP-PLUS
					this.scrollTop = 9999999 + new Date().getTime()
					// #endif
				})
			},
			jump({
				url = '',
				data = ''
			}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #eaeaeb;
	}

	.container {
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.rect {
			// width: 240rpx;
			// height: 240rpx;
			color: #fff;
			padding: 20rpx 40rpx;
			background-color: #00B8A2;
			border-radius: 12rpx;
		}

		.voicebtn {
			background: white;
			line-height: 58rpx;
			text-align: center;
			border-radius: 8rpx;
		}

		.voicebtn ::after {
			border: none;
		}

		.active {
			background: #00B8A2;
			color: #fff;
		}

		.date_title {
			// padding: 40upx 0;
			padding-bottom: 30upx;
			justify-content: center;
			font-size: 24upx;

			>text {
				height: 40upx;
				line-height: 40upx;
				padding: 0 30upx;
				background: #cbcbcb;
				border-radius: 6upx;
				color: #ffffff;
			}
		}

		.messages {
			// height: calc(100vh - 40rpx - var(--safe-area-inset-bottom) - 80rpx);
			box-sizing: border-box;
			// padding-bottom: 30upx;
			// padding-top: 30upx;
			background: #eaeaeb;

			.loading_mask {
				position: absolute;
				top: 0;
				left: 0;
				z-index: 10;
				width: 100%;
				height: 100%;
				background: #eaeaeb;
			}

			.show_index {
				display: none;
			}

			.message_container {
				padding-top: 30upx;

				&:last-child {
					padding-bottom: 30upx;
				}
			}

			.message_item {
				// margin-top: 30upx;
				padding: 0 30upx;
				border-radius: 10upx;
				display: flex;
				align-items: flex-start;

				// &:first-child {
				// 	margin-top: 0;
				// }

				.avatar {
					border-radius: 50%;
					margin-right: 38upx;
					width: 86upx;
					height: 86upx;
				}

				.message_content {
					position: relative;
					padding: 16upx;
					border-radius: 10upx;
					background: #ffffff;
					max-width: 460upx;
					//       display: flex;
					// flex-wrap: wrap;
					align-items: center;
					justify-content: flex-start;

					.audit_icon {
						margin-right: 10upx;
						width: 30upx;
						height: 30upx;
					}
				}

				.triangle {
					position: relative;

					&::after {
						content: '';
						position: absolute;
						top: 10upx;
						width: 0;
						border-width: 20upx;
						border-style: solid;
						border-color: transparent #ffffff transparent transparent;
					}
				}

				.message_video {
					width: 180upx;
					height: 180upx;
					position: relative;

					&::after {
						height: 100%;
						width: 100%;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 10;
						content: '';
					}

					image {
						width: 100%;
						height: 100%;
					}

					video {
						border-radius: 10upx;
						width: 100%;
						height: 100%;
					}
				}

				.message_file {
					padding: 20upx;
					background: #ffffff;
					border-radius: 10upx;

					&::after {
						border-color: transparent transparent transparent #ffffff !important;
					}

					>text {
						margin-left: 14upx;
						max-width: 300upx;
					}
				}

				.message_share_assess {
					background: #ffffff;
					padding: 24upx 30upx;
					border-radius: 10upx;

					&::after {
						border-color: transparent transparent transparent #ffffff !important;
					}

					image {
						width: 100upx;
						height: 100upx;
					}

					>view {
						width: 260upx;
						margin-right: 30upx;
						flex-direction: column;
						align-items: flex-start;

						.share_assess_title {
							font-size: 32upx;
						}

						.share_assess_desc {
							width: 260upx;
							margin-top: 10upx;
							font-size: 24upx;
							color: #888888;
						}
					}
				}
			}

			.others {
				.triangle {
					&::after {
						left: -34upx;
					}
				}

				.message_share_assess,
				.message_file {
					&::after {
						border-color: transparent #ffffff transparent transparent !important;
					}
				}
			}

			.self {
				flex-direction: row-reverse;

				.avatar {
					margin-left: 38upx;
					margin-right: 0;
				}

				.message_content {
					flex-direction: row-reverse;
					background: #00B8A2;
					color: #FFFFFF;

					.audit_icon {
						margin-left: 10upx;
						transform: rotateZ(180deg);
					}
				}

				.triangle {
					&::after {
						right: -34upx;
						border-color: transparent transparent transparent #00B8A2;
					}
				}
			}
		}

		.footer {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 750upx;
			// padding: 0 30upx;
			padding-top: 20upx;
			padding-bottom: calc(20upx + var(--safe-area-inset-bottom));
			background: #fff;

			.send_message {
				padding: 0 30upx;

				>image {
					width: 54upx;
					height: 54upx;
					padding: 4rpx 0rpx
				}

				input,
				textarea {
					// width: 468upx;
					flex: 1;

					height: 58upx;
					background: #ffffff;
					border-radius: 10upx;
					box-sizing: border-box;
					padding: 0 20upx;
				}

				.send_btn {
					justify-content: center;
					margin-left: 20upx;
					width: 100upx;
					padding: 12upx;
					background: #00B8A2;
					border-radius: 10upx;
					color: #ffffff;
				}
			}

			.audio_content {
				padding: 0 30upx;
				height: 300upx;
				justify-content: center;
				flex-direction: column;
				position: relative;

				.time {
					height: 40upx;
				}

				.delete_icon {
					position: absolute;
					top: 30upx;
					right: 0;
					width: 70upx;
					height: 70upx;
				}

				.record_audio {
					padding: 30upx 0;
					width: 250upx;
					text-align: center;
					position: relative;

					&::after {
						content: '';
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
					}

					image {
						width: 81upx;
						height: 114upx;
					}
				}
			}

			.menu_content {
				padding: 0 30upx;
				padding-top: 30upx;
				flex-wrap: wrap;

				.menu_item_operation {
					width: 25%;
					align-items: center;
					flex-direction: column;

					image {
						width: 130upx;
						height: 130upx;
					}

					text {
						margin-top: 12upx;
					}

					&:nth-child(n + 5) {
						margin-top: 30upx;
					}
				}
			}

			.emoji_content {
				padding-top: 20upx;

				.emojis {
					height: 400upx;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					overflow-y: scroll;
					box-sizing: border-box;

					.emoji_item {
						width: 93upx;
						height: 93upx;
						padding: 10upx;
					}
				}
			}
		}
	}
</style>