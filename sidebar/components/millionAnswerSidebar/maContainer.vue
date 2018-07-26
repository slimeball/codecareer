<template>
  <div id="answerBox" class="answer-box" v-show="isShowActivity">
    <div id="answerContainer" class="answer-container">
      <div class="answer-bg">
        <!-- <activity-socket></activity-socket> -->
        <prepare v-if="activity.status == 1 || activity.status == 2 || activity.status == 8"/>
        <exam v-if="activity.status == 3 || activity.status == 7 || activity.status == 9" />
        <race-result v-if="activity.status == 6 || activity.status == 4" />
    <!-- 0-活动未发布,1-活动发布,2-活动准备(倒计时),3-活动进行中（先进来的用户）,4-活动结束,5-活动删除    6:排行版  7： 答题结束 8:活动准备（开始答题）  9:活动进行中（后进来的用户） -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import prepare from "./Prepare";
import exam from "./Exam";
import RaceResult from "./RaceResult";
// import ActivitySocket from './ActivitySocket'
// import socketConnect from '../socketConnect'

export default {
  replace: true,
  name: "macontainer",
  data() {
    return {
      showAlert: false,
      alertText: null
    };
  },
  components: {
    prepare,
    exam,
    RaceResult
    // ActivitySocket
    // socketConnect
  },
  computed: {
    ...mapState(["activity", "isShowActivity"])
  },
  created() {
    // this.$bus.on(Event.SHOW_ALERT, this.showAlertFunc);
  },
  mounted() {
    let outerdomH = document.querySelector("#screenContainer").clientHeight;
    document.querySelector("#answerContainer").style.height =
      outerdomH + 2 + "px";
  },
  beforeDestroy() {
    // this.$bus.off(Event.SHOW_ALERT, this.showAlertFunc);
  },
  methods: {}
};
</script>

<style lang="scss">
@import "../../style/common";
.answer-box {
  position: absolute;
  width: 100%;
  z-index: 10;
}
.answer-bg {
  width: 100%;
  height: 100%;
  // background:  url('../../images/activity/asnwer_bg.jpg');
  background-size: 100% 100%;
  position: relative;
}
</style>
