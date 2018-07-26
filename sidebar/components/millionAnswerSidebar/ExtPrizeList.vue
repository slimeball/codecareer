<template>
  <div class="rank d-flex flex-column">
    <div class="rank-title">加奖榜</div>
    <div class=" rank-list-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
      <ul class="rank-list" >
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
            <p>{{item.time}}</p>
            <p class="rank-bonus">{{item.bonus}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// 加奖榜，已融合到总榜，暂时无用 待删除
import { mapState, mapActions, mapMutations } from "vuex";
import { pushVerifyAnswer, getExtPrizeList } from "../../utils/getData";
export default {
  data() {
    return {
      prize: [],
      busy: false,
      pageNum: 1
    };
  },
  mounted() {
    this.prizeList();
  },
  computed: {
    ...mapState(["currentSubject", "room", "activity"])
  },
  methods: {
    ...mapMutations(["SET_CURRENT_SUBJECT"]),
    async prizeList() {
      let res = await getExtPrizeList(this.activity.id, this.pageNum, 15);
      if (res.data && res.data.length > 0) {
        this.prize = this.prize.concat(res.data);
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
    top: 10px;
  }

  &-list-wrap {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 20px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-list {
    color: #333;
    padding: 10px;

    li {
      margin-bottom: 2px;
      font-size: 12px;

      p {
        text-align: center;
      }

      .rank-bonus {
        font-size: 14px;
        font-weight: 600;
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
