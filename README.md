## 运行发布

```bash
小程序需要使用hbuilderx点击发行 这样才会压缩代码 如果直接运行是不可以发布的，因为没有压缩代码所以体积太大，只能用来开发调试。
# 注：该小程序对'我的'模块进行了分包 如后续主包代码还是超过2m 可以继续对其他模块进行分包，我把5个tabbar页面单独放一块，是为了更方便进行分包

app需要使用hbuilderx云打包 每次更新记得修改版本号 关联证书填写密钥
# app调试安卓可用手机直接插上电脑运行然后等待手机安装hbuilderx即可，也可用模拟器，不过模拟器与真机差异较大。
```

## 某些 js 文件说明

```bash
全局通用js文件是utils/common.js # 修改域名baseurl也是在common里面
# 在页面内无需引用，在main.js已经挂在到实例了，可通过this.$commmon调用

请求可通过this.$axios()调用 # 具体请移步文件内查看注释

如看到this.$u 这是uviewui的内置js

main.js文件还挂在了全局过滤器 如需使用filter可在utils/filters中添加
```

## 全局样式

```bash
全局样式文件在styles/common.scss

有一些样式如 u-flex、u-p-30、u-font-24等是uview的内置样式 详细可查看uviewui的官网
```

## 需注意事项

```bash
项目引入的uview由于某些需求的问题，我已修改过了多个组件的源码，请尽量不要更新uview。

由于app端的picker选择器confirm颜色无法改变，所以我修改了hbuildx的源码，每次更新hbuildx都要去重新修改，不然按钮颜色是蓝色而不是主题色。
# 修改目录：HBuilderX\plugins\uniapp-cli\node_modules\@dcloudio\uni-app-plus\template\common\__uniapppicker.js   把文件中的uni-picker-action-confirm颜色修改了就行
```

## 页面常见变量

```bash
# 有一些页面经常看见一些变量 如：
   page:分页页码
   size(lengthNum):每页条数
   length:当前页请求的条数或者说长度，用于触底时判断有没有拉取完所有数据
   afterLoading:是否在加载中,用于判断列表页拉取数据接口有没有跑完
   userId:营养师或者医生端才会有 指的是营养师查看或修改当前用户 这个用户的userId
   date:用于查看日记或者记录日记时是哪天的日期
```

## 项目 component 和 utils 说明

```bash
good_pure
├─ components  # 通用组件目录
│  ├─ mallMenu.vue  # 商城商品组件
│  ├─ vueScale.vue  # 刻度尺组件
│  ├─ canvas-half-circle.vue  # 日记头部半圆刻度条组件
│  ├─ impopup.vue  # 全局消息通知弹出框组件
│  ├─ appTop.vue  # 用于app顶部占位状态栏组件
│  ├─ arc.vue     # 用于消息的语音播放的动画组件
│  ├─ articleItem.vue  # 文章项组件
│  ├─ blog.vue   # 帖子(动态)组件
│  ├─ checked.vue # 一个按钮组件 可用于单选多选
│  ├─ columnChart.vue # 日记页的柱状图组件
│  ├─ diaryButtonBox.vue  # 日记页的记饮食之类的按钮组
│  ├─ foodContent.vue # 食物查询和记饮食中的食物内容组件
│  ├─ getCode.vue  # 获取验证码按钮组件
│  ├─ goodsItem.vue  # 商品项组件
│  ├─ goodsItemOrder.vue  # 订单中的商品项组件
│  ├─ infoTemplate.vue  # 用于'我的'模块中的某写地方左右结构的信息展示
│  ├─ inputPopup.vue  # 用于填写资料的弹框中嵌套输入框
│  ├─ locateView.vue  # 用于会话列表  长按出现操作菜单 类似微信
│  ├─ mineOperationItem.vue  # '我的'页面中每个操作项组件
│  ├─ movementContent.vue # 记运动中的运动内容组件 类似上面的foodContent
│  ├─ myButton.vue  # 通用按钮组件
│  ├─ myCheckbox.vue # 用于答题时的单选多选组件（需求不做，可能弃用）
│  ├─ numberKeyboard2.vue # 用于记体重的数字输入框组件
│  ├─ playVideo.vue # 发现页中视频组件
│  ├─ recordPopup1.vue # 日记记录弹出组件
│  ├─ popup.vue # 弹框组件（可用uview的u-popup，该组件可不用）
│  ├─ previewVideo.vue # 预览视频组件
│  ├─ qrcode.vue # 小程序码组件
│  ├─ tki-file-manager.vue # app选择文件组件
│  ├─ topicItem.vue   # 话题项组件
│  ├─ topicSimple.vue # 简单ui的话题项组件 用于发布动态添加话题时
│  └─ video.vue  # 发现页中视频展示组件
├─ mixins  一些全局处理的逻辑
│  ├─ setOss.js             #  一些扫码进来处理的逻辑、保存跳转url
├─ packages  分包 体脂称模块

├─ utils  工具类js文件
│  ├─ common.js             #  全局通用函数
│  ├─ decodeElement.js      #  处理消息中的表情
│  ├─ emojiMap.js           #  表情资源
│  ├─ eventBus.js           #  事件总线
│  ├─ filters.js            #  全局过滤js
│  ├─ initTimSdk.js         #  初始化im
│  ├─ md5.min.js            #  md5加密js文件
│  ├─ request.js            #  通用请求文件
│  └─ u-charts.min.js       #  ucharts图表js
└─ vuex
   ├─ getters.js
   ├─ index.js
   └─ modules
      ├─ app.js
      ├─ message.js
      └─ user.js

```

## 首页图表说明

```bash
小程序内使用的图表是uchart v2.0 版本，在 uni_modules 目录下，如插件有更新，可右键选择更新，图表的配置在 \uni_modules\qiun-data-charts\js_sdk\u-charts 目录下的 config-ucharts.js，更新插件是会覆盖图表配置，只需要在uni_modules/qiun-data-charts文件夹上，右键菜单中选择【从插件市场更新(w)】，如果修改了config-ucharts.js等配置文件，请在弹出的“文件内容合并对比”窗口中选择保留您的配置文件
```

组件库 uview-ui(1.x)

注意：页面中使用到的图表实际上 canvas，在开发工具中显示为被弹出层遮挡，在真机中是正常的，不用处理这个问题

## 登陆账号身份

```bash
根据userInfo返回的role_id 还有 roles对象判断
role_id : 1 (会员)；2(营养师);3(医生)；4(其他)
yly: wxa30fb7b6a43e85ed
减重: wxc21929d3544f193d

roles:{
   isDirector:true/false,   //是否主管
   isDoctor:true/false,       //是否医生
   isSale:true/false,      //是否销售营养师
   isSaleRep:true/false,   //是否销售代表
   isSite:true/false,   //是否驻场营养师
   isServer:true/false,   //是否服务营养师
}
```
 ## 前端上传静态图片路径
```bash
	oss://dev-gp/app_icon/
```