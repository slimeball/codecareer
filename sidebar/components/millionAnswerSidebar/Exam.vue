<template>
  <section class="exam-box">
    <div class="exam-left" v-show="!isShowRank">
      <div class="exam-left__cont">
        <div class="exam-left__top_user pull-left">
          <img src="../../images/activity/exam_people.png" />
          <span>{{peopleNum}}</span>
        </div>
        <!-- 用户状态 -->

        <div class="exam-left__user-status exam-left__user_answering" v-if="userActivityStatus == 1 && !room.userIsAnchor">答题中</div>
        <div class="exam-left__user-status exam-left__user_out" v-if="userActivityStatus == -1 && !room.userIsAnchor">已出局</div>
        <div class="exam-left__user-status exam-left__user_out" v-if="userActivityStatus == 0 && !room.userIsAnchor">未报名</div>
        

        
        <div class="exam-left__main">

          <!-- 顶部 -->
          <div class="exam-left__top">
            <div class="exam-clock-wrap">
              <div class="exam-left__user-status exam-left__user_answering css-out-rank" v-on:click="showRank()" v-if="!room.userIsAnchor">排行榜</div>
              <div class="exam-clock">
                <number-countdown :answerStep="answerStep" :leftseconds="parseInt(activity.answer_countdown_time)" v-on:onComplete="onComplete" v-on:onTick="onTick" />
              </div>
            </div>
            <div class="pull-right" v-if="room.userIsAnchor">
              <div class="exam-left__top_opt" style="background-color: #FF3666;" v-show="answerStep == 0">
                <number-left :answerStep="answerStep" :leftseconds="parseInt(activity.answer_countdown_time)"  />
              </div>
              <div class="exam-left__top_opt" @click="publishResult" v-show="answerStep == 1">公布结果</div>
              <div class="exam-left__top_opt" @click="_goNext" v-show="answerStep == 2">下一题</div>
              <div class="exam-left__top_opt" @click="publishRank" v-show="answerStep == 3">公布排行榜</div>
            </div>
            <div v-else class="pull-right">
              <div class="exam-left__top_opt css-coutout" style="background-color: #FF3666;"  v-show="answerStep == 0 || answerStep == 1">
                <number-left :answerStep="answerStep" :leftseconds="parseInt(activity.answer_countdown_time)"  />
              </div>
              <div class="exam-left__top_opt css-coutout" v-show="answerStep == 3">答题结束</div>
            </div>
          </div>
          <!-- 题目 -->
          <subject :answerStep="answerStep" :answerResult="answerResult" />
        </div>
      </div>
    </div>

    <div class="exam-right" v-show="isShowRank">
      <Rank :answerStep="answerStep" />
    </div>
    <close-btn></close-btn>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { IS_SHOW_RANK } from "../../store/mutation-types";
import {
  checkChannelShutUp,
  checkUserShutUp,
  getAnswerTotalNum,
  getPlayerStatus
} from "../../utils/getData";
import NumberCountdown from "./NumberCountdown";
import NumberLeft from "./NumberLeft";
import Subject from "./Subject";
import Rank from "./Rank";
import Event from "../../utils/Event";
import newSubject from "../../mixins/newSubject";
import activityPeople from "../../mixins/activityPeople";
import closeBtn from "./closeBtn";
export default {
  data() {
    return {
      step: 0,
      fire: 0,
      tiping: {
        text: "倒计时进行中",
        color: "#fff"
      },
      tipend: {
        text: "倒计时结束",
        color: "#fff"
      },
      isCountDownEnd: false,
      answerStep: 0, //0:答题中 1：停止答题 2：公布答案中
      // subjectInfo: this.subjects[this.subjects.length -1]
      // subjectInfo: {},
      // userStatus: 1, //1：可以答题 0：已出局
      answerResult: {},
      isAnswerEnd: false,
      isLoading: false
    };
  },
  mounted() {
    this.getPeopleNum();
    this.getPlayerStatus();
  },
  created() {
    this.$bus.on(Event.ACTIVITY_RESULT_EVENT, this.getPublishResult);
    if (this.activity.status == 9) {
      this.startAnswer(
        {
          ct: this.activity.current_question
        },
        this.activity.status
      );
    }
  },
  beforeDestroy() {
    this.$bus.off(Event.ACTIVITY_RESULT_EVENT, this.getPublishResult);
  },
  components: {
    // CanvasCountdown
    NumberLeft,
    NumberCountdown,
    Subject,
    Rank,
    closeBtn
  },
  mixins: [newSubject, activityPeople],
  computed: {
    ...mapState([
      "user",
      "room",
      "activity",
      "currentSubject",
      "subjectTotal",
      "userActivityStatus",
      "isShowRank"
    ])
  },
  methods: {
    ...mapMutations(["IS_SHOW_RANK"]),
    showRank() {
      this.IS_SHOW_RANK();
    },
    _goNext() {
      if (this.isLoading) return;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
      this.answerResult = {};
      this.getPeopleNum();
      this.goNext();
    },
    // fireCD() {
    //   // 配置参数（更多配置如下表）
    //   this.tiping = {
    //     text: '',
    //     color: '#fff'
    //   }
    //   this.tipend = {
    //     text: '时间到',
    //     color: '#fff'
    //   }

    //   // 启动倒计时(效果如上图所示)
    //   this.fire++
    // },
    onEnd() {
      // console.log('倒计时结束的回调函数')
    },
    onComplete() {
      // this.isCountDownEnd = true;
      this.answerStep = 1;
    },
    onTick(leftSeconds) {},
    async publishResult() {
      if (this.isLoading) return;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);

      if (this.answerStep == 1) {
        try {
          //获取答案
          let res = await getAnswerTotalNum(
            this.activity.id,
            this.room.id,
            this.user.id
          );
          if (res.code == 200) {
            this.$bus.emit(Event.EMIT_EVENT, {
              _method_: "result",
              action: "1020",
              ct: res.data,
              msgtype: "0"
            });
          } else {
            alert(res.message);
          }
        } catch (e) {}
      }
    },
    getPublishResult(msg) {
      if (msg._method_ == "result") {
        this.answerResult = msg.ct;
        this.answerStep = 2; //公布结果
        this.INSERT_ANSWER_POEOPLE_NUM(msg.ct.contents);
        this.getPlayerStatus();
        this.getPeopleNum();

        if (this.currentSubject.id == this.subjectTotal) {
          setTimeout(() => {
            this.answerStep = 3; //公布排行榜
          }, 1000);
          this.CHANGE_ACTIVITY_STATUS({
            status: 7
          });
        }
      } else if (msg._method_ == "end") {
        this.CHANGE_ACTIVITY_STATUS({
          status: 6
        });
      }
    },
    publishRank() {
      this.$bus.emit(Event.EMIT_EVENT, {
        _method_: "end",
        action: "1020",
        ct: {},
        msgtype: "0"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pull-left {
  float: left;
}

.pull-right {
  float: right;
}

.exam-box {
  width: 100%;
  height: 100%;
  .exam-left {
    width: 100%;
    height: 100%;
    box-sizing: border-box; // overflow-y: auto;
    .css-out-rank {
      position: absolute;
      top: 28px;
      left: 10px;
      cursor: pointer;
    }
    &__user-status {
      width: 70px;
      height: 20px;
      line-height: 20px;
      border-radius: 20px;
      text-align: center;
      color: #ffffff;
      font-size: 14px; // background: #3fce00;
      margin: 0 auto;
      position: relative;
      top: 14px;
      z-index: 2;
    }

    &__user_answering {
      background-color: #3fce00;
    }

    &__user_out {
      background-color: #ff3366;
    }

    &__cont {
      background-color: #fff;
      border-radius: 10px;
      width: 100%;
      height: 100%;
      position: relative;
    }

    &__main {
      position: absolute;
      top: 30px;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__top {
      padding: 10px;
      height: 70px;
    }

    &__top_user {
      position: relative;
      top: 14px;
      left: 10px;
      color: #999;
      img {
        float: left;
        margin-right: 3px;
      }
    }

    &__top_opt {
      // float: right;
      background-color: #41cd03;
      width: 70px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      color: #ffffff; // box-shadow: rgba(102,0,0,0.35);
      text-align: center;
      cursor: pointer;
      position: relative;
      top: 13px;
      z-index: 10;
      &.css-coutout{
        position: absolute;
        top: 38px;
        right: 10px;
      }
    }
  }
  .exam-right {
    width: 100%;
    height: 100%;
    float: left;
    background-color: #fff;
    border-radius: 10px;
  }

  .exam-clock-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
  }
  .exam-clock {
    width: 56px;
    height: 56px;
    line-height: 50px;
    text-align: center;
    border: solid 3px #ff3366;
    border-radius: 56px;
    margin: 10px auto 0; // .exam-timeup {
    //     font-size: 16px;
    // }
    // .exam-timeing {
    //     font-size: 30px;
    // }
  }
}
</style>
