const state = {
	
  list: [
	  {
	    pagePath: '/pages/tabbar/diary',
	    "iconPath": "/static/tabbarIcon/tab/tab_icon_news_nor@2x.png",
	    "selectedIconPath": "/static/tabbarIcon/tab/tab_icon_news_sel@2x.png",
	    text: '发现'
	  },
    {
      pagePath: '/pages/tabbar/shoppingMall',
      "iconPath": "/static/tabbarIcon/tab/tab_icon_shop_nor@2x.png",
      "selectedIconPath": "/static/tabbarIcon/tab/tab_icon_shop_sel@2x.png",
      text: '商城',
	  
	  isDot: false,
    },
	{
		pagePath: '/pages/tabbar/record',
		iconPath: '/static/tabbarIcon/tab/diary.png',
		selectedIconPath: '/static/tabbarIcon/tab/diary.png',
		text: '',
		
		isDot: false,
	},
    
	{
	  pagePath: '/pages/tabbar/projects',
	  "iconPath": "/static/tabbarIcon/tab/tab_icon_diary_nor@2x.png",
	  "selectedIconPath": "/static/tabbarIcon/tab/tab_icon_diary_sel@2x.png",
	  text: '日记'
	},
    {
      pagePath: '/pages/tabbar/mine',
     "iconPath": "/static/tabbarIcon/tab/tab_icon_home_nor@2x.png",
     "selectedIconPath": "/static/tabbarIcon/tab/tab_icon_homepage_sel@2x.png",
      text: '我的'
    }
  ]
}
const mutations = {
	updateList(state,{index,data}={}){
		state.list[index].text = data
	}
}
export default {
  state,
  mutations
}
