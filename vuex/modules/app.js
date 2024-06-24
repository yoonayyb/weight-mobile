const state = {
  currentUserId: '', //营养师端当前点击了客户的id
  commentUnreadTotal: '' //话题帖子评论未读总数
}
const getters = {
  currentUserId: (state) => state.currentUserId,
  commentUnreadTotal: (state) => state.commentUnreadTotal
}
const mutations = {
  setUserId(state, id) {
    state.currentUserId = id
  },
  setCommentUnreadTotal(state, total) {
    state.commentUnreadTotal = total
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions,
  getters
}
