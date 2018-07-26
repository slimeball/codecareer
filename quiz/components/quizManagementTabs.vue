<template>
  <div class="kf-quiz-tabs clearfix">
    <div class="tab" :class="{cur: reSetTab === index}" v-for="(tab, index) in tabList" :key="index" v-on:click="switchTab(index)">{{tab}}</div>
  </div>
</template>

<script>
/**
 * 头部切换选项卡组件
 */
import { mapState, mapMutations } from 'vuex'
import { QUIZ_LIST_VISIBLE, QUIZ_NEW_VISIBLE, QUIZ_EDIT_VISIBLE,RESET_TAB } from '../store/mutation-types'
export default {
  name: 'quizManagementTabs',
  data () {
    return {
      tabList: ['活动管理', '新建活动']
    }
  },
  computed: {
    ...mapState(['quizListVisible', 'quizNewVisible', 'quizEditVisible','reSetTab'])
  },
  methods: {
    ...mapMutations(['QUIZ_LIST_VISIBLE', 'QUIZ_NEW_VISIBLE', 'QUIZ_EDIT_VISIBLE','RESET_TAB']),
    switchTab (index) {
      this.RESET_TAB(index);
      if (index === 0) {
        this.showList();
      } else {
        this.showNew();
      }
    },
    showList () {
      this.QUIZ_LIST_VISIBLE();
    },
    showNew () {
      this.QUIZ_NEW_VISIBLE();
    }
    // showEdit () {
    //   this.QUIZ_EDIT_VISIBLE()
    // }
  }
}
</script>

<style lang="scss" scoped>
.kf-quiz-tabs{
  font-size: 18px;
  border-bottom: 2px solid #eee;
  .tab{
    float: left;
    padding: 10px;
    margin-right: 20px;
    cursor: pointer;
    &.cur{
      color: #cca352;
      border-bottom: 2px solid #cca352;
      margin-bottom: -2px;
    }
  }
}
</style>
