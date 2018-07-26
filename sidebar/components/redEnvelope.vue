<template>
  <div class="envelop-box">
    <div class="envelop-close" @click="closeRedEnvelop"></div>
    <!--未抢状态0-->
    <div v-show="info.status == 0">
      <div class="envelop-user-avatar">
        <img :src="info.avatar"/>
      </div>

      <!--普通红包-->
      <div v-if="info.redPacketType == 0">
        <div>
          <p class="mr10">{{info.user_nicename}}</p>
          <p class="mr5">发送了一个{{info.typeName}}红包</p>
        </div>
        <div class="envelop-blessing mr10" style="font-size:14px;">{{info.title}}</div>
        <div class="envelop-rob" @click="rob"></div>
      </div>
      <!--口令红包-->
      <div v-if="info.redPacketType == 1">
        <div>
          <p class="mr5">{{info.user_nicename}}</p>
          <p class="mr3">发送了一个{{info.typeName}}红包</p>
        </div>
        <div class="envelop-blessing mr5">口令：{{info.title}}</div>
        <div><input class="envelop-password mr10" type="text" placeholder="请输入口令" v-model="commandInput" /></div>
        <div class="envelop-rob" @click="rob"></div>
      </div>

    </div>

    <!--已被抢完状态1-->
    <div v-show=" info.status == 1">
      <div class="envelop-user-avatar">
        <img :src="info.avatar"/>
      </div>

      <!--普通红包-->
      <div v-if="info.redPacketType == 0">
        <div>
          <p class="mr10">{{info.user_nicename}}</p>
          <p class="mr5">发送了一个{{info.typeName}}红包</p>
        </div>
        <div class="envelop-blessing mr10" style="font-size:14px;">{{info.title}}</div>
      </div>
      <!--口令红包-->
      <div v-if="info.redPacketType == 1">
        <div>
          <p class="mr5">{{info.user_nicename}}</p>
          <p class="mr3">发送了一个{{info.typeName}}红包</p>
        </div>
        <div class="envelop-blessing mr5">口令：{{info.title}}</div>
      </div>
      <div class="envelop-late">来晚一步，红包被抢完了</div>
    </div>


    <!--抢成功状态2-->
    <div class="envelop-success" v-show="info.status == 2">
        <p class="envelop-success-tip">恭喜你抢到了一个红包</p>
        <div>
          <h3 class="envelop-noney">{{info.receiveMoney}}</h3>
          <span class="envelop-unit">券</span>
        </div>
        <div class="envelop-store-tip">已存入直播券</div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import {robRedPackets} from '../utils/getData';
  import tip from 'src/mixins/tip'
  import {imgBaseUrl} from 'src/config/env';
  import alertTip from 'src/components/alertTip'
  import Event from 'src/utils/Event';

  export default {
    data() {
      return {
        imgBaseUrl,
        // status: 0,
        commandInput: "",
        // receiveMoney: 0
      }
    },
    updated() {
    },
    mixins: [tip],
    components: {
      alertTip
    },
    props: ['info'],
    computed: {
      ...mapState([
        'user',
        'room'
      ]),
    },
    methods: {
      closeRedEnvelop() {
        this.commandInput = '';
        this.$emit('closeRedEnvelop');
      },
      async rob() {
        const info = this.info;
        if(info.redPacketType == 1) {
          if(!this.commandInput) {
            this.showTip('请输入口令');
            return;
          }
          if(this.commandInput != info.title) {
            this.showTip('口令不一致');
            return;
          }
        }
        try {
          let res = await robRedPackets({
            uid: this.user.id,
            token: this.user.token,
            sendRedUid: info.sendRedUid,
            liveuid: this.room.id,
            sendtime: info.sendtime,
            type: info.redPacketType,
            title:  info.title
          });
          const data = res.data;
          if(data.code == 0) {
            this.info.status = 2;
            this.info.receiveMoney = data.info[0].liveCoin;
            const user = this.user;
            var msg = {
              "msg": [{
                "_method_": "SendMsg",
                "action": 0,
                "ct": info.title,
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
          } else {
            if(data.code == 1001) { //红包已抢完
              this.info.status = 1;
            }
            this.showTip(data.msg);
            this.closeRedEnvelop();
          }
        } catch (e) {
          this.showTip('抢红包失败');
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .envelop-box {
    background: url('../images/envelop_bg.png') no-repeat;
    width: 200px;
    height: 266px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -133px 0 0 -100px;
    color: #ffe2b1;
    text-align: center;
  }
  .envelop-close {
    background: url('../images/envelop_close.png') no-repeat 20px 10px;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0px;
    right: 0px;
    /*cursor: pointer;*/
  }

  .envelop-user-avatar {
    width: 34px;
    height: 34px;
    margin: 14px auto 0;
    border-radius: 34px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 34px;
    }
  }

  .envelop-late {
    margin-top: 80px;
  }

  .envelop-success-tip {
    margin-top: 60px;
  }

  .envelop-noney {
    font-size: 40px;
    display: inline-block;
    margin-top: 30px;
  }

  .envelop-unit {
    font-size: 16px;
  }
  .envelop-store-tip {
    margin-top: 65px;
  }

  .envelop-blessing {
    /*font-size: 14px;*/
    /*margin-top: 20px;*/
  }

  .envelop-blessing {
    /*margin-top: 10px;*/
  }

  .envelop-password {
    width: 140px;
    height: 22px;
    line-height: 22px;
    border-radius: 22px;
    padding-left: 10px;
    margin-top: 10px;
    font-size: 12px;
  }

  .envelop-rob{
    background: url('../images/revelop_rob.png');
    width: 70px;
    height: 70px;
    /*margin: 18px auto 0;*/
    cursor: pointer;
    position: absolute;
    left: 50%;
    margin-left: -35px;
    bottom: 38px;
  }
  .mr3 {
    margin-top: 3px;
  }
  .mr5 {
    margin-top: 5px;
  }
  .mr10 {
    margin-top: 10px;
  }
</style>
