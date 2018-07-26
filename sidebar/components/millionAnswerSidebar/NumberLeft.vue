<template>
    <span>{{ticktockHTML}}</span>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  replace: true,
  data() {
    return {
      interval: null,
      second: this.leftseconds * 100,
      completed: false,
      ticktockHTML: ""
    };
  },
  watch: {
    // currentTime: function (val, oldval) {
    //   this.gogogo();
    // },
    answerStep(value) {
      if (value == 0) {
        //开始答题
        this.second = this.leftseconds * 100;
        this.completed = false;
        this.interval = setInterval(this.tick, 10);
      }
    },
    currentSubject(value) {
      if (value.isAnswered === true) {
        this.stop();
      }
    }
  },
  props: {
    leftseconds: {
      type: Number,
      required: true
    },
    answerStep: {
      type: Number
    }
  },
  computed: {
    ...mapState(["activity", "currentSubject"])
  },
  mounted() {
    if (this.activity.status == 9) {
      this.completed = true;
      this.ticktockHTML = "00:00";
    } else {
      this.interval = setInterval(this.tick, 10);
    }
  },
  methods: {
    tick() {
      if (this.second <= 0) {
        clearInterval(this.interval);
        this.completed = true;
        // this.$emit('onComplete');
        this.ticktockHTML = "00:00";
      } else {
        var ss = Math.floor(this.second / 100);
        if (ss < 10) {
          ss = "0" + ss;
        }
        var ms = this.second - Math.floor(this.second / 100) * 100;
        this.ticktockHTML = ss + ":" + ms;
        this.second--;
        // this.$emit('onTick', this.second);
      }
    },
    stop() {
      clearInterval(this.interval);
    }
  }
};
</script>
<style lang="scss" scoped>
.exam-timeup {
  // background: #FF3666;
  //     width: 70px;
  //     height: 20px;
  //     border-radius: 10px;
  //     color: #ffffff; // box-shadow: rgba(102,0,0,0.35);
  //     text-align: center;
  //     position: relative;
  //     z-index: 10
}
</style>
