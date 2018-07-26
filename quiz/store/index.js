import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
Vue.use(Vuex)

const state = {
  // quizTheme:'',// 竞猜主题
  _DATA: window._DATA, // 直播站_DATA对象
  //--- 主播相关
  quizListVisible: false, // 是否显示管理列表
  quizNewVisible: false, // 是否显示新建
  quizEditVisible: false, // 是否显示编辑
  reSetTab: 0, // 标签索引
  curQuiz: 0, // 编辑的索引
  //--- 用户
  isHasQuiz: false, // 是否有活动
  quizVisitorList: [], // 竞猜列表
  quizVisitorDataSocket: [] // socket更新的竞猜数据
}
// 把state开放给window对象，用以直播间联动
window.quizState = state;
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
