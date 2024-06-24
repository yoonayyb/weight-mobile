const state = {
  tabNum: null,
}
const getters = {
  tabNum: (state) => state.tabNum,
}
const mutations = {
  // 保存营养圈当前选择的tab
  saveTabNum(state, data) {
    state.tabNum = data
  },
}
const actions = {}

export default {
  state,
  mutations,
  actions,
  getters,
}
