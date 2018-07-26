<template>
  <div id="answerEntrance" class="answer-entrance">
      <div id="answerEntranceContainer" class="answer-entrance-container" v-on:click="switchActivity()">
        <div class="activity-logo">
          <img :src="activity.icon" alt="百万答题" onerror="this.src='/public/images/activity/activity_logo.png'"/>
        </div>
        <div class="activity-status activity-status-1 activity-countdown" v-if="(activity.status == 1 || activity.status == 2)">
          <count-down v-on:start_callback="countDownS_cb()" v-on:end_callback="countDownE_cb()" :currentTime="parseInt(activity.server_time)" :startTime="parseInt(activity.start_at)"
          :endTime="1481450115000000000" :tipText="'距离开始文字1'" :tipTextEnd="'距离结束文字1'" :endText="'结束自定义文字2'" :dayTxt="'天'"
          :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''"></count-down>
        </div>

        <div v-if="(activity.status != 1 && activity.status != 2)" :class="['activity-status-' + activity.status, 'activity-status']">{{activity.status | transfromStatus(room.userIsAnchor )}}</div>
      </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
// import ActivitySocket from './components/ActivitySocket'
import CountDown from "./Countdown";
import utilityServertime from "../../utils/utilityServertime";
import { CLOSE_ACTIVITY } from "../../store/mutation-types";
export default {
  replace: false,
  name: "maentrance",
  data() {
    return {
      step: 0
    };
  },
  filters: {
    transfromStatus: function(status, userIsAnchor) {
      let text = "";
      switch (parseInt(status)) {
        case 0:
          text = "未发布";
          break;
        // case 1:
        case 2:
        case 8:
          if (userIsAnchor) {
            text = "开始答题";
          } else {
            text = "即将开始";
          }
          break;
        case 3:
        case 9:
          text = "答题中";
          break;
        case 4:
        case 6:
          text = "已结束";
          break;
        case 7:
          text = "答题结束";
          break;
          break;
        default:
          break;
      }
      return text;
    }
  },
  components: {
    // ActivitySocket,
    CountDown
  },
  computed: {
    ...mapState(["activity", "room"])
  },
  beforeCreate() {
    utilityServertime.servertimeRequest();
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations(["CLOSE_ACTIVITY"]),
    countDownS_cb: function() {},
    countDownE_cb: function() {
      this.step = 1;
    },
    switchActivity() {
      this.CLOSE_ACTIVITY();
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-logo {
  width: 70px;
  height: 70px;
  margin-bottom: 3px;
  img {
    width: 100%;
    height: 100%;
    float: left;
  }
}

.activity-status {
  min-width: 70px;
  height: 20px;
  border-radius: 20px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  background: #9966ff;
}

.activity-status-1,
.activity-status-2,
.activity-status-7 {
  background: #9966ff;
}

.activity-status-3 {
  background: #41cd03;
}

.activity-status-4,
.activity-status-6 {
  background: #9e9e9e;
}
.activity-countdown {
  padding: 0 5px;
}
</style>
