import { jsonKeySort, baseUrl_v2 } from './common.js'

import store from '../vuex/index'
import CryptoJS from "crypto-js"
// var fundebug = require("./fundebug.1.7.2.min.js");
/**
 * @param {string} url 请求地址
 * @param {string} method 请求方法
 * @param {object} data 请求参数
 * @param {boolean} loading 是否出现加载中
 * @param {boolean} errMsg 错误时是否出现toast提示
 * @param {boolean} upload 是否是上传文件请求
 * @param {object} file 上传的文件
 */
const flatten_object = (obj, prefix)=> {
		var flat_obj = {};
		for (var key in obj) {
			if(obj[key] === undefined || obj[key] === null){
				
				flat_obj[prefix ? prefix + '.' + key : key] = null ;
			}else if ( typeof obj[key] === 'object') {
			
				var flat_child = flatten_object(obj[key], prefix ? prefix + '.' + key : key);
				Object.assign(flat_obj, flat_child);
			} else {
				
				flat_obj[prefix ? prefix + '.' + key : key] = obj[key] ;
			}
		}
		return flat_obj;
	}
const Hash = (json_data,URL) => {
	let index = URL.indexOf('?')
	if(index > -1){
		URL = URL.slice(0,index)
		
	}
	
	// 密钥
	const key = 'asddsads8g_gg5s';
	// 将JSON数据扁平化为单层键-值对
	const flat_data = flatten_object(json_data);
	// console.log("扁平化参数",flat_data)
	const sorted_keys = Object.keys(flat_data).sort();
	let query_string = '';
	for (let i = 0; i < sorted_keys.length; i++) {
		const key = sorted_keys[i];
		const value = flat_data[key];
		query_string += `${key}=${value}&`;
	}
	// query_string = query_string.slice(0, -1);
	 query_string = query_string + URL
	 // console.log('URL',URL)
	 // console.log('query_string',query_string)
	// 使用HMAC-SHA256算法计算签名
	const signature = CryptoJS.HmacSHA256(query_string, key).toString();
	return signature;
}
//生成随机十位数字符串
function generateRandomString() {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}



const request_v2 = ({
  url = '',
  method = 'POST',
  data = {},
  loading = false,
  errMsg = false,
  upload = false,
  file = null
} = {}) => {
	
  return new Promise((resolve, reject) => {
    if (loading) {
      uni.showLoading({
        title: '加载中',
		mask:true
      })
    }
    // md5加密
    // const key = 'Wxmp_s13a68661ded77a16728825079w3r91'
    // const timeStamp = Date.parse(new Date()).toString().substr(0, 10)
    // const encryptionParamsArr = []

    // data = jsonKeySort(data)
    // for (let key in data) {
    //   if (data[key] === undefined) {
    //     data[key] = ''
    //     encryptionParamsArr.push(`${key}=${data[key]}`)
    //   }
    //   if (typeof data[key] === 'object') {
    //     encryptionParamsArr.push(`${key}=${JSON.stringify(data[key])}`)
    //   }
    // }
    // encryptionParamsArr.push(`timeStamp=${timeStamp}`, `key=${key}`)
    // data.token = md5(md5(encryptionParamsArr.join('&')))
    // data.timeStamp = timeStamp
    
	const timeStamp = Date.parse(new Date()).toString().substr(0, 11)
	
	data._t = timeStamp
	data._n = generateRandomString()
	data._s = Hash(data,url)

    const header = {
      'content-type': 'application/json',
      // #ifdef APP-PLUS
      platform: 'app',
      // #endif
      // #ifdef MP-WEIXIN
      platform: 'mini'
      // #endif
    }
    if (uni.getStorageSync('token')) {
      header.authorization = 'Bearer ' + uni.getStorageSync('token')
    }
	for(let i in data){
		if(data[i] === undefined ) data[i] = null
	}
	// console.log('入参',data)
	
    if (upload) {
      //传文件
      uni.uploadFile({
        url: (uni.getStorageSync('baseUrl_v2') ||  baseUrl_v2) + url,
        name: 'file',
        filePath: file.path || file,
        header,
        formData: data,
        success(res) {
			// console.log('upload:res',res)
			// console.log('formData',data)
          if (loading) {
            uni.hideLoading()
          }
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            if (data.code === 0) {
              resolve(data.data)
            } else if (data.code >= 10000 && data.code < 10100) {
				
				
              let url = '/pages/login/index'
              uni.navigateTo({
                url
              })
			  uni.clearStorageSync()
            } else {
              if (errMsg) {
                uni.showToast({
                  title: data.message,
                  icon: 'none',
                  duration: 3000
                })
              }
              reject({
                code: data.code,
                data: data.data,
                message: data.message
              })
            }
          } else {
            uni.showToast({
              title: '服务器错误',
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail(err) {
          if (loading) {
            uni.hideLoading()
          }
          uni.showToast({
            title: err.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
      })
    } else {
      //普通请求
      uni.request({
        url:(uni.getStorageSync('baseUrl_v2') ||  baseUrl_v2)  + url,
        data,
        method,
        dataType: 'json',
        timeout: 100000,
        header,
        success(res) {
			
			if(url !== '/ApiV3/Mobile/Chat/getNewMsg'){
				console.log('baseUrl_v2',baseUrl_v2)
				console.log(
				  `---------------api 请求--------------\n` +
				    `请求地址: ${(uni.getStorageSync('baseUrl_v2') ||  baseUrl_v2) + url}\n` +
				    `请求参数:\n` +
				    `${JSON.stringify(data)}\n` +
				    `------------------------------------------------------`
				)
				console.log('返回结果', res.data)
				console.log('------------------------------------------------------')
			}
          
          if (loading) {
            uni.hideLoading()
          }

          if (res.statusCode === 200) {
            const resData = {
              code: res.data.code,
              data: res.data.data,
              message: res.data.message
            }

            if (res.data.code === 0) {
              resolve(resData)
            } else if (res.data.code >= 10000 && res.data.code < 10100) {
              
			
              uni.navigateTo({
                url:'/pages/login/index'
              })
			  uni.clearStorageSync()
            } else {
              if (errMsg) {
                uni.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 3000
                })
              }
              if (res.data.code === 203) {
                uni.removeStorageSync('token')
                // uni.showModal({
                // 	title: '提示',
                // 	content: res.data.message,
                // 	confirmText: '确定',
                // 	confirmColor: '#00B8A2',
                // 	showCancel: false,
                // 	success: (res) => {
                // 		if (res.confirm) {
                // 			uni.navigateTo({
                // 				url: '/pages/login/index'
                // 			})
                // 		}
                // 	}
                // })
              }
              
            }
			reject(resData)
          } else {
            console.log('失败', res,url)
			
            if (res.data.code >= 10000 && res.data.code < 10100) {
			 //单独对轮询失败处理
			 if(url === '/ApiV3/Mobile/Chat/getNewMsg'){
				 
				 return reject()
			 }
              uni.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 3000
              })
            
			  reject()
			  
              return uni.navigateTo({
                url:'/pages/login/index'
              })
			  uni.clearStorageSync()
            }
			// fundebug.notifyError(res.data.message || '当前网络状态不佳，请稍后再尝试。');
			if (errMsg) {
			  uni.showToast({
			    title: res.data.message || '当前网络状态不佳，请稍后再尝试。',
			    icon: 'none',
			    duration: 3000
			  })
			}
           
			reject()
          }
        },
        fail(err) {
          if (loading) {
            uni.hideLoading()
          }
		  // fundebug.notifyError(err);
          uni.showToast({
            title: err.errMsg,
            icon: 'none',
            duration: 3000
          })
		  reject()
        }
      })
    }
  })
}
export {  request_v2 }
