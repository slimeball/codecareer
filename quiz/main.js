import Vue from 'vue'
import User from './User'
import VueResource from 'vue-resource'
import Visitor from './Visitor'
import VueBus from './utils/vue-bus'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueBus)
Vue.use(VueResource);
/* eslint-disable no-new */
// 发起流程
new Vue({
  el: '#kf-quiz-management',
  store,
  components: { User },
  template: '<User/>'
})

// 访问流程
new Vue({
  el: '#kf-quiz-visitor',
  store,
  components: { Visitor },
  template: '<Visitor/>'
})
