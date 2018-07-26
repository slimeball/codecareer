<template>
  <div>
    <!-- <p v-if="msTime.show"> -->
    <p>
      <!--<span v-if="tipShow">{{tipText}}:</span>-->
      <!--<span v-if="!tipShow">{{tipTextEnd}}:</span>-->
      <span v-if="msTime.day>0">
        <span>{{msTime.day}}</span>
        <span>{{dayTxt}}</span>
      </span>
      <span>{{msTime.hour}}{{hourTxt}}{{msTime.minutes}}{{minutesTxt}}{{msTime.seconds}}{{secondsTxt}}</span>
    </p>
    <!--<p v-if="!msTime.show">{{endText}}</p>-->
  </div>
</template>
<script>
import utilityServertime from "src/utils/utilityServertime";
export default {
  replace: true,
  data() {
    return {
      tipShow: true,
      msTime: {
        //倒计时数值
        show: false, //倒计时状态
        day: "", //天
        hour: "", //小时
        minutes: "", //分钟
        seconds: "" //秒
      },
      star: "", //活动开始时间
      end: "", //活动结束时间
      current: "", //当前时间
      interval: null
    };
  },
  watch: {
    // currentTime: function (val, oldval) {
    //   this.gogogo();
    // }
  },
  props: {
    //距离开始提示文字
    tipText: {
      type: String,
      default: "距离开始"
    },
    //距离结束提示文字
    tipTextEnd: {
      type: String,
      default: "距离结束"
    },
    //时间控件ID
    id: {
      type: String,
      default: "1"
    },
    //当前时间
    currentTime: {
      type: Number
    },
    // 活动开始时间
    startTime: {
      type: Number
    },
    // 活动结束时间
    endTime: {
      type: Number
    },
    // 倒计时结束显示文本
    endText: {
      type: String,
      default: "已结束"
    },
    //自定义显示文字:天
    dayTxt: {
      type: String,
      default: ":"
    },
    //自定义显示文字:时
    hourTxt: {
      type: String,
      default: ":"
    },
    //自定义显示文字:分
    minutesTxt: {
      type: String,
      default: ":"
    },
    secondsTxt: {
      type: String,
      default: ":"
    },
    //是否开启秒表倒计，未完成
    secondsFixed: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    function interval(duration, fn) {
      this.baseline = undefined;

      this.run = function() {
        if (this.baseline === undefined) {
          this.baseline = new Date().getTime();
        }
        fn();
        var end = new Date().getTime();
        this.baseline += duration;

        var nextTick = duration - (end - this.baseline);
        if (nextTick < 0) {
          nextTick = 0;
        }
        (function(i) {
          i.timer = setTimeout(function() {
            i.run(end);
          }, nextTick);
        })(this);
      };

      this.stop = function() {
        clearTimeout(this.timer);
      };
    }

    utilityServertime.getServertime(() => {
      this.interval = new interval(100, () => {
        this.tick(this.startTime * 1000, utilityServertime.getUnix());
      });
      this.interval.run();
    });
  },

  methods: {
    tick(startTime, endTime, expected) {
      // console.log(endTime)
      // var dt = Date.now() - expected;
      // if(dt > 0)
      let leftUnix = startTime - endTime;
      if (leftUnix > 0) {
        let leftSeconds = leftUnix / 1000;
        let seconds = Math.floor(leftSeconds % 60); //计算剩余的秒数
        let minutes = parseInt((leftSeconds / 60) % 60); //计算剩余的分钟数
        let hour = parseInt((leftSeconds / 60 / 60) % 60); //计算剩余的小时数
        let day = Math.floor(leftSeconds / 60 / 60 / 24);

        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.msTime.day = day;
        this.msTime.hour = hour;
        this.msTime.minutes = minutes;
        this.msTime.seconds = seconds;
      } else {
        // clearInterval(this.interval);
        this.interval.stop();
        this.end_message();
      }

      // if (this.second <= 0) {
      //   clearInterval(this.interval);
      //   this.completed = true;
      //   this.$emit('onComplete');
      // } else {
      //   this.second -= 1;
      //   this.$emit('onTick', this.second);
      // }
    },
    gogogo: function() {
      //判断是秒还是毫秒
      this.startTime.toString().length == 10
        ? (this.star = this.startTime * 1000)
        : (this.star = this.startTime);
      // this.endTime.toString().length == 10 ? this.end = this.endTime * 1000 : this.end = this.endTime;
      // if (this.currentTime) {
      //   this.currentTime.toString().length == 10 ? this.current = this.currentTime * 1000 : this.current = this.currentTime;
      // } else {
      this.current = utilityServertime.getUnix();
      // }

      // console.log('开始时间', new Date(this.star).toLocaleString())
      // console.log('当前时间', new Date(this.current).toLocaleString())

      // if (this.end < this.current) {
      if (this.star < this.current) {
        //kilian 开始时间已经小于当前时间，说明活动结束
        /**
         * 结束时间小于当前时间 活动已结束
         */
        this.msTime.show = false;
        this.end_message();
      } else if (this.current < this.star) {
        /**
         * 当前时间小于开始时间 活动尚未开始
         */
        this.$set(this, "tipShow", true);
        // setTimeout(() => {
        this.runTime(this.star, this.current, this.end_message);
        // }, 1);
      }
      // else if (this.end > this.current && this.star < this.current || this.star == this.current) {
      //   /**
      //    * 结束时间大于当前并且开始时间小于当前时间，执行活动开始倒计时
      //    */
      //   this.$set(this, 'tipShow', false);
      //   this.msTime.show = true;
      //   this.$emit('start_callback', this.msTime.show);
      //   setTimeout(() => {
      //     this.runTime(this.end, this.star, this.end_message, true)
      //   }, 1);
      // }
    },
    runTime(startTime, endTime, callFun, type) {
      let msTime = this.msTime;
      let leftSeconds = (startTime - endTime) / 1000;
      if (leftSeconds > 0) {
        this.msTime.show = true;

        let seconds = parseInt(leftSeconds % 60); //计算剩余的秒数
        let minutes = parseInt((leftSeconds / 60) % 60); //计算剩余的分钟数
        let hour = parseInt((leftSeconds / 60 / 60) % 60); //计算剩余的小时数
        let day = Math.floor(leftSeconds / 60 / 60 / 24);

        // msTime.day = Math.floor(leftSeconds / 86400);
        // leftSeconds -= msTime.day * 86400;
        // msTime.hour = parseInt(leftSeconds / 3600);
        // leftSeconds -= msTime.hour * 3600;
        // msTime.minutes = parseInt(leftSeconds / 60);
        // leftSeconds -= msTime.minutes * 60000;
        //是否开启秒表倒计,未完成
        //                    this.secondsFixed ? msTime.seconds = new Number(leftSeconds / 1000).toFixed(2) : msTime.seconds = Math.floor( timeDistance / 1000 ).toFixed(0);
        // msTime.seconds = parseInt(leftSeconds / 1000).toFixed(0);
        // leftSeconds -= msTime.seconds * 1000;

        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        msTime.day = day;
        msTime.hour = hour;
        msTime.minutes = minutes;
        msTime.seconds = seconds;
        // let _s = Date.now();
        // let _e = Date.now();
        // let diffPerFunc = _e - _s;
        setTimeout(() => {
          // if (type) {
          //   this.runTime(this.end, endTime += 1000, callFun, true);
          // } else {
          this.runTime(this.star, (endTime += 1000), callFun);
          // this.runTime(this.star, utilityServertime.getUnix(), callFun);
          // }
          // }, 1000 - diffPerFunc)
        }, 1000);
      } else {
        callFun();
      }
    },
    start_message() {
      this.$set(this, "tipShow", false);
      this.$emit("start_callback", this.msTime.show);
      // setTimeout(() => {
      // this.runTime(this.end, this.star, this.end_message, true)
      // }, 1);
    },
    end_message() {
      this.msTime.show = false;
      if (this.currentTime <= 0) {
        return;
      }
      this.$emit("end_callback", this.msTime.show);
    }
  }
};
</script>
