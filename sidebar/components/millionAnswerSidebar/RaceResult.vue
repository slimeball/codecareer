<template>
  <section class="race-result">
    <!-- "extra_bonus_type":"1"            //有无加奖：0-无加奖，1-有加奖 -->
    <div class="race-result-left" v-bind:class="{ 'rece-extra_bonus_type': activity.extra_bonus_type != 1 }">
      <PrizeList />
    </div>
    <!-- <div class="race-result-right" v-if="activity.extra_bonus_type == 1" v-show="!isShowrank">
      <ExtPrizeList />
    </div> -->
  </section>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import PrizeList from "./PrizeList";
import ExtPrizeList from "./ExtPrizeList";
import { pushVerifyAnswer } from "../../utils/getData";
export default {
  data() {
    return {};
  },
  mounted() {},
  components: {
    PrizeList,
    ExtPrizeList
  },
  props: {},
  watch: {},
  computed: {
    ...mapState(["currentSubject", "room", "activity"])
  },
  methods: {
    ...mapMutations(["SET_CURRENT_SUBJECT"]),
    selectAnswer(item) {}
    // async submmitAnswer(answer) {
    //  let res = await pushVerifyAnswer(this.activity.id, this.room.id, answer);
    // }
  }
};
</script>
<style lang="scss" scoped>
.race-result {
  width: 100%;
  height: 100%;

  .race-result-left {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .rece-extra_bonus_type {
    padding-right: 0;
    width: 100%;
  }
  .race-result-right {
    width: 100%;
    height: 100%;
    float: left;
    background-color: #fff;
    border-radius: 10px;
  }
}
</style>

