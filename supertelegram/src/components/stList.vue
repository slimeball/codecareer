<template>
  <div class="st-list-container">
    <header class="st-top-container">
      <nav class="st-top-category">
        <span class="st-item" :class="{cur:curcate === index}" v-for="(cat,index) in categoryList" :key="index" v-on:click="changecate(index,cat.type,cat.value)">{{cat.label}}</span>
      </nav>
    </header>
    <section class="st-list-container">
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
        <div class="st-list-item" v-for="(info,index) in articleList" :key="index" v-on:click="todetail(info.id)">
          <div class="st-list-info">
            <h1><i class="st-icon"></i>{{info.name}}{{info.id}}</h1>
            <p>适合：<span>{{info.fit}}</span></p>
            <p>人均消费：<span>{{info.per_consumption}}</span></p>
            <p>介绍：<span>{{info.summary}}</span></p>
          </div>
          <div class="st-list-address"><i class="st-icon"></i><span>{{info.address}}</span></div>
        </div>
      </scroller>
    </section>
  </div>
</template>

<script>
import ajaxurl from '../config/url';
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller);

export default {
  name: 'stList',
  data () {
    return {
      curcate: 0,
      categoryList: [],
      articleList: [],
      curpage: 1,
      listPage:1,
      listLen: 20,
      listparams:{}
    }
  },
  mounted () {
    this.listparams = {page:this.listPage};
  },
  methods:{
    initData (pars,isrefresh,done) {
      let paramsType = this.$route.params.type;
      this.listparams.page = this.listPage;
      if(paramsType === 'restaurants'){
        this.$http.get(ajaxurl.baseUrl+ ajaxurl.restaurants,{params: pars}).then(res => {
        // this.$http.get('/static/json/restaurants.json').then(res => {
          if(res.body.code === 0){
            let data = res.body.data;
            if(data.restaurant_attribute){
              this.categoryList = data.restaurant_attribute;
            }
            if(isrefresh){
              this.articleList = data.list;
              if(done){
                done();
              }
            }else{
              this.articleList = this.articleList.concat(data.list); 
            }
            window.localStorage.setItem('restaurants',JSON.stringify(this.articleList));
            this.listLen = data.list.length;
            this.listPage++;
            if(data.list.length <20){
              this.$refs.scroller.finishInfinite(true);
            }else{
              this.$refs.scroller.finishInfinite(false);
            }
          }
        }, response => {
          // error callback
        });
      }
      if(paramsType === 'travels'){
        this.$http.get(ajaxurl.baseUrl+ ajaxurl.travels,{params: pars}).then(res => {
          if(this.categoryList&&res.body.code === 0){
            let data = res.body.data;
            if(data.travel_attribute){
              this.categoryList = data.travel_attribute;
            }
            if(isrefresh){
              this.articleList = data.list;
              if(done){
                done();
              }
            }else{
              this.articleList = this.articleList.concat(data.list); 
            }
            window.localStorage.setItem('travels',JSON.stringify(this.articleList));
            this.listLen = data.list.length;
            this.listPage ++;
            if(data.list.length <20){
              this.$refs.scroller.finishInfinite(true);
            }else{
              this.$refs.scroller.finishInfinite(false);
            }
          }
        }, response => {
          // error callback
        });
      }
    },
    refresh(done) {
      this.listPage = 1;
      this.initData(this.listparams,true,done);
    },
    infinite(){
      this.initData(this.listparams);
    },
    changecate(index,type,value){
      /** 
      * 参数
      * is_tb    0-非团建，1-团建
      * num_person  2-2人，6-6人左右聚餐
      * is_special  0-非特色，1-特色
      * is_quiet  0-非安静，1-安静
      * page    分页参数，默认为1
      */
      // this.listFilter = type;
      this.listPage = 1;
      this.listparams = {page:this.listPage,[type]:value};
      this.curcate = index;
      // this.initData(this.listparams,true);
      this.$refs.scroller.triggerPullToRefresh()
    },
    todetail(id){
      this.$router.push({path: `/detail/${this.$route.params.type}/${id}`})
    }
  }
}
</script>

<style lang="scss" scoped>
%breakwords{
  word-wrap: break-word;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.st-icon{
  background-size:cover;
  display: block;
  float: left;
  margin-top: 4px;
  margin-right: 10px;
}
._v-container{
  top: 36px;
}
._v-container>._v-content{}
.st-list-container{
  height:auto;
  .st-top-container{
    width:100%;
    padding: 1.5% 2.67%;
    border-bottom: 1px solid #dddcd8;
    background-color: #fff;
    overflow: hidden;
    font-size:.9375rem;
    position: fixed;
    z-index: 10;
    .st-top-category{
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      color: #333;
      white-space: nowrap;
      .st-item{
        display: inline-block;
        padding: 0 2.23%;
        &.cur{
          color:#6297f7;
          text-decoration: underline;
        }
      }
    }
  }
  .st-list-container{
    .st-list-item{
      border-radius: 5px;
      background-color:#fff;
      margin: 0 3.2%;
      margin-top: 2.4%;
      padding: 4.3% 3.5%;
      .st-list-info{
        h1{
          font-size:1.0625rem;
            @extend %breakwords;
          .st-icon{
            width:21px;
            height:19px;
            background-image: url(../assets/icon-shop.png);
          }
        }
        p{
          font-size:.875rem;
          color:#6e6e6e;
          margin-top: 5px;
          @extend %breakwords;
        }
      }
      .st-list-address{
        font-size:.8125rem;
        color:#a6a6a6;
        border-top:1px solid #e5e5e5;
        padding-top: 15px;
        margin-top: 15px;
        @extend %breakwords;
        .st-icon{
          width:9px;
          height:14px;
          background-image: url(../assets/icon-location.png);
        }
      }
    }
  }
}
</style>
