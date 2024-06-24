<template>
  <view class="container">
	  <image class="u-m-t-40 u-m-b-40" :src="`${imgUrl}v3_invite_sale.png`" mode="" style="width:355rpx;height:207rpx;margin:0 auto;display: block;
	  }"></image>
    <view class="u-p-20 u-font-28" style="text-align:center"
      >您正在接受 <text v-if="inviteName" style="color:#00B8A2">【{{ inviteName }}】</text> 邀请进行销售代表注册，请填写本人真实姓名完成注册。</view>
    <u-form :model="form" ref="uForm" label-position="top" :label-style="{fontWeight:'bold'}">
      <u-form-item label="姓名">
        <u-input type="text" v-model="form.realname" placeholder-class="light_color" placeholder="请输入姓名" />
      </u-form-item>
    </u-form>
    <view class="footer_button1">
      <!-- <my-button :width="670" :height="100">
        <text>{{!isAuth?'授权':'提交'}}</text>
        <button class="openButton" type="default" open-type="getPhoneNumber" @getphonenumber="loginGetPhoneNumber" v-if="!isAuth"></button>
      </my-button> -->
      <!-- <view class="btn"> -->
      <text>提交</text>
      <button class="openButton" type="default" @click="loginGetPhoneNumber">提交</button>
      <!-- <text>提交</text>
      <button class="openButton" type="default" open-type="getPhoneNumber" @getphonenumber="submit"></button> -->
      <!-- </view> -->
    </view>

    <u-popup v-model="getPhonePopupShow" mode="center" border-radius="20" duration="50">
      <view class="phone_popup_content">
        <view class="title u-flex">
          <text>微信授权手机号成功</text>
        </view>
        <view class="content u-flex">
          <text>申请获取您的公开信息（昵称、头像、地区及性别）</text>
        </view>
        <view class="button border_t u-flex">
          <text>授权获取信息</text>
          <!-- <button class="openButton" type="default" open-type="getUserInfo" @getuserinfo="loginGetuserinfo"></button> -->
          <button class="openButton" type="default" @click="toRegister"></button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import myButton from '@/components/myButton.vue'
import { getLoginStatus } from '@/utils/common.js'
export default {
  data() {
    return {
	is_login:false,
	
      doctorRegister: false, //如果是true则是医生自己注册 否则是营养师帮医生注册
      form: {
        realname: '' //姓名
      },
      inviteName: '',
      hospitalList: [], // 医院列表
      hospital_title: '', //医院全称
      showPicker: false,
      defaultSelector: 0,
      isAuth: false, // 是否已授权
      inviterId: '',
      getPhonePopupShow: false,
      currentMobile: '',
      wxCode: ''
    }
  },
  onShow() {
  	this.getLoginType()
	
  },
  async onLoad(option) {
    // console.log('option: ', option)

    if (option.scene) {
      console.log('option.scene', option.scene)

      const inviterId = option.scene
      this.inviterId = inviterId

      this.$request({
        url: '/ApiV2/Mobile/Tourists/decodeScene',
        loading: true,
        errMsg: true,
        data: {
          scene_id: option.scene
        }
      }).then((res) => {
        console.log('res: ', res)
        this.inviteName = res.data.realname2
      })
    }
    // if (option.isAuth) {
    //   this.isAuth = option.isAuth
    //   this.inviterId = uni.getStorageSync('userInfo') && uni.getStorageSync('userInfo').pass_code
    // }
    // // if (uni.getStorageSync('token')) this.isAuth = true
    // this.wxCode = await this.getLoginCode()
  },
  methods: {
	  //判断当前登陆状态
	  async getLoginType(){
		  this.is_login = await getLoginStatus()
		  if(!this.is_login){
		  	uni.navigateTo({
		  		url:'/pages/login/index'
		  	})
		  }
	  },
    // 获取微信code
    getLoginCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            resolve(res.code)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    // 获取手机号
    async loginGetPhoneNumber(e) {
      // if (!this.isAuth) return
      if (!this.$u.trim(this.form.realname)) return this.$common.toast('请输入姓名')

      // this.form.scene = this.inviterId || this.$store.getters.inviterId

      this.form = Object.assign(this.form, { scene_id: this.inviterId })
      
	  
	  this.$request({
	  	url:'/ApiV2/Mobile/Staff/saleRepRegister',
	  	loading: true,
	  	errMsg: true,
	  	data:this.form  
	  }).then((res) => {
	  	uni.switchTab({
	  	  url: '/pages/tabbar/projects'
	  	})
	  
	  })
      // uni.navigateTo({
      //   url: `${url}?backPage=1&saleInfo=${JSON.stringify(this.form)}`
      // })
      return
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        // const code = await this.getLoginCode()
        // if (!code) return uni.showToast({
        //   title: '授权失败',
        //   duration: 2000,
        //   icon: 'none'
        // });
        uni.login({
          provider: 'weixin',
          success: (r) => {
            const data = {
              code: r.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            }
            // if (this.$store.getters.inviterId) {
            //   data.scene_id = this.$store.getters.inviterId
            // }
            this.$axios({
              url: '/api/get_mpuser_phone',
              errMsg: true,
              loading: true,
              data
            })
              .then((res) => {
                console.log('res: ', res)
                this.form.mobile = res.data.phoneNumber
                this.role_id = res.data.role_id
                // uni.setStorageSync('currentRoleId', res.data.role_id)
                uni.setStorageSync('currentRoleId', 3)
                if (res.data.authorization) {
                  this.$common.setToken(res.data.authorization)
                  this.isAuth = true
                  this.$store.dispatch('getUserInfo').then((res) => {})
                } else {
                  this.getPhonePopupShow = true
                }
              })
              .catch(async (err) => {
                // this.wxCode = await this.getLoginCode()
              })
          }
        })
      }
    },
    // 获取用户信息
    async toRegister(e) {
      uni.getUserProfile({
        desc: '申请获取您的公开信息',
        success: async (userInfoRes) => {
          const encryptedData = userInfoRes.encryptedData
          const iv = userInfoRes.iv
          const mobile = this.form.mobile
          const role_id = 3
          const code = await this.getLoginCode()
          let data = {
            code,
            iv,
            encryptedData,
            mobile,
            role_id
          }
          this.$axios({
            url: '/api/auth',
            errMsg: true,
            loading: true,
            data
          })
            .then((res) => {
              this.getPhonePopupShow = false
              uni.setStorageSync('currentRoleId', role_id)
              this.$common.setToken(res.data.authorization)
              this.isAuth = true
            })
            .catch(async (err) => {})
        },
        fail: (err) => {
          console.log('err: ', err)
        }
      })
    },

    // 提交数据
    submit(e) {
      if (!this.$u.trim(this.form.realname)) return this.$common.toast('请输入姓名')
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        console.log(e)
        return
        this.$request({
          url: '/ApiV2/Mobile/Doctor/apply', //'/api/create_doctor',
          loading: true,
          errMsg: true,
          data: {
            ...this.form
          }
        }).then((res) => {
          console.log('res: ', res)

          uni.switchTab({
            url: '/pages/tabbar/mine'
          })
		 
        })
      }
    }
  },
  components: {
    myButton
  }
}
</script>

<style lang="scss">
.container {
  padding: 0 40upx;
}
.openButton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1000;
}
.phone_popup_content {
  width: 570upx;

  .title {
    justify-content: center;
    padding: 40upx;
    font-weight: bold;
    font-size: 32upx;
  }

  .content {
    justify-content: center;
    padding: 0 30upx;
  }

  .button {
    margin-top: 30upx;
    padding: 30upx;
    justify-content: center;
    font-size: 36upx;
    color: $color;
    position: relative;
  }
}
.footer_button1 {
  width: 90%;
  height: 84rpx;
  line-height: 84rpx;
  color: #fff;
  text-align: center;
  border-radius: 84rpx;
  background-color: #00b8a2;
  position: fixed;
  bottom: 100rpx;
}
</style>
