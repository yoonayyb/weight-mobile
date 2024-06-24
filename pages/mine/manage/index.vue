<template>
	<page-meta :page-style="'overflow:'+(searchPopupShow?'hidden':'visible')"></page-meta>
	<view class="container u-p-b-24">
		<view class="u-flex" style="background: #FFF;position: relative;z-index: 999;padding:32rpx"
			:style="{'padding-bottom':searchPopupShow?'20rpx':'32rpx'}">
			<u-search style="flex:1" @focus="keyboard = false" :show-action="false" placeholder="请输入会员姓名/备注/手机号"
				v-model="keyword" @custom="search" @search="search" @change="searchChange" height="72"
				:clearabled="true">


			</u-search>
			<image @click="searchPopupShow = !searchPopupShow" :src="`${imgUrl}v3_manage_search.png`" mode=""
				style="width:48rpx;height:48rpx;margin-left:16rpx"></image>
			<!-- <view class="u-m-t-32" @click="searchPopupShow = !searchPopupShow">筛选 <u-icon
          :name="searchPopupShow?'arrow-up':'arrow-down'" size="32rpx" style="margin-left:4rpx;">
        </u-icon>
      </view> -->

		</view>
		<view :style="{'display':searchPopupShow?'flex':'none'}" class="searchOrder searchOrderPopup">
			<view class="u-flex u-flex-column" v-show="target !== 'team' ">
				<view style="width: 100%;height: 74rpx;background-color: #00B8A2;flex-direction: row"
					class="u-flex u-flex-center u-font-28">

					<view @click="tabNum = 1" class="u-flex u-flex-center" style="flex:1;height: 100%;color:#fff;"
						:class="{'noActiveStatus':tabNum === 1}">
						<image :src="tabNum===2? `${imgUrl}tabStatuscheck.png`:`${imgUrl}tabStatusNo.png`" mode=""
							style="width:48rpx;height:48rpx;margin-right:16rpx"></image>状态
					</view>
					<view @click="tabNum = 2" class="u-flex u-flex-center" style="flex:1;height: 100%;color:#fff;"
						:class="{'noActiveGuishu':tabNum === 2}">

						<image :src="tabNum===2? `${imgUrl}tabGuishuNo.png`:`${imgUrl}tabGuishuCheck.png`" mode=""
							style="width:48rpx;height:48rpx;margin-right:16rpx"></image>归属
					</view>
				</view>
				<view class="u-flex u-flex-wrap"
					style="flex-direction: row;justify-content: start;padding:48rpx 64rpx 0 64rpx;">
					<view v-show="tabNum === 2" style="width: 100%;margin-bottom: 35rpx" class="u-flex"
						v-for="(item,index) of options" :key="index">
						<template v-if="item.type">
							<text style="width: 160rpx;">{{item.label}}</text>
							<template v-if="item.type === 'mutil-piker'">


								<view @click="target = 'team'" class="typebox u-flex-center">
									<view
										style="width: 390rpx; display: block;margin: 0;padding: 0;color:#B2B2B2;text-align: center;"
										class="u-line-1">{{item.title}}</view>
									<u-icon color="#00B8A2" size="20" name="arrow-down-fill"></u-icon>
								</view>


							</template>
						</template>
						<template v-else>
							<text style="width: 160rpx;">{{item.label}}</text>
							<view class="typebox">
								<u-dropdown textInput :classname="'uDropdown'+index" @input="input" :length="itemLength"
									@itemHeight="(e)=>{itemHeight = e}" height="48" menu-icon="arrow-down-fill"
									menu-icon-size="20" active-color="#00B8A2" inactive-color="#9B9B9B"
									:ref="'uDropdown'+index" @open="dropdownOpen(index)">
									<u-dropdown-item v-model="item.value"  @compareTitle="compareTitle" :title="item.title">
										<view v-if="item.list.length" class="slot-content"
											style="background-color: #F3F3F3;border-radius:0 0 24rpx 24rpx"
											:style="{'height':itemHeight+'rpx'}">
											<scroll-view scroll-y="true" style="height: 100%;">
												
												<view v-if="item.list.length != 0" @click="choose(i,item,index)" v-for="(i,ii) of item.list"
													:key="ii" :class="{active:item.active === i.value}"
													class="u-text-center u-line-1"
													style="margin: 24rpx 0;color:#9B9B9B"> {{i.name}}
												</view>
											</scroll-view>
										</view>
										<view v-else class="slot-content"
											style="background-color: #F3F3F3;border-radius:0 0 24rpx 24rpx"
											:style="{'height':itemHeight+'rpx'}">
											<scroll-view scroll-y="true" style="height: 100%;">
												
												
													
													<u-empty text="暂无数据" mode="list"></u-empty>
												
											</scroll-view>
										</view>
									</u-dropdown-item>

								</u-dropdown>
							</view>
						</template>

					</view>
					<view v-show="tabNum === 1" style="width: 100%;margin-bottom: 35rpx" class="u-flex"
						v-for="(item,index) of guishuOptions" :key="index">
						<template v-if="item.type">
							<text style="width: 160rpx;">{{item.label}}</text>
							<template v-if="item.type === 'input'">
								<view @click="closeAlluDropdown()" class="typebox u-flex-center">
									<view
										style="margin: 0;padding: 0;color:#9B9B9B;font-size: 24rpx;width: 100%;margin-right: 24rpx;">
										<view @click="bmi = item.sbmi;bmiType='sbmi'" class="u-line-1"
											style="width: 60rpx;text-align: end;"
											:style="{'color':bmiType==='sbmi'?'#00B8A2':'#9B9B9B'}">{{item.sbmi}}</view>
										<view style="margin: 0 116rpx;">一</view>
										<view @click="bmi = item.ebmi;bmiType='ebmi'" class="u-line-1"
											style="width: 60rpx;"
											:style="{'color':bmiType==='ebmi'?'#00B8A2':'#9B9B9B'}">{{item.ebmi}}</view>
									</view>

								</view>

							</template>
						</template>
						<template v-else>
							<text style="width: 160rpx;">{{item.label}}</text>
							<view class="typebox">
								<u-dropdown :length="itemLength" @itemHeight="(e)=>{itemHeight = e}" height="48"
									menu-icon="arrow-down-fill" menu-icon-size="20" active-color="#00B8A2"
									inactive-color="#9B9B9B" :ref="'uDropdown'+item.index" @open="dropdownOpen1(index)">
									<u-dropdown-item v-model="item.value" :title="item.title">
										<view class="slot-content"
											style="background-color: #F3F3F3;border-radius:0 0 24rpx 24rpx;"
											:style="{'height':itemHeight+'rpx'}">
											<scroll-view scroll-y="true" style="height: 100%;">
												<view @click.stop="choose1(i,item,item.index)"
													v-for="(i,ii) of item.list" :key="ii"
													:class="{active:item.active === i.value}"
													class="u-text-center u-line-1"
													style="margin: 24rpx 0;color:#9B9B9B"> {{i.name}}
												</view>

											</scroll-view>
										</view>
									</u-dropdown-item>

								</u-dropdown>
							</view>
						</template>

					</view>
				</view>
			</view>
			<view class="u-flex u-flex-column" v-show="target === 'team'">
				<view class="u-flex u-flex-column u-flex-items-center" style="padding:48rpx 38rpx 0 38rpx;width: 100%;">
					<view class="u-font-28 text-bold"
						style="color:#2A2A2A;padding:0 26rpx 20rpx 26rpx;border-bottom:2rpx solid #F8F8F8;margin-bottom:44rpx;width: 100%;">
						请选择所属团队</view>
					<view v-if="teamTitleArr.length" class="u-font-24 text-bold u-flex u-flex-center u-flex-items-start"
						style="color:#2A2A2A;padding:0 26rpx 8rpx 26rpx;border-bottom:2rpx solid #F8F8F8;margin-bottom:44rpx;width: 100%;">
						<u-icon @click="backTeam()" color="#bcbcbc" name="arrow-left"
							style="position: absolute;left: 112rpx;" size="36"></u-icon>
						<view class="green text-bold u-line-1"
							style="padding:0 8rpx 36rpx 8rpx;border-bottom:4rpx solid #00B8A2;max-width: 60%;">
							{{teamTitle}}
						</view>
					</view>

					<scroll-view scroll-y="true" style="height: 400rpx">
						<view @click="chooseTeam(item)" v-for="(item,index) of teamOptions" :key="index"
							class="u-flex u-flex-center u-flex-items-baseline"
							style="padding-bottom:8rpx;color:#2A2A2A;width: 100%;">

							<view :style="{'background':teamId === item.id?'#00B8A2':'#fff'}" class="sign"></view>
							<view style="max-width: 80%;padding-bottom:36rpx;margin-right: 30rpx;"
								class=" u-font-24 u-line-1">{{item.title}}</view>

						</view>

					</scroll-view>
				</view>
			</view>
			<view style="display: flex; justify-content: center;margin-bottom: 32rpx;flex-direction: row;">
				<my-button @click="selectOrderReset" width="184" height="72" color="#2A2A2A" border="#C2C2C2"
					margin="0 48rpx 0 0">重置</my-button>
				<my-button @click="selectOrderConfirm" width="184" height="72">确定</my-button>
			</view>
			<number-keyboard :max="100" @input="bmiInput" style="position: fixed;bottom: 0;width: 100%;left: 0;"
				v-if="keyboard" :padding="0" ref="numberKeyboard" title="''" v-model="bmi" rightBtnText="''"
				@confirm="submit"></number-keyboard>
		</view>
		<block v-if="customerList.length">
			<view class="box" v-for="(item,index) of customerList"
				@click="jump({url:'mine/manage/detail',data:{id:item.id,sex:item.sex}})" :key="item.id">
				<view @click.stop="openDetail(item)" class="right"
					:class="{red:item.plan_status == 0,info:item.plan_level == 0 }">
					<block v-if="item.plan_level == 0">
						<block>未开始</block>
					</block>
					<block v-else>
						<view>{{typeObj[item.plan_level]}}</view>
						<view class="u-line-1 " style="width: 140rpx;text-align: center;">
							{{item.plan_current}}/{{item.plan_total}}
						</view>
					</block>
				</view>
				<view class="u-flex u-font-32">
					<u-avatar size="80" :src="item.avatar"></u-avatar>
					<view style="max-width:272rpx;font-weight: bold;margin-left: 10rpx;" class="u-line-1">
						{{item.realname || item.nickname}}
					</view>
					<view class="gender man u-m-l-10 u-m-r-10" :class="{woman:item.sex ===0}">
						<image :src="`${imgUrl}v3_manage_${item.sex ===0 ? 'woman':'man'}.png`" mode=""></image>
						<text>{{item.age}}</text>
					</view>
					<image @click.stop="actionShow = true;info = item"
						style="width: 32rpx;height: 32rpx;padding: 10rpx;" :src="`${imgUrl}v3_manage_info.png`"></image>
				</view>
				<!-- <view class="u-flex-y-center u-font-28 u-m-t-16">
	    <view class="u-flex u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
	      <view style="color: #C2C2C2;">当前体重</view>
	      <view style="color: #C2C2C2;">阶段变化</view>
	      <view style="color: #C2C2C2;">BMI</view>
	      <view style="color: #C2C2C2;">饮食</view>
	      
	    </view>
	</view> -->
				<view class="u-flex-y-center u-font-28 u-m-t-16">
					<view @click.stop="jump({url:'newHome/index',data:{user_id:item.id,sex:item.sex}})"
						class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
						<view style="color: #C2C2C2;">当前体重</view>
						<view>{{item.current_weight | filterNum}}</view>
					</view>
					<view @click.stop="jump({url:'newHome/index',data:{user_id:item.id,sex:item.sex}})"
						class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
						<view style="color: #C2C2C2;">阶段变化</view>
						<view>{{item.change_weight }}</view>
					</view>
					<view @click.stop="jump({url:'newHome/index',data:{name:'BMI',user_id:item.id,sex:item.sex}})"
						class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
						<view style="color: #C2C2C2;">BMI</view>
						<view>{{item.bmi}}</view>
					</view>
					<view @click.stop="jump({url:'newHome/index',data:{name:'热量',user_id:item.id,sex:item.sex}})"
						class="u-flex-column u-flex-items-center u-flex-around" style="flex:1;min-height: 100rpx;">
						<view style="color: #C2C2C2;">饮食</view>
						<view>

							<text
								:class="[calcFood(item.food_target,item.food)]">{{item.food && parseInt(Number(item.food)) || 0}}</text>
							/
							<text>{{item.food_target && parseInt(Number(item.food_target)) || 0}}</text>
						</view>
					</view>
				</view>
				<view v-if="item.diary" class="u-flex-y-center u-font-24 u-m-t-10 u-flex-wrap">
					<view v-if="item.is_read === 0"
						style="width: 16rpx;height: 16rpx;background: #E34D59;margin-right: 10rpx;border-radius: 50%;">
					</view>
					<text style="color: #C2C2C2;">更新于 {{item.diary.updated_at | formatTime1}}</text>
					<view @click="gotoDiary(v.type,item.id)" v-for="(v,index) in item.diary.diary_list" :key="index"
						class="foot_box">
						{{v.title}}
					</view>
				</view>
			</view>
		</block>
		<view class="v3_empty" v-else-if="!customerList.length && afterLoading">
			<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_manage_empty.png`"></image>
			<view class="u-m-t-16">
				暂无符合的筛选
			</view>
		</view>
		<view v-if="searchPopupShow" class="mask" @click="searchPopupShow = false">

		</view>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="638rpx" height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
				<view class="u-font-32 text-bold">您还未完善个人信息</view>
				<view class="u-font-32 ">请先完善信息再进行操作</view>
				<view class="u-flex-y-center u-flex-around" style="width: 100%;">
					<my-button width="208" height="72" color="#00B8A2" bg="#FFFFFF" @click="popshow = false">取消
					</my-button>
					<my-button width="208" height="72" @click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善
					</my-button>
				</view>
			</view>
		</u-popup>

		<u-action-sheet :list="actionList" @click="actionClick" v-model="actionShow"></u-action-sheet>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	import numberKeyboard from '../components/numberKeyboard2.vue' //键盘
	export default {
		data() {
			return {
				teamId: '',
				teamTitle: '', //选中的团队名字
				teamTitleArr: [],
				saveTeamOptions: [], //保存所属团队的数据
				teamOptions: [], //所属团队的下拉
				target: '', //是否点击所属团队
				tabNum: 1,
				show: false,
				bmiType: null,
				bmi: 0,
				keyboard: false,
				personList: [], //引流人达成人
				personList2: [], //干预人
				personList1: [], //推荐人
				hospitallist:[],//医院列表数据
				itemHeight: 436, //默认一个高度
				itemLength: 0,
				value1: '',
				afterLoading: false,
				popshow: false,
				page: 1,
				length: 0,
				keyword: '',
				actionShow: false,
				searchPopupShow: false,
				active: '',
				active1: '',
				phone: '',
				info: {},
				actionList: [{
					text: '发消息'
				}, {
					text: '拨打电话'
				}],
				guishuOptions: [{
						label: "状态",
						title: '全部',
						value: '',
						active: '',
						index: 11, //定义一个索引
						list: [{
							name: '全部',
							value: '',

						}, {
							name: '未开始',
							value: 0,

						}, {
							name: '启动期',
							value: 1,

						}, {
							name: '过渡期',
							value: 2,

						}, {
							name: '维持期',
							value: 3,

						}, {
							name: '已暂停',
							value: 4,

						}]
					},
					{
						label: "性别",
						title: '全部',
						value: '',
						active: '',
						index: 12, //定义一个索引
						list: [{
							name: '全部',
							value: '',

						}, {
							name: '男',
							value: 1,

						}, {
							name: '女',
							value: 0,

						}]
					},
					{
						label: "日记更新",
						title: '全部',
						value: '',
						active: '',
						index: 13, //定义一个索引
						list: [{
								name: '全部',
								value: '',

							},
							{
								name: '已更新',
								value: 1,

							},
							{
								name: '未更新',
								value: 0,

							}
						]
					},
					{
						label: "BMI区间",
						type: 'input',
						value: '',
						sbmi: 0,
						ebmi: 0,
						title: '全部',
						active: '',
						list: []
					},
				],
				options: [{
						label: "所属医院",
						// type: 'single-piker',
						value: '',
						title: '',
						
						
						active: '',
						list: []
					},
					{
						label: "所属团队",
						type: 'mutil-piker',
						value: '',
						title: '全部',
						active: '',
						list: []
					},
					{
						label: "引流人",
						value: '',
						title: '',
						
						active: '',
						list: []
					}, {
						label: "达成人",
						value: '',
						title: '',
						
						active: '',
						list: []
					}, {
						label: "推荐人",
						value: '',
						title: '',
						
						active: '',
						list: []
					}, {
						label: "干预人",
						value: '',
						title: '',
						
						active: '',
						list: []
					},
				],
				typeObj: {
					0: '未开始',
					1: '启动期',
					2: '过渡期',
					3: '维持期'
				},
				customerList: [],
				
				is_current_month: ''
			}
		},
		components: {
			myButton,
			numberKeyboard
		},
		onLoad(option) {
			if (option.params) { //状态
				this.active = Number(option.params)
				this.guishuOptions[0].active = Number(option.params)
				if (Number(option.params) === 1) {
					this.guishuOptions[0].title = '启动期'
				}
				if (Number(option.params) === 2) {
					this.guishuOptions[0].title = '过度期'
				}
				if (Number(option.params) === 3) {
					this.guishuOptions[0].title = '维持期'
				}

			}
			if (option.diary) { //日记更新
				// this.active1 = Number(option.diary)
				this.guishuOptions[2].active = Number(option.diary)
				this.guishuOptions[2].title = '已更新'
			}
			if (option.is_current_month) { //本月新增
				this.is_current_month = Number(option.is_current_month)
			}
			//获取引流人、达成人(保存起来)
			this.getPerson('site,director,doctor,server,sale', this.personList, 2, 3)
			this.getPerson('server', this.personList2, 5)//干预人
			//获取推荐人(保存起来)
			this.getPerson('doctor', this.personList1, 4)
			//获取医院数据(保存起来)
			this.getHospitalListSave()
			//获取第一级团队数据 parent_id
			this.getStoreSelect(0)
			this.getCustomerList()
		},
		onShow() {
			// console.log('[ onShow ]-161', )
			// this.getCustomerList()
		},
		async onPullDownRefresh(){
			
			this.page = 1
			 this.getCustomerList()
			
		},
		onReachBottom() {
			if (this.length) {
				this.page++
				this.getCustomerList()
			}
		},
		watch: {
			searchPopupShow(newValue, oldValue) {
				if (!newValue) {
					this.keyboard = false
					this.options.forEach((v, i) => {
						if (this.$refs['uDropdown' + i]) {
							this.$refs['uDropdown' + i][0].close()
						}
					})
				}
			},
			keyboard() {
				//如果都未选中 就默认第一个
				if (!this.bmiType) this.bmiType = 'sbmi'
			},
			tabNum(val) {
				this.keyboard = false
			}
		},
		methods: {
			compareTitle(menuList,title){
				
				if(menuList[0].title !== title){
					menuList[0].title = title
				}
				
				console.log('compareTitle',menuList,title)
			},
			searchFunc(value){
				this.getHospitalList(value)
			},
			input({
				val,
				classname
			} = {}) {
				console.log(111, val.detail.value)
				console.log(222, classname)
				switch (classname) {
					case 'uDropdown0':
					
						this.getHospitalList(this.$u.trim(val.detail.value))
							
						
						
						
						break;
					case 'uDropdown2':
					//引流人
					this.getSearchPerson('site,director,doctor,server,sale', this.$u.trim(val.detail.value), 2)
					
						break;
					case 'uDropdown3':
					//达成人
					this.getSearchPerson('site,director,doctor,server,sale', this.$u.trim(val.detail.value), 3)
					
						break;
					case 'uDropdown4':
					//推荐人
					this.getSearchPerson('doctor', this.$u.trim(val.detail.value), 4)
					
						break;
					case 'uDropdown5':
					//干预人
					this.getSearchPerson('site,director,doctor,server,sale', this.$u.trim(val.detail.value), 5)
					
					
						break;	
					default:
						break;
				}
			},
			searchChange() {
				if (this.searchPopupShow) {

				} else {
					
					this.$u.debounce(this.search, 300)
				}

			},
			async chooseTeam(item) {
				this.teamId = item.id

				console.log(item)
				let length = await this.getStoreSelect(item.id)
				if (length !== 0) {
					this.teamTitle = item.title
					this.teamTitleArr.push(item)
				}

			},
			backTeam() {
				if (this.saveTeamOptions.length) {
					this.teamId = this.teamTitleArr[this.teamTitleArr.length - 1].id
					this.teamTitleArr.pop()
					this.saveTeamOptions.pop()
					if (this.teamTitleArr.length) {
						this.teamTitle = this.teamTitleArr[this.teamTitleArr.length - 1].title
					}


					this.teamOptions = this.saveTeamOptions[this.saveTeamOptions.length - 1]


				} else {
					this.teamTitle = ''
				}
				console.log('this.teamTitle', this.teamTitle)
				console.log('this.teamOptions', this.teamOptions)
			},
			bmiInput(val) {
				console.log('input', val)


				if (this.bmiType === 'sbmi') {
					//通过顺序找到bmi
					this.guishuOptions[3].sbmi = val
				} else {
					//通过顺序找到bmi
					this.guishuOptions[3].ebmi = val
				}
			},
			submit() {
				this.keyboard = false
			},
			
			async getStoreSelect(parent_id) {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Staff/storeSelect',
						method: 'get',
						data: {
							parent_id
						}
					}).then(({
						data
					}) => {
						if (!data.list.length) return resolve(0)
						let arr = data.list.map(v => {
							return {
								...v,
								active: ''
							}
						})

						this.saveTeamOptions.push(arr) //保存数据
						this.teamOptions = [...arr]
						resolve(data.list.length)
					}).catch(err => {
						reject(0)
					})

				})


			},
			async getSearchPerson(doctor_type,keywords="",index) {
				let page = 1
				let list = []
				
				const _getSearchPerson = async () => {
					const {
						data
					} = await this.$request({
						method: 'get',
						url: '/ApiV2/Mobile/ReportingOrder/staffs',
						data: {
							lengthNum: 15,
							page,
							doctor_type,
							keywords
						}
					})
					console.log('keywords',keywords)
					let arr = data.data.map(v => {
						return {
							name: v.nickname,
							value: v.id
						}
					})
					list = [...list, ...arr]
					if (data.next_page_url) {
						page++
						_getSearchPerson()
					} else {
						//通过顺序获取医院这个对象
						this.options[index].list = list
						console.log('this.options[index].list',this.options[index].list)
						this.$forceUpdate()
						if(list.length){
							this.itemLength = list.length > 6 ? 7.5 : list.length + 1.5
						}else{
							this.itemLength = 6
						}
						
					}
					
				}
				this.$u.debounce(_getSearchPerson,500)
				
			
			},
			async getHospitalListSave(){
				let page = 1
				let list = []
				
				const _getHospitalListSave = async () => {
					const {
						data
					} = await this.$request({
						url: '/ApiV3/Mobile/Hospital/index',
						method: 'get',
						data: {
							lengthNum: 15,
							page,
							
						}
					})
					
					let arr = data.data.map(v => {
						return {
							name: v.title,
							value: v.id
						}
					})
					list = [...list, ...arr]
					if (data.next_page_url) {
						page++
						_getHospitalListSave()
					} else {
						//通过顺序获取医院这个对象
						this.options[0].list = [...list]
						this.hospitallist = [...list]
						this.$forceUpdate()
						
						
					}
					
				}
				_getHospitalListSave()
			},
			async getHospitalList(keywords="") {
				let page = 1
				let list = []
				
				const _getHospitalList = async () => {
					const {
						data
					} = await this.$request({
						url: '/ApiV3/Mobile/Hospital/index',
						method: 'get',
						data: {
							lengthNum: 15,
							page,
							keywords
						}
					})
					console.log('keywords',keywords)
					let arr = data.data.map(v => {
						return {
							name: v.title,
							value: v.id
						}
					})
					list = [...list, ...arr]
					if (data.next_page_url) {
						page++
						_getHospitalList()
					} else {
						//通过顺序获取医院这个对象
						this.options[0].list = list
						this.$forceUpdate()
						if(list.length){
							this.itemLength = list.length > 6 ? 7.5 : list.length + 1.5
						}else{
							this.itemLength = 6
						}
						
					}
					
				}
				this.$u.debounce(_getHospitalList,500)
				// _getHospitalList()

			},
			getPerson(doctor_type, option, ...index) {
				let page = 1
				const _getPerson = () => {
					this.$request({
						method: 'get',
						url: '/ApiV2/Mobile/ReportingOrder/staffs',
						data: {
							doctor_type,
							page,
							lengthNum: 15,
						}
					}).then(res => {
						let arr = res.data.data.map(v => {
							return {
								name: v.nickname,
								value: v.id
							}
						})
						option = [...option, ...arr]
						if (res.data.next_page_url) {
							page++
							_getPerson()
						} else {
							console.log(222, index)
							index.forEach(v => {
								this.options[v].list = [...option]
							})
							if(doctor_type === 'doctor'){
								this.personList1 = [...option]
							}else if(doctor_type === 'server'){
								this.personList2 = [...option]
							}else{
								this.personList = [...option]
							}
						}
					})
				}
				_getPerson()

			},
			dropdownOpen(index) {
				console.log('开启', index)
				this.keyboard = false
				new Array(this.options.length).fill(1).forEach((v, i) => {
					if (index !== i && this.$refs['uDropdown' + i]) {
						this.$refs['uDropdown' + i][0].close()
					} else if (this.$refs['uDropdown' + i]) {
						this.$refs['uDropdown' + i][0].highlight();
						if(this.options[index].list.length){
							this.itemLength = this.options[index].list.length > 6 ? 7.5 : this.options[index].list
								.length + 1.5
						}else{
							this.itemLength = 6
						}
						
						console.log('this.$refs', this.$refs['uDropdown' + i])
						console.log(this.itemLength)
					}

				})

			},
			dropdownOpen1(index) {
				//找出所有uDropdown组件的对象
				let arr = this.guishuOptions.map(v => v.index).filter(v => v)
				console.log('开启', index)

				this.keyboard = false
				arr.forEach((v, i) => {
					if (index !== i && this.$refs['uDropdown' + v]) {
						this.$refs['uDropdown' + v][0].close()
					} else if (this.$refs['uDropdown' + v]) {
						this.$refs['uDropdown' + v][0].highlight();
						
						this.itemLength = this.guishuOptions[index].list.length > 6 ? 7.5 : this.guishuOptions[index].list.length + 1.5
						
						
						console.log('this.$refs', this.$refs['uDropdown' + v])
						
						console.log(this.itemLength)
					}

				})

			},
			closeAlluDropdown() {
				this.keyboard = true
				//找出所有uDropdown组件的对象
				let arr = this.guishuOptions.map(v => v.index).filter(v => v)
				arr.forEach(v => {
					this.$refs['uDropdown' + v][0].close()
				})
			},
			dropdownClose(index) {
				new Array(this.options.length).fill(1).forEach((v, i) => {
					this.$refs['uDropdown' + i][0].close()

				})
			},
			choose(i, item, arrLength) {
				item.active = i.value;
				item.title = i.name
				console.log(i.active === i.value)
				this.$refs['uDropdown' + arrLength][0].close()

			},
			choose1(i, item, index) {

				item.active = i.value;
				item.title = i.name
				console.log(i.active === i.value)
				console.log(11111, this.$refs['uDropdown' + index])

				this.$refs['uDropdown' + index][0].close()

			},
			gotoWrite(url) {

				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			gotoDiary(type, user_id) {
				let url;
				if (type === 1) url = '/pages/newHome/index?name=血压&user_id=' + user_id
				if (type === 2) url = '/pages/newHome/index?name=血糖&user_id=' + user_id
				if (url) {
					uni.navigateTo({
						url
					})
				}
			},
			calcFood(food_target, food) {
				if (!food_target || !food) {
					return
				}
				// 低于80%黄色，80%~100%绿色，超了就红色
				if (food > food_target) {
					return 'fontRed'
				}
				// 计算百分比
				let foodPercentage = (Math.round(food / food_target * 10000) / 100.00)
				if (foodPercentage < 80) {
					return 'fontWarn'
				}
				if (foodPercentage > 80) {
					return 'fontGreen'
				}
			},
			getCustomerList() {
				this.afterLoading = false
				let data = {
					page: this.page,
					is_diary_update: this.active1,
					keywords: this.keyword,
				}
				if (this.teamId !== '') data.store_id = this.teamId
				if (this.options[0].active !== '' ) data.hospital_id = this.options[0].active

				if (this.options[2].active !== '' ) data.drainage = this.options[2].active
				if (this.options[3].active !== '' ) data.reach = this.options[3].active
				if (this.options[4].active !== '' ) data.doctor_id = this.options[4].active
				if (this.options[5].active !== '' ) data.dietitian_id = this.options[5].active

				//状态是 已暂停 特殊处理
				if (this.guishuOptions[0].active !== '' && this.guishuOptions[0].active === 4) {
					data.plan_status = 0
				} else if (this.guishuOptions[0].active !== '') {
					data.plan_level = this.guishuOptions[0].active
				}
				if (this.guishuOptions[1].active !== '') data.sex = this.guishuOptions[1].active
				if (this.guishuOptions[2].active !== '') data.is_diary_update = this.guishuOptions[2].active
				if (this.guishuOptions[3].sbmi !== 0) data.bmi_min = this.guishuOptions[3].sbmi
				if (this.guishuOptions[3].ebmi !== 0) data.bmi_max = this.guishuOptions[3].ebmi
				//本月新增
				if (this.is_current_month) {
					data.is_current_month = this.is_current_month
				}
				this.$request({
						url: '/ApiV3/Mobile/Staff/customerList',
						method: 'GET',
						loading: true,
						data
					})
					.then((res) => {
						this.afterLoading = true
						if (this.page === 1) {
							this.customerList = res.data.data
						} else {
							this.customerList = [...this.customerList, ...res.data.data]
						}
						this.length = res.data.next_page_url
						console.log('[ res ]-157', res)
						uni.stopPullDownRefresh();
					})
					.catch(async (err) => {
						this.afterLoading = true
						uni.stopPullDownRefresh();
					})
			},
			search() {
				
				this.page = 1
				this.getCustomerList()
			},
			// 通用跳转
			jump({
				url = '',
				data = {}
			} = {}) {
				let id = data.id || data.user_id
			
				if (this.$store.state.user.userInfo.id == id && this.$store.state.user.userInfo.should_update) {
					return this.popshow = true
				}
				
				this.$common.jump({
					url,
					data,
					that: this
				})
			},
			openDetail(item) {
				console.log(1111, item)
				if (this.$store.state.user.userInfo.id == item.id && this.$store.state.user.userInfo.should_update) {
					return this.popshow = true
				}
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
			selectOrderConfirm() {
				if (this.target === 'team') {
					let arr = this.saveTeamOptions.flatMap(v => v)
					this.options[1].title = arr.find(v => v.id === this.teamId) && arr.find(v => v.id === this.teamId)
						.title || '全部'
					console.log(arr)
					this.target = ''
				} else {
					this.searchPopupShow = false
					this.page = 1
					this.getCustomerList()
				}

			},
			resetTeam() {
				this.saveTeamOptions = [this.saveTeamOptions.shift()]
				this.teamOptions = this.saveTeamOptions[0]
				this.teamTitleArr = []
				this.teamTitle = ''
				this.teamId = ''
				this.options[1].title = '全部'

				// this.target = ''
			},
			selectOrderReset() {
				if (this.target === 'team') {
					this.resetTeam()
				} else {

					this.is_current_month = ''
					if (this.tabNum === 2) {
						
						this.options.forEach(v => {
							v.value = ''
							v.active = ''
							v.title = ''
						})
						console.log('this.options',this.options)
						this.resetTeam();
						try{[0,2,3,4,5].forEach(v=>{
							
							
							if(this.$refs['uDropdown' + v]){
								
								this.$refs['uDropdown' + v][0].initTitle()
								this.$refs['uDropdown' + v][0].close()
							}
						})
						this.options[0].list = [...this.hospitallist]
						this.options[2].list = [...this.personList]
						this.options[3].list = [...this.personList]
						this.options[5].list = [...this.personList2]
						this.options[4].list = [...this.personList1]
						
						this.$forceUpdate()
							
						}catch(e){
							console.log('err',err)
							//TODO handle the exception
						}
						
						
					}
					if (this.tabNum === 1) {
						this.guishuOptions.forEach(v => {
							v.value = ''
							v.active = ''
							v.title = '全部'
							if (v.type === 'input') {
								v.sbmi = 0
								v.ebmi = 0
							}
						})
					}

				}

			},
			actionClick(index) {
				console.log('info', this.info);
				if (index === 1) {
					uni.makePhoneCall({
						phoneNumber: this.info.mobile
					});
				} else {
					console.log(111)
					uni.navigateTo({
						url: `/pages/message/messageChat?avatar=${encodeURIComponent(this.info.avatar)}&nick=${this.info.realname ||this.info.nickname}&friend_user_id=${this.info.id + ''}`
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.noActiveStatus {
		background: #fff;

		border-radius: 0 38rpx 38rpx 0;
		color: #00B8A2 !important;
	}

	.noActiveGuishu {
		background: #fff;
		border-radius: 38rpx 0 0 38rpx;
		color: #00B8A2 !important;
	}

	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0.6;
		z-index: 100;
		top: 0rpx;
	}

	.container {
		min-height: 100vh;
		background: #f7f7f7;

		.box {
			background: #ffffff;
			border-radius: 24rpx;
			min-height: 288rpx;
			min-width: 686rpx;
			margin: 24rpx 32rpx;
			padding: 24rpx 16rpx;
			position: relative;

			.right {
				position: absolute;
				top: 0;
				right: 0;
				background: #f1fbfa;
				color: #00b8a2;
				border-radius: 0px 24rpx 0px 24rpx;
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

		.searchOrder {
			position: relative;
			z-index: 999;
			display: flex;
			// padding: 24rpx;
			font-size: 28rpx;
			justify-content: space-between;
			background-color: #ffffff;

			>view {
				// display: flex;
				// flex-direction: column;
				// justify-content: center;
				// margin: 8rpx 0;

				.typebox {
					flex: 1;
					height: 56rpx;
					background: #F3F3F3;
					border-radius: 24rpx 24rpx 24rpx 24rpx;
					display: flex;
					flex-wrap: wrap;
					align-items: center;

					.u-dropdown__content {
						// z-index: 1111 !important;
						// overflow:inherit !important;
					}

					.u-dropdown__menu {
						z-index: 9 !important;

						.u-dropdown__menu__item .u-dropdown__menu__item__arrow {
							u-icon {
								text {
									color: #00B8A2 !important;
								}
							}
						}

						.u-dropdown__menu__item__text {
							color: #B2B2B2 !important;
							font-size: 28rpx;
							width: 390rpx;
							text-align: center;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}

					}

					>view {
						background: #f3f3f3;
						border-radius: 36rpx;
						width: 136rpx;
						font-size: 28rpx;
						color: #2a2a2a;
						display: flex;
						justify-content: center;
						padding: 8rpx 0;
						align-items: center;
						margin: 16rpx;
					}

					.active {
						// background: #00b8a2;
						color: #00b8a2 !important;
					}
				}
			}
		}

		.searchOrderPopup {
			flex-direction: column;
			position: absolute;
			z-index: 111;
			width: 100vw;
			border-radius: 0 0 24rpx 24rpx;
			// padding: 0 56rpx 28rpx 56rpx;
		}
	}

	.red {
		color: #e34d59;
	}

	.green {
		color: #00b8a2 !important;
	}

	.yellow {
		color: #ffc76b;
	}

	.sign {
		border-radius: 50%;
		width: 18rpx;
		height: 18rpx;
		background-color: #00b8a2;
		margin-right: 12rpx;
	}
</style>
