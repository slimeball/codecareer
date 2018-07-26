<template>
  <div class="st-container">
    <keep-alive :include="['stList']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'SpTel'
}
</script>

<style>
* {margin: 0; padding: 0;box-sizing: border-box; }
html,body{width: 100%;height:100%;min-width: 320px;}
html {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 1.6 }
body {-webkit-touch-callout: none; font-family: -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif; color: #0b0b0b; background-color: #efefef; letter-spacing: .034em }
h1,h2,h3,h4,h5,h6 {font-weight: 400; font-size: 1rem }
a {color: #576b95; text-decoration: none; -webkit-tap-highlight-color: rgba(0,0,0,0)}
.fl-l{float: left;}
.fl-r{float: right;}
.clearfix::after{content: "";clear: both;display: block;}
i{font-style:normal;}
</style>

<style scoped>
  .st-container{height: 100%;}
</style>