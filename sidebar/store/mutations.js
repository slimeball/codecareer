import { RETSET_NAME, CHANGE_ACTIVITY_STATUS, ADD_SUBJECT, UPDATE_SUBJECT, SET_CURRENT_SUBJECT, SET_SUBJECT_TOTAL, INSERT_ANSWER_POEOPLE_NUM, SET_USER_ACTIVITY_STATUS, CLOSE_ACTIVITY, IS_SHOW_RANK, IS_HAVE_QUIZ, QUIZ_VISITOR_LIST, QUIZ_VISITOR_LIST_SOCKET, IS_SHOW_QUIZ_PAD,UPDATE_LIVE_TICKET } from "./mutation-types.js";

export default {
  //修改用户名
  [RETSET_NAME](state, user_nicename) {
    state.user = Object.assign({}, state.user, { user_nicename });
  },
  //--- 百万答题 Start
  //修改用户名
  [CHANGE_ACTIVITY_STATUS](state, newActivity) {
    state.activity = {
      ...state.activity,
      ...newActivity
    };
  },

  //新增题目
  [ADD_SUBJECT](state, newSubject) {
    state.subjects.push(newSubject);
  },

  [SET_CURRENT_SUBJECT](state, newSubject) {
    state.currentSubject = newSubject;
  },

  [SET_SUBJECT_TOTAL](state, num) {
    state.subjectTotal = num;
  },

  [SET_USER_ACTIVITY_STATUS](state, newUserActivityState) {
    state.userActivityStatus = newUserActivityState;
  },

  // 修改题目
  [UPDATE_SUBJECT](state, newSubject) {
    let subjectsCopy = [...state.subjects];
    subjectsCopy.forEach((subject, index) => {
      if (subject.question == newSubject.question) {
        subjectsCopy[index] = newSubject;
      }
    });
    state.subjects = subjectsCopy;
  },

  [INSERT_ANSWER_POEOPLE_NUM](state, arr) {
    let currentSubjectCopy = { ...state.currentSubject };
    currentSubjectCopy.content.answer.forEach((a, index) => {
      arr.forEach(v => {
        if (v.answer == a.text) {
          a.num = v.num;
        }
      });
    });
    state.currentSubject = currentSubjectCopy;
  },
  // 关闭按钮
  [CLOSE_ACTIVITY](state) {
    if (state.isShowActivity) {
      state.isShowActivity = false;
    } else {
      state.isShowActivity = true;
    }
  },
  // 是否显示 排行榜
  [IS_SHOW_RANK](state) {
    if (state.isShowRank) {
      state.isShowRank = false;
    } else {
      state.isShowRank = true;
    }
  },
  //--- 百万答题End
  //--- 竞猜活动 Start
  [IS_HAVE_QUIZ](state,bool){
    state.isHaveQuiz = bool;
  },
  // 更新参与活动列表
  [QUIZ_VISITOR_LIST](state, list){
    state.quizVisitorList = list;
  },
  // socket获取到的活动列表
  [QUIZ_VISITOR_LIST_SOCKET](state, obj){
    state.quizVisitorDataSocket = obj;
  },
  // 切换竞猜板
  [IS_SHOW_QUIZ_PAD](state,bool){
    state.isShowQuizPad = bool;
  },
  // 更新直播券
  [UPDATE_LIVE_TICKET](state,num){
    state.quizLiveTicket = num;
  }
  //--- 竞猜活动 End
};
