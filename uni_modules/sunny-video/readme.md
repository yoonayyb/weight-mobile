# sunny-video视频倍速播放器
> **组件名：sunny-video**

### 平台差异说明
目前以应用到APP（安卓、iOS）、微信小程序

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法 

- APP端需要配置`manifest.json>App模块配置`勾选`VideoPlay(视频播放)`

### Props

|属性名		| 类型			|默认值	 		| 可选值	| 说明|
|:-:		| :-:			|:-:			| :-:	| :-:	|
|src		| String		| ''			| -		| 视频播放地址	|
|title		| String		| ''			| -		| 视频标题	|
|poster		| String		| ''			| -		| 视频封面	|
|videoHeight| String, Number| 230px			| -		| 视频高度|
|playImgHeight| String, Number| '70rpx'	| -		| 播放图片按钮宽高|
|playImg	| String	| 'base64'			| -		| 暂停按钮|	
|showMuteBtn | Boolean		| false	| -		| 是否显示静音按钮|
|isExitFullScreen | Boolean | true	| -		| 播放完毕是否退出全屏|

```html
<sunny-video ref="sunny-video" title="测试视频" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4" @timeupdate="timeupdate" />
```

### 事件 Events

| 事件名   | 说明                                                             | 返回值 |
| -------- | ----------------------------------------------------------------| ------ |
| play  |  | 监听开始播放   |
| pause     | 监听视频暂停                                                     | 	  |
| playError     | 视频播放出错时触发      |        |
| videoEnded | 视频播放结束触发 |  |
| timeupdate | 播放进度变化时触发 | event.detail = {currentTime, duration} 。触发频率 250ms 一次 |

### 方法 Methods
| 事件名   | 说明                                                             
| -------- | ----------------|
| onPlayChange | 开始播放视频 |