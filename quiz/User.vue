<template>
  <div class="kf-user-container">
    <div class="kf-user-entrance">
      <quiz-management-main></quiz-management-main>
    </div>
  </div>
</template>

<script>
/** 
 * 主播发起入口页面
 */
import quizManagementMain from './components/quizManagementMain'
import socket from './mixins/socketClient';
export default {
  name: 'User',
  mixins:[socket],
  components: {
    quizManagementMain
  }
}
</script>
<style>
/* 打包需注释  Start*/
/* html,body{width: 100%; height: 100%;font-family: "Source Sans Pro", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;}
.clearfix::after{content: '';clear: both;display: block}
.fl-l{float: left;}
.fl-r{float: right;} */
/* 打包需注释  End*/
.kf-quiz-info-close {
  color: #999;
  font-size: 20px;
  margin-right: 10px;
  font-style: normal;
  cursor: pointer;
}
.kf-flex1{flex: 1;}
.kf-user-container *{
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.kf-user-container{
  color: #000;
}
.kf-user-container{
  display: none;
  .kf-user-entrance{
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.48);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
