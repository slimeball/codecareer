<template>
  <div class="rank d-flex flex-column">
    <close-btn></close-btn>
    <div class="rank-title">
      <img src="../../images/activity/cup.png" />
    </div>
    <div class="rank-list-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
      <div class="rank-tip-title" v-show="base.ami_prize == 1">恭喜您</div>
      <div class="rank-tip-title" v-show="base.ami_prize != 1">很遗憾</div>
      <div class="rank-tip-content">
        <span class="rank-yellow-font">{{base.prized_num}}</span>人瓜分
        <span class="rank-yellow-font">{{base.base_bonus_amount}}</span>元 每人
        <span class="rank-yellow-font">{{base.each_person_bonus}}</span> 元
      </div>
      <div class="css-btn-box">
        <div class="css-btn"><span v-on:click="switchRank('total')" :class="{'cur':istotalRank}">总榜</span></div>
        <div class="css-btn"><span v-on:click="switchRank('ext')" :class="{'cur':!istotalRank}">加奖榜</span></div>
      </div>
      <div class="css-rank-container">
        <table class="rank-list" v-show="istotalRank">
          <thead v-if="prize.length===0">
            <p class="css-no-prize">本场活动无人中奖</p>
          </thead>
          <thead v-if="prize.length>0">
            <tr>
              <th width="30">名次</th>
              <th>昵称</th>
              <th>奖金</th>
              <th>通关时间</th>
            </tr>
          </thead>
          <tbody v-if="prize.length>0">
            <tr v-for="(item, index) in prize" :key="index">
              <td>
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
              </td>
              <td>{{item.user_nicename}}</td>
              <td>{{item.bonus}} 元</td>
              <td>{{item.time}}</td>
            </tr>
          </tbody>
        </table>
        <table class="rank-list" v-show="!istotalRank">
          <thead v-if="prize.length===0">
            <p class="css-no-prize">本场活动无人中奖</p>
          </thead>
          <thead v-if="prize.length>0">
            <tr>
              <th width="30">名次</th>
              <th>昵称</th>
              <th>奖金</th>
              <th>通关时间</th>
            </tr>
          </thead>
          <tbody v-if="prize.length>0">
            <tr v-for="(item, index) in Extprize" :key="index">
              <td>
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
              </td>
              <td>{{item.user_nicename}}</td>
              <td>{{item.bonus}} 元</td>
              <td>{{item.time}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  pushVerifyAnswer,
  getPrizeList,
  getExtPrizeList
} from "../../utils/getData";
import closeBtn from "./closeBtn";
export default {
  data() {
    return {
      prize: [], // 获奖
      Extprize: [], // 加奖
      busy: false,
      pageNum: 1,
      istotalRank: true, // 是否显示总榜
      base: {}
    };
  },
  components: {
    closeBtn
  },
  mounted() {
    this.prizeList();
    this.ExtprizeList();
  },

  computed: {
    ...mapState(["currentSubject", "room", "activity"])
  },
  methods: {
    ...mapMutations(["SET_CURRENT_SUBJECT"]),
    switchRank(str) {
      // 参数值为 total 总榜
      if (str === "total") {
        this.istotalRank = true;
      } else {
        this.istotalRank = false;
      }
    },
    async prizeList() {
      let res = await getPrizeList(this.activity.id, this.pageNum, 18);
      this.base = res.data.data || {};
      if (res.data && res.data.list && res.data.list.length > 0) {
        this.prize = this.prize.concat(res.data.list);
      }
    },
    async ExtprizeList() {
      let res = await getExtPrizeList(this.activity.id, this.pageNum, 15);
      if (res.data && res.data.length > 0) {
        this.Extprize = this.Extprize.concat(res.data);
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
  background-color: #fff;
  border-radius: 10px;
  &-title {
    color: #333;
    font-size: 14px;
    width: 156px;
    height: 84px;
    line-height: 0px;
    text-align: center;
    margin: 0 auto;
    position: relative;
    top: 20px;
  }

  &-tip-title {
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 12px;
    color: #ffffff;
    font-size: 14px;
    background-color: #9966ff;
    margin: 0 auto;
  }

  &-tip-content {
    color: #333;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 6px;
  }

  &-yellow-font {
    font-size: 16px;
    color: #ffca32;
  }

  &-list-wrap {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 116px;
    // overflow-y: auto;
    .css-btn-box {
      display: flex;
      display: -webkit-flex;
      text-align: center;
      .css-btn {
        flex: 1;
        span {
          cursor: pointer;
          &.cur {
            border-bottom: 2px solid #ffd600;
          }
        }
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .css-rank-container{
    height: 70%;
    overflow-y: auto;
    .rank-list {
      color: #333;
      width: 100%;
      font-size: .8rem;
      margin-top: 10px;
      .css-no-prize{
        text-align: center;
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 120px;
      }
      .rank-list.rank-ext-list{
        padding: 10px;
      }
      th {
        text-align: center;
      }
      tr {
        text-align: center;
        td {
          padding: 2px 0;
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

}
</style>
