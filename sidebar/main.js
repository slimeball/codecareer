import Vue from "vue";
import Sidebar from "./Sidebar";
import VueResource from 'vue-resource'
import VueBus from "./plugins/vue-bus";
import VModal from 'vue-js-modal';
import store from "./store";
import Event from "src/utils/Event";
import getUrlParameter from "src/utils/getUrlParameter";
import gtag from "src/utils/gtag";

Vue.use(VueBus);
Vue.use(VModal, { dialog: true })
Vue.use(VueResource);

var vm;
const initLiveVideo = function() {
  if (typeof vm == "undefined") {
    vm = new Vue({
      store,
      render: h => h(Sidebar),
      methods: {}
    }).$mount("#sidebar");

  }
};

var init = getUrlParameter("init");
var source = decodeURIComponent(getUrlParameter("source"));
if (init == 1) {
  initLiveVideo();
}

window.sourceUrl = "";
if (source && source != "undefined") {
  sourceUrl = source;
} else {
  sourceUrl = "";
}

window.hideSliderLive = () => {};

window.refreshSliderLive = () => {};

window.onmessage = function(event) {
  sourceUrl = event.origin;
  if (event.data == "initLiveVideo") {
    initLiveVideo();
    gtag.open(); //统计代码
  } else if (event.data == "playLiveVideo") {
    vm.$bus.emit(Event.VIDEO_EVENT, { _method_: "playLiveVideo" });
  }

  hideSliderLive = function() {
    event.source.postMessage("hideSliderLive", event.origin);
    gtag.close(); //统计代码
  };

  refreshSliderLive = () => {
    event.source.postMessage("refreshSliderLive", event.origin);
  };
};
