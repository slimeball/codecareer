<template>
  <div>
    <span class="exam-timeup" v-if="completed">时间到</span>
    <span class="exam-timeing" v-else>{{second}}</span>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  replace: true,
  data() {
    return {
      interval: null,
      second: this.leftseconds,
      completed: false
    };
  },
  watch: {
    // currentTime: function (val, oldval) {
    //   this.gogogo();
    // },
    answerStep(value) {
      if (this.activity.status == 9) {
        // this.$emit('onComplete');
      } else if (value == 0) {
        //开始答题
        this.second = this.leftseconds;
        this.completed = false;
        this.interval = setInterval(this.tick, 1000);
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
    ...mapState(["activity"])
  },
  mounted() {
    if (this.activity.status == 9) {
      this.completed = true;
      this.second = 0;
      this.$emit("onComplete");
    } else {
      this.interval = setInterval(this.tick, 1000);
    }
    // this.gogogo();
  },
  methods: {
    tick() {
      if (this.second <= 0) {
        clearInterval(this.interval);
        this.completed = true;
        this.$emit("onComplete");
      } else {
        this.second -= 1;
        this.$emit("onTick", this.second);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.exam-timeup {
  font-size: 12px;
  color: #ff3366;
}

.exam-timeing {
  font-size: 1.3rem;
}
</style>
