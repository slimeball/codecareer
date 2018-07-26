<template>
  <div class="kf-sidebar-quiz">
    <section class="kf-quiz-visitor-container">
      <div class="kf-quiz-visitor-info">
        <!-- <div class="kf-flex1 kf-quiz-ticket">
          <i class="fl-l kf-quiz-ticket-icon"><img src="../../images/quizsidebar/live-ticket-room.png"></i><span class="fl-l kf-live-tikcet-value">{{quizVisitorList.live_coin}}</span>
          <span class="fl-l"><b class="kf-quiz-chargeticket">充值</b></span>
        </div> -->
        <div class="kf-quiz-record-container"><span class="fl-l kf-quiz-record" v-on:click="goPersonal()">竞猜记录</span><i class="fl-l kf-quiz-rule">&#10067;</i>
          <div class="kf-pop-rule-text-container">
            <pre class="kf-pop-rule-text">{{quizRule.content}}</pre>
          </div>
        </div>
        <div class="kf-quiz-close-container">
          <i class="fl-r kf-quiz-info-close" v-on:click="padclose()">&#10006;</i>
        </div>
      </div>
      <div class="kf-quiz-theme">{{quizTheme}}</div>
    </section>
    <section class="kf-quiz-visitor-slide">
      <div class="kf-silde-container" v-if="slideObj.length>0">
        <div class="kf-slide kf-slide-fade" v-for="(item,index) in slideObj" :key="index" v-if="index === slideIndex">
          <div class="kf-quiz-status" :class="{end:quizEnd}">{{countDownTime}}</div>
          <div class="kf-options" :class="{mgT40:!item.eq_name}">
            <div class="kf-option-item kf-option-item-left" :class="{selected:betSelected==='A'}" v-on:click="ctrlBetinpad(true,'A',item.id,item.a_total_amount,item.a_pub_rate)">
              <div class="fl-l kf-avatar"><img :src="item.a_img_url_full"></div>
              <div class="kf-option-info">
                <div class="c-hideoverflow" :title="item.a_name">{{item.a_name}}</div>
                <div class="c-hideoverflow" :title="item.a_total_amount+'券'">{{item.a_total_amount}}券</div>
              </div>
              <div class="kf-option-rate color-orange">胜<span>{{item.a_pub_rate}}</span></div>
              <div class="kf-ribbon win" v-if="item.win==='1'">胜利</div>
              <div class="kf-ribbon lose" v-if="item.win==='2'">失败</div>
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone === 'A'}"><i class="c-ticket-icon"><img src="../../images/quizsidebar/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
            </div>
            <div class="kf-option-item kf-option-item-mid" :class="{selected:betSelected==='EQ'}" v-on:click="ctrlBetinpad(true,'EQ',item.id,item.eq_total_amount,item.eq_pub_rate)" v-if="item.eq_name">
              <div class="kf-option-rate color-orange c-hideoverflow draw-left" :title="item.eq_name">{{item.eq_name}}</div>
              <div class="kf-option-draw-prize c-hideoverflow" :title="item.eq_total_amount+'券'">{{item.eq_total_amount}}券</div>
              <div class="kf-option-rate color-orange">{{item.eq_pub_rate}}</div>
              <div class="kf-ribbon draw" v-if="item.win==='3'">平局</div>
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone==='EQ'}"><i class="c-ticket-icon"><img src="../../images/quizsidebar/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
            </div>
            <div class="kf-option-item kf-option-item-right" :class="{selected:betSelected==='B'}" v-on:click="ctrlBetinpad(true,'B',item.id,item.b_total_amount,item.b_pub_rate)">
              <div class="fl-l kf-avatar"><img :src="item.b_img_url_full"></div>
              <div class="kf-option-info">
                <div class="c-hideoverflow" :title="item.b_name">{{item.b_name}}</div>
                <div class="c-hideoverflow" :title="item.b_total_amount+'券'">{{item.b_total_amount}}券</div>
              </div>
              <div class="kf-option-rate color-orange">胜<span>{{item.b_pub_rate}}</span></div>
              <div class="kf-ribbon win" v-if="item.win==='2'">胜利</div>
              <div class="kf-ribbon lose" v-if="item.win==='1'">失败</div>
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone === 'B'}"><i class="c-ticket-icon"><img src="../../images/quizsidebar/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
            </div>
          </div>
        </div>
        <span class="prev" v-on:click="ctrlSlides(-1)">&#10094;</span>
        <span class="next" v-on:click="ctrlSlides(1)">&#10095;</span>
      </div>
      <div class="kf-betin-container" v-if="isShowbetin">
        <div class="clearfix kf-betin-info"><span class="fl-l c-info-icon"><img src="../../images/quizsidebar/quiz-receive.png"></span><b class="kf-info-text">赢则获得</b><b class="color-orange">{{curWinTake}}</b><span class="color-orange kf-explain">(含本金)</span></div>
        <div class="clearfix kf-betin-info"><span class="fl-l c-info-icon"><img src="../../images/quizsidebar/quiz-odds.png"></span><b class="kf-info-text">赔率</b><b class="color-orange">{{curBetRate}}</b><span class="color-orange kf-explain">(以封盘时间赔率为准，结算收益)</span></div>
        <!-- <div class="kf-betin-notice"><b>余额不足</b></div> -->
        <div class="kf-typein-container"><input type="text" maxlength="10" placeholder="请输入投注数量" v-model="betinNum" v-on:keyup="typeinKeyup()" class="kf-typein-num"><i class="kf-quiz-info-close kf-clear-input" v-show="betinNum !== ''" v-on:click="clearinput()">&#10006;</i></div>
        <div class="kf-betin-options">
          <span class="c-btn" :class="{cur: curBtn === index}" v-for="(item,index) in btnVal" :key="index" v-on:click="selectVal(item,index)">{{item}}</span>
        </div>
        <div class="kf-betin-start" v-on:click="betin()">投注</div>
        <i class="kf-quiz-info-close" v-on:click="ctrlBetinpad(false)">&#10006;</i>
      </div>
    </section>
  </div>
</template>

<script>
/**
 * 侧边栏竞猜板
 */
import { mapState,mapMutations } from 'vuex';
import { quizGameList,quziBetIn,quzigetRule } from "../../utils/getData";
import { IS_SHOW_QUIZ_PAD,UPDATE_LIVE_TICKET } from '../../store/mutation-types'
export default {
  name: "quizvisitorpadsidebar",
  data() {
    return {
      betinNum: '', // 投注数量
      betSelected: '', // 选中选项
      betSelectedId: '', // 选中的id
      btnVal: [10, 100, 1000, 10000], // 推荐数额
      curBtn:'', // 推荐数额选中btn索引
      curWinTake: 0, // 获胜获得
      curBetRate: 0, // 当前选择的赔率
      isShowbetin: false, // 是否显示投注板
      slideObj: [], // 滑动区的队列
      slideIndex: 0, // 滑动区的索引
      quizTheme: '', // 竞猜主题
      quizRule: '', //竞猜规则
      countDownTime:'00:00:00', // 倒计时间
      timeInter:{}, // 倒计时间对象
      quizEnd: false, // 是否结束
      beindone: '' // 已投注后的类型
    };
  },
  mounted() {
    this.slideObj = this.quizVisitorList.list;
    this.quizTheme = this.slideObj[this.slideIndex].title;
    this.getRule();
    this.countdownSeal(this.slideObj[this.slideIndex].seal_time,this.slideObj[this.slideIndex].end_time);
    this.UPDATE_LIVE_TICKET(this.quizVisitorList.live_coin);
  },
  computed: {
    ...mapState(['_DATA','quizVisitorList','quizVisitorDataSocket'])
  },
  watch:{
    quizVisitorDataSocket(){
      let isMatch = false;
      this.slideObj.forEach((el,index) => {
        if(el.id === this.quizVisitorDataSocket.id){
          this.slideObj[index] = this.quizVisitorDataSocket;
          isMatch = true;
        }
      });
      if(!isMatch){
        this.slideObj.push(this.quizVisitorDataSocket);
      }
    }
  },
  methods: {
    ...mapMutations(['IS_SHOW_QUIZ_PAD', 'UPDATE_LIVE_TICKET']),
    // 获取活动列表
    async getQuizList(){
      let sendData = {live_id:this._DATA.anchor.id};
      let res = await quizGameList(sendData);
      if(res.code === 0){
        this.slideObj = res.data;
      }else{
        try{
          this.warn(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }
    },
    // 获取竞猜规则
    async getRule (){
      let res = await quzigetRule();
      if(res.code === 0){
        this.quizRule = res.data;
      } else{
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }
    },
    // 封板倒计时
    countdownSeal(sealtime,endtime){
      var _this = this;
      let immedi = () => {
        var now = new Date().getTime();
        var sealTime = sealtime - now;
        var endTime = endtime - now;
        _this.quizEnd= false;
        if (sealTime < 0 && endTime > 0){
          clearInterval(_this.timeInter);
          _this.quizEnd= true;
           _this.countDownTime = '已封盘，等待结算...';
        } else if (sealTime < 0 && endTime < 0) {
            clearInterval(_this.timeInter);
           _this.countDownTime = '竞猜结束';
        } else {
          var days = Math.floor(sealTime / (1000 * 60 * 60 * 24));
          var hours = Math.floor((sealTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((sealTime % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((sealTime % (1000 * 60)) / 1000);
          _this.countDownTime =  (days>0?days+'天 ':'') + (hours<10?'0'+hours:hours) + ":" + (minutes<10?'0'+minutes:minutes) + ":" + (seconds<10?'0'+seconds:seconds) + "后封盘";
        }
      }
      immedi();
      this.timeInter = setInterval(immedi, 1000);
    },
    // 竞猜记录跳转
    goPersonal(){
      window.open("/index.php?m=Personal&a=comguess","_blank"); 
    },
    // 关闭投注板
    padclose(){
      this.IS_SHOW_QUIZ_PAD(false);
    },
    // 控制滚动区
    ctrlSlides(index) {
      this.beindone = '';
      clearInterval(this.timeInter);
      this.ctrlBetinpad(false);
      let lenIndex = this.slideObj.length - 1;
      if (this.slideIndex === lenIndex && index === 1) {
        this.slideIndex = 0;
      } else if (this.slideIndex === 0 && index === -1) {
        this.slideIndex = lenIndex;
      } else {
        this.slideIndex += index;
      }
      this.countdownSeal(this.slideObj[this.slideIndex].seal_time,this.slideObj[this.slideIndex].end_time);
      this.quizTheme = this.slideObj[this.slideIndex].title;
    },
    // 选择推荐的直播券
    selectVal(item,i){
      this.curBtn = i;
      this.betinNum = item;
    },
    // 清除input
    clearinput(){
      this.betinNum = '';
      this.curBtn = '';
    },
    // 处理input内的非整数
    typeinKeyup(){
      // 开始就输入符号删除 || 转换为数字小于1不给输入
      if(isNaN(parseInt(this.betinNum))|| parseInt(this.betinNum) <1){
        this.betinNum = '';
        return;
      }
      // 中间输入非数字不给输入
      if(isNaN(+this.betinNum)){
        this.betinNum = parseInt(this.betinNum);
      }
      // 不给输入小数
      this.betinNum = parseInt(this.betinNum);
      this.curBtn = '';
    },
    // 选择投注与关闭面板
    ctrlBetinpad(opt,type,id,winbet,rate){
      this.isShowbetin = opt;
      this.betSelected = type;
      this.betSelectedId = id;
      this.curWinTake = winbet;
      this.curBetRate = rate;
    },
    // 使用cny投注
    async quizBetCNY(data){
      let res = await quziBetIn(data);
      if(res.code === 0){
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: res.msg,
          clickToClose: true,
          buttons: [{title: '确定'}]
        })
      } else {
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: res.msg,
          clickToClose: true,
          buttons: [{title: '确定'}]
        })
      }
    },
    // 直播券投注
    async quizBet(selected,id){
      let _this = this;
      let sendData = {};
      if(this.betinNum === ''){
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: '请输入投注数量',
          clickToClose: true,
          buttons: [{title: '确定'}]
        })
        return false;
      }else {
        sendData = {id:this.betSelectedId,live_id:this._DATA.anchor.id,code:selected,money:this.betinNum,pay_type:1}
      }

      let res = await quziBetIn(sendData);
      if(res.code === 0){
        // 已投注，减掉直播券，直播券动画
        this.beindone = selected;
        this.quizVisitorList.live_coin -= this.betinNum;
        this.UPDATE_LIVE_TICKET(this.quizVisitorList.live_coin);
        this.ctrlBetinpad(false);
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: res.msg,
          clickToClose: true,
          buttons: [{title: '确定'}]
        })
      }else if (res.code === 1003){
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: res.msg,
          clickToClose: true,
          buttons: [{title: '取消'},{
              title: '确定',
              handler: () => {
                sendData = {id:_this.betSelectedId,live_id:_this._DATA.anchor.id,code:selected,money:_this.betinNum,pay_type:2}
                _this.quizBetCNY(sendData);
                this.$modal.hide('dialog');
              }
            }
          ]
        })
      }else{
        this.$modal.show('dialog', {
          maxWidth: 200,
          text: res.msg,
          clickToClose: true,
          buttons: [{title: '确定'}]
        })
      }
    },
    // 确认投注
    betin(){
      this.quizBet(this.betSelected,this.betSelectedId);
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes -webkit-outToup {
  from   {bottom: -20px;}
  to  {bottom: 80px;}
}
@keyframes outToup {
  from   {bottom: -20px;}
  to  {bottom: 80px;}
}
.c-outtoup{
  -webkit-animation-name: outToup;
  -webkit-animation-duration: .3s;
  animation-name: outToup;
  animation-duration: .3s;
}
@-webkit-keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
.kf-slide-fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}
.color-orange {
  color: #ff7700;
}
.c-hideoverflow{
  word-break: break-all;
  word-wrap: break-word;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.kf-sidebar-quiz{
  background-color: #5a5052;
  position: absolute;
  width: 100%;
  padding-bottom: 20px;
  z-index: 10;
  min-height: 335px;
  box-shadow: 0 0 15px 9px #48413f;
}
.kf-quiz-visitor-container{
  border-bottom: 1px dashed #ddd;
  padding: 3px 17px;
  color: #fff;
  .kf-quiz-visitor-info {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    .kf-quiz-ticket {
      line-height: 38px;
      .kf-quiz-ticket-icon {
        margin-left: 10px;
        margin-right: 5px;
        img {
          width: 22px;
          height: 22px;
          margin-top: 8px;
        }
      }
      .kf-live-tikcet-value {
        margin-right: 15px;
        line-height: 39px;
      }
      .kf-quiz-chargeticket {
        cursor: pointer;
        color: #fff;
        background: -webkit-linear-gradient(130deg, #cca352, #996b3d);
        background: -moz-linear-gradient(130deg, #cca352, #996b3d);
        background: linear-gradient(130deg, #cca352, #996b3d);
        padding: 5px 13px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: normal;
        &:hover {
          background: -webkit-linear-gradient(130deg, #996b3d, #cca352);
          background: -moz-linear-gradient(130deg, #996b3d, #cca352);
          background: linear-gradient(130deg, #996b3d, #cca352);
        }
      }
    }
    .kf-quiz-theme {
      text-align: center;
    }
    .kf-quiz-record-container {
      position: relative;
      color: #ffd800;
      text-align: right;
      i {
        font-style: normal;
      }
      .kf-quiz-rule {
        width: 20px;
        height: 20px;
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 20px;
        cursor: pointer;
        border-radius: 50px;
        border: 2px solid #ffd800;
        line-height: 18px;
        text-align: center;
        &:hover{
          &~.kf-pop-rule-text-container{
            display: block;
          }
        }
      }
      .kf-quiz-record {
        cursor: pointer;
      }
      .kf-pop-rule-text-container {
        display: none;
        overflow: hidden;
        position: absolute;
        z-index: 10;
        left: 0;
        top: 37px;
        border-radius: 10px;
        border: 1px solid #ccc;
        color: #242424;
        padding: 10px;
        background-color: #fff;
        &:hover{
          display: block;
        }
        .kf-pop-rule-text {
          width: 165px;
          height: 158px;
          overflow-y: auto;
          overflow-x: hidden;
          word-wrap: break-word;
          word-break: break-all;
          border-radius: 10px;
          line-height: 20px;
          text-align: left;
          white-space: pre-line;
        }
      }
    }
    .kf-quiz-close-container{
      text-align: right;
      font-size: 19px;
      cursor: pointer;
      i {
        font-style: normal;
      }
    }
  }
  .kf-quiz-theme{
    text-align: center;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
  }
}
.kf-quiz-visitor-slide {
  position: relative;
  .kf-silde-container {
    .kf-slide {
      width: 77%;
      max-width: 550px;
      margin: 0 auto;
      .kf-quiz-status {
        line-height: 48px;
        text-align: center;
        color: #fff;
        &.end{
          color: #ff0000;
          text-align: center;
        }
      }
      .kf-options {
        &.mgT40{
          margin-top: 40px;
        }
        .kf-option-item {
          height: 40px;
          border-radius: 7px;
          background-color: #f3f3f3;
          padding: 0 10px;
          position: relative;
          overflow: hidden;
          border: 1px solid #f3f3f3;
          cursor: pointer;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          .kf-ribbon {
            position: absolute;
            top: 0;
            left: -17px;
            height: 16px;
            line-height: 15px;
            width: 82px;
            color: #fff;
            text-indent: 21px;
            transform: rotate(-40deg);
            font-size: 12px;
            &.win {
              background-color: #6fdb3f;
            }
            &.lose {
              background-color: #ff4848;
            }
            &.draw {
              background-color: #ccc;
            }
          }
          .kf-ticket-animation{
            position: absolute;
            right: 5px;
            bottom: -20px;
            .c-ticket-icon{
              width: 14px;
              height: 14px;
              float: left;
              margin-top: 2px;
              margin-right: 5px;
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
          .kf-avatar {
            width: 35px;
            height: 35px;
            overflow: hidden;
            border-radius: 50px;
            margin-top: 1px;
            img {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
          }
          .kf-option-info {
            margin-left: 10px;
            flex: 2;
            word-break: break-all;
            word-wrap: break-word;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .kf-option-draw-prize {
            text-align: center;
            flex:2;
          }
          .kf-option-rate {
            text-align: right;
            font-weight: bold;
            // flex: 0.5;
            &.draw-left{
              text-align:left;
            }
          }
          &.kf-option-item-left {
          }
          &.kf-option-item-mid {
          }
          &.kf-option-item-right {
          }

          &.selected{
            border: 1px solid #ff7700;
          }
        }

      }
    }
    .prev,
    .next {
      cursor: pointer;
      position: absolute;
      top: 30px;
      width: auto;
      padding: 0 16px;
      padding-bottom: 4px;
      margin-top: -25px;
      color: #b8b8b8;
      font-size: 25px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
    }
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    .prev:hover,
    .next:hover {
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 50px;
    }
  }
  .kf-betin-container {
    position: absolute;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 10px 5px;
    font-size: 14px;
    bottom:-42px;
    left: 0;
    .kf-betin-info {
      margin-bottom: 5px;
      .c-info-icon {
        width: 20px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .kf-info-text {
      margin: 0 10px;
    }
    .kf-explain {
      margin-left: 10px;
      font-size: 12px;
    }
    .kf-betin-notice {
      text-align: center;
      color: #ff0000;
      line-height: 25px;
    }
    .kf-typein-container {
      position: relative;
      .kf-typein-num {
        width: 100%;
        height: 38px;
        border-radius: 50px;
        outline: 0;
        border: 0;
        background-color: #eee;
        padding: 0 35px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
      }
      .kf-clear-input {
        top: 8px;
        right: 8px;
        background-color: #ddd;
        border-radius: 52px;
        height: 22px;
        width: 22px;
        font-size: 15px;
        text-align: center;
        color: #eee;
      }
    }
    .kf-betin-options {
      display: flex;
      margin: 10px 0;
      .c-btn {
        width: 58px;
        height: 26px;
        line-height: 25px;
        font-size: 14px;
        color: #666;
        text-align: center;
        border-radius: 50px;
        border: 1px solid #ccc;
        flex: 1;
        margin-left: 10px;
        cursor: pointer;
        &.cur {
          color: #fff;
          border-color: #ff7700;
          background-color: #ff7700;
        }
        &:first-child{
          margin-left:0;
        }
      }
    }
    .kf-betin-start {
      width: 100px;
      height: 30px;
      line-height: 30px;
      margin: 0 auto;
      background-color: #ff7700;
      border-radius: 50px;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }
    .kf-quiz-info-close {
      position: absolute;
      top: 5px;
      right: 6px;
      color:#999;
      font-style: normal;
      cursor: pointer;
    }
  }
}
</style>
