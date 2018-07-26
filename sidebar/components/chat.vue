<template>
  <!--<div class="chat" @click="disabledChat">-->
  <div class="chat">
    <div class="d-flex align-items-center">
      <chat-user :hideDropdown="hideDropdown" />
      <chat-emoji :hideDropdown="hideDropdown" v-on:getEmojiMsg="getEmojiMsg" />
    <!--   <div class="chat-reply" @click.stop="toggleQuickChat">
        <img src="../images/reply.png"/>
      </div> -->
      <div class="col">
        <!--<input class="chat-input" v-model="chatMsg" type="text" placeholder="撩她一下..." @keyup.enter="send" :disabled="!user || user.logged != 1" :maxlength="room.chat_num" />-->
        <input class="chat-input" v-model="chatMsg" type="text" placeholder="撩她一下..." @keyup.enter="send"
               :maxlength="room.chat_num" @input="setButtonStatus" />
      </div>
      <!--<button class="chat-send-button" @click.prevent="send" :disabled="!user || user.logged != 1">发送</button>-->
      <button class="chat-send-button" v-bind:class="{ 'chat-button-active': buttonIsActive }" @click.prevent="send">发送</button>
    </div>

    <!-- 快捷回复内容 -->
    <div class="chat-quick" v-show="quickChatStatus">
      <ul>
        <li v-for="(item, index) in quickChats" :key="index" @click.stop="setQuickChat(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import Event from 'src/utils/Event';
  import {checkChannelShutUp, checkUserShutUp} from '../utils/getData';
  import tip from 'src/mixins/tip'
  import chatUser from './chatUser'
  import chatEmoji from './chatEmoji'

  export default {
    props: ['hideDropdown'],
    data() {
      return {
        chatMsg: "",
        quickChatStatus: false,
        isHitsInterval: false,
        buttonIsActive: false,
        quickChats: [
          '主播棒棒美美哒',
          '我们会陪着你的',
          '加油↖(^ω^)↗',
          '财运滚滚来',
          '恭喜发财'
        ],
        channelShutUp: null,
        showChatUsername: false
        // userShutUp: null
      }
    },
    mounted() {
    },
    created() {
      this.$bus.on(Event.CHAT_EVENT, this.dealChatEvent);
    },
    beforeDestroy() {
      this.$bus.off(Event.CHAT_EVENT, this.dealChatEvent);
    },
    components: {
      chatUser,
      chatEmoji
    },
    mixins: [tip],
    computed: {
      ...mapState([
        'user',
        'room'
      ]),
    },
    watch: {
      //监听父级传来的排序方式
      hideDropdown: function(value) {
        this.quickChatStatus = false
      }
    },
    methods: {
      setButtonStatus() {
        if(this.chatMsg.length > 0) {
          this.buttonIsActive = true;
        } else {
          this.buttonIsActive = false;
        }
      },

      /**
       * 处理事件
       **/
      dealChatEvent(msgObject) {
        // debugger;
        const msgmethod = msgObject._method_;

        switch (msgmethod) {
          case "channel_gap": //禁言和解除禁言
            if(msgObject.action == 0) {
              this.channelShutUp = true;
            } else if (msgObject.action == 1) {
              this.channelShutUp = false;
            }
            break;
        }
      },
      /**
       * 设置快捷发言
       **/
      setQuickChat(msg) {
        this.chatMsg = msg;
        this.send();
        this.quickChatStatus = false;
      },

      /**
       * 切换快捷发言状态
       **/
      toggleQuickChat() {
        this.quickChatStatus = !this.quickChatStatus;
      },
      
      getEmojiMsg(emojiStr) {
        this.chatMsg += emojiStr;
      },
      
      /**
       *  试玩账号不能聊天
       **/
      disabledChat() {
        if (!this.user || this.user.logged != 1) {
          this.warn("试玩账号不能聊天哦，快快注册吧~");
        }
      },

      /**
       * 判断频道是否禁言
       **/
      async isChannelShutUp() {
        if(this.channelShutUp != null) { //第一次发言检查房间是否禁言
          if(this.channelShutUp) {
            this.warn("该频道被禁言");
          }
          return this.channelShutUp;
        }

        let res = await checkChannelShutUp(this.room.id, this.room.typeId);
        // if (res.data.is_shut_up == true || res.data.is_shut_up == 'true') {
        //   this.warn("该频道被禁言");
        //   return true;
        // }
        if (res.info == 1) {
          this.warn("该频道被禁言");
          return true;
        }
        return false;
      },

      /**
       * 判断用户是否被禁言
       **/
      async isUserShutUp() {
        let res = await checkUserShutUp(this.room.id, this.room.typeId);
        if (res.info == 1) {
          this.warn("你已经被禁言");
          return true;
        }
        return false;
      },

      async send() {
        const user = this.user;
        if (parseInt(user.id) < 0) {
            this.warn("请登录");
            return;
        }
        if (!this.checkChat()) {
          return;
        }
        // if (user.logged == 1) { //登陆
          this.channelShutUp = await this.isChannelShutUp();
          if (this.channelShutUp == false) {
              let userShutUp = await this.isUserShutUp();
              if(userShutUp == false) {
                this.sendChat();
              }
          }
        // } else { //非登陆
        // }
      },
      /**
       * 检查是否可以聊天
       * @returns {boolean}
       */
      checkChat() {
        const room = this.room;
        const user = this.user;

        // 检查是否是空消息
        if (!this.chatMsg.replace(/(^\s*)|(\s*$)/g, "")) {
          return false;
        }

        // 检查发言频率
        if (user && !room.userIsAnchor && this.isHitsInterval) {
          this.warn("您发言频率太快,请稍候再发送")
          this.chatMsg = "";
          return false;
        }
        return true;
      },

      /**
       * 发送消息
       */
      sendChat() {
        if(!this.chatMsg) return;
        const room = this.room;
        const user = this.user;
        var msg = {
          "msg": [{
            "_method_": "SendMsg",
            "action": 0,
            "ct": this.chatMsg,
            "msgtype": "2",
            "isfilter": "0",
            "tougood": "",
            "touid": "",
            "touname": "",
            "ugood": user.id,
            "uid": user.id,
            "uname": user.user_nicename,
            "level": user.level
          }],
          "retcode": "000000",
          "retmsg": "OK"
        };
        this.$bus.emit(Event.EMIT_EVENT, msg);
        this.chatMsg = "";
        let chatRrequency = room.chat_frequency > 0 ? room.chat_frequency : 2; //如果没有发言频率，则默认为2秒
        this.isHitsInterval = true;
        setTimeout(() => {
          this.isHitsInterval = false;
        }, chatRrequency * 1000)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .chat {
    position: relative;
    margin-bottom: 28px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    height: 30px;
    z-index: 999;
  }

  .chat-quick {
    position: absolute;
    z-index: 2;
    top: -30 * 5px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);

    li {
      height: 30px;
      line-height: 30px;
      color: #ffffff;
      width: 100%;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #ff3366;
      }
    }
  }

  .chat-reply {
    cursor: pointer;
    width: 30px;
    height: 30px;
    text-align: center;
    img {
      width: 30px;
      height: 30px;
      vertical-align: top;
    }
  }

  .chat-input {
    background: none;
    width: 100%;
    height: 22px;
    float: left;
    padding: 0 3px 0 0;
    font-size: 12px;
    color: #ffffff;
    outline: none;

    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #999999;
      opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #999999;
    }

    &::-ms-input-placeholder { /* Microsoft Edge */
      color: #999999;
    }
  }

  .chat-send-button {
    background: none;
    width: 40px;
    height: 30px;
    font-size: 12px;
    color: #bbbbbb;
    cursor: pointer;
    border-radius: 2px;

    &.chat-button-active {
      background-color: #f36;
      color: #ffffff;
    }
  }
</style>
