<template>
  <section class="kf-quiz-new-container">
    <div class="kf-quiz-new-form">
      <div class="kf-quiz-new-column">
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">活动主题：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="活动主题" :disabled="quizEditVisible" v-model="launchNewData.title"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">选项A：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="选项A" :disabled="quizEditVisible" v-model="launchNewData.a_name"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">A图标：</b>
          <span class="kf-img-view"><img :src="launchNewData.a_img_url_full" id="kf-optA-upload-view"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">选项B：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="选项B" :disabled="quizEditVisible" v-model="launchNewData.b_name"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">B图标：</b>
          <span class="kf-img-view"><img :src="launchNewData.b_img_url_full"  id="kf-optB-upload-view"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <span class="kf-quiz-new-column-item-input"><input type="checkbox" :disabled="quizEditVisible" v-model="launchNewData.is_show_eq"></span><span class="kf-quiz-new-raido-title">显示平局</span>
        </div>
        <div class="kf-quiz-new-column-item" v-if="launchNewData.is_show_eq">
          <b class="kf-quiz-new-column-item-title">平局名称：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="平局名称" :disabled="quizEditVisible" v-model="launchNewData.eq_name"></span>
        </div>
      </div>
      <div class="kf-quiz-new-column">
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">开始时间：</b><span class="kf-quiz-new-column-item-input">
            <input type="text" placeholder="开始时间" v-model="launchNewData.start_time" :disabled="quizEditVisible">
          </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">截止时间：</b><span class="kf-quiz-new-column-item-input">
            <input type="text" placeholder="截止时间" v-model="launchNewData.end_time" :disabled="quizEditVisible">
            </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">封盘时间：</b><span class="kf-quiz-new-column-item-input">
            <input type="text" placeholder="封盘时间" v-model="launchNewData.seal_time" :disabled="quizEditVisible">
          </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <span class="kf-quiz-new-column-item-input"><input type="checkbox" :disabled="quizEditVisible" v-model="launchNewData.is_show_amt"></span><span class="kf-quiz-new-raido-title">显示下注额度</span>
        </div>
        <div class="kf-quiz-new-column-item">
          <button class="kf-quiz-result" v-for="(btn,index) in resultBtn" :key="index" v-on:click="selectResult(index)" :class="{cur:btn.isselect}">{{btn.name}}</button>
        </div>
      </div>
    </div>
    <div class="kf-quiz-new-save" v-on:click="sendResult()">公布答案</div>
  </section>
</template>

<script>
/**
 * 公布竞猜页面
 */
import { mapState } from 'vuex';
import Datepicker from 'vue2-datepicker';
import { quizAnnounce,quizOnce } from "../service/ajax";

const state = {
  date1: new Date()
};

export default {
  name: 'quizManagementNew',
  data() {
    return {
      format: 'YYYY/MM/DD HH:mm:ss',
      timeType: 'datetime',
      resultBtn: [],
      resultIndex:undefined,
      launchNewData: {
        title: '', // 是 String 主题
        a_name: '', // 是	String	选项A名称
        a_img_url: '', // 是	String	A图标
        b_name: '', //	是	String	选项B名称2
        b_img_url: '', //	是	String	B图标
        eq_name: '', //	否	String	平局名称
        is_show_eq: false, //	是	Int	是否显示平局：1-是；-0-否
        is_show_amt: true, //	是	Int	是否显示下注额度：1-是；-0-否
        start_time: '', //	是	String	开始时间：2018-06-30 12:00：00
        end_time: '', //	是	String	截止时间：2018-06-30 16:00:00
        seal_time: '' //	是	String	封盘时间：2018-06-30 13:00:00
      }
    };
  },
  components: {
    Datepicker
  },
  computed: {
    ...mapState(['quizListVisible', 'quizEditVisible','curQuiz', '_DATA'])
  },
  mounted() {
    this.quizGet();
  },
  methods: {
    //选择公布的结果
    async quizGet(){
      let res = await quizOnce({id:this.curQuiz});
      if (res.code === 0){
        this.launchNewData = res.data;
        if(this.launchNewData.is_show_amt === "0"){
          this.launchNewData.is_show_amt = false;
        }else{
          this.launchNewData.is_show_amt = true;
        }
        if(this.launchNewData.is_show_eq === "0"){
          this.launchNewData.is_show_eq = false;
        } else {
          this.launchNewData.is_show_eq = true;
        }
        if(this.launchNewData.is_show_eq){
          this.resultBtn = [
            { name: 'A赢', isselect: false },
            { name: 'B赢', isselect: false },
            { name: '平局', isselect: false },
            { name: '下线', isselect: false }
          ]
        }else{
          this.resultBtn =[
            { name: 'A赢', isselect: false },
            { name: 'B赢', isselect: false },
            { name: '下线', isselect: false }
          ]
        }
      } else {
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }
    },
    selectResult(index) {
      this.resultBtn.forEach((el, idx) => {
        if (idx === index) {
          el.isselect = true;
        } else {
          el.isselect = false;
        }
      });
      this.resultIndex = index+1;
    },
    /**
     * 公布结果 
     * 参数名	必选	类型	说明
     * id	是	Int	当前活动ID
     * live_id	是	Int	直播间ID
     * action	是	Int	公布操作：1-下线；2-结算
     * result	是	Int	公布结果：1-A赢；2-B赢；3-平局；
     */
    async getQuizAnnounce () {
      if(typeof this.resultIndex === 'undefined') {
        try{
          layer.msg('请选择答案');
        }catch(e){
          console.log('请选择答案');
        }
        return false;
      }

      let sendData = {id:this.curQuiz,live_id:this._DATA.anchor.id,action:'',result:''}
      // 是否是下线
      if(this.resultIndex===4){
        sendData.action = 1;
        sendData.result = 0;
      } else {
        sendData.action = 2;
        console.log(this.resultIndex)
        sendData.result = this.resultIndex;
      }
      let res = await quizAnnounce(sendData);
      if(res.code === 0){
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }else{
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }
    },
    sendResult() {
      this.getQuizAnnounce();
      // 发送一段socket通知各端有竞猜
    }
  }
};
</script>

<style lang="scss" scoped>
.kf-quiz-new-container {
  .kf-quiz-new-form {
    display: flex;
    margin-bottom: 20px;
    .kf-quiz-new-column {
      flex: 1;
      font-size: 14px;
      .kf-quiz-new-column-item {
        position: relative;
        padding: 10px 0;
        .kf-quiz-new-raido-title {
          color: #666;
        }
        .kf-quiz-new-column-item-title {
          display: inline-block;
          width: 70px;
          text-align: right;
        }
        .kf-quiz-new-column-item-input {
          input[type="checkbox"] {
            width: 24px;
            height: 24px;
            position: relative;
            top: 7px;
          }
          input[type="text"] {
            width: 70%;
            padding: 7px;
            border: 1px solid #ccc;
          }
        }
        .kf-img-upload {
          width: 58px;
          height: 28px;
          line-height: 24px;
          border-radius: 4px;
          color: #cca352;
          text-align: center;
          border: 2px solid #cca352;
          display: inline-block;
          cursor: pointer;
          text-decoration: none;
          &:hover {
            background-color: #fdeccc;
          }
        }
        .kf-img-view {
          width: 30px;
          height: 30px;
          position: absolute;
          top: 9px;
          margin-left: 10px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .kf-quiz-result {
        color: #666;
        border: 1px solid #ccc;
        display: inline-block;
        padding: 9px 23px;
        border-radius: 5px;
        margin-right: 12px;
        cursor: pointer;
        &:hover {
          background-color: #eaeaea;
        }
        &.cur {
          color: #fff;
          border-color: #cca352;
          background: -webkit-linear-gradient(130deg, #cca352, #996b3d);
          background: -moz-linear-gradient(130deg, #cca352, #996b3d);
          background: linear-gradient(130deg, #cca352, #996b3d);
        }
      }
    }
  }
  .kf-quiz-new-save {
    cursor: pointer;
    color: #fff;
    background: -webkit-linear-gradient(130deg, #cca352, #996b3d);
    background: -moz-linear-gradient(130deg, #cca352, #996b3d);
    background: linear-gradient(130deg, #cca352, #996b3d);
    display: inline-block;
    padding: 7px 100px;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    &:hover {
      background: -webkit-linear-gradient(130deg, #996b3d, #cca352);
      background: -moz-linear-gradient(130deg, #996b3d, #cca352);
      background: linear-gradient(130deg, #996b3d, #cca352);
    }
  }
}
</style>
