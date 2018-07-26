// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SpTel from './SpTel'
import router from './router'
import VueResource from 'vue-resource';

Vue.config.productionTip = false

Vue.use(VueResource);
/* eslint-disable no-new */
new Vue({
  router,
  el: '#SpTel',
  components: { SpTel },
  template: '<SpTel/>'
})
