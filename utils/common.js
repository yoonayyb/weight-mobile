import route from '../uview-ui/libs/function/route.js'
import { request_v2 } from './request.js'
export const commonApi = {
	api: {
		//本地
		// new: 'http://192.168.8.66:9501',
		// old: 'http://192.168.8.66'
		//测试
		// new: 'https://testv2.subweight.weehealth.cn',
		// old: 'https://pre-test.subweight.weehealth.cn',
		//预发布
		// new: 'https://pre-test.subweight.weehealth.cn',
		// old: '',
		//生产
		// new: 'https://subweight-pro.goodpure.cn',
		// old: 'https://mini.goodpure.cn'
		//生产v3
		// new: 'https://weight.goodpure.cn',
		// old: 'https://mini.goodpure.cn'
	},
	clickApi: {
		//多次点击切换
		//本地
		// new: 'http://192.168.8.66:9501',
		// old: 'http://192.168.8.66'
		//测试
		// new: 'https://testv2.subweight.weehealth.cn',
		// old: 'https://pre-test.subweight.weehealth.cn'
		//预发布
		// new: 'https://pre-test.subweight.weehealth.cn',
		// old: '',
		//生产
		// new: 'https://subweight-pro.goodpure.cn',
		// old: 'https://mini.goodpure.cn'
		// //生产v3
		// new: 'https://weight.goodpure.cn',
		// old: 'https://mini.goodpure.cn'
	}
}
// export const baseUrl = 'http://192.168.0.124'   //本地
// export const baseUrl = 'http://tz.localdev.com'  //本地
// export const baseUrl = "http://admin.nlygy.com"; //测试
const accoutInfo = uni.getAccountInfoSync()
console.log('utils：accoutInfo', accoutInfo.miniProgram.envVersion)
if (accoutInfo.miniProgram.envVersion === 'release') { //||  accoutInfo.miniProgram.envVersion === 'develop'
	commonApi.api.new = commonApi.clickApi.new = 'https://weight.goodpure.cn'
	commonApi.api.old = commonApi.clickApi.old = 'https://mini.goodpure.cn'
} else {
	// commonApi.api.new = commonApi.clickApi.new = 'https://weight.goodpure.cn'
	// commonApi.api.old = commonApi.clickApi.old = 'https://mini.goodpure.cn'
	commonApi.api.new = commonApi.clickApi.new ='https://testv2.subweight.weehealth.cn' 
	commonApi.api.old = commonApi.clickApi.old = 'https://pre-test.subweight.weehealth.cn'
}
export const baseUrl = uni.getStorageSync('baseUrl') || commonApi.api.old //'https://mini.goodpure.cn' //正式
export const baseUrl_v2 = uni.getStorageSync('baseUrl_v2') || commonApi.api.new //'https://mini.goodpure.cn' //正式
export const imgUrl = ''
// 获取n天后的日期
export const getDateStr = (AddDayCount) => {
	let dd = new Date()
	dd.setDate(dd.getDate() + AddDayCount) //获取AddDayCount天后的日期
	let y = dd.getFullYear()
	let m = dd.getMonth() + 1 //获取当前月份的日期
	let d = dd.getDate()
	if (m < 10) {
		m = '0' + '' + m
	}
	if (d < 10) {
		d = '0' + '' + d
	}
	return y + '-' + m + '-' + d
}
// 时间戳转化为年月日
export const formatDate = (timeStamp, day = true, second = false) => {
	if (!timeStamp) return ''
	let time = ''
	if (timeStamp.toString().length < 13) {
		timeStamp = timeStamp * 1000
		time = new Date(timeStamp)
	} else {
		time = timeStamp
	}

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	if (second) {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
	}
	if (day) {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
	} else {
		return y + '-' + add0(m) + '-' + add0(d)
	}
}
export const formatDate1 = (timeStamp, day = true, second = false) => {
	if (!timeStamp) return ''
	let time = timeStamp

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	if (second) {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
	}
	if (day) {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
	} else {
		return y + '-' + add0(m) + '-' + add0(d)
	}
}
// 获取url参数
export const getParams = (str, params) => {
	if (!str) return ''
	const arr = str.split('&')
	const obj = {}
	arr.forEach((item) => {
		const key = item.split('=')[0]
		const value = item.split('=')[1]
		if (key) {
			obj[key] = value
		}
	})
	return obj[params] || ''
}
// app分享
export const appShare = ({ title = '', image = '', path = '' } = {}) => {
	return new Promise((resolve, reject) => {
		uni.share({
			provider: 'weixin',
			scene: 'WXSceneSession',
			type: 5,
			imageUrl: image,
			title,
			miniProgram: {
				id: 'gh_5c68f7f7bee6',
				path,
				type: 0,
				webUrl: 'http://www.goodpure.cn'
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
// 打开文件
export const openFile = (url) => {
	showLoading('加载中')
	uni.downloadFile({
		url,
		success: (response) => {
			if (response.statusCode === 200) {
				uni.saveFile({
					tempFilePath: response.tempFilePath,
					success: (resData) => {
						const index = url.lastIndexOf('.')
						const fileType = url.substring(index + 1, url.length)
						uni.openDocument({
							filePath: resData.savedFilePath,
							fileType, // 指定文件的格式
							showMenu: true, // 允许出现分享功能
							success: (r) => {
								hideLoading()
							},
							fail: (openError) => {
								hideLoading()
								console.log(openError, '打开文件失败')
							}
						})
					},
					fail: (error) => {
						hideLoading()
						console.log(error, '保存文件按失败')
					}
				})
			}
		},
		fail: (err) => {
			hideLoading()
			console.log(err, '下载文件失败')
		}
	})
}
// 获取上一个页面
export const prePage = (index = 1) => {
	let pages = getCurrentPages()
	let prePage = pages[pages.length - 1 - index]
	if (prePage) {
		// #ifdef H5
		return prePage
		// #endif
		return prePage.$vm
	}
}
// 公用路由跳转
export const jump = ({ that = {}, url = '', data = {} }) => {
	if (url.indexOf('tabbar') !== -1) {
		uni.switchTab({
			url: '/pages/' + url
		})
	} else {
		route('/pages/' + url, data)
	}
}
// 保存token
export const setToken = (token) => {
	uni.setStorageSync('token', token)
}
// 模态框
export const showModal = ({
	title = '提示',
	content = '',
	confirmText = '确定',
	confirmColor = '#00B8A2',
	showCancel = true
} = {}) => {
	return new Promise((resolve, reject) => {
		function normal() {
			uni.showModal({
				title,
				content,
				confirmText,
				confirmColor,
				showCancel,
				success: (res) => {
					if (res.confirm) {
						resolve()
					} else {
						reject()
					}
				}
			})
		}
		// #ifdef MP-WEIXIN
		normal(resolve, reject)
		// #endif
		// #ifdef APP-PLUS
		normal(resolve, reject)
		return false
		try {
			const dcRichAlert = uni.requireNativePlugin('DCloud-RichAlert')
			let buttons = [{
				title: confirmText,
				titleColor: confirmColor
			}]
			if (showCancel) {
				buttons.push({
					title: '取消',
					titleColor: '#000000'
				})
			}
			dcRichAlert.show({
					position: 'center',
					title,
					titleColor: '#000000',
					content,
					contentColor: '#666666',
					contentAlign: 'center',
					buttons
				},
				(result) => {
					if (result.type === 'button') {
						if (result.index === 0) {
							reject()
						} else if (result.index === 1) {
							resolve()
						}
					}
				})
		} catch {
			normal()
		}
		// #endif
	})
}
// 加载中
export const showLoading = (title = '加载中') => {
	uni.showLoading({
		title
	})
}
// 加载完成
export const hideLoading = () => {
	uni.hideLoading()
}
// 轻提示
export const toast = (title = '成功', time = 2500) => {
	uni.showToast({
		title,
		duration: time,
		icon: 'none'
	})
}
// 跳转登录
export const jumpLogin = () => {
	showModal({
		title: '提示',
		content: `为了您能正常使用，请先登录！`,
		confirmText: '去登录',
		confirmColor: '#00B8A2'
	}).then((res) => {
		uni.navigateTo({
			url: '/pages/login/index'
		})
	})
}
// 获取元素信息
export const queryDom = (dom, callback) => {
	const box = uni.createSelectorQuery().select(dom)
	box.boundingClientRect((res) => {
		callback(res)
	}).exec()
	// return new Promise((resolve) => {
	// 	let view = uni.createSelectorQuery().select(dom);
	// 	view.fields({
	// 		size: true,
	// 		rect: true,
	// 		scrollOffset: true,
	// 		dataset: true,
	// 		context: true,
	// 	}, (res) => {
	// 		resolve(res);
	// 	}).exec();
	// })
}
// 设置tabbaer消息的未读数
export const setTabbarMessageTotal = (val) => {
	if (val > 0) {
		uni.setTabBarBadge({
			index: 1,
			text: val.toString()
		})
	} else {
		uni.removeTabBarBadge({
			index: 1
		})
	}
}
// 保存成功
export const submitSuccess = (title, callback) => {
	showModal({
		title: '提示',
		content: title || '保存成功',
		confirmText: '确定',
		confirmColor: '#00B8A2',
		showCancel: false
	}).then((res) => {
		if (!prePage() || prePage().$scope.$page.fullPath === '/pages/login/index') {
			uni.switchTab({
				url: '/pages/tabbar/projects'
			})
		} else {
			uni.navigateBack({
				delta: 1
			})
		}
		callback && callback()
	})
}
// 对象按照key排序
export const jsonKeySort = (o) => {
	let sorted = {},
		keys = Object.keys(o)
	keys.sort()
	keys.forEach((key) => {
		sorted[key] = o[key]
	})
	return sorted
}
// 判断时间是昨天今天
export const filterDate = (time) => {
	let tempTime = time + ' 00:00:00'
	tempTime = tempTime.replace(/-/g, '/')
	let date = new Date(tempTime)
	// const y = date.getFullYear();
	const m = date.getMonth() + 1
	const d = date.getDate()
	const toDay = getDateStr(0)
	const yesterday = getDateStr(-1)
	const theDayBeforeYesterday = getDateStr(-2)
	if (toDay === time) {
		return '今天'
	} else if (yesterday === time) {
		return '昨天'
	} else if (theDayBeforeYesterday === time) {
		return '前天'
	} else {
		return m + '-' + d
	}
}
export function unique(arr) {
	// 因对象特别，分出数组中的对象单独去重
	let objArr = arr.filter((item) => {
		return Object.prototype.toString.call(item) === "[object Object]";
	});
	let otherTypeArr = arr.filter((item) => {
		return Object.prototype.toString.call(item) !== "[object Object]";
	});
	// 数组及简单类型处理
	let obj = {};
	otherTypeArr = otherTypeArr.filter((item, index) => {
		let newItem = item + JSON.stringify(item);
		return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true);
	});
	// 对象类型处理
	if (objArr.length !== 0) {
		// 将数组对象转成数组字符串
		var objToStrArr = [];
		var keyArr = [];
		var key = "";
		var currentObj = {};
		var currentStr = "";
		objArr.forEach(item => {
			// 对象属性排序
			keyArr = [];
			for (key in item) {
				keyArr.push(key);
			}
			keyArr.sort(); // 降序
			currentObj = {};
			keyArr.forEach(ele => {
				currentObj[ele] = item[ele];
			})
			currentStr = JSON.stringify(currentObj);
			// 去除空格及\t空白字符
			// currentStr = currentStr.replace(/(\s|[\\t])/g, "");
			objToStrArr.push(currentStr);
		})
		objToStrArr.sort();
		var tmepArr = [];
		// 数组去重
		objToStrArr.forEach((item, i) => {
			if (item !== tmepArr[tmepArr.length - 1]) {
				tmepArr.push(item);
			}
		})
		var resultArr = [];
		// 新数组字符串转成数组对象
		tmepArr.forEach((item) => {
			resultArr.push(JSON.parse(item));
		})
		objArr = resultArr;
	}
	return [...otherTypeArr, ...objArr];
}
export function uploadParams(filePath, type) {
	return new Promise(async (resolve, reject) => {
		let params = {}
		if (type) params.type = type
		const {
			data
		} = await request_v2({
			url: '/ApiV3/Mobile/Upload/uploadParams',
			loading: true,
			errMsg: true,
			data: params
		})
		uni.uploadFile({
			url: data.host, // 开发者服务器的URL。
			filePath,
			name: 'file', // 必须填file。
			formData: {
				key: data.key,
				policy: data.policy,
				OSSAccessKeyId: data.OSSAccessKeyId,
				signature: data.signature,
				// 'x-oss-security-token': securityToken // 使用STS签名时必传。
			},
			success: async (res) => {
				console.log('uploadFile', res)
				if (res.statusCode === 204) {
					console.log('uploadParamsData', data)
					resolve(data)
				} else {
					reject(res)
				}
			},
			fail(res) {
				console.log('fail', res)
				reject(res)
			}
		})
	})
}
//只要 时分秒
export const formatTimeHHMMSS = (timeStamp) => {
	let time = ''
	time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	return `${add0(h)}:${add0(mm)}:${add0(s)}`
}
const updataToken = ()=>{
	
	return new Promise((resolve,reject)=>{
		request_v2({
			url: '/ApiV3/Mobile/Auth/extendToken',
		}).then(res=>{
			resolve()
		})
	})
}
//判断当前登陆状态
export const getLoginStatus = ()=>{
	return new Promise(  (resolve,reject)=>{
		request_v2({
			url:'/ApiV3/Mobile/Auth/loginStatus',
			method:'get'
		}).then( async res=>{
			let is_login = res.data.is_login
			if(!is_login){
				uni.setStorageSync('token','')
			}else{
				
				//更新token
				await updataToken()
			}
			resolve(is_login)
			
		})
	})
	
}
	