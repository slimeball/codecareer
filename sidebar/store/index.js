import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex);

// 这里对游客进行临时处理
if (!_DATA.user) {
  _DATA.user = {
    "id": "temp_5a939a164bc51",
    "avatar": "/public/home/images/icon-avatar.png",
    "user_nicename": "游客",
    "token": "eabd9dafe8060018e45d182d999952d4",
    "logged": 0,
    "issuper": 0,
    "iswhite": 0,
    "sex": 0,
    "signature": "",
    "consumption": 0,
    "votestotal": 0,
    "province": "",
    "city": "",
    "level": 0
  }
} else {
  _DATA.user.logged = 1;
}

/**
 * 获取房间信息 
 * 去掉单人多人判断 noah.g
 * 修改_DATA.live.uid为_DATA.anchor.id
 */
let getRoom = () => {
  var room = {};
  room.typeId = 0;
  room.typeName = 'single'; // 单直播间： 'single'  多直播间： 'multi'
  room.id = _DATA.anchor.id; //_DATA.live.uid; // 房间的id
  room.userIsAnchor = (_DATA.user.id == _DATA.anchor.id); // 当前用户是否是此房间的主播
  room.userIsLive = room.userIsAnchor || (_DATA.live.islive == 1); // 当前用户是否在直播
  room.chat_num = parseInt(_DATA.live.chat_num); // 聊天的字数
  room.chat_frequency = parseInt(_DATA.live.chat_frequency); // 聊天的频率
  room.isLive = (_DATA.live.islive == 1); // 当前房间是否在直播
  room.ispc = (_DATA.live.ispc == 1);
  room.streamUrl = _DATA.live.pull;

  room.userIsSuper = (_DATA.user && _DATA.user.issuper && _DATA.user.issuper == 1); //用户是否是超管
  room.userIsLogged = (_DATA.user && _DATA.user.logged == 1);
  return room;
}

// 0-活动未发布,1-活动发布,2-活动准备(倒计时),3-活动进行中（先进来的用户）,4-活动结束,5-活动删除 6:排行版  7： 答题结束 8:活动准备（开始答题）  9:活动进行中（后进来的用户）
if (_DATA.activity.status == 3) {
  _DATA.activity.status = 9;
}

const state = {
  // userInfo: _DATA.user, //用户信息
  // gifts: _DATA.gift, //礼物列表
  _DATA: window._DATA, // 直播站_DATA对象
  config: _DATA.config,
  getConfigPub: _DATA.getConfigPub,
  anchor: _DATA.anchor,
  live: _DATA.live,
  gift: _DATA.gift,
  user: _DATA.user,
  giftPkInfo: _DATA.giftPkInfo,
  grabBenchInfo: _DATA.grabBenchInfo,
  guardInfo: _DATA.guardInfo,
  vests: _DATA.vests,
  thumb: _DATA.thumb,
  obs: _DATA.obs,
  push: _DATA.push,
  enterChat: _DATA.enterChat,
  room: getRoom(),
  userActivityStatus: -1, //字符串,-1:出局；1，可继续答题 0：未报名
  //-- 百万答题相关
  activity: _DATA.activity,
  subjects: [],
  currentSubject: {},
  subjectTotal: 0,
  isShowActivity: false, // 是否显示答题区域
  isShowRank: false,
  //-- 竞猜相关
  isHaveQuiz: false, // 是否有竞猜
  isShowQuizPad: false, // 是否显示竞猜板
  quizVisitorList: [], // 竞猜列表
  quizVisitorDataSocket: [], // socket更新的竞猜数据
  quizLiveTicket: 0 // 直播券
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
