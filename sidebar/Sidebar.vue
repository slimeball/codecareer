<template>

  <div class="content d-flex flex-column" @click="pageClick">
    <!-- <socket-connect></socket-connect> -->
    <live-video></live-video>
    <screen class="col"></screen>
    <gift></gift>
    <chat :hideDropdown="hide_dropdown"></chat>

    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <close-page />
    <v-dialog/>
  </div>
</template>

<script>

  // import socketConnect from './components/socketConnect';
  import socketConnect from './mixins/socketConnect';
  import liveVideo from './components/liveVideo';
  import screen from './components/screen';
  import chat from './components/chat';
  import gift from './components/gift';
  import closePage from './components/closePage';
  import alertTip from './components/alertTip';
  import Event from 'src/utils/Event';
  
  export default {
    name: 'sidebar',
    data() {
      return {
        showAlert: false,
        alertText: null,
        hide_dropdown: 0
      }
    },
    components: {
      // socketConnect,
      liveVideo,
      screen,
      chat,
      gift,
      alertTip,
      closePage
    },
    mixins: [socketConnect],
    created() {
      this.$bus.on(Event.SHOW_ALERT, this.showAlertFunc);
    },
    beforeDestroy() {
      this.$bus.off(Event.SHOW_ALERT, this.showAlertFunc);
    },
    methods: {
      showAlertFunc(option) {
        this.showAlert = true;
        this.alertText = option.text;
      },
      pageClick() {
        this.hide_dropdown += 1;
      }
    }
   }

</script>

<style lang="scss">
  @import './style/common';

  .content {
    // max-width: 263px;
    // width: 263px;
    width: 100%;
    height: 100%;
    background: #524948 url("./images/body_bg.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

</style>
