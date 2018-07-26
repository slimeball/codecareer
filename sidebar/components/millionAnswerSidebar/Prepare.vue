<template>
  <section class="answer-prepare" v-show="isShowActivity">
    <div class="answer-prepare__inner">
      <div class="css-activity-title-container">
        <p class="css-activity-name">百万答题</p>
        <close-btn></close-btn>
      </div> 
      <div class="answer-prepare__top d-flex">
        <div class="answer-prepare__top_left col">
          <p class="text1">距离开场</p>
          <p class="text2" v-if="step == 0">
            <count-down v-on:start_callback="countDownS_cb()" v-on:end_callback="countDownE_cb()" :currentTime="parseInt(activity.server_time)" :startTime="parseInt(activity.start_at)"
              :endTime="1481450115000000000" :tipText="'距离开始文字1'" :tipTextEnd="'距离结束文字1'" :endText="'结束自定义文字2'" :dayTxt="'天'"
              :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''"></count-down>
          </p>
          <p class="text3" v-if="step == 1 && room.userIsAnchor">时间到</p>
          <p class="text3" v-if="step == 1 && !room.userIsAnchor">即将开始</p>
        </div>
        <div class="answer-prepare__top_right col">
          <p class="text1">奖金</p>
          <p class="text2">
            <span>{{activity.base_bonus_amount}}</span>
            <span>元</span>
          </p>
        </div>
      </div>
      <div class="answer-prepare__middle" v-if="room.userIsAnchor">
        <div>
          <div class="answer-prepare__middle_people">
              <span class="people-num">参与人数：{{peopleNum}}人</span>
              <span class="refresh-btn" @click="getPeopleNum">刷新</span>
            </div>
          <button v-if="step == 0" class="answer-prepare__middle_btn3">开始答题</button>
          <button  v-if="step == 1" class="answer-prepare__middle_btn1" @click="_goNext">开始答题</button>
        </div>
      </div>
      <div class="answer-prepare__middle" v-else>
        <!-- <div class="answer-prepare__middle_tip">您尚未有资格参与答题活动，请立即充值</div> -->
        <div class="answer-prepare__middle_tip" v-if="errMsg">{{errMsg}}</div>
        <div v-if="step == 0">
          <button v-bind:class="{ 'answer-prepare__middle_btn2': signUpStatus == 0, 'answer-prepare__middle_btn4': signUpStatus == 1,   }"
            @click="signUpActivity">{{signUpStatus == 0 ? '报名' : '报名成功'}}</button>
        </div>
        <!-- <button class="answer-prepare__middle_btn3">预约报名</button>  -->
        <button v-if="step == 1" class="answer-prepare__middle_btn4">准备开始</button>
      </div>
      <div class="answer-prepare__bottom">
        <p class="css-title">活动规则</p>
        <pre class="css-content">{{activity.desct}}</pre>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  signUpActivity,
  isSignUpActivity,
  setActivityStatus
} from "../../utils/getData";
import Event from "../../utils/Event";
import utilityServertime from "../../utils/utilityServertime";
import CountDown from "./Countdown";
import newSubject from "../../mixins/newSubject";
import activityPeople from "../../mixins/activityPeople";
import closeBtn from "./closeBtn";

export default {
  props: [],
  data() {
    return {
      step: 0,
      errMsg: "",
      signUpStatus: 0, //0: 未报名 1：已报名
      isLoading: false
    };
  },
  components: {
    CountDown,
    closeBtn
  },
  mounted() {
    this.isSignUpActivity();
    this.getPeopleNum();
  },
  computed: {
    ...mapState(["user", "room", "activity", "anchor", "isShowActivity"])
  },
  mixins: [newSubject, activityPeople],
  methods: {
    _goNext() {
      // if(this.room.userIsAnchor && this.activity.status == 8) {
      //   // setActivityStatus(this.activity.id, this.room.id, this.anchor.id, 3) //2：活动准备,3：活动进行中
      // }
      if (this.isLoading) return;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
      this.goNext();
    },
    countDownS_cb: function() {},
    countDownE_cb: function() {
      this.step = 1;
      this.getPeopleNum();
      this.getPlayerStatus();
      this.CHANGE_ACTIVITY_STATUS({
        status: 8
      });
      if (this.room.userIsAnchor && this.activity.status == 8) {
        setActivityStatus(this.activity.id, this.room.id, this.anchor.id, 2); //2：活动准备,3：活动进行中
      }
    },
    async signUpActivity() {
      if (this.signUpStatus == 1) return;
      const res = await signUpActivity(this.activity.id);
      if (res.code == 200) {
        this.signUpStatus = 1;
      } else {
        this.errMsg = res.msg;
      }
    },
    async isSignUpActivity() {
      const res = await isSignUpActivity(this.activity.id, this.room.id);
      if (res.code == 200) {
        if (res.data == 1) {
          this.signUpStatus = 1;
        } else {
          this.signUpStatus = 0;
        }
      } else {
      }
    },
    // 显示隐藏答题
    switchActivity() {
      if (this.$store.state.isShowActivity) {
        this.$store.state.isShowActivity = false;
      } else {
        this.$store.state.isShowActivity = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// @import '../style/mixin';
.answer-prepare {
  background-color: #524948;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  .css-activity-title-container {
    position: relative;
    .css-activity-name {
      color: #fff;
      text-align: center;
      line-height: 40px;
    }
  }
  &__inner {
    // padding: 20px 0;
  }

  &__top {
    margin-top: 10px;
    p {
      text-align: center;
    }

    .text1 {
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
    }

    .text2 {
      font-size: 18px;
      color: #ffd800;
    }

    .text3 {
      font-size: 1.1rem;
      color: #ffd800;
    }

    &_left {
      border-right: 1px solid #ffd800;
    }
  }

  &__middle {
    margin-top: 25px;
    text-align: center;

    &_tip {
      color: #ff3366;
      font-size: 14px;
      margin: 10px 0;
    }

    &_people {
      margin-bottom: 15px;
      font-size: 12px;
      text-align: center;

      // .people-num {}
      .refresh-btn {
        background: #43cc0b;
        width: 46px;
        height: 18px;
        line-height: 18px;
        color: #ffffff;
        display: inline-block;
        border-radius: 18px;
        cursor: pointer;
      }
    }

    button {
      width: 120px;
      height: 35px;
      font-size: 14px;
      text-align: center;
      border: none;
      outline: none;
      border-radius: 40px;
    }

    &_btn1 {
      color: #fff;
      background-color: #9966ff;
    }

    &_btn2 {
      color: #000;
      background-color: #FFD800;
      cursor: pointer;
      &:hover{
        opacity: .9;
      }
    }

    &_btn3 {
      color: #fff;
      background-color: #c6c6c6;
    }

    &_btn4 {
      color: #fff;
      background-color: #8BC34A;
    }
  }

  &__bottom {
    padding: 20px;
    color: #fff;
    .css-title {
      text-align: center;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .css-content{
      font-size: 12px;
      white-space: pre-line;
    }
  }
}
</style>
