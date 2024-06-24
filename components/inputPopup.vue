<template>
  <view class="input_popup_content" @touchmove.stop.prevent="clear">
    <view class="title">
      <text>{{ title }}</text>
    </view>
    <view style="display: flex; align-items: center; padding: 0 30rpx">
      <view :style="{ width: left_text_width + 'rpx' }">{{ left_text }}</view>
      <view class="import_content">
        <!-- <slot></slot> -->
        <!-- #ifdef APP-PLUS -->
        <input :maxlength="maxlength" v-if="type && type !== 'textarea'"
          :type="type === 'input' || type === 'nickname' ? 'text' : 'number'" :focus="focus" :show-confirm-bar="false"
          :adjust-position="true" v-model="modelValue" :placeholder="placeholder" placeholder-class="light_color" />
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <input :maxlength="maxlength" v-if="type && type !== 'textarea' " :type="formatType" :focus="focus"
          :show-confirm-bar="false" :adjust-position="false" @confirm="handleClick" confirm-type="提交"
          v-model="modelValue" :placeholder="placeholder" placeholder-class="light_color" />
        <!-- #endif -->
        <textarea :maxlength="maxlength" @confirm="handleClick" confirm-type="提交" v-if="type === 'textarea'"
          :focus="focus" :show-confirm-bar="false" :adjust-position="true" v-model="modelValue"
          :placeholder="placeholder" placeholder-class="light_color"></textarea>
        <scroll-view scroll-y="true" class="slot_content">
          <view class="slot_container">
            <slot></slot>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="button">
      <my-button v-if="cancelText" @click="cancelClick" :width="208" :height="72" bg='#fff' color='#00B8A2'
        border='#00B8A2;' style="margin-right:56rpx">
        {{ cancelText }}</my-button>
      <my-button @click="handleClick" :width="208" :height="72">{{ submitText }}</my-button>
    </view>
  </view>
</template>

<script>
import myButton from './myButton.vue'
export default {
  props: {
    left_text_width: {
      //左边label宽度
      default: 0,
      type: Number
    },
    left_text: {
      //左边label
      default: '',
      type: String
    },
    cancelText: {
      //按钮文本
      default: '',
      type: String
    },
    submitText: {
      //按钮文本
      default: '确认',
      type: String
    },
    placeholder: {
      //input框的placeholder
      default: '',
      type: String
    },
    title: {
      //弹框标题
      default: '',
      type: String
    },
    show: {
      //显示弹框
      default: false,
      type: Boolean
    },
    type: {
      //input框类型
      default: '',
      type: String
    },
    value: {
      //传入值用于一开始回显数据
      default: '',
      type: [String, Number]
    },
    maxlength: {
      //
      default: '140',
      type: [String, Number]
    }
  },
  data () {
    return {
      focus: false,
      modelValue: ''
    }
  },
  components: {
    myButton
  },
  mounted () {
    if (this.type) {
      // #ifdef APP-PLUS
      // app端直接获取焦点
      this.focus = true
      // #endif
      if (this.value !== '') {
        // 如果有值则赋值给input框
        this.modelValue = this.value
      }
    }
  },
  watch: {
    show (value) {
      if (!this.type) return false
      this.modelValue = this.value
      console.log('modelValue', this.modelValue)
      // #ifdef MP-WEIXIN
      if (value) {
        setTimeout(() => {
          this.focus = true
        }, 50)
      } else {
        this.focus = false
      }
      // #endif
      // #ifdef APP-PLUS
      if (value === false) {
        this.focus = false
      }
      // #endif
    }
    // value(value) {
    //   this.modelValue = value
    //   console.log('value', value)
    // }
  },
  computed: {
    formatType: function () {
      try {
        let typeStr = ''
        if (this.type === 'nickname') {
          typeStr = 'nickname'
        } else if (this.type === 'input') {
          typeStr = 'text'
        } else {
          typeStr = 'digit'
        }
        console.log('[ typeStr ]-124', typeStr)
        return typeStr
      } catch (e) {
        console.log('[ e ]-154', e)
        //TODO handle the exception
      }
    },
  },
  methods: {

    cancelClick () {
      this.$emit('cancelClick')
    },
    // 组织冒泡
    clear (e) {
      e.stopPropagation()
    },
    // 点击确定
    handleClick () {
      console.log('[  this.modelValue ]-169', this.modelValue)
      this.$emit('confirm', this.modelValue || '')
    }
  }
}
</script>

<style lang="scss">
.input_popup_content {
  border-radius: 20upx;
  width: 600upx;
  background: #fff;
  .title {
    padding: 40upx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32upx;
    font-weight: bold;
  }

  .import_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    .light_color {
      font-size: 30rpx;
      color: #7a7a7a;
    }
    input {
      // width: 520upx;
      width: 100%;
      height: 96upx;
      line-height: 96upx;
      font-size: 36rpx;
      // box-sizing: border-box;
      border: 1px solid rgba($color: #dedbdb, $alpha: 0.5);
      border-radius: 10rpx;
      padding-left: 24rpx;
      color: #000;
    }

    textarea {
      width: 100%;
      height: 160upx;
      box-sizing: border-box;
      border: 1px solid rgba($color: #dedbdb, $alpha: 0.5);
      border-radius: 10upx;
      padding: 10upx 20upx;
    }

    .slot_content {
      max-height: 50vh;

      .slot_container {
        padding: 0 30upx;
      }
    }
  }

  .button {
    padding-top: 60upx;
    padding-bottom: 40upx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32upx;
    font-weight: bold;
  }
}
</style>
