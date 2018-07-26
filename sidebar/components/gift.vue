<template>

  <div class="swipers" ref="swipers">
    <swiper :options="swiperOption" ref="swiper">
      <swiper-slide v-for="(item,idx) in gift" :key="idx">
        <div class="gifcenter" :class="[{ 'act': idx == isAct},{'show':idx == isShow}]" v-on:mouseenter="gifhover(item,idx,$event)"
          v-on:mouseleave="gifleave" v-on:click="gifclick(item,idx)">
          <img :src="item.gifticon" :alt="item.giftname" onerror="this.src='/public/images/gift-default.png'">
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>

    <div class="gifmoreshow" ref="gifmoreshow" v-show="showGifmoreshow">
      <img class="ticon" :src="selectedHoverGift.gifticon" :alt="selectedHoverGift.giftname" onerror="this.src='/public/images/gift-default.png'">
      <div class="coin">
        <span class="coinRmg">{{selectedHoverGift.needcoin}}</span>
      </div>
      <div class="name">{{selectedHoverGift.giftname}}</div>
    </div>

    <div class="gifgroup" v-on:mouseleave="sendGrouHide">
      <input type="text" value="1" maxlength="4" ref="giftValue" class="sed_mun" :class="{'act':act}" v-on:input="sendGroupIpt"
        v-on:click="sendGroupShow">

      <ul class="giftGroup" v-show="show">
        <li v-for="(item,index) in giftGroupLists" :key="index" :data-value="item.group_val" v-on:click="sendGroupval($event)">{{item.group_val}}{{item.group_name}}</li>
      </ul>
    </div>
    <div class="kf-recharge-info">
      <span class="kf-live-tikcet fl-l" v-if="isShowQuizPad" :title="quizLiveTicket">{{quizLiveTicket}}</span>
      <!-- <a href="deposit.htm" target="_blank">充值</a> -->
      <span class="kf-quiz-entrance fl-l" v-if="isHaveQuiz" v-on:click="swichQuizPad()"><img src="../images/quiz-icon.png"></span>
    </div>

    <div class="sed_zengS" v-on:click="sed_zengS">赠送</div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import Event from "../utils/Event";
  import { checkSendGift, quizGameList } from "../utils/getData";
  import tip from "../mixins/tip";
  import { QUIZ_VISITOR_LIST, IS_HAVE_QUIZ, IS_SHOW_QUIZ_PAD } from '../store/mutation-types'

  import "swiper/dist/css/swiper.css";
  import {
    swiper,
    swiperSlide
  } from "vue-awesome-swiper";

  export default {
    data() {
      return {
        swiperOption: {
          notNextTick: true,
          autoplay: false,
          observer: true,
          observeParents: true,
          slidesPerView: 7,
          slidesPerGroup: 7,
          allowTouchMove: false,
          navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next"
          },
          breakpoints: {
            550: {
              slidesPerView: 6,
              slidesPerGroup: 6
            },

            450: {
              slidesPerView: 5,
              slidesPerGroup: 5
            },

            350: {
              slidesPerView: 4,
              slidesPerGroup: 4
            }
          }
        },
        selectedHoverGift: {},
        isAct: null,
        isShow: null,
        show: false,
        act: false,
        gifVlueflag: true,
        gifObjValue: {},
        giftGroupLists: _DATA.giftGroupLists,
        showGifmoreshow: false,
        isAgreeUseCny: false, // 是否同意使用人民币
      };
    },
    created() {
      this.$bus.on(Event.CHECK_QUIZ, this.checkquiz);
    },
    beforeDestroy() {
      this.$bus.off(Event.CHECK_QUIZ, this.checkquiz);
    },
    mounted() {
      this.checkquiz();
    },
    components: {
      swiper,
      swiperSlide
    },
    mixins: [tip],
    computed: {
      swiper() {
        return this.$refs.swiper.swiper;
      },
      ...mapState(['live', 'gift', 'user', 'room', 'isShowQuizPad', 'isHaveQuiz', 'quizLiveTicket'])
    },
    methods: {
      ...mapMutations(['QUIZ_VISITOR_LIST', 'IS_HAVE_QUIZ', 'IS_SHOW_QUIZ_PAD']),
      // 检测是否有竞猜
      async checkquiz () {
        let sendData = {live_id:_DATA.anchor.id};
        let res = await quizGameList(sendData);
        if(res.code===0){
          if(res.data.list.length>0){
            this.QUIZ_VISITOR_LIST(res.data);
            this.IS_HAVE_QUIZ(true);
          }
        } else {
          this.warn(res.msg);
        }
      },
      // 切换竞猜板
      swichQuizPad(){
        this.IS_SHOW_QUIZ_PAD(true);
      },
      gifhover(gift, idx, e) {
        let evt = window.event || e;
        this.selectedHoverGift = gift;
        this.isAct = idx;
        this.showGifmoreshow = true;
        if (
          evt.x + this.$refs.gifmoreshow.offsetWidth <=
          this.$refs.swiper.$el.offsetWidth
        ) {
          this.$refs.gifmoreshow.style.left =
            evt.target.getBoundingClientRect().x -
            this.$refs.swipers.getBoundingClientRect().x +
            "px";
          this.$refs.gifmoreshow.style.right = "auto";
        } else {
          this.$refs.gifmoreshow.style.right =
            Math.abs(
              evt.target.getBoundingClientRect().x -
              this.$refs.swipers.getBoundingClientRect().x -
              this.$refs.swiper.$el.offsetWidth
            ) + "px";
          this.$refs.gifmoreshow.style.left = "auto";
        }
      },

      gifleave() {
        this.isAct = null;
        this.showGifmoreshow = false;
      },

      gifclick(item, idx) {
        this.gifObjValue = item;
        this.isShow = idx;
      },

      sendGroupIpt() {
        this.show = false;
        if (!Number(this.$refs.giftValue.value)) {
          this.$refs.giftValue.value = 1;
        }
      },

      sendGroupShow(index) {
        if (this.show) {
          this.show = false;
          this.act = false;
        } else {
          this.show = true;
          this.act = true;
        }
      },

      sendGrouHide() {
        this.show = false;
        this.act = false;
      },

      sendGroupval(e) {
        let evt = window.event || e;
        this.$refs.giftValue.value = evt.target.getAttribute("data-value");
        this.sendGrouHide();
      },

      /**
       * 使用人民币赠送礼物
       */
      async sendGiftUseCny() {
        const data = await checkSendGift(
          this.room.id,
          this.gifObjValue.id,
          this.live.showid,
          this.$refs.giftValue.value,
          1
        );
        // var data = JSON.parse(data);

        if (data.errno == 0) {

          if (data.iswin == 1) {
            this.warn("恭喜您中得" + data.winLiveCoin + "直播券");
          }

          let msg = {
            msg: [{
              _method_: "SendGift",
              evensend: data.evensend,
              action: "0",
              ct: data.gifttoken,
              msgtype: "1",
              level: data.level,
              giftGroupNum: data.giftGroupNum,
              uid: data.uid,
              // "timestamp":'WlTools.FormatNowDate()',
              uname: this.user.user_nicename,
              uhead: this.user.avatar,
              html: '<div class="gifshow"><span class="gif-use"><img src="' +
                this.user.avatar +
                '"></span><span class="gif-name">' +
                this.user.user_nicename +
                '</span><span class="gif-numname">' +
                data.giftname +
                "x" +
                data.giftGroupNum +
                '</span><span class="gif-img"><img src="' +
                data.gifticon +
                '"></span><span class="gif-num">' +
                "x" +
                data.giftGroupNum +
                "</span></div>"
            }],
            retcode: "000000",
            retmsg: "OK"
          };

          this.$bus.emit(Event.EMIT_EVENT, msg);
          // this.warn(this.user.user_nicename + " " + data.charge_msg);
        } else {
          this.warn(data.msg);
        }
      },

      /**
       * 赠送礼物
       */
      async SendGift() {
        let res = await checkSendGift(
          this.room.id,
          this.gifObjValue.id,
          this.live.showid,
          this.$refs.giftValue.value,
          0
        );

        if (res.errno == 1003) {
          if (!this.isAgreeUseCny) {
            this.$modal.show('dialog', {
              // title: 'Alert!',
              maxWidth: 200,
              text: '您的直播券不足，是否使用' + res.coin_name + '支付？',
              clickToClose: true,
              buttons: [{
                  title: '取消'
                },
                {
                  title: '确定',
                  handler: () => {
                    this.isAgreeUseCny = true;
                    this.sendGiftUseCny();
                    this.$modal.hide('dialog');
                  }
                },
              ]
            })
          } else {
            this.sendGiftUseCny();
          }
        } else if (res.errno == 0) {

          if (res.iswin == 1) {
            this.warn("恭喜您中得" + res.winLiveCoin + "直播券");
          }

          let msg = {
            msg: [{
              _method_: "SendGift",
              evensend: res.evensend,
              action: "0",
              ct: res.gifttoken,
              msgtype: "1",
              level: res.level,
              giftGroupNum: res.giftGroupNum,
              uid: res.uid,
              // "timestamp":'WlTools.FormatNowDate()',
              uname: this.user.user_nicename,
              uhead: this.user.avatar,
              html: '<div class="gifshow"><span class="gif-use"><img src="' +
                this.user.avatar +
                '"></span><span class="gif-name">' +
                this.user.user_nicename +
                '</span><span class="gif-numname">' +
                res.giftname +
                "x" +
                res.giftGroupNum +
                '</span><span class="gif-img"><img src="' +
                res.gifticon +
                '"></span><span class="gif-num">' +
                "x" +
                res.giftGroupNum +
                "</span></div>"
            }],
            retcode: "000000",
            retmsg: "OK"
          };

          this.$bus.emit(Event.EMIT_EVENT, msg);
          // this.warn(this.user.user_nicename + " " + res.charge_msg);

        } else {
          this.warn(data.msg);
        }
      },

      sed_zengS() {
        if (!this.gifObjValue.id) {
          this.showTip("请选中要送的礼物");
          return false;
        }
        if (this.gifObjValue.id && !this.gifVlueflag) {
          this.showTip("请先等待礼物送出");
          return false;
        }
        if (this.$refs.giftValue.value < 1) {
          this.showTip("礼物数量最少为1");
          return false;
        }
        if (this.gifObjValue.id && this.gifVlueflag) {
          this.gifVlueflag = false;
          this.SendGift().then(() => {
            // this.isShow=null;
            // this.gifObjValue={};
            this.gifVlueflag = true;
            // this.$refs.giftValue.value='1';
          });
        }
      }
    }
  };

</script>

<style lang="scss">
  .swipers {
    width: 100%;
    height: 110px;
    position: relative;
    margin-bottom: 10px;
    padding-top: 10px;
    background-color: rgba(0, 0, 0, 0.15);

    .swiper-container {
      margin: 0px 25px;
      height: 50px;
      .swiper-wrapper {
        margin: 0px auto;

        .swiper-slide {
          text-align: center;
        }

        .gifcenter {
          display: inline-block;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.15);
          width: 46px;
          height: 46px;
          padding: 4px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid transparent;
          cursor: pointer;

          &.act {
            border: 1px solid #aaa;
          }

          &.show {
            border-color: #ff3366;
          }

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      top: 10px;
      margin: 0px;
      width: 20px;
      height: 46px;
      border-radius: 4px;
      background-size: 9px;
      background-color: rgba(0, 0, 0, 0.15);
      filter: grayscale(100%) brightness(200%);
      -webkit-filter: grayscale(100%) brightness(200%);
    }

    .swiper-button-prev {
      left: 0px;
    }
    .swiper-button-next {
      right: 0px;
    }

    .gifmoreshow {
      position: absolute;
      /*opacity: 0;*/
      width: 110px;
      height: 45px;
      color: #fff;
      top: -45px;
      left: 10px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 5px;

      .ticon,
      .coin,
      .name {
        position: absolute;
        overflow: hidden;
      }
      .ticon {
        top: 3px;
        left: 3px;
        width: 35px;
        height: 35px;

        img {
          width: 100%;
          height: 100%;
        }
      }
      .coin,
      .name {
        right: 3px;
        width: 65px;
        height: 16px;
        overflow: hidden;
      }
      .coin {
        top: 3px;
        color: #ffcc01;
        background: url("../images/live-ticket-sidebar.png") no-repeat 40px center;
        background-size: contain;
        .coinRmg {
          width: 40px;
          height: 16px;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          left: 0px;
        }
      }
      .name {
        top: 25px;
      }
    }

    .sed_zengS,
    .sed_mun {
      position: absolute;
      bottom: 10px;
      height: 30px;
      line-height: 28px;
      border-radius: 4px;
      color: #fff;
      text-align: center;
    }

    .sed_zengS {
      right: 6px;
      width: 60px;
      background-color: #ff3366;
      cursor: pointer;
      &:hover {
        background-color: #ca2b53;
      }
    }

    .kf-recharge-info {
      width: 47%;
      overflow: hidden;
      color: #fff;
      .kf-quiz-entrance{
        width: 30px;
        height: 30px;
        margin-top: 8px;
        margin-left: 5px;
        cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .kf-live-tikcet {
        word-wrap: break-word;
        word-break: break-all;
        height: 18px;
        line-height: 18px;
        max-width: 75px;
        padding-left: 25px;
        margin-top: 15px;
        margin-left: 5px;
        background: url("../images/live-ticket-sidebar.png") no-repeat left center;
        background-size: contain;
      }

      a {
        position: absolute;
        right: 60px;
        top: 0px;
        width: 30px;
        height: 20px;
        color: #ffcc00;
        line-height: 20px;
      }
    }

    .sed_mun {
      outline: none;
      right: 75px;
      width: 65px;
      z-index: 999;
      color: #ff3366;
      background: rgba(0, 0, 0, 0.15) url("../images/jiantou.png") no-repeat 50px center;

      &.act {
        background-image: url("../images/jiantou-down.png");
      }
    }

    .giftGroup {
      position: absolute;
      bottom: 40px;
      right: 55px;
      background-color: rgba(68, 59, 59, 1);
      width: 100px;
      color: #fff;
      z-index: 998;

      li {
        border-bottom: 1px solid #4c4c4c;
        line-height: 30px;
        padding: 0px 5px 0px 14px;
        cursor: pointer;
      }

      li:last-child {
        border-bottom: none;
      }

      li:hover {
        background: #333;
        color: #ff3366;
      }
    }
  }

</style>
