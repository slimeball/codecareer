import { QUIZ_LIST_VISIBLE, QUIZ_NEW_VISIBLE, QUIZ_EDIT_VISIBLE, RESET_TAB,QUIZ_INDEX,QUIZ_VISITOR_LIST,QUIZ_VISITOR_LIST_SOCKET } from './mutation-types'

export default {
  // 是否显示管理列表
  [QUIZ_LIST_VISIBLE] (state) {
    if (!state.quizListVisible) {
      state.quizListVisible = true;
      state.quizNewVisible = false;
      state.quizEditVisible = false;
    }
  },
  // 是否显示新建
  [QUIZ_NEW_VISIBLE] (state) {
    if (!state.quizNewVisible) {
      state.quizNewVisible = true;
      state.quizListVisible = false;
      state.quizEditVisible = false;
    }
  },
  // 是否显示编辑
  [QUIZ_EDIT_VISIBLE] (state) {
    if (!state.quizEditVisible) {
      state.quizEditVisible = true;
      state.quizNewVisible = false;
      state.quizListVisible = false;
    }
  },
  // 编辑的索引
  [QUIZ_INDEX] (state,index) {
    state.curQuiz = index;
  },
  // 关闭窗口重置标签
  // isreset 是 true就是重置 不是就赋值
  [RESET_TAB] (state, isreset) {
    if (isreset === true) {
      state.reSetTab = 0;
    } else {
      state.reSetTab = isreset;
    }
  },
  // 更新参与活动列表
  [QUIZ_VISITOR_LIST](state, list){
    state.quizVisitorList = list;
  },
  // socket获取到的活动列表
  [QUIZ_VISITOR_LIST_SOCKET](state, obj){
    state.quizVisitorDataSocket = obj;
  }
}
