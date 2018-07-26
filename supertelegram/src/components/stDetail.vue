<template>
  <div class="st-detail-container">
    <div class="st-detail-info">
      <h1><i class="st-icon"></i>{{detailInfo.name}}</h1>
      <p><i class="st-icon"></i><span>适合：</span><span>{{detailInfo.fit}}</span></p>
      <p><i class="st-icon"></i><span>人均消费：</span><span>{{detailInfo.per_consumption}}</span></p>
      <p><i class="st-icon"></i><span>地址：</span><span>{{detailInfo.address}}</span></p>
      <p><i class="st-icon"></i><span>介绍：</span><span>{{detailInfo.summary}}</span></p>
    </div>
    <div class="st-article-detail" v-html="detailInfo.content"></div>
  </div>
</template>

<script>
export default {
  name: 'stDetail',
  data () {
    return {
      detailInfo: {}
    }
  },
  mounted () {
    this.initDetailData();
  },
  methods:{
    initDetailData () {
      let urlParams = this.$route.params;
      let data={};
      if(urlParams.type === 'restaurants'){
        data = JSON.parse(window.localStorage.getItem('restaurants'));
      }
      if(urlParams.type === 'travels'){
        data = JSON.parse(window.localStorage.getItem('travels'));
      }
      data.forEach(el=>{
        if(el.id===urlParams.id) {
          this.detailInfo = el;
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .st-article-detail{
    padding: 5px 0;
    img{width:100%;}
  }
</style>
<style lang="scss" scoped>
%breakwords{
  word-wrap: break-word;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.st-icon{
  width:17px;
  height:17px;
  background-size:cover;
  display: block;
  float: left;
  margin-top: 3px;
  margin-right: 7px;
}
.st-detail-container{
  padding:15px 13px;
  background-color:#fff;
  height: auto;
  .st-detail-info{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    margin-bottom: 10px;
    h1{
      font-size:1.0625rem;
      .st-icon{
        width:21px;
        height:19px;
        margin-top: 4px;
        margin-right: 10px;
        background-image: url(../assets/icon-shop.png);
      }
    }
    p{
      font-size:.875rem;
      margin-top: 10px;
      color:#6e6e6e;
      &:nth-child(2){
        .st-icon{
          background-image: url(../assets/icon-people.png);
        }
      }
      &:nth-child(3){
        .st-icon{
          background-image: url(../assets/icon-cost.png);
        }
      }
      &:nth-child(4){
        .st-icon{
          background-image: url(../assets/icon-location-detail.png);
        }
      }
      &:nth-child(5){
        .st-icon{
          background-image: url(../assets/icon-intro.png);
        }
      }
    }
  }
}
</style>
