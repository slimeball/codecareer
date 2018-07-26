<template>
  <section class="kf-quiz-new-container">
    <div class="kf-quiz-new-form">
      <div class="kf-quiz-new-column">
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">活动主题：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="活动主题" v-model="launchNewData.title"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">选项A：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="选项A" v-model="launchNewData.a_name"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">A图标：</b><a class="mount_btn_on kf-img-upload" onclick="flashuploadcut('thumb_images', '图片上传','kf-optA-upload',thumb_images,'1,jpg|jpeg|gif|png|bmp,1,,,1','','','');return false;">上传</a>
					<input type="hidden" name="kf-optA-upload" id="kf-optA-upload">
          <span class="kf-img-view"><img src="../assets/beforelogo.png" id="kf-optA-upload-view"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">选项B：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="选项B" v-model="launchNewData.b_name"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">B图标：</b><a class="mount_btn_on kf-img-upload" onclick="flashuploadcut('thumb_images', '图片上传','kf-optB-upload',thumb_images,'1,jpg|jpeg|gif|png|bmp,1,,,1','','','');return false;">上传</a>
					<input type="hidden" name="kf-optB-upload" id="kf-optB-upload">
          <span class="kf-img-view"><img src="../assets/beforelogo.png" id="kf-optB-upload-view"></span>
        </div>
        <div class="kf-quiz-new-column-item">
          <span class="kf-quiz-new-column-item-input"><input type="checkbox" v-model="launchNewData.is_show_eq"></span><span class="kf-quiz-new-raido-title">显示平局</span>
        </div>
        <div class="kf-quiz-new-column-item" v-if="launchNewData.is_show_eq">
          <b class="kf-quiz-new-column-item-title">平局名称：</b><span class="kf-quiz-new-column-item-input"><input type="text" placeholder="平局名称" v-model="launchNewData.eq_name"></span>
        </div>
      </div>
      <div class="kf-quiz-new-column">
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">开始时间：</b><span class="kf-quiz-new-column-item-input">
            <datepicker placeholder="开始时间" :format="format" :type="timeType" v-model="launchNewData.start_time" confirm></datepicker>
          </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">截止时间：</b><span class="kf-quiz-new-column-item-input">
            <datepicker placeholder="截止时间" :format="format" :type="timeType" v-model="launchNewData.end_time" confirm></datepicker>
            </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <b class="kf-quiz-new-column-item-title">封盘时间：</b><span class="kf-quiz-new-column-item-input">
            <datepicker placeholder="封盘时间" :format="format" :type="timeType" v-model="launchNewData.seal_time" confirm></datepicker>
          </span>
        </div>
        <div class="kf-quiz-new-column-item">
          <span class="kf-quiz-new-column-item-input"><input type="checkbox" v-model="launchNewData.is_show_amt"></span><span class="kf-quiz-new-raido-title">显示下注额度</span>
        </div>
      </div>
    </div>
    <div class="kf-quiz-new-save" v-on:click="launchNew()">保存</div>
  </section>
</template>

<script>
/**
 * 发布新竞猜
 * 上传调用的直播站的flashuploadcut方法
 */
import { mapMutations } from 'vuex';
import { QUIZ_LIST_VISIBLE,RESET_TAB } from '../store/mutation-types'
import Datepicker from 'vue2-datepicker';
import { quizCreate,quizOnce } from "../service/ajax";
import Event from "../utils/Event";

const state = {
  date1: new Date()
};

export default {
  name: 'quizManagementNew',
  data() {
    return {
      format: 'YYYY/MM/DD HH:mm:ss',
      timeType: 'datetime',
      resultBtn: [
        { name: 'A赢', isselect: false },
        { name: 'B赢', isselect: false },
        { name: '平局', isselect: false },
        { name: '下线', isselect: false }
      ],
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
  methods: {
    ...mapMutations(['QUIZ_LIST_VISIBLE','RESET_TAB']),
    // 发起新竞猜
    async quizCreateSend () {
      // 图片读取直播间插件的内容
      this.launchNewData.a_img_url = document.getElementById('kf-optA-upload').value;
      this.launchNewData.b_img_url = document.getElementById('kf-optB-upload').value;
      for(let el in this.launchNewData){
        if (this.launchNewData[el] === '' && el !== 'eq_name') {
          try{
            layer.msg('请保证表单填写完整再提交');
          }catch(e){
            console.log('请保证表单填写完整再提交');
          }
          return false;
        }
      }

      let st = +this.launchNewData.start_time;
      let et = +this.launchNewData.end_time;
      let sealT = +this.launchNewData.seal_time;
      if (st === et ){
        try{
          layer.msg('开始时间不能与截止时间相同');
        }catch(e){
          console.log('开始时间不能与截止时间相同');
        }
        return false;
      }
      if (st === sealT ){
        try{
          layer.msg('封盘时间不能与开始时间相同');
        }catch(e){
          console.log('封盘时间不能与开始时间相同');
        }
        return false;
      }
      if(et < st) {
        try{
          layer.msg('截止时间不能在开始时间之前');
        }catch(e){
          console.log('截止时间不能在开始时间之前');
        }
        return false;
      }
      if(sealT < st || sealT>et){
        try{
          layer.msg('封盘时间需在开始截止时间之间');
        }catch(e){
          console.log('封盘时间需在开始截止时间之间');
        }
        return false;
      }
      // 平局与下注额度修改为数值
      if (this.launchNewData.is_show_eq){
        this.launchNewData.is_show_eq = 1;
      } else {
        this.launchNewData.is_show_eq = 0;
      }
      if (this.launchNewData.is_show_amt){
        this.launchNewData.is_show_amt = 1;
      } else {
        this.launchNewData.is_show_amt = 0;
      }
      // 将时间转换为时间戳
      this.launchNewData.start_time = +this.launchNewData.start_time;
      this.launchNewData.end_time= +this.launchNewData.end_time;
      this.launchNewData.seal_time = +this.launchNewData.seal_time;
      // 验证通过 发送请求
      let res = await quizCreate(this.launchNewData);
      if(res.code===0){
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
        this.RESET_TAB(true);
        this.QUIZ_LIST_VISIBLE();
      } else {
        try{
          layer.msg(res.msg);
        }catch(e){
          console.log(res.msg);
        }
      }
    },
    launchNew(){
      this.quizCreateSend();
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
          margin-left: 10px;
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
