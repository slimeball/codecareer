<template>
  <div class="st-exchangerate-container">
    <section class="st-exchangerate-update">
      <h1 class="title"><i class="st-icon st-icon-title"></i>最新：<span>{{updatetime | formatDate}}</span></h1>
      <p>比较多个兑换中心价格</p>
    </section>
    <section class="st-exchangerate-info">
      <div class="t-header"><span class="st-td st-num">&#8470;</span><span class="st-td">钱庄</span><span class="st-td"><i class="st-icon usa"></i><i class="st-arrow">&#8594;</i><i class="st-icon china"></i></span><span class="st-td"><i class="st-icon usa"></i><i class="st-arrow">&#8594;</i><i class="st-icon philippine"></i></span><span class="st-td"><i class="st-icon philippine"></i><i class="st-arrow">&#8594;</i><i class="st-icon china"></i></span></div>
      <div class="t-body" v-for="(item,index) in rateData" :key="index"><span class="st-td st-num">{{index+1}}</span><span class="st-td">{{item.name}}</span><span class="st-td">{{item.usd_cny}}</span><span class="st-td">{{item.usd_php}}</span><span class="st-td">{{item.cny_php}}</span></div>
    </section>
    <section class="st-exchangerate-update">
      <h1 class="title"><i class="st-icon st-icon-new"></i><span>汇率电报群</span></h1>
      <ul class="st-rateUpdate-list">
        <li v-for="(litem,index) in rateUpdate" :key="index">{{litem.content}}</li>
      </ul>
    </section>
  </div>
</template>

<script>
import ajaxurl from '../config/url';

export default {
  name: 'stExchangeRate',
  data () {
    return {
      page:1,
      updatetime:'',
      rateData:[],
      rateUpdate:[]
    }
  },
  filters: {
    formatDate: function (value) {
      let d = new Date(Number.parseInt(value));
      return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+ '日'+' '+d.getHours()+':'+d.getMinutes();
    }
  },
  mounted () {
    this.initRate();
    this.initLog();
  },
  methods:{
    initRate(){
      this.$http.get(ajaxurl.baseUrl+ ajaxurl.exchange).then(res => {
          if(res.body.code === 0){
            let data = res.body.data;
            this.rateData = data.list;
            this.updatetime = data.latest_money_exchange_time;
          }
        }, response => {
          // error callback
        });
    },
    initLog(){
      let params = {page:this.page,limit:20}
      this.$http.get(ajaxurl.baseUrl+ ajaxurl.exchangelog,{params}).then(res => {
        if(res.body.code === 0){
            let data = res.body.data;
            this.rateUpdate = data.list;
          }
      }, response => {
        // error callback
      });
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
.st-exchangerate-container{
  height:auto;
  min-height: 100%;
  background-color:#fff;
  color:#484848;
  padding-bottom: 10%;
  .st-exchangerate-update{
    padding: 8px 4%;
    .title{
      font-weight: 700;
      font-size:1.125rem;
      .st-icon{
        width:15px;
        height:15px;
        margin-top: 6px;
        margin-right: 4%;
        &.st-icon-title{
          background-image:url(../assets/icon-clock.png);
        }
        &.st-icon-new{
          background-image:url(../assets/icon-plane.png);
        }
      }
    }
    p{
      padding-left: 9%;
      font-size: .875rem;
      color: #6e6e6e;
    }
    .st-rateUpdate-list{
      font-size:.9375rem;
      margin-left:13%;
    }
  }
  .st-exchangerate-info{
    text-align:center;
    margin: 0 4px;
    border-left: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    .t-header{
      font-size:1rem;
      font-weight: 700;
    }
    .t-body{
      font-size: .875rem;
    }
    .t-header,.t-body{
      display:flex;
      .st-td{
        flex:1;
        padding: 12px 0;
        border-top: 1px solid #dcdcdc;
        border-right: 1px solid #dcdcdc;
        &.st-num{
          flex: 0.5;
        }
        .st-arrow{
          color:#d6d6d6;
        }
      }
      .st-icon{
        width:16px;
        height:16px;
        margin-top: 6px;
        margin-right: 5px;
        &.usa{
          background-image:url(../assets/icon-usa.png);
        }
        &.china{
          background-image:url(../assets/icon-china.png);
        }
        &.philippine{
          background-image:url(../assets/icon-philippine.png);
        }
        &:first-child{
          margin-left: 5px;
        }
        &:last-child{
          float:right;
        }
      }
    }
  }
}

</style>
