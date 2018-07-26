<template>
  <div class="subject">
    <h4 class="subject-title">{{currentSubject.id}}. {{currentSubject.content.question}} </h4>
    <ul class="subject-answer">
      <li class="d-flex align-items-center" v-for="(item, index) in currentSubject.content.answer" :key="index" @click="selectAnswer(item)"
        v-bind:class="{ 'checked': item.checked, 'correct': (isCorrect && item.checked), 'error': (isError && item.checked), 'right': (answerResult.right_answer == item.text) }">
        <span class="col">{{item.text}}</span>
        <span class="css-correct-num">{{item.num}}</span>
        <span class="subject-answer-imgwrap">
          <img  v-if="(isCorrect && item.checked) || (answerResult.right_answer == item.text && (answerStep == 2 ||  answerStep == 3))" src="../../images/activity/correct.png" alt="">
          <img  v-if="isError && item.checked" src="../../images/activity/error.png" alt="">
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { pushVerifyAnswer, getAnswerTotalNum } from "../../utils/getData";
export default {
  data() {
    return {};
  },
  mounted() {},
  props: {
    answerStep: {
      type: Number,
      required: true
    },
    answerResult: {
      type: Object
    }
  },
  watch: {
    answerStep(value) {
      if (value == 0) {
        this.currentSubject.content.answer.forEach((value, index) => {
          value.checked = false;
        });
      } else if (value == 1) {
        //停止答题
        // if(!this.currentSubject.isAnswered && !this.room.userIsAnchor && this.userActivityStatus == 1) {
        //     this.submmitAnswer("")
        // }
      }
    }
  },
  computed: {
    ...mapState([
      "currentSubject",
      "room",
      "activity",
      "user",
      "userActivityStatus"
    ]),
    isCorrect() {
      let item = {};
      this.currentSubject.content.answer.forEach((value, index) => {
        if (value.checked) {
          item = value;
        }
      });
      return (
        this.answerStep == 2 &&
        this.answerResult.right_answer == item.text &&
        item.checked
      );
    },
    isError() {
      let item = {};
      this.currentSubject.content.answer.forEach((value, index) => {
        if (value.checked) {
          item = value;
        }
      });
      return (
        this.answerStep == 2 &&
        this.answerResult.right_answer != item.text &&
        item.checked
      );
    }
  },
  methods: {
    ...mapMutations(["SET_CURRENT_SUBJECT"]),
    selectAnswer(item) {
      if (this.room.userIsAnchor || this.currentSubject.isAnswered) return; //非主播 || 没有选答案 || 已出局
      if (this.answerStep == 0 && this.userActivityStatus == 1) {
        var newSubject = { ...this.currentSubject };
        newSubject.isAnswered = true;
        newSubject.content.answer.forEach((value, index) => {
          if (value.text == item.text) {
            value.checked = true;
          } else {
            value.checked = false;
          }
        });
        this.SET_CURRENT_SUBJECT(newSubject);
        this.submmitAnswer(item.text);
      }
    },
    // async getAnswer() {
    //   let res = await getAnswerTotalNum(this.activity.id, this.room.id, this.user.id);
    // },
    async submmitAnswer(answer) {
      let res = await pushVerifyAnswer(this.activity.id, this.room.id, answer);
    }
  }
};
</script>
<style lang="scss" scoped>
.subject {
  width: 100%;
  margin-top: 20px;
  &-title {
    font-size: 15px;
    padding: 0 20px;
    margin-bottom: 14px;
    font-weight: bold;
  }
  &-answer {
    padding: 0 10px 10px;

    &-imgwrap {
      width: 20px;
      line-height: 0;
      display: inline-block;
    }

    li {
      border: 1px solid #ccc;
      height: 40px;
      line-height: 1.4;
      border-radius: 40px;
      padding-left: 20px;
      padding-right: 15px;
      margin-bottom: 10px;
      width: 100%;
      cursor: pointer;
      .css-correct-num{
        margin-right: 3px;
      }
      &.checked,
      &.right {
        background-color: #91d76b; 
        color: #fff;
        border: none;
      }
      &.error {
        background: #ff6060;
        color: #fff;
        border: none;
      }
      img {
        margin-left: 5px;
      }
    }
  }
}
</style>
