<template>
  <section class="kf-quiz-list-container">
    <div class="kf-quiz-list">
      <div class="kf-quiz-list-header">
        <div class="kf-quiz-list-header-th">活动主题</div>
        <div class="kf-quiz-list-header-th">发布时间</div>
        <div class="kf-quiz-list-header-th">操作</div>
      </div>
      <div class="kf-quiz-list-main">
        <div class="kf-quiz-list-item" v-for="(item, index) in manageList" :key="index">
          <div class="kf-quiz-list-item-td">{{item.title}}</div>
          <div class="kf-quiz-list-item-td">{{item.start_time}}</div>
          <div class="kf-quiz-list-item-td" v-on:click="itemEdit(item.id)">编辑</div>
        </div>
        <infinite-loading @infinite="infiniteHandler">
          <span slot="no-results">
            没有活动
          </span>
          <span slot="no-more">
            没有更多了
          </span>
        </infinite-loading>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * 管理列表页面
 */
import { mapState, mapMutations } from "vuex";
import { QUIZ_EDIT_VISIBLE,QUIZ_INDEX } from "../store/mutation-types";
import { quizManageList } from "../service/ajax";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "quizManagementList",
  computed: {
    ...mapState(["quizEditVisible"])
  },
  components: {
    InfiniteLoading
  },
  data() {
    return {
      tabList: ["活动管理", "新建活动"],
      manageList: [],
      curPage: 1,
      totalPage: undefined
    };
  },
  mounted() {
    // this.getQuizList();
  },
  methods: {
    ...mapMutations(["QUIZ_EDIT_VISIBLE","QUIZ_INDEX"]),
    itemEdit(id) {
      this.QUIZ_INDEX(id);
      this.QUIZ_EDIT_VISIBLE();
    },
    async getQuizList(state) {
      let res = {};
      if (typeof this.totalPage === 'undefined' || this.curPage <= this.totalPage) {
        res = await quizManageList({p:this.curPage});
        this.totalPage = res.data.total_pages;
        if (res.code === 0) {
          this.manageList = this.manageList.concat(res.data.list);
          state.loaded();
          this.curPage++;
        } else {
          state.complete();
        }
      } else {
        state.complete();
      }
    },
    infiniteHandler($state) {
      this.getQuizList($state);
    }
  }
};
</script>

<style lang="scss" scoped>
.kf-quiz-list-header {
  display: flex;
  color: #999;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #f5f5f5;
  .kf-quiz-list-header-th {
    flex: 1;
    &:last-child {
      flex: none;
      min-width: 80px;
    }
  }
}
.kf-quiz-list-main {
  overflow-y: auto;
  height: 380px;
  .kf-quiz-list-item {
    display: flex;
    padding: 10px;
    &:nth-child(odd) {
      background-color: #f5f5f5;
    }
    .kf-quiz-list-item-td {
      flex: 1;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        color: #cc9966;
        cursor: pointer;
        flex: none;
      }
    }
  }
}
</style>
