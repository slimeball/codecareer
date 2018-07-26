<template>
  <div class="close-page" @click="hideLiveRoom" title="收回"></div>
</template>

<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
//   import {isEmpty, isNickname} from 'src/utils/validation';
//   import tip from 'src/mixins/tip';
//   import {editUserNiceName} from '../utils/getData';
import Event from "src/utils/Event";

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    hideLiveRoom() {
      this.$bus.emit(Event.VIDEO_EVENT, {
        _method_: "pauseLiveVideo"
      });
      hideSliderLive();
    }
  }
};
</script>

<style lang="scss" scoped>
.close-page {
  width: 12px;
  height: 70px;
  margin-top: -35px;
  position: absolute;
  left: 0;
  top: 50%;
  cursor: pointer;
  background: url("../images/close_page.png") no-repeat;
  background-size: 100% 100%;
}
</style>
