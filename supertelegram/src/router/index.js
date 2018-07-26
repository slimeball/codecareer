import Vue from 'vue';
import Router from 'vue-router';
import stList from '@/components/stList';
import stDetail from '@/components/stDetail';
import stExchangeRate from '@/components/stExchangeRate';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/list/:type',
      name: 'stList',
      component: stList
    },
    {
      path: '/detail/:type/:id',
      name: 'stDetail',
      component: stDetail
    },
    {
      path: '/exchangerate',
      name: 'stExchangeRate',
      component: stExchangeRate
    }
  ]
})
