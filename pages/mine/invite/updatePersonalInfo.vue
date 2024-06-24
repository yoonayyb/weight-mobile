<template>
  <view class="container">
    <info-template style_='padding:0;' title="头像" :icon="true">
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <image v-if="userInfo.avatar" class="head" :src="userInfo.avatar" mode="aspectFill"></image>
        <image v-else class="head" :src="`${imgUrl}profilepicture_img_nor@2x.png`" mode='aspectFill'></image>
      </button>
    </info-template>
    <info-template style_='min-height: 96rpx;margin-top:32rpx;padding:0' title="昵称"
      @click="infoTempClick('showNamePopupShow',true)">
      <text v-if="userInfo.nickname">{{ userInfo.nickname }}</text>
      <text v-else class="light_color">请填写昵称</text>
    </info-template>
    <view class="content">
      <view class="content_title">请选择性别</view>
      <view class="select_gender_image">
        <image @click="checkImg('man','woman')" :src="imgUrl+manSrc" mode="aspectFill"></image>
        <image @click="checkImg('woman','man')" :src="imgUrl+womanSrc" mode="aspectFill"></image>

      </view>
    </view>
    <view class="content">
      <view class="content_title">请选择出生日期</view>
      <!-- 生日选择 -->
      <picker1 class="personalInfo_picker" @change="pickerChange"></picker1>
    </view>
    <view class="content">
      <view class="content_title">请填写身高&体重</view>
      <person-scale unit="cm" @loading="(val)=>{loading = val}" :pageOffset='32' @value='heightWeightValueFn' ref="scale1"></person-scale>
      <person-scale unit="kg" @loading="(val)=>{loading = val}" :pageOffset='32' @value='heightWeightValueFn' ref="scale2"></person-scale>
    </view>
    <view class="btn">
      <my-button :opacity="loading?0.6:1" @click="btnClick" :width="560" :height="80">确认</my-button>
    </view>
    <!-- 修改姓名弹框 -->
    <u-popup :closeable='false' negative-top="30vh" duration="50" v-model="showParams.showNamePopupShow"
      border-radius="20" mode="center">
      <input-popup cancelText='取消' title="修改昵称" placeholder='这是一个昵称名字' :maxlength="20" :value="showParams.nickname"
        type="nickname" @confirm="handleConfirm($event, 'nickname')" @cancelClick='showParams.showNamePopupShow=false'
        :show="showParams.showNamePopupShow">
      </input-popup>
    </u-popup>
  </view>
</template>

<script>
import infoTemplate from '@/components/infoTemplate.vue'
import inputPopup from '@/components/inputPopup.vue'
import { mapGetters, mapState } from 'vuex'
import personScale from '@/pages/mine/personalInfo/components/personScale.vue'
import picker1 from './components/picker1.vue'
import myButton from '@/components/myButton.vue'

export default {
  name: '',
  components: {
    infoTemplate,
    inputPopup,
    personScale,
    picker1,
    myButton,
  },
  data () {
    return {
	   loading:false,
	  login:false,//是否从登录跳转过来
      showParams: {
        showNamePopupShow: false,
        height: 160,
        weight: 60,
        day: 23,
        month: 11,
        year: 2022,
        gender: 'man',
        nickname: '',
      },
      visible: false,
      showType: '',
      name: '',
      manSrc: 'set_avatar_man_sel@2x.png',
      womanSrc: 'set_avatar_woman_nor@2x.png',
	  
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  onLoad (option) {
	
    this.name = this.userInfo.nickname
	this.login = option.login
    this.initHWScale(true)
  },
  created () { },
  methods: {
    btnClick () {
      console.log(this.showParams);
	  if(!this.userInfo.nickname) return this.$common.toast('请输入昵称')
	  let data = {
		  sex:this.showParams.gender === 'man'?1:0,
		  birthday:this.showParams.year+'-'+this.showParams.month + '-' +this.showParams.day,
		  height:parseFloat(this.showParams.height),
		  weight:parseFloat(this.showParams.weight),
		  target_weight:0,//parseFloat(this.showParams.weight),//默认一个目标体重
		  avatar:this.userInfo.avatar,
		  nickname:this.showParams.nickname || this.userInfo.nickname
	  }
	  
	  this.editUserInfo(data, () => {
	    
	  	this.$store.dispatch('getUserInfo')
		if(this.login){
			return uni.switchTab({
				url:'/pages/tabbar/mine'
			})
			
		}else{
			uni.navigateBack()
			this.$common.toast('保存成功')
			return
		}
		
	    // this.$store.commit('setUserInfo', this.userInfo)
	    // this.showParams.showNamePopupShow = false
	    // this.$common.toast('保存成功')
	  })
    },
    pickerChange (e) {
      this.showParams = {
        ...this.showParams,
        ...e
      }
    },
    heightWeightValueFn ({ value, type }) {
      // console.log('[ value,type ]-144', value, type)
      this.$set(this.showParams, type, value)
    },
    checkImg (gender, gender2) {
      this.showParams.gender = gender
      this[`${gender}Src`] = `set_avatar_${gender}_sel@2x.png`
      this[`${gender2}Src`] = `set_avatar_${gender2}_nor@2x.png`
    },
    editUserInfo (data, callback) {
      this.$request({
        url: '/ApiV2/Mobile/User/edit',
        data,
        errMsg: true,
        loading: true
      }).then((res) => {
        callback && callback()
      })
    },
    handleConfirm (e, type) {
      console.log('[ e, type ]-118', e, type)
      console.log('this.userInfo', this.userInfo)
      let data = { [type]: e }
		// this.userInfo = {
		//   ...this.userInfo,
		//   ...data
		// }
		// this.userInfo.nickname = e
		this.$set(this.userInfo,'nickname',e)
     this.showParams.showNamePopupShow = false
    },
    infoTempClick (type, status, hwType) {
      console.log('[ type, status, hwType ]-144', type, status, hwType)
      this.showType = type
      this.$set(this.showParams, type, status)
    },
    //初始化刻度表
    initHWScale (status) {
      this.heightWeightPopupShow = status
      console.log('[   this.$refs.scale1 ]-83', this.$refs.scale1)
      this.$refs.scale1.reset({
        min: 40,
        max: 230,
        title: '',
        unit: 'cm',
        status,
        type: 'height',
        value: this.userInfo.height || 160
      })
      this.$refs.scale2.reset({
        min: 1,
        max: 200,
        title: '',
        unit: 'kg',
        status,
        type: 'weight',
        value: this.userInfo.weight || 60
      })
    },
     onChooseAvatar (e) {
      const { avatarUrl } = e.detail
      console.log(e)
	  let that = this
	   this.$common.uploadParams(avatarUrl).then(data=>{
		  //更新数据到后台
		  that.$request({
		    url: '/ApiV2/Mobile/User/updateUserProfile',
		    data: {
		      avatar: data.key
		    }
		  })
		    .then((res) => {
		     
		  	this.$set(that.userInfo,'avatar',data.url)
		      that.$store.dispatch('getUserInfo')
		    })
		    .catch(async (err) => { })
	  }).catch(err=>{
		  this.$common.toast('上传失败，请重试');
	  })
	  
      
    },
  }
}
</script>

<style lang='scss' scoped>
.container {
  padding: 32rpx;
  .head {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }
  .box {
    background-color: #fff;
    padding: 28rpx 32rpx;
    font-size: 28rpx;
  }
  .avatar-wrapper {
    height: 80rpx;
    width: 80rpx;
    // border-radius: 50%;
    margin: 0;
    padding: 0;
    background: transparent;

    &::after {
      border: none;
    }
  }
  ::v-deep .info_left {
    text {
      font-weight: 700;
      font-size: 32rpx;
    }
  }
  .content {
    margin-top: 40rpx;
    overflow: hidden;

    .content_title {
      color: #2a2a2a;
      font-weight: 700;
      font-size: 32rpx;
    }
  }
  .select_gender_image {
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      margin-top: 24rpx;
      width: 152rpx;
      height: 152rpx;
      &:first-child {
        margin-right: 80rpx;
      }
    }
  }
}
.btn {
  // position: fixed;
  // bottom: 120rpx;
  // left: 50%;
  // transform: translate(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20rpx 0 120rpx 0;
}
</style>
