<template>
  <span class="css-activity-close-box" v-on:click="switchActivity()"><i class="css-activity-close"></i></span>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import { CLOSE_ACTIVITY, IS_SHOW_RANK } from "../../store/mutation-types";

export default {
  data() {
    return {};
  },
  computed:{
    ...mapState([
      "isShowRank"
    ])
  },
  methods: {
    ...mapMutations(["CLOSE_ACTIVITY", "IS_SHOW_RANK"]),
    // 显示隐藏答题
    switchActivity() {
      this.CLOSE_ACTIVITY();
      if(this.isShowRank){
        this.IS_SHOW_RANK();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.css-activity-close-box {
  cursor: pointer;
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 14px;
  width: 15px;
  height: 15px;
  .css-activity-close {
    position: absolute;
    right: 6px;
    top: 0;
    width: 0.15rem;
    height: 1rem;
    background-color: #333;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    display: inline-block;
    &::after {
      content: "";
      position: absolute;
      width: 0.15rem;
      height: 1rem;
      background-color: #333;
      -webkit-transform: rotate(270deg);
      -moz-transform: rotate(270deg);
      -o-transform: rotate(270deg);
      -ms-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }
}
</style>
