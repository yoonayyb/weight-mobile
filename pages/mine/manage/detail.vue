<template>
  <view class="container u-p-24">
    <view class="box" @click="jumpUserInfo">
      <view @click.stop="openDetail(userInfo)" class="right"
        :class="{red:userInfo.plan_status == 0,info:userInfo.plan_level == 0 }">
        <block v-if="userInfo.plan_level == 0">
          <block>未开始</block>
        </block>
        <block v-else>
          <view>{{typeObj[userInfo.plan_level]}}</view>
          <view class="u-line-1 " style="width: 140rpx;text-align: center;">
            {{userInfo.plan_current || 0}}/{{userInfo.plan_total || 0}}
          </view>
        </block>
      </view>
      <view class="u-flex u-flex-items-start u-font-32">
        <u-avatar size="128" :src="userInfo.avatar"></u-avatar>
        <view class="u-m-l-16">
          <view class="u-flex u-flex-y-center">
            <view style="max-width:200rpx;font-weight: bold;" class="u-line-1">{{userInfo.realname || userInfo.nickname}}</view>
            <view class="gender man u-m-l-10 u-m-r-10" :class="{woman:userInfo.sex ===0}">
              <image :src="`${imgUrl}v3_manage_${userInfo.sex ===0 ? 'woman':'man'}.png`" mode=""></image>
              <text>{{userInfo.age}}</text>
            </view>
            <image class="u-m-t-10" @click.stop="actionShow = true;" style="width: 32rpx;height: 32rpx;"
              :src="`${imgUrl}v3_manage_info.png`"></image>
          </view>
		  <view class="u-flex  u-m-t-10 ">
			  <view class="box_tag u-m-r-10">
			    <view>成长值 {{userInfo.growth || 0}}</view> 	
			  </view>
			  <view @click.stop="showNamePopupShow = true" class="u-font-20 u-line-1" style="max-width: 240rpx"  :style="{'color':!doctorRemarkName?'#c2c2c2':'#2A2A2A'}" v-if="roles"><u-icon size="32" color="#c2c2c2" name="edit-pen"></u-icon>{{doctorRemarkName || '编辑备注姓名'}}</view> 
		  </view>
          
        </view>

      </view>
      <view class="u-flex-y-center u-font-28 u-m-t-16">
        <view class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
          <view style="color: #C2C2C2;">身高</view>
          <view>{{userInfo.height || '-'}}</view>
        </view>
        <view class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
          <view style="color: #C2C2C2;">体重</view>
          <view>{{userInfo.current_weight | filterNum}}</view>
        </view>
        <view class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
          <view style="color: #C2C2C2;">BMI</view>
          <view>{{userInfo.bmi|| '-'}}</view>
        </view>
        <view class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
          <view style="color: #C2C2C2;">阶段变化</view>
          <view>{{userInfo.change_weight|| '-'}}</view>
        </view>
      </view>

    </view>
    <view class="box u-flex u-m-t-24 u-flex-wrap" style="min-height: auto;">

      <view class="u-flex-column u-flex-items-center u-m-b-24" style="min-width: 25%;min-height: 140rpx;" @click="goto(item)"
        v-for="item in personList" :key="item.url">
        <image :src="`${imgUrl+item.url}.png`" mode="" style="width:88rpx;height:88rpx;"></image>
        <view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">
          {{item.name}}
        </view>
      </view>
    </view>
    <!-- <image @click="jump({url:'diary/recordSummary/recordSummary',data: { diaryId, user_id, date }})"
			:src="`${imgUrl}v3_manage_evaluete.png`" class="fixed_box" mode=""></image> -->
    <image @click="xiaojieopen" :src="`${imgUrl}v3_manage_evaluete.png`" class="fixed_box" mode=""></image>
    <xiaojie ref="xiaojie"></xiaojie>
	<!-- 修改姓名弹框 -->
	<u-popup :closeable='false' negative-top="30vh" duration="50" v-model="showNamePopupShow"
	  border-radius="20" mode="center">
	  <input-popup cancelText='取消' title="备注姓名" placeholder='填写备注姓名' :maxlength="20" :value="doctorRemarkName" type="nickname"
	    @confirm="handleConfirm($event, 'nickname')" @cancelClick='showNamePopupShow=false'
	    :show="showNamePopupShow">
	  </input-popup>
	</u-popup>
    <u-action-sheet :list="actionList" @click="actionClick" v-model="actionShow"></u-action-sheet>
  </view>
</template>

<script>
import xiaojie from '../components/xiaojie.vue'
import infoTemplate from '@/components/infoTemplate.vue'
import inputPopup from '@/components/inputPopup.vue'
export default {
  data () {
    return {
	  
	  showNamePopupShow:false,
	  roles:'',//权限
	  doctorRemarkName:'编辑备注姓名',//只有医生 才能显示、修改、添加
      diaryId: '', //日记id
      user_id: '', //营养师端  当前的客户id
      date: '', //当前日期
      src: '',
      actionShow: false,
      userInfo: {},
      typeObj: {
        0: '未开始',
        1: '启动期',
        2: '过渡期',
        3: '维持期'
      },
      personList: [{
        url: 'v3_manage_diary',
        name: '日记',
        path: 'newHome/index'
      },
      {
        url: 'v3_manage_record',
        name: '干预记录',
        path: 'mine/manage/interventionRecord'
      }, {
        url: 'v3_manage_picture',
        name: '会员照片',
        path: 'mine/manage/picture'
      },
      {
        url: 'v3_manage_order',
        name: '订单',
        path: 'order/order?other=' + 1
      },
	  {
	    url: 'v3_manage_refund',
	    name: '售后',
	    path: 'order/refund?other=' + 1
	  },
      {
        url: 'v3_manage_guishu1',
        name: '归属',
        path: 'mine/manage/guishu'
      },
	  {
	    url: 'v3_mine_ask_detail',
	    name: '问卷',
	    path: 'mine/manage/ask'
	  },
	  {
	    url: 'v3_tizhicheng',
	    name: '体脂秤',
	    path: '/packages/bodyFatScale/myHealthReport/history'
	  },
	  
      ],
      actionList: [{
        text: '发消息'
      }, {
        text: '拨打电话'
      }],
    }
  },
  components: {
    xiaojie,
	infoTemplate,
	inputPopup
  },
  onLoad (option) {
	  
    if (option) {
      //获取userid
      this.user_id = option.id
	  this.sex = option.sex
    }
	this.roles = this.$store.state.user.userInfo.roles?.isDoctor //是否是医生
	
  },
  onShow () {
    //根据userid请求 写onShow是 因为返回上一页时也需要重新获取当前信息
    if (this.user_id) {
      this.getUserInfo(this.user_id)
    }
  },
  methods: {
	  
	  async handleConfirm (e, type) {
	    console.log('[ e, type ]-213', e, type)
		this.$request({
			url:'/ApiV3/Mobile/Staff/remark',
			loading:true,
			data:{
				user_id:this.user_id,
				remark_name:e.trim()
			}
		}).then(res=>{
			this.doctorRemarkName = e.trim()
			
			this.showNamePopupShow = false
			
		})
	    
	  },
	  infoTempClick () {
	   
	    this.showNamePopupShow = true
	     
	  },
    setInfo (id) {
      this.getUserInfo(id)
    },
    jumpUserInfo () {
      this.jump({ url: 'mine/personalInfo/personalInfo', data: { other: 1, ...this.userInfo } })
    },
    getUserInfo (id) {
      this.$request({
        url: '/ApiV3/Mobile/Staff/customerInfo',
        method: 'GET',
		data:{
			user_id:id
		}
      })
        .then((res) => {
          this.userInfo = res.data
		  this.doctorRemarkName = res.data.remark_name.trim()
		  
          console.log('[ res ]-157', res)
        })
        .catch(async (err) => { })
    },
    openDetail (item = {}) {
      console.log(1111, item)
      let params = {
        // plan_level: 0,
        // plan_estimate_date: item.plan_estimate_date,
        // plan_start_date: item.plan_start_date,
        // plan_all_day: item.plan_all_day,
        // plan_status: item.plan_status,
       id: item.plan_id,
       user_id: item.id
      }
      uni.navigateTo({
        url: `/pages/changePlanInfo/index?item=${JSON.stringify(params)}`
      })
    },
    xiaojieopen () {
      this.$refs.xiaojie.open({ user_id: this.user_id })
      console.log(this.$refs.xiaojie)
    },
    // 通用跳转
    jump ({
      url = '',
      data = {}
    } = {}) {
      this.$common.jump({
        url,
        data,
        that: this
      })
    },
    goto (item) {
      let url = item.path
      if (item.name === '日记') url = url + '?user_id=' + this.user_id + '&sex=' + this.sex
      if (item.name === '订单') url = url + '&user_id=' + this.user_id
      if (item.name === '售后') url = url + '&user_id=' + this.user_id
      if (item.name === '会员照片') url = url + '?user_id=' + this.user_id
      if (item.name === '归属') url = url + '?user_id=' + this.user_id
      if (item.name === '干预记录') url = url + '?id=' + this.user_id
      if (item.name === '问卷') url = url + '?user_id=' + this.user_id
      if (item.name === '体脂秤'){
		  return uni.navigateTo({
		  	url:item.path +'?userId=' + this.user_id
		  })
	  }
      // uni.navigateTo({
      // 	url
      // })
      this.jump({
        url,
        data: { id: this.userInfo.id }
      })
    },
    actionClick (index) {
     
      if (index === 1) {
        uni.makePhoneCall({
          phoneNumber: this.userInfo.mobile //仅为示例
        });
      } else {
        uni.navigateTo({
          url: `/pages/message/messageChat?avatar=${encodeURIComponent(this.userInfo.avatar)}&nick=${ this.userInfo.realname ||  this.userInfo.nickname}&friend_user_id=${this.userInfo.id + ''}`
        })
      }

    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f7f7f7;

  .fixed_box {
    height: 124rpx;
    width: 124rpx;
    position: fixed;
    right: 44rpx;
    bottom: 150rpx;
  }

  .box {
    background: #ffffff;
    border-radius: 24rpx;
    min-height: 288rpx;
    min-width: 686rpx;
    // margin: 24rpx 32rpx;
    padding: 24rpx 16rpx;
    position: relative;

    .box_tag {
      background: #ffffff;
      border-radius: 24rpx;
      border: 1px solid #c2c2c2;
      text-align: center;
      display: inline-block;
      padding: 6rpx 16rpx;
      color: #c2c2c2;
      font-size: 20rpx;
    }

    .right {
      position: absolute;
      top: 0;
      right: 0;
      background: #f1fbfa;
      border-radius: 0px 24rpx 0px 24rpx;
      color: #00b8a2;
      font-size: 24rpx;
      padding: 6rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 80rpx;
      min-width: 140rpx;
      justify-content: space-between;
    }

    .red {
      background-color: #e34d59;
      color: #fff;
    }

    .info {
      background-color: #c2c2c2;
      color: #2a2a2a;
      justify-content: center;
    }

    .fontRed {
      color: #e34d59;
    }

    .fontWarn {
      color: #ffc76b;
    }

    .fontGreen {
      color: #00b8a2;
    }

    .foot_box {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #fff;
      padding: 4rpx 16rpx;
      background: #e34d59;
      border-radius: 24rpx;
      margin: 6rpx;
    }

    .gender {
      border-radius: 24rpx;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rpx 16rpx;
      font-size: 24rpx;
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
    .man {
      color: #45adff;
      border: 1px solid #45adff;
    }
    .woman {
      color: #ff8d88;
      border: 1px solid #ff8d88;
    }
  }
}
</style>
