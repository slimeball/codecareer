<template>
  <section id="screenContainer" class="screen-container">
    <div id="screenInner" class="screen-inner" ref="screenInner" @click="contextMenuVisible = false">
      <div class="screen-mask"></div>
      <ul class="screen-list">
        <li class="screen-listitem" v-for="(item, index) in messages" :key="index">
          <div class="warning-msg" v-if="item.messageStyle == 0">
            <span>提示：</span>
            <span>{{item.text}}</span>
          </div>

          <div class="system-msg" v-if="item.messageStyle == 1">
            <span>系统消息：</span>
            <span v-html="item.ct"></span>
          </div>
          <div class="welcome-msg" v-if="item.messageStyle == 2">
            <span>欢迎</span>
            <span class="username"> {{item.ct.user_nicename}} </span>
            <span>进入频道</span>
          </div>

          <div class="chat-msg" v-if="item.messageStyle == 3">
            <span class="ICON-noble-level" :class="['ICON-nl-' + item.level]"></span>
            <span class="username">{{item.uname}}：</span>
            <span class="user-msg" v-html="item.ct"></span>
          </div>

          <div class="envelope-msg" @click="getRedEnvelop(item)" v-if="item.messageStyle == 4">
            <span>提示：</span>
            <span>{{item.user_nicename}}发了一个{{item.typeName}}红包，点击领取</span>
            <span class="revelop-mini"></span>
          </div>

          <div class="SendGift" v-if="item.messageStyle == 5">
            <span class="icon-name">{{item.uname}}</span>
            <span class="icon-zengs">赠送 </span>
            <span class="icon-gifname">{{item.ct.giftname}}<img :src="item.ct.gifticon"></span>
            <span class="icon-x">&#10006;</span>
            <span class="icon-gifgroup">{{item.giftGroupNum}}</span>
          </div>

          <div class="system-msg" v-if="item.messageStyle == 6">
            <span>系统消息：</span>
            <span>本次直播已结束，{{item.touname}}的直播已经开启，{{leftSecond}}秒后将自动切换直播间</span>
          </div>
        </li>
      </ul>

      <transition name="gifslide" v-for="(item,index) in SendGiftObj" :key="index"  v-on:after-enter="gifshowHide" node="in-out" >
          <div v-show="gifshow" v-html="item" ></div>
      </transition>

      <transition name="fade">
        <red-envelope v-show="showRedEnvelop" @closeRedEnvelop="showRedEnvelop = false" :info="redEnvelopInfo"></red-envelope>
      </transition>
    </div>
    <!-- 百万答题活动入口 答题区-->
    <ma-container></ma-container>
    <ma-entrance v-show="isHaveActivity"></ma-entrance>
    <!-- 竞猜活动 参与区 -->
    <quiz-visitor-pad-sidebar v-if="isShowQuizPad"></quiz-visitor-pad-sidebar>
    <!-- 右键功能 -->
    <context-menu class="right-menu" 
      :target="contextMenuTarget" 
      :show="contextMenuVisible" 
      @update:show="(show) => contextMenuVisible = show">
      <a href="javascript:void(0);" @click="clearScreen">清屏</a>
      <a href="javascript:void(0);" v-show="!isLock" @click="lockScreen">锁屏</a>
      <a href="javascript:void(0);" v-show="isLock" @click="cancelLockScreen">取消锁屏</a>
    </context-menu>
  </section>
</template>

<script>
import twemoji from "twemoji";
import { imgBaseUrl } from "src/config/env";
import Event from "src/utils/Event";
import { mapState, mapActions } from "vuex";
import redEnvelope from "src/components/redEnvelope";
// import contextMenu from 'src/components/contextMenu';
import { component as ContextMenu } from "@xunlei/vue-context-menu";
import tip from "src/mixins/tip";
import maEntrance from "./millionAnswerSidebar/maEntrance";
import maContainer from "./millionAnswerSidebar/maContainer";
import quizVisitorPadSidebar from './quizSidebar/quizVisitorPadSidebar'
export default {
  data() {
    return {
      messages: [],
      SendGiftObj: [],
      imgBaseUrl,
      showRedEnvelop: false,
      redEnvelopInfo: {}, //红包的具体信息
      leftSecond: 5,
      gifshow: false,
      contextMenuTarget: null,
      contextMenuVisible: false,
      isHaveActivity: false, // 是否有答题
      isLock: false
    };
  },
  components: {
    redEnvelope,
    maEntrance,
    maContainer,
    quizVisitorPadSidebar,
    ContextMenu
  },
  created() {
    this.isHaveActivity = JSON.stringify(window._DATA.activity) !== '{}';
    this.$bus.on(Event.ADD_MSG, this.addMsg);
  },
  beforeDestroy() {
    this.$bus.off(Event.ADD_MSG, this.addMsg);
  },
  mixins: [tip],
  mounted() {
    this.contextMenuTarget = this.$refs.screenInner;
  },
  computed: {
    ...mapState(['user', 'room', 'isShowActivity', 'isHaveQuiz', 'isShowQuizPad'])
  },
  props: [],
  methods: {
    /**
     * 清屏
     */
    clearScreen() {
      this.messages = [];
      this.contextMenuVisible = false;
    },
    /**
     * 锁屏
     */
    lockScreen() {
      this.isLock = true;
      this.contextMenuVisible = false;
    },

    /**
     * 锁屏
     */
    cancelLockScreen() {
      this.isLock = false;
      this.contextMenuVisible = false;
    },
    /**
     * 隐藏红包
     **/
    hideRedEnvelop() {
      this.showRedEnvelop = false;
    },

    /**
     * 获取红包
     **/
    getRedEnvelop(info) {
      if (!this.user || this.user.logged != 1) {
        this.warn("试玩账号不能领红包，请先登录");
        return;
      }
      this.redEnvelopInfo = info;
      this.showRedEnvelop = true;
    },

    /**
     * 添加消息
     * @param msg
     * 前端自定义messageStyle:  提醒：0  系统公告：1   用户进入房间:2   用户发送消息: 3    红包： 4  送礼物：5
     */
    addMsg(msgObject) {
      // debugger;
      const msgmethod = msgObject._method_;

      switch (msgmethod) {
        case "clearScreen": //房间清屏
          this.messages = [];
          this.messages.push({
            messageStyle: 1,
            ct: "发言列表被清除"
          });
          // return;
          break;
        case "warning": //提示
          msgObject.messageStyle = 0;
          break;
        case "SystemNot": //系统消息
        case "channel_gap": //房间禁言
        case "ShutUpUser": //用户禁言
        case "changeVest": //设置马甲
          msgObject.messageStyle = 1;
          break;
        case "SendMsg":
          if (msgObject.msgtype == 0) {
            msgObject.messageStyle = 2; //用户进入房间
          } else if (msgObject.msgtype == 2) {
            msgObject.ct = twemoji.parse(msgObject.ct);
            msgObject.messageStyle = 3; //发送消息
          }
          break;
        case "SendRedPack": //发送红包
          // redPacketType 0表示普通红包  1表示口令红包
          if (msgObject.redPacketType == 0) {
            msgObject.typeName = "普通";
          } else if (msgObject.redPacketType == 1) {
            msgObject.typeName = "口令";
          }
          msgObject.status = 0; //默认是未抢状态
          msgObject.receiveMoney = 0; //默认抢到的钱是0元
          msgObject.messageStyle = 4;
          break;
        case "SendGift": //礼物
          msgObject.messageStyle = 5;
          if (!msgObject.html) {
            //从pc端发过来的送礼数据
            msgObject.html =
              '<div class="gifshow"><span class="gif-use"><img src="' +
              msgObject.uhead +
              '"></span><span class="gif-name">' +
              msgObject.uname +
              '</span><span class="gif-numname">' +
              msgObject.ct.giftname +
              "x" +
              msgObject.ct.giftGroupNum +
              '</span><span class="gif-img"><img src="' +
              msgObject.ct.gifticon +
              '"></span><span class="gif-num">' +
              "x" +
              msgObject.ct.giftGroupNum +
              "</span></div>";
          }
          this.SendGiftObj.push(msgObject.html);
          this.$nextTick(function() {
            this.gifshow = true;
          });
          break;
        case "switchLive": //切换主播
          if (this.room.id != msgObject.roomid) return; //验证房间号是否相同
          msgObject.messageStyle = 6;
          this.countdown(msgObject);
          break;
        case "KickUser": // 用户被踢出
          let _this= this;
          this.warn("你已被踢出房间");
          window.location.reload();
        default:
          return;
      }
      this.messages.push(msgObject);
      // console.log(this.SendGiftObj);
      setTimeout(() => {
        !this.isLock && this.scrollToEnd();
      });
    },

    gifshowHide() {
      this.gifshow = false;
    },

    /**
     * 滚动到底部
     */
    scrollToEnd() {
      var container = this.$el.querySelector("#screenInner");
      container.scrollTop = container.scrollHeight;
    },

    /**
     * 倒计时
     */
    countdown(msgObject) {
      if (this.leftSecond == 0) {
        refreshSliderLive();
        setTimeout(() => {
          location.href =
            `index.php?g=home&m=member&a=sidebar&roomid=${
              msgObject.touid
            }&init=1&source=` + encodeURIComponent(sourceUrl);
        }, 100);
        return;
      }
      setTimeout(() => {
        this.leftSecond -= 1;
        this.countdown(msgObject);
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
.answer-entrance {
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
}
// .answer-box{
//   height: 500px;
// }
/****礼物动画*****/

.gifslide-enter {
  opacity: 0;
  transform: translateX(300px);
}
.gifslide-enter-active {
  transition: all 0.5s;
}

.gifslide-leave-active {
  opacity: 0;
}

.gifshow {
  position: absolute;
  width: 175px;
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  left: 0px;
  font-weight: normal;

  .gif-use {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 40px;
    width: 40px;
    border: 1px solid #ffcc01;
    border-radius: 20px;
    overflow: hidden;
    color: #fff;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .gif-name {
    position: absolute;
    top: 0px;
    left: 45px;
    width: 65px;
    height: 20px;
    overflow: hidden;
    color: #ffcc01;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .gif-numname {
    position: absolute;
    bottom: 3px;
    left: 40px;
    width: 65px;
    height: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffcc01;
    transform: scale(0.9);
    white-space: nowrap;
  }
  .gif-img {
    position: absolute;
    right: 15px;
    top: 2px;
    height: 35px;
    width: 35px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .gif-num {
    position: absolute;
    right: -65px;
    height: 30px;
    top: 6px;
    width: 60px;
    color: #ff3366;
    font-size: 18px;
  }
}

.chat-msg .user-msg .emoji {
  width: 20px;
  height: 20px;
  margin: 0 2px;
}
// 系统推送过来的a节点没有scoped标记
.system-msg {
  span > a {
    color: #ffd12a;
    text-decoration: underline;
  }
}
</style>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.screen-container {
  /*padding-bottom: 150px;*/
  // margin-top: 10px;
  /*padding: 0px 2px 10px 8px;*/
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: normal;
}

.screen-inner {
  overflow-y: scroll;
  position: absolute;
  top: 10px;
  left: 8px;
  bottom: 0;
  right: -17px;
}

.screen-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 18px;
  /*background:url("../images/chat_bg.png") repeat-x left top;*/
}

.screen-list {
  padding-right: 20px;
}

.screen-listitem {
  color: #ffffff;
  padding: 3px 0;
}

.warning-msg {
  color: #fe819b;
}

.system-msg {
  color: #fe819b;
  /*color: #ffff00;*/
}

.chat-msg {
  /*background-color: rgba(0, 0, 0, 0.2);*/
  border-radius: 6px;
  display: inline-block;
  padding-left: 2px;
  // span {
  //   float: left;
  // }
}

.envelope-msg {
  color: #ffe172;
  /*color: #fe819b;*/
  cursor: pointer;
  .revelop-mini {
    display: inline-block;
    width: 18px;
    height: 24px;
    background: url("../images/revelop_mini.png");
    position: relative;
    top: 7px;
    margin-left: 3px;
  }
}

.welcome-msg .username {
  color: #00ffa7;
}

.chat-msg .username {
  color: #00ffa7;
}

.chat-msg .user-msg {
  padding-right: 5px;
}

.ICON-noble-level {
  display: inline-block;
  width: 43px;
  height: 17px;
  vertical-align: middle;
  background: url("/public/home/show/images/level_v7.png") no-repeat;
  float: left;
  margin-right: 3px;
}

.SendGift {
  .icon-zengs {
    color: #ffe172;
  }

  .icon-name {
    color: #00ffa7;
  }

  .icon-gifname {
    color: #ffe172;

    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-left: 5px;
    }
  }

  .icon-x {
    color: #ffe172;
  }
  .icon-gifgroup {
    color: #ffe172;
  }
}

.ICON-nl-1 {
  background-position: 0 -40px;
}

.ICON-nl-2 {
  background-position: 0 -80px;
}

.ICON-nl-3 {
  background-position: 0 -120px;
}

.ICON-nl-4 {
  background-position: 0 -160px;
}

.ICON-nl-5 {
  background-position: 0 -200px;
}

.ICON-nl-6 {
  background-position: 0 -240px;
}

.ICON-nl-7 {
  background-position: 0 -280px;
}

.ICON-nl-8 {
  background-position: 0 -320px;
}

.ICON-nl-9 {
  background-position: 0 -360px;
}

.ICON-nl-10 {
  background-position: 0 -400px;
}

.ICON-nl-11 {
  background-position: 0 -440px;
}

.ICON-nl-12 {
  background-position: 0 -480px;
}

.ICON-nl-13 {
  background-position: 0 -520px;
}

.ICON-nl-14 {
  background-position: 0 -560px;
}

.ICON-nl-15 {
  background-position: 0 -601px;
}

.ICON-nl-16 {
  background-position: 0 -640px;
}

.ICON-nl-17 {
  background-position: 0 -680px;
}

.ICON-nl-18 {
  background-position: 0 -720px;
}

.ICON-nl-19 {
  background-position: 0 -760px;
}

.ICON-nl-20 {
  background-position: 0 -800px;
}

.ICON-nl-21 {
  background-position: 0 -840px;
}

.ICON-nl-22 {
  background-position: 0 -880px;
}

.ICON-nl-23 {
  background-position: 0 -920px;
}

.ICON-nl-24 {
  background-position: 0 -960px;
}

.ICON-nl-25 {
  background-position: 0 -1000px;
}

.ICON-nl-26 {
  background-position: 0 -1040px;
}

.ICON-nl-27 {
  background-position: 0 -1080px;
}

.ICON-nl-28 {
  background-position: 0 -1120px;
}

.ICON-nl-29 {
  background-position: 0 -1160px;
}

.ICON-nl-30 {
  background-position: 0 -1200px;
}

.ICON-nl-31 {
  background-position: 0 -1240px;
}

.ICON-nl-32 {
  background-position: 0 -1280px;
}

.ICON-nl-33 {
  background-position: 0 -1320px;
}

.ICON-nl-34 {
  background-position: 0 -1360px;
}

.ICON-nl-35 {
  background-position: 0 -1400px;
}

.ICON-nl-36 {
  background-position: 0 -1440px;
}

.ICON-nl-37 {
  background-position: 0 -1480px;
}

.ICON-nl-38 {
  background-position: 0 -1520px;
}

.ICON-nl-39 {
  background-position: 0 -1560px;
}

.ICON-nl-40 {
  background-position: 0 -1600px;
}

.ICON-nl-41 {
  background-position: 0 -1640px;
}

.ICON-nl-42 {
  background-position: 0 -1680px;
}

.ICON-nl-43 {
  background-position: 0 -1720px;
}

.ICON-nl-44 {
  background-position: 0 -1760px;
}

.ICON-nl-45 {
  background-position: 0 -1800px;
}

.ICON-nl-46 {
  background-position: 0 -1840px;
}

.ICON-nl-47 {
  background-position: 0 -1880px;
}

.ICON-nl-48 {
  background-position: 0 -1920px;
}

.ICON-nl-49 {
  background-position: 0 -1960px;
}

.ICON-nl-50 {
  background-position: 0 -2000px;
}

.ICON-nl-51 {
  background-position: 0 -2040px;
}

.ICON-nl-52 {
  background-position: 0 -2080px;
}

.ICON-nl-53 {
  background-position: 0 -2120px;
}

.ICON-nl-54 {
  background-position: 0 -2160px;
}

.ICON-nl-55 {
  background-position: 0 -2200px;
}

.ICON-nl-56 {
  background-position: 0 -2240px;
}

.ICON-nl-57 {
  background-position: 0 -2280px;
  width: 65px;
}

.ICON-nl-58 {
  background-position: 0 -2320px;
  width: 65px;
}

.ICON-nl-59 {
  background-position: 0 -2360px;
  width: 65px;
}

.ICON-nl-60 {
  background-position: 0 -2400px;
  width: 65px;
}

.ICON-nl-61 {
  background-position: 0 -2440px;
  width: 65px;
}

.ICON-nl-62 {
  background-position: 0 -2480px;
  width: 65px;
}

.ICON-nl-63 {
  background-position: 0 -2520px;
  width: 65px;
}

.ICON-nl-64 {
  background-position: 0 -2560px;
  width: 65px;
}

.ICON-nl-65 {
  background-position: 0 -2600px;
  width: 65px;
}

.ICON-nl-66 {
  background-position: 0 -2640px;
  width: 65px;
}

.ICON-nl-67 {
  background-position: 0 -2680px;
  width: 65px;
}

.ICON-nl-68 {
  background-position: 0 -2720px;
  width: 65px;
}

.ICON-nl-69 {
  background-position: 0 -2760px;
  width: 65px;
}

.ICON-nl-70 {
  background-position: 0 -2800px;
  width: 65px;
}

.ICON-nl-no {
  background: none;
  overflow: hidden;
  width: 0;
}

.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}
.right-menu a {
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}
.right-menu a:hover {
  background: #eee;
  // color: #fff;
  // background: #437ff9;
}
</style>
