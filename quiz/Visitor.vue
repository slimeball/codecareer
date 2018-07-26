<template>
  <div class="kf-visitor-container" v-if="isHasQuiz">
    <div class="kf-visitor-entrance">
      <!-- <quiz-visitor-info></quiz-visitor-info> -->
      <quiz-visitor-pad></quiz-visitor-pad>
    </div>
  </div>
</template>

<script>
/**
 * 用户参与入口页面
 */
import { mapState } from 'vuex'
// import quizVisitorInfo from './components/quizVisitorInfo'
import quizVisitorPad from './components/quizVisitorPad'
import socket from './mixins/socketClient';

export default {
  name: 'Visitor',
  // mixins:[socket],
  components: {
    // quizVisitorInfo,
    quizVisitorPad
  },
  computed: {
    ...mapState(['isHasQuiz'])
  }
}
</script>
<style>
.kf-visitor-container *{
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.kf-visitor-container{
  display: none;
  color: #000;
  .kf-visitor-entrance{
    width: 100%;
    height: 180px;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #ddd;
    background-color: #fff;
  }
}
</style>
