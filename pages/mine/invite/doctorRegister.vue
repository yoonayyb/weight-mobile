<template>
  <view class="container" @click="$refs.selectLay.close()">
	  <image class="u-m-t-40 u-m-b-40" :src="`${imgUrl}v3_invite_doctor.png`" mode="" style="width:280rpx;height:220rpx;margin:0 auto;display: block;
}"></image>
	  <view style="text-align: center;" class="u-p-20 u-font-28 "
	  >您正在接受 <text v-if="inviteName" style="color:#00B8A2">【{{ inviteName }}】</text>邀请进行医生注册，请填写相关信息完成注册。</view>
    <u-form :model="form" label-position="top" :label-style="{fontWeight:'bold'}" ref="uForm">
      <u-form-item label="姓名">
        <u-input type="text" @focus="$refs.selectLay.close()" v-model="form.username" placeholder-class="light_color" placeholder="请输入姓名" />
      </u-form-item>
      <u-form-item label="手机" v-if="!doctorRegister">
        <u-input type="number" @focus="$refs.selectLay.close()" v-model="form.mobile" placeholder-class="light_color" placeholder="请输入手机" />
      </u-form-item>
	  
      <u-form-item label="医院全称" label-width="150">
		  <!-- <view> -->
		  	<!-- <text style="margin-right: 22rpx;font-weight: bold;width:90rpx">营养师</text> -->
		  	<select-lay ref="selectLay" style="flex:1" @remove="tval = '';changeValue()" :zindex="3" :value="tval" name="title"
		  		placeholder="请选择医院" :showplaceholder="false" :options="hospitalList" @input="changeValue"
		  		@selectitem="selectitem">
		  	</select-lay>
		  <!-- </view> -->
        <!-- <u-input
          type="select"
          :select-open="showPicker"
          v-model="hospital_title"
          placeholder="请选择医院全称"
          @click="showPicker = true"
          :disabled="true"
          readonly
        ></u-input> -->
        <!-- <u-input type="text" v-model="form.hos_name" placeholder-class="light_color" placeholder="请输入医院全称" /> -->
      </u-form-item>
      <u-form-item label="科室">
        <u-input type="text" @focus="$refs.selectLay.close()" v-model="form.department" placeholder-class="light_color" placeholder="请输入科室" />
      </u-form-item>
      <u-form-item label="职称">
        <u-input type="text" @focus="$refs.selectLay.close()" v-model="form.titles" placeholder-class="light_color" placeholder="请输入职称" />
      </u-form-item>
    </u-form>
    <view class="footer_button1">
      <!-- <my-button :width="670" :height="100">
        <text>{{!isAuth?'授权':'提交'}}</text>
        <button class="openButton" type="default" open-type="getPhoneNumber" @getphonenumber="loginGetPhoneNumber" v-if="!isAuth"></button>
      </my-button> -->
      <!-- <view class="btn"> -->
      <text>{{ !is_login ? '授权' : '提交' }}</text>
      <button class="openButton" type="default" @click="loginGetPhoneNumber" v-if="!is_login">授权</button>
      <button class="openButton" v-else  @click="submit">提交</button>
      <!-- </view> -->
    </view>
    <u-picker
      mode="selector"
      v-model="showPicker"
      :default-selector="[defaultSelector]"
      range-key="title"
      :range="hospitalList"
	  @pickend="pickend"
      @confirm="pickerConfirm"
    ></u-picker>
    <!-- 授权弹框 -->
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
import selectLay from './components/select-lay/components/select-lay/select-lay.vue'
export default {
  data() {
    return {
		keywords:'',
		tval:'',
		is_login:false,
		inviteName: '',
      doctorRegister: false, //如果是true则是医生自己注册 否则是营养师帮医生注册
      form: {
        username: '', //姓名
        mobile: '', //手机号
        hospital_id: '', // 医院id
        department: '', //科室
        titles: '' //职称
      },
      hospitalList: [], // 医院列表
      hospital_title: '', //医院全称
      showPicker: false,
      defaultSelector: 0,
      isAuth: false, // 是否已授权
      inviterId: '',
      getPhonePopupShow: false,
      currentMobile: '',
      wxCode: '',
	  hospPage:1,
	  hospLength:'',
    }
  },
  async onLoad(option) {
    console.log('option: ', option)
	
    if (option.scene) {
      const inviterId = option.scene
      this.inviterId = inviterId
      this.$store.commit('setInviterId', inviterId)
      this.doctorRegister = true
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
    if (option.isAuth) {
      this.isAuth = option.isAuth
      this.inviterId = uni.getStorageSync('userInfo') && uni.getStorageSync('userInfo').pass_code
    }
    // if (uni.getStorageSync('token')) this.isAuth = true
    this.wxCode = await this.getLoginCode()
    this.getHospitalList()
  },
  onShow() {
  	this.getLoginType()
  },
  methods: {
	  changeValue(val) {
		this.keywords = val
	  	this.getHospitalList()
	  },
	 
	  selectitem(index, item) {
	  	console.log(item)
	  	if (index >= 0) {
	  		this.tval = item.id;
	  	} else {
	  		this.tval = ""
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
      if (!this.$u.trim(this.form.username)) return this.$common.toast('请输入姓名')
      if (!this.doctorRegister) {
        if (!this.$u.trim(this.form.mobile)) return this.$common.toast('请输入手机号')
        if (!this.$u.test.mobile(this.form.mobile)) return this.$common.toast('手机格式错误')
      }
      // if (!this.tval) return this.$common.toast('请选择医院全称')
      // if (!this.$u.trim(this.form.department)) return this.$common.toast('请输入科室')
      // if (!this.$u.trim(this.form.titles)) return this.$common.toast('请输入职称')
      this.form.mobile = this.form.mobile || uni.getStorageSync('userInfo').mobile
      this.form.scene = this.inviterId || this.$store.getters.inviterId
	  this.form.hospital_id = this.tval || 0
      console.log(this.form)

      this.form = Object.assign(this.form, { scene_id: this.inviterId })
      let url =  '/pages/login/index'
      uni.navigateTo({
        url: `${url}?backPage=1&doctorInfo=${JSON.stringify(this.form)}`
      })
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
    async getHospitalList() {
		const {
			data
		} = await this.$request({
			url: '/ApiV3/Mobile/Hospital/index',
			method: 'get',
			data: {
				lengthNum: 20,
				page: this.hospPage,
				keywords:this.keywords
			}
		})
		
		if (this.hospPage === 1) {
			this.hospitalList = data.data
		} else {
			this.hospitalList = [...this.hospitalList, ...data.data]
		}
		this.hospLength = data.next_page_url
  //     this.$axios({
  //       url: '/api/hospital_list',
  //       errMsg: true
  //     }).then((res) => {
  //       this.hospitalList = res.data
		
  //     })
    },
	pickend(){
		if(this.hospLength){
			this.hospPage ++ 
			this.getHospitalList()
		}
		console.log('滚动结束')
	},
    pickerConfirm(e) {
      this.defaultSelector = e[0]
      this.form.hospital_id = this.hospitalList[e[0]].id
      this.hospital_title = this.hospitalList[e[0]].title
    },
	//判断当前登陆状态
	async getLoginType(){
		this.is_login = await getLoginStatus()
		if(!this.is_login){
			uni.navigateTo({
				url:'/pages/login/index'
			})
		}
	},
	
    // 提交数据
    submit() {
		
      if (!this.$u.trim(this.form.username)) return this.$common.toast('请输入姓名')
      if (!this.doctorRegister) {
        if (!this.$u.trim(this.form.mobile)) return this.$common.toast('请输入手机号')
        if (!this.$u.test.mobile(this.form.mobile)) return this.$common.toast('手机格式错误')
      }
      // if (!this.tval) return this.$common.toast('请选择医院全称')
      // if (!this.$u.trim(this.form.department)) return this.$common.toast('请输入科室')
      // if (!this.$u.trim(this.form.titles)) return this.$common.toast('请输入职称')
      this.form.mobile = this.form.mobile || uni.getStorageSync('userInfo').mobile
      this.form.scene = this.inviterId || this.$store.getters.inviterId
      this.form.scene_id = this.inviterId || this.$store.getters.inviterId
	  this.form.hospital_id = this.tval || 0
      console.log(this.form)

      this.$request({
        url: '/ApiV2/Mobile/Doctor/apply', //'/api/create_doctor',
        loading: true,
        errMsg: true,
        data: {
          ...this.form
        }
      }).then((res) => {
        console.log('res: ', res)
        // uni.redirectTo({
        //   url: `/pages/mine/welcome/welcome?username=${this.form.username}`
        // });
        uni.switchTab({
          url: '/pages/tabbar/projects'
        })
      })
      return
      if (!this.doctorRegister) {
        this.$axios({
          url: '/api/create_doctor',
          loading: true,
          errMsg: true,
          data: {
            ...this.form
          }
        }).then((res) => {
          // this.$common.toast(res.message)
          uni.redirectTo({
            url: `/pages/mine/welcome/welcome?username=${this.form.username}`
          })
          return
          uni.showToast({
            title: res.message,
            duration: 2000
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            })
          }, 1500)
        })
      } else {
        uni.redirectTo({
          url: '/pages/login/index?doctorInfo=' + JSON.stringify(this.form)
        })
      }
    }
  },
  components: {
    myButton,
	selectLay
  }
}
</script>

<style lang="scss">
.container {
  padding: 0 40upx;
  padding-bottom: 300rpx;
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
