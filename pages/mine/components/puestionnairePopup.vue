<template>
  <view>
    <u-popup
      @open="this.$emit('open')"
      @close="this.$emit('close')"
      closeable
      negative-top="30vh"
      duration="50"
      v-model="show"
      border-radius="20"
      mode="center"
    >
      <input-popup2 btn="发送" title="请选择要发送的问卷" @confirm="handleContirm">
        <view class="ketonuria_content">
          <view
            @tap="handleItemClick(item)"
            class="ketonuria_item u-flex"
            v-for="(item, index) in questionnaireOptions"
            :key="index"
            :class="item.checked ? 'active' : ''"
          >
            <text>{{ item.label }}</text>
            <text v-if="item.type == 1 && !hasQuestion" :style="item.checked ? '' : 'color: #00B8A2'">(未)</text>
          </view>
        </view>
      </input-popup2>
    </u-popup>
  </view>
</template>

<script>
import inputPopup2 from '@/components/inputPopup2.vue'
export default {
  components: {
    inputPopup2
  },
  data() {
    return {
      hasQuestion: false,
      questionnaireOptions: [
        {
          label: '知情同意书',
          type: 1,
          value: 1,
          checked: false
        },
        {
          label: '客户档案表',
          type: 2,
          value: 2,
          checked: false
        },
        // {
        //   label: '营养测评问卷',
        //   type: 3,
        //   value: 3,
        //   checked: false
        // }
      ]
    }
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    friendUid: {
      default: '0',
      type: String
    }
  },
  watch: {
    show: function (n, o) {
      this.show = n
      if (n) this.checkStaus()
    }
  },
  methods: {
    checkStaus() {
      this.$request({
        url: '/ApiV3/Mobile/Questionnaire/checkHasUserQue',
		method:'get',
        errMsg: false,
        loading: true,
        data: {
          uid: this.friendUid
        }
      }).then((res) => {
        this.hasQuestion = res.has
      })
    },
    handleItemClick(item) {
      this.questionnaireOptions.forEach((item) => {
        item.checked = false
      })
      item.checked = true
    },
    handleContirm() {
      let type = null
      this.questionnaireOptions.forEach((item) => {
        if (item.checked) {
          type = item.value
        }
      })
      if (type === null) return (this.show = false)
      if (type === 2) {
        this.$common.toast('暂未开放')
        return
      }
	  if(type === 1){
		  this.$request({
		    url: '/ApiV3/Mobile/Questionnaire/create',
		    errMsg: true,
		    loading: true,
		    data: {
		      type: type,
		      uid: this.friendUid
		    }
		  }).then((res) => {
		    // this.$common.toast('保存成功')
		    this.$emit('questionnaireCreate', res.data.id, res.data.end)
		    
		  })
	  }
   //    if(type === 3){
		 //  //打开预览页面
		 //  uni.navigateTo({
		 //  	url: '/pages/question/question2?id=111'
		 //  })
	  // }
    }
  }
}
</script>

<style lang="scss">
.ketonuria_content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 10upx;
  
  .active {
    border-color: #00b8a2 !important;
    color:#00B8A2;
    background-color: #ffffff !important;
  }

  .ketonuria_item {
    margin-top: 20upx;
    width: 460upx;
    height: 96upx;
    justify-content: center;
    border: 1px solid #e4e7ed;
	border-radius: 24rpx 24rpx 24rpx 24rpx;
	font-size: 28rpx;
	background: #ECECEC;
    &:nth-child(n + 3) {
      margin-top: 30upx;
    }

    &:nth-child(2n) {
      // margin-left: 100upx;
    }

    .icon {
      margin-right: 30upx;
      width: 30upx;
      height: 30upx;
      background: #e2def0;
    }
  }
}
</style>
