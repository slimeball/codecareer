<template>
  <div>
    <section class="kf-quiz-visitor-container">
      <div class="kf-quiz-visitor-info">
        <div class="kf-flex1 kf-quiz-ticket">
          <i class="fl-l kf-quiz-ticket-icon"><img src="../assets/live-ticket-room.png"></i><span class="fl-l kf-live-tikcet-value">{{quizVisitorList.live_coin}}</span>
          <!-- <span class="fl-l"><b class="kf-quiz-chargeticket">充值</b></span> -->
        </div>
        <div class="kf-flex1 kf-quiz-theme">{{quizTheme}}</div>
        <div class="kf-flex1 kf-quiz-record-container">
          <i class="fl-r kf-quiz-info-close" v-on:click="padclose()">&#10006;</i><i class="fl-r kf-quiz-rule">&#10067;</i><span class="fl-r kf-quiz-record" v-on:click="goPersonal()">竞猜记录</span>
          <div class="kf-pop-rule-text-container">
            <pre class="kf-pop-rule-text">{{quizRule.content}}</pre>
          </div>
        </div>
      </div>
    </section>
    <section class="kf-quiz-visitor-slide">
      <div class="kf-silde-container" v-if="slideObj.length>0">
        <div class="kf-slide kf-slide-fade" v-for="(item,index) in slideObj" :key="index" v-if="index === slideIndex">
          <div class="kf-quiz-status" :class="{end:quizEnd}">{{countDownTime}}</div>
          <div class="kf-options">
            <div class="kf-option-item kf-option-item-left" :class="{selected:betSelected==='A'}" v-on:click="ctrlBetinpad(true,'A',item.id,item.a_total_amount,item.a_pub_rate)">
              <div class="fl-l kf-avatar"><img :src="item.a_img_url_full"></div>
              <div class="kf-option-info">
                <div class="c-hideoverflow" :title="item.a_name">{{item.a_name}}</div>
                <div class="c-hideoverflow" :title="item.a_total_amount+'券'">{{item.a_total_amount}}券</div>
              </div>
              <div class="kf-option-rate color-orange">胜<span>{{item.a_pub_rate}}</span></div>
              <div class="kf-ribbon win" v-if="item.win==='1'">胜利</div>
              <div class="kf-ribbon lose" v-if="item.win==='2'">失败</div>
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone === 'A'}"><i class="c-ticket-icon"><img src="../assets/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
            </div>
            <div class="kf-option-item kf-option-item-mid" :class="{selected:betSelected==='EQ'}" v-on:click="ctrlBetinpad(true,'EQ',item.id,item.eq_total_amount,item.eq_pub_rate)" v-if="item.eq_name">
              <div class="kf-option-rate color-orange c-hideoverflow" :title="item.eq_name">{{item.eq_name}}</div>
              <div class="kf-option-draw-prize c-hideoverflow" :title="item.eq_total_amount+'券'">{{item.eq_total_amount}}券</div>
              <div class="kf-option-rate color-orange">{{item.eq_pub_rate}}</div>
              <div class="kf-ribbon draw" v-if="item.win==='3'">平局</div>
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone==='EQ'}"><i class="c-ticket-icon"><img src="../assets/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
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
              <div class="kf-ticket-animation" :class="{'c-outtoup':beindone === 'B'}"><i class="c-ticket-icon"><img src="../assets/live-ticket-room.png"></i><span class="kf-minus-ticket">{{betinNum}}</span></div>
            </div>
          </div>
        </div>
        <span class="prev" v-on:click="ctrlSlides(-1)">&#10094;</span>
        <span class="next" v-on:click="ctrlSlides(1)">&#10095;</span>
      </div>
      <div class="kf-betin-container" v-if="isShowbetin">
        <div class="clearfix kf-betin-info"><span class="fl-l c-info-icon"><img src="../assets/quiz-receive.png"></span><b class="kf-info-text">赢则获得</b><b class="color-orange">{{curWinTake}}</b><span class="color-orange kf-explain">(含本金)</span></div>
        <div class="clearfix kf-betin-info"><span class="fl-l c-info-icon"><img src="../assets/quiz-odds.png"></span><b class="kf-info-text">赔率</b><b class="color-orange">{{curBetRate}}</b><span class="color-orange kf-explain">(以封盘时间赔率为准，结算收益)</span></div>
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
 * 竞猜板
 */
import { mapState,mapMutations } from 'vuex';
import { quizGameList,quziBetIn,quzigetRule } from "../service/ajax";
export default {
  name: "quizVisitorSlide",
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
  },
  updated() {
    // this.getQuizList();
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
    // 获取活动列表
    async getQuizList(){
      let sendData = {live_id:this._DATA.anchor.id};
      let res = await quizGameList(sendData);
      if(res.code === 0){
        this.slideObj = res.data;
      }else{
        try{
          layer.msg(res.msg);
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
      document.querySelector('.kf-visitor-container').style.display = 'none';
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
        layer.msg(res.msg);
      } else {
        layer.msg(res.msg);
      }
    },
    // 直播券投注
    async quizBet(selected,id){
      let _this = this;
      let sendData = {};
      if(this.betinNum === ''){
        layer.msg('请输入投注数量');
        return false;
      }else {
        sendData = {id:this.betSelectedId,live_id:this._DATA.anchor.id,code:selected,money:this.betinNum,pay_type:1}
      }
      
      let res = await quziBetIn(sendData);
      if(res.code === 0){
        // 已投注，减掉直播券，直播券动画
        this.beindone = selected;
        this.quizVisitorList.live_coin -= this.betinNum;
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      } else if (res.code === 1003){
        layer.confirm(res.msg, {
          btn: ['确定', '取消']
        }, function () {
          sendData = {id:_this.betSelectedId,live_id:_this._DATA.anchor.id,code:selected,money:_this.betinNum,pay_type:2}
          _this.quizBetCNY(sendData);
          layer.closeAll();
        }, function () {
          layer.closeAll();
        }); 
      }else{
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
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
.kf-quiz-visitor-container{
  .kf-quiz-visitor-info {
    display: flex;
    border-bottom: 1px dashed #ddd;
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
      color: #cca352;
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
        border: 2px solid #cca352;
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
        right: 0;
        top: -158px;
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
        &.end{
          color: #ff0000;
          text-align: center;
        }
      }
      .kf-options {
        display: flex;
        height: 80px;
        .kf-option-item {
          height: 100%;
          border-radius: 15px;
          background-color: #f3f3f3;
          padding: 11px 28px;
          position: relative;
          overflow: hidden;
          border: 1px solid #f3f3f3;
          cursor: pointer;
          .kf-ribbon {
            position: absolute;
            top: 0;
            left: -17px;
            height: 16px;
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
            img {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
          }
          .kf-option-info {
            margin-left: 50px;
          }
          .kf-option-draw-prize {
            text-align: center;
          }
          .kf-option-rate {
            text-align: center;
            font-weight: bold;
          }
          &.kf-option-item-left {
            flex: 2;
          }
          &.kf-option-item-mid {
            flex: 1;
            margin-left: 10px;
          }
          &.kf-option-item-right {
            flex: 2;
            margin-left: 10px;
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
      top: 67%;
      width: auto;
      padding: 0 30px;
      padding-bottom: 4px;
      margin-top: -25px;
      color: #b8b8b8;
      font-size: 40px;
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
    bottom: 0;
    width: 383px;
    height: 220px;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 10px 30px;
    font-size: 14px;
    bottom: 83px;
    left: 50%;
    transform: translateX(-50%);
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
        width: 324px;
        height: 38px;
        border-radius: 50px;
        outline: 0;
        border: 0;
        background-color: #eee;
        padding: 0 35px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .kf-clear-input {
        top: 8px;
        right: -5px;
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
      margin: 15px 0;
      margin-right: 20px;
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
        margin-left: 20px;
        cursor: pointer;
        &.cur {
          color: #fff;
          border-color: #ff7700;
          background-color: #ff7700;
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
      top: 3px;
      right: 0;
    }
  }
}
</style>
