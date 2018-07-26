import fetch from '../config/fetch'
// 使用vue-resource封装可以直接传入对象参数 noah.g Start
import resource from '../config/resource'
// get 拼接接口参数及传入参数
let concatobj = (a,b)=>{
  return Object.assign(a,b);
}
// End 
/**
 * 判断频道是否禁言
 */
export const checkChannelShutUp = (liveid, live_type) => fetch(
  // '/index.php?g=home&m=spend&a=',
  '/index.php?g=Home&m=Show&a=checkChannelShupUp', {
    // liveid,
    // live_type
    showid: liveid
  },
  'POST'
);

/**
 * 判断用户是否被禁言
 */
export const checkUserShutUp = (liveid, live_type) => fetch(
  // '/index.php?g=home&m=spend&a=isShutUp',
  '/index.php?g=home&m=Spend&a=isShutUp', {
    // liveid,
    // live_type
    showid: liveid
  },
  'POST'
);

/**
 * 获取IM连接的必要信息
 */
export const setNodeInfo = (liveid, live_type, stream) => fetch(
  // '/index.php?g=home&m=show&a=setNodeInfo',
  `/index.php?g=home&m=show&a=setNodeInfo&showid=${liveid}&stream=${stream}`, {
    // liveid,
    // live_type,
    // stream
  },
  'GET'
);

/**
 * 修改用户昵称
 */
export const editUserNiceName = (user_nicename) => fetch(
  // '/index.php?m=Personal&a=edit_modify',
  `/index.php/Personal/edit_name/name/${user_nicename}/`, {
    // user_nicename
  },
  // 'POST'
  'GET'
);

/**
 * 抢红包
 */
export const robRedPackets = (params) => fetch(
  '/api/public/index.php?service=Live.robRedPackets',
  params,
  'POST'
);

//**礼物
export let checkSendGift = (touid, giftid, showid, giftGroupNum, sendType) => fetch(
  '/index.php?g=home&m=Spend&a=sendGift', {
    touid: touid,
    giftid: giftid,
    showid: showid,
    giftGroupNum: giftGroupNum,
    sendType: sendType
    // debug:  1
  },
  'POST'
);

/**
 * 百万答题 Start
 */
export const signUpActivity = (activity_id) => fetch(
  "./index.php?g=Api&m=Activity&a=enroll", {
    activity_id
    // uid: 580 //todo test , 待删除
  },
  'POST'
);

export const isSignUpActivity = (activity_id, live_id) => fetch(
  "./index.php?g=Api&m=Activity&a=isEnroll", {
    activity_id,
    live_id
    // uid: 580  //todo test , 待删除
  },
  'POST'
);

/**
 * 获取活动的详情
 */
export const getActivity = (activity_id, live_id, live_token, uid) => fetch(
  "./index.php?g=Api&m=Activity&a=getCurrentQuestion", {
    user_id
  },
  'POST'
);

/**
 * 取当前问题及备选答案API
 */
export const getCurrentQuestion = (activity_id, live_id, uid) => fetch(
  "./index.php?g=Api&m=Activity&a=getCurrentQuestion", {
    activity_id,
    live_id,
    uid
  },
  'POST'
);

export const getRightAnswerNum = (activity_id, live_id) => fetch(
  "./index.php?g=Api&m=Activity&a=getRightAnswerNum", {
    activity_id,
    live_id
  },
  'POST'
);

export const getAnswerTotalNum = (activity_id, live_id, uid) => fetch(
  "./index.php?g=Api&m=Activity&a=answerTotalNum", {
    activity_id,
    live_id,
    uid
  },
  'POST'
);

/**
 * 用户提交答案并验证返回结果API
 */
export const pushVerifyAnswer = (activity_id, live_id, answer) => fetch(
  "./index.php?g=Api&m=Activity&a=pushVerifyAnswer", {
    activity_id,
    live_id,
    answer
  },
  'POST'
);

export const getPlayerStatus = (activity_id, live_id) => fetch(
  "./index.php?g=Api&m=Activity&a=getPlayerStatus", {
    activity_id,
    live_id
  },
  'POST'
);

// {"code":400,"message":"您已参与过","data":[]}

/**
 * 抢答排行榜
 */
export const getPrizeList = (activity_id, page, limit) => fetch(
  // "./index.php?g=api&m=activity&a=getPrizeList",
  "./index.php", {
    g: 'api',
    m: 'activity',
    a: 'getPrizeList',
    activity_id,
    page,
    limit
  },
  'GET'
);

export const getExtPrizeList = (activity_id, page, limit) => fetch(
  "./index.php", {
    g: 'api',
    m: 'activity',
    a: 'getExtPrizeList',
    activity_id,
    page,
    limit
  },
  'GET'
);

export const setActivityStatus = (activity_id, live_id, uid, status) => fetch(
  "./index.php?g=Api&m=Activity&a=setActivityStatus", {
    activity_id,
    live_id,
    uid,
    status
  },
  'POST'
);

export const getServerTimeAjax = () => fetch(
  "./index.php?g=Api&m=Activity&a=getServerTime", {},
  'GET'
);
// 百万答题 End

// 竞猜 Stard

/**
 * 公用-直播间调活动列表
 * quizVisitorPad.vue
 */

export const quizGameList = (p) => resource('post','/index.php?g=Api&m=ActivityComGuess&a=getListInLiveRoom',p);

/**
 * 用户端-投注
 */
export const quziBetIn = (p) => resource('post','/index.php?g=Api&m=ActivityComGuess&a=regBet',p);

/**
 * 公用-直播间调获取活动规则
 */
export const quzigetRule = (p) => resource('get','/index.php?g=Api&m=ActivityComGuess&a=getRule',p);

// 竞猜 End