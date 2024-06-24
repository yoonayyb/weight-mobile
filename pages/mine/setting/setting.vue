<template>
  <view class="container border_t container_padding_bottom">
    <!-- #ifdef MP-WEIXIN -->
    <info-template title="小程序权限设置" :icon="true" @click="openSetting"></info-template>
    <info-template title="消息推送提醒" :icon="true" @click="jump({ url: 'mine/setting/infoPush' })"></info-template>
    <info-template title="意见反馈" :icon="true" @click="jump({ url: 'mine/setting/feedback' })"></info-template>
    <!-- <info-template title="切换环境" :icon="true" @click="show = true"> </info-template> -->
   <!-- <info-template title="聊天提醒" :icon="true" @tap="requestSubscribeMessage"> </info-template>
    <info-template title="服务提醒" :icon="true" @tap="seviceRequestSubscribeMessage"> </info-template> -->
    <!-- <info-template title="日记提醒" :icon="true" @tap="logRequestSubscribeMessage"> </info-template> -->
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <info-template title="设置密码" :icon="true" @click="jump({ url: 'test/setPassword' })"></info-template>
    <info-template title="微信" :icon="true" @click="bindWx">
      <text>{{ userInfo.is_bindwx === 1 ? '已绑定' : '未绑定' }}</text>
    </info-template>

    <info-template @click="jump({ url: 'mine/setting/richText', data: { type: 1 } })" title="用户协议" :icon="true">
    </info-template>
    <info-template @click="jump({ url: 'mine/setting/richText', data: { type: 2 } })" title="隐私政策" :icon="true">
    </info-template>
    <view class="copyright_wrap">
      <text>Copyright@2019-2021 归朴goodpure.cn版权所有</text>
    </view>
    <!-- #endif -->
    <view class="footer_button">
      <my-button @click="handleLogout" width="690" height="100">退出登录</my-button>
    </view>
	<u-action-sheet :list="list" v-model="show"></u-action-sheet>
  </view>
</template>

<script>
import infoTemplate from '@/components/infoTemplate.vue'
import myButton from '@/components/myButton.vue'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      wxSetting: {},
	  // show:false,
	  // list:[{
		 //  text: '测试',
		 //  url:'https://testv2.subweight.weehealth.cn',
	  // },{
		 //  text: '预发布',
		 //  url:'https://pre-test.subweight.weehealth.cn',
	  // },]
    }
  },
  onLoad() {
    // #ifdef MP-WEIXIN

    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      },
      complete(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
    // #endif
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // app微信登录
    bindWx() {
      if (this.userInfo.is_bindwx === 1) return false
      const that = this
      uni.getProvider({
        service: 'oauth',
        success: function (res) {
          console.log(res.provider)
          //支持微信、qq和微博等
          if (~res.provider.indexOf('weixin')) {
            uni.login({
              provider: 'weixin',
              success: function (loginRes) {
                that.getApploginData(loginRes)
              },
              fail: function (res) {
                console.log('App微信获取用户信息失败', res)
              }
            })
          }
        }
      })
    },
    // app获取微信头像昵称
    getApploginData(data) {
      var that = this
      uni.request({
        url:
          'https://api.weixin.qq.com/sns/userinfo?access_token=' +
          data.authResult.access_token +
          '&openid=' +
          data.authResult.openid,
        method: 'GET',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          that
            .$axios({
              url: '/api/bind_wxinfo',
              errMsg: true,
              loading: true,
              data: {
                wx_openid: res.data.openid,
                wx_unionid: res.data.unionid,
                nickname: res.data.nickname,
                avatar: res.data.headimgurl
              }
            })
            .then((res) => {
              const userInfo = this.userInfo
              userInfo.is_bindwx = 1
              this.$store.commit('setUserInfo', userInfo)
              that.$common.toast(res.message)
            })
        },
        fail() {}
      })
    },
    // 公共跳转
    jump({ url = '', data = {} } = {}) {
      this.$common.jump({
        url,
        data,
        that: this
      })
    },
    // 小程序设置页
    openSetting() {
      uni.openSetting()
    },
    // 退出登录
    handleLogout() {
      this.$common
        .showModal({
          title: '提示',
          content: `您确定要退出登录吗`,
          confirmText: '确定',
          confirmColor: '#00B8A2'
        })
        .then((res) => {
		 
          
			  
            this.$store.dispatch('logout', this.tim)
          
        })
    },
    logRequestSubscribeMessage() {
      uni.requestSubscribeMessage({
        tmplIds: ['klo5DKVBtOJmE2qwaoWyc7albYe0oHez8S7Eh0cHNL8', 'aJSETfjxUmZmSMg-Y70FiK-rGC3-tXo5l9wzVkqmEtg'],
        success: (res) => {
          let arr = ['klo5DKVBtOJmE2qwaoWyc7albYe0oHez8S7Eh0cHNL8', 'aJSETfjxUmZmSMg-Y70FiK-rGC3-tXo5l9wzVkqmEtg']
          if (arr.some((v) => res[v] === 'accept')) {
            return this.$common.toast('订阅成功')
          }

          this.$common.toast('已取消,请去小程序权限设置中修改')
        },
        fail: (err) => {
          this.$common.toast(err.errMsg)
        }
      })
    },
    seviceRequestSubscribeMessage() {
      uni.requestSubscribeMessage({
        tmplIds: ['PoRkeVz8nAcINlDWq9Fu66BWTmXcENwC0xa3P8sg5bY', 'klo5DKVBtOJmE2qwaoWyc8EU-xD7PkeYYzm6gWgTmqY'],
        success: (res) => {
          let arr = ['PoRkeVz8nAcINlDWq9Fu66BWTmXcENwC0xa3P8sg5bY', 'klo5DKVBtOJmE2qwaoWyc8EU-xD7PkeYYzm6gWgTmqY']
          if (arr.some((v) => res[v] === 'accept')) {
            return this.$common.toast('订阅成功')
          }

          this.$common.toast('已取消,请去小程序权限设置中修改')
        },
        fail: (err) => {
          this.$common.toast(err.errMsg)
        }
      })
    },
    orderRequestSubscribeMessage() {
      uni.requestSubscribeMessage({
        tmplIds: [
          'aJSETfjxUmZmSMg-Y70FiGJUagbZMvVSPzA9rV2aOD4',
          'iOvvIPSxW-xINEKILugybQivQwLAkpbTVJ_pCMCk9SY',
          'KNBoojVM-oIApHKVNj-gX90LTyIwkqsQK86S1pYD6ds'
        ],
        success: (res) => {
          let arr = [
            'aJSETfjxUmZmSMg-Y70FiGJUagbZMvVSPzA9rV2aOD4',
            'iOvvIPSxW-xINEKILugybQivQwLAkpbTVJ_pCMCk9SY',
            'KNBoojVM-oIApHKVNj-gX90LTyIwkqsQK86S1pYD6ds'
          ]
          if (arr.some((v) => res[v] === 'accept')) {
            return this.$common.toast('订阅成功')
          }
          console.log('res', res)
          this.$common.toast('已取消,请去小程序权限设置中修改')
        },
        fail: (err) => {
          this.$common.toast(err.errMsg)
        }
      })
    },
    requestSubscribeMessage() {
      uni.requestSubscribeMessage({
        tmplIds: [
          'PoRkeVz8nAcINlDWq9Fu66BWTmXcENwC0xa3P8sg5bY',
          'klo5DKVBtOJmE2qwaoWyc8EU-xD7PkeYYzm6gWgTmqY',
          'aJSETfjxUmZmSMg-Y70FiK-rGC3-tXo5l9wzVkqmEtg'
        ],
        success: (res) => {
          console.log(res)
          let arr = [
            'PoRkeVz8nAcINlDWq9Fu66BWTmXcENwC0xa3P8sg5bY',
            'klo5DKVBtOJmE2qwaoWyc8EU-xD7PkeYYzm6gWgTmqY',
            'aJSETfjxUmZmSMg-Y70FiK-rGC3-tXo5l9wzVkqmEtg'
          ]
          if (arr.some((v) => res[v] === 'accept')) {
            return this.$common.toast('订阅成功')
          }
          this.$common.toast('已取消,请去小程序权限设置中修改')
        },
        fail: (err) => {
          this.$common.toast(err.errMsg)
        }
      })
    }
  },
  components: {
    infoTemplate,
    myButton
  }
}
</script>

<style lang="scss" scoped>
.copyright_wrap {
  position: fixed;
  left: 0;
  bottom: 160upx;
  display: flex;
  justify-content: center;
  width: 750upx;
}
</style>
