import resource from '../config/resource'
// get 拼接接口参数及传入参数
let concatobj = (a,b)=>{
  return Object.assign(a,b);
}
/**
 * 主播端-活动管理API
 * quizManagementList.vue
 */
export const quizManageList = (p) => resource('get','/index.php', concatobj({g:'Api',m:'ActivityComGuess',a:'index'},p));

/**
 * 主播端-创建活动接口
 * quizManagementNew.vue
 */
export const quizCreate = (p) => resource('post','/index.php?g=Api&m=ActivityComGuess&a=create',p);

/**
 * 获取单个活动API
 * quizManagementEdit.vue
 */
export const quizOnce = (p) => resource('post','/index.php?g=Api&m=ActivityComGuess&a=getInfo',p);

/**
 * 主播端-当场公布结果
 * quizManagementEdit.vue
 */
export const quizAnnounce = (p) => resource('post','/index.php?g=Api&m=ActivityComGuess&a=announce',p);

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
