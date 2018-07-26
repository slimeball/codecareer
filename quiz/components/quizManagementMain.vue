<template>
  <div class="kf-quiz-main">
    <quiz-management-tabs></quiz-management-tabs>
    <quiz-management-list v-if="quizListVisible"></quiz-management-list>
    <quiz-management-new v-if="quizNewVisible"></quiz-management-new>
    <quiz-management-edit v-if="quizEditVisible"></quiz-management-edit>
    <i class="c-close" v-on:click="closeManage()">&#10006;</i>
  </div>
</template>

<script>
/**
 * 主播管理主页面
 */
import { mapState, mapMutations } from 'vuex'
import { QUIZ_LIST_VISIBLE } from '../store/mutation-types'
import quizManagementTabs from './quizManagementTabs'
import quizManagementList from './quizManagementList'
import quizManagementNew from './quizManagementNew'
import quizManagementEdit from './quizManagementEdit'
export default {
  name: 'quizManagementMain',
  components: {
    quizManagementTabs,
    quizManagementList,
    quizManagementNew,
    quizManagementEdit
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['quizListVisible', 'quizNewVisible', 'quizEditVisible','reSetTab'])
  },
  methods: {
    ...mapMutations(['QUIZ_LIST_VISIBLE','RESET_TAB']),
    closeManage(){
      this.RESET_TAB(true);
      this.QUIZ_LIST_VISIBLE();
      setTimeout(function(){
        document.querySelector('.kf-user-container').style.display = 'none';
      },50)
    }
  }
}
</script>

<style lang="scss" scoped>
  .kf-quiz-main{
    position: relative;
    width: 830px;
    height: 540px;
    background-color: #fff;
    border-radius: 13px;
    padding: 24px 48px;
    .c-close{
      position: absolute;
      top: 10px;
      right: 17px;
      font-style: normal;
      color: #a4a4a4;
      font-size: 20px;
      cursor: pointer;
    }
  }
</style>
