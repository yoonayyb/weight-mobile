<template>
  <view class="connect-wrap u-flex u-row-between">
    <view class="u-font-16" style="width: 100%">
      <image :src="`${imgUrl}icon-b-wifi.png`" mode="widthFix" :style="[{ opacity: connecting ? 1 : 0 }]" />
      <image :src="`${imgUrl}icon-connect-f.png`" mode="widthFix" />
      <block v-if="!connecting">
        <view class="u-m-b-10" @click="openBlue">1.请打开手机<text>蓝牙</text></view>
        <view>2.体脂秤保持电量充足，<text>点亮体脂秤屏幕</text></view>
      </block>
      <block v-else>
        <view class="u-m-b-10 text-center"><text>测量体重中，请不要下秤</text></view>
        <view class="text-center">等待数据稳定后，系统提示在下秤</view>
      </block>
    </view>
    <view class="btn">
      <my-button
        width="300"
        height="90"
        fontSize="32"
        @click="$u.route('/packages/bodyFatScale/myHealthReport/history')"
        >历史数据</my-button
      >
    </view>
  </view>
</template>

<script>
let icommon = requirePlugin('ICDeviceManager')
let ICDeviceManager = new icommon.ICDeviceManager()

import MyButton from '@/components/myButton.vue'
export default {
  components: { MyButton },
  data() {
    return {
      searchMacAddr: '0B:76:1C:C1:2D:DC',
      weightData: {},
      onshowType: true,
      connecting: false,
      timer: '',
      weight: '',
      resistance: '',
      advertisData: '',
      i: 0,
      navigateNum: 1 //次数大于1不在接收数据跳转，防止多次跳转
    }
  },

  onLoad() {
    // 测试数据
    // let d = {
    //   weight: 60,
    //   impendances: [0, 0, 0, 0, 0]
    // }
    // uni.navigateTo({ url: `/packages/bodyFatScale/myHealthReport/index?data=${JSON.stringify(d)}` })
    // this.onshowType = false
    this.initBlue()
  },
  onShow() {
    setTimeout(() => {
      this.scanBlue()
    }, 1000)
    this.navigateNum = 1 // 页面显示 重置
    // this.openBlue()
  },
  onHide() {
    uni.hideLoading()
    clearInterval(this.timer)
  },
  onUnload() {
    uni.hideLoading()
    console.log('离开了')
    clearInterval(this.timer)
  },
  methods: {
    initBlue() {
      // if (!ICDeviceManager.isInit()) {
      // 设置蓝牙状态代理监听
      ICDeviceManager.setBleStateCallback((state) => {
        console.log('蓝牙状态：' + state)
        if (state == 4) {
          this.scanBlue()
          // this.timer = setInterval(() => {
          //   this.scanBlue()
          // }, 1500)
        }
      })
      // 设置连接状态和数据代理监听
      ICDeviceManager.setDelegate({
        onDeviceConnectionChanged: (device, state) => {
          console.log('设备连接状态：' + state)
        },
        onReceiveWeightData: (device, model) => {
          console.log('onReceiveWeightData', model)
          this.connecting = true
          if (model.isStabilized && this.navigateNum == 1) {
            clearInterval(this.timer)
            this.navigateNum++
            this.weightData = {
              weight: model.weight_kg,
              impendances: model.impendences
            }
            uni.navigateTo({
              url: `/packages/bodyFatScale/myHealthReport/index?data=${JSON.stringify(this.weightData)}`
            })
          }
        },
        onReceiveWeightHistoryData: (macAddr, code) => {
          console.log('历史数据: ', macAddr, code)
        }
      })
      ICDeviceManager.init((isInit) => {
        console.log('初始化状态: ', isInit)
        // 除setBleStateCallback，updateUserInfo, setDelegate,
        // 其它接口只有初始化完以后才能调用
        // 其它接口可以在任意地方调用，无需一定要在这里面调用
      })
      // }
    },
    scanBlue() {
      uni.openBluetoothAdapter({
        success: (res) => {
          uni.showLoading({
            title: '查找设备中...'
          })
          // uni.showToast({
          //   title: '连接成功',
          //   duration: 2000
          // })
        },
        fail: () => {
          uni.showToast({
            title: '请开启蓝牙',
            icon: 'none'
          })
        }
      })
      ICDeviceManager.scanDevice((model) => {
        console.log('model', model)
        if (model.macAddr) {
          // 找到设备后，停止扫描。调用scanDevice后，需开发者自己调用stopScan才会停止扫描，否则将会一直扫描，特例：蓝牙关闭后也会自己停止扫描
          ICDeviceManager.stopScan()
          // 添加回调成功不代表连接成功，这里只是说明设备已经添加到插 件了，连接状态看onDeviceConnectionChanged
          ICDeviceManager.addDevice(model.macAddr, (macAddr, code) => {
            console.log('add device code=' + code)
            if (code == 0) {
              // uni.hideLoading()
              uni.showLoading({
                title: '设备添加成功,请上称'
              })
              console.log('设备添加成功')
            }
            if (code == 2) {
              // uni.hideLoading()
              uni.showLoading({
                title: '设备已存在,请上称'
              })
              this.connecting = true
              console.log('设备添加失败，设备已存在')
            }
          })
        }
      })
    },
    // 以下代码已不再使用
    openBlue() {
      uni.openBluetoothAdapter({
        success: (res) => {
          this.connecting = true
          uni.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
            interval: 0,
            success: (res) => {
              uni.showLoading({
                title: '正在搜索设备',
                mask: true
              })
              this.timer = setInterval(() => {
                this.i++
                this.getBlue()
              }, 1000)
              setTimeout(() => {
                uni.hideLoading()
              }, 60000)
            }
          })
        },
        fail: () => {
          uni.showToast({
            title: '请开启蓝牙',
            icon: 'none'
          })
        }
      })
    },
    getBlue() {
      uni.getBluetoothDevices({
        success: (res) => {
          console.log('res: ', res)

          let devices = res.devices
          devices.map((item) => {
            item.advertisData = this.ab2hex(item.advertisData)
          })
          let arr = devices.filter((item) => {
            return (
              item.advertisData.length == 30 &&
              item.advertisData.substr(0, 2) == 'c0' &&
              item.advertisData.indexOf('0002') > -1
            )
          })
          if (arr.length == 0) return
          uni.stopBluetoothDevicesDiscovery({})
          this.advertisData = arr[0].advertisData
          console.log('this.advertisData: ', this.advertisData)
          let weight = arr[0].advertisData.substr(4, 4)
          let resistance = arr[0].advertisData.substr(8, 4)
          weight = this.hex2int(weight)
          resistance = this.hex2int(resistance)
          console.log('weight: ', weight)
          console.log('resistance: ', resistance)
          if (!resistance) {
            arr = []
            uni.startBluetoothDevicesDiscovery()
            if (this.i % 3 == 0) {
              return uni.showToast({
                title: '请光脚上秤',
                icon: 'none'
              })
            } else {
              return false
            }
          }
          this.weight = weight / 10
          this.resistance = resistance / 10
          uni.hideLoading()
          clearInterval(this.timer)
          uni.stopBluetoothDevicesDiscovery({})
          setTimeout(() => {
            uni.navigateTo({
              url: `/packages/bodyFatScale/myHealthReport/index?weight=${this.weight}&resistance=${this.resistance}`
            })
          }, 1000)
        },
        fail: (err) => {
          uni.hideLoading()
          uni.showToast({
            title: '搜索不到设备',
            icon: 'none'
          })
        }
      })
    },
    ab2hex(buffer) {
      const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      })
      return hexArr.join('')
    },
    hex2int(hex) {
      var len = hex.length,
        a = new Array(len),
        code
      for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i)
        if (48 <= code && code < 58) {
          code -= 48
        } else {
          code = (code & 0xdf) - 65 + 10
        }
        a[i] = code
      }
      return a.reduce(function (acc, c) {
        acc = 16 * acc + c
        return acc
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.connect-wrap {
  width: 100%;
  height: 100vh;
  padding: 20% 90rpx 130rpx;
  flex-direction: column;
  align-items: flex-start;
  color: #333;
  line-height: 45rpx;
  image {
    width: 246rpx;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 54rpx;
  }
  text {
    color: #00b8a2;
  }
  .btn {
    margin: 0 auto;
  }
  .text-center {
    text-align: center;
  }
}
</style>
