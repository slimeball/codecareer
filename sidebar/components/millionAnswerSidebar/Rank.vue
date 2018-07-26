<template>
  <div class="rank d-flex flex-column">
    <span class="css-goback" v-on:click="goback()"></span>
    <div class="rank-title">抢答榜</div>
    <div class="rank-list-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
      <ul class="rank-list" v-if="prize.length>0">
        <li class="d-flex align-items-center" v-for="(item, index) in prize" :key="index">
          <span class="rank-order" v-if="index == 0">
            <img src="../../images/activity/rank_0.png" alt="">
          </span>
          <span class="rank-order" v-if="index == 1">
            <img src="../../images/activity/rank_1.png" alt="">
          </span>
          <span class="rank-order" v-if="index == 2">
            <img src="../../images/activity/rank_2.png" alt="">
          </span>
          <span class="rank-order" v-if="index > 2">{{index + 1}}</span>
          <span class="col">{{item.user_nicename}}</span>
          <div>
            <span>{{item.time}}</span>
          </div>
        </li>
      </ul>
      <ul class="rank-list" v-if="prize.length===0">
        <li class="css-no-resault">暂无人上榜</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { IS_SHOW_RANK } from "../../store/mutation-types";
import { pushVerifyAnswer, getPrizeList } from "../../utils/getData";
export default {
  data() {
    return {
      prize: [],
      busy: false,
      pageNum: 1
    };
  },
  mounted() {
    (this.prize = []), (this.busy = false), (this.pageNum = 1);
    this.prizeList();
  },
  props: {
    answerStep: {
      type: Number,
      required: true
    }
  },
  watch: {
    answerStep(value) {
      // console.log('answerStep为：' + value)
      if (value == 2) {
        (this.prize = []), (this.busy = false), (this.pageNum = 1);
        this.prizeList();
      }
    }
  },

  computed: {
    ...mapState(["currentSubject", "room", "activity"])
  },
  methods: {
    ...mapMutations(["IS_SHOW_RANK"]),
    goback(){
      this.IS_SHOW_RANK();
    },
    async prizeList() {
      let res = await getPrizeList(this.activity.id, this.pageNum, 15);
      if (res.data && res.data.list && res.data.list.length > 0) {
        this.prize = this.prize.concat(res.data.list);
      }
    },
    async loadMore() {
      this.busy = true;
      await this.prizeList(this.pageNum++);
      this.busy = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.rank {
  width: 100%;
  height: 100%;
  position: relative;
  .css-goback{
    cursor: pointer;
    position: absolute;
    z-index: 10;
    left: 10px;
    top: 10px;
    width: 15px;
    height: 15px;
    background-image: url(../../images/activity/activity_goback.png);
    background-size: cover;
  }
  &-title {
    font-size: 14px;
    color: #333;
    font-size: 14px;
    width: 70px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
    top: 5px;
  }

  &-list-wrap {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 40px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-list {
    color: #333;
    padding: 10px;

    li {
      margin-bottom: 10px;
      &.css-no-resault{
        text-align: center;
      }
    }
    li .rank-order {
      margin-right: 5px;
      width: 20px;
      height: 19px;
      text-align: center;
      img {
        float: left;
      }
    }
  }
}
</style>
