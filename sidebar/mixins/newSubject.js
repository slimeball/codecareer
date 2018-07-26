import Event from 'src/utils/Event';
import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex';
import {
  getCurrentQuestion,
} from '../utils/getData';
import shuffle from '../utils/shuffle';


const newSubject = {
  data() {
    return {
      // isLoading: false
    }
  },
  created() {
    this.$bus.on(Event.ACTIVITY_NEXT_EVENT, this.startAnswer);
  },
  beforeDestroy() {
    this.$bus.off(Event.ACTIVITY_NEXT_EVENT, this.startAnswer);
  },
  computed: {
    ...mapState([
      'user'
    ]),
    ...mapState([
      'room'
    ]),
    ...mapState([
      'anchor'
    ]),
    ...mapState([
      'activity'
    ]),
  },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVITY_STATUS',
      'SET_CURRENT_SUBJECT',
      'SET_SUBJECT_TOTAL',
      'INSERT_ANSWER_POEOPLE_NUM',
    ]),
    async goNext() {

      // this.startAnswer({});
      // return;
      try {
        let res = await getCurrentQuestion(this.activity.id, this.room.id, this.anchor.id);
        if (res.code == 200) {
          this.$bus.emit(Event.EMIT_EVENT, {
            "_method_": "next",
            "action": "1020",
            "ct": res.data,
            "msgtype": res.data.id
          });
          this.SET_SUBJECT_TOTAL(parseInt(res.data.total_num));
        } else {
          // window.layer.msg(res.message);
          alert(res.msg)
        }
      } catch (error) {}
    },

    startAnswer(data, status) {
      // data.ct = {"code":200,"message":"","data":{"id":10,"content":{"question":"以下哪一个游戏在早期2D时代的第一部作品不是俯视角？","answer":[{"key":1,"text":"合金装备"},{"key":2,"text":"塞尔达传说"},{"key":3,"text":"侠盗猎车"},{"key":4,"text":"银河战士"}]},"timestamp":1523000207.5238,"total_num":10}}.data;
      data.ct.content.answer = shuffle(data.ct.content.answer)
      this.SET_CURRENT_SUBJECT(
        data.ct
      );
      if (!status) {
        this.CHANGE_ACTIVITY_STATUS({
          status: 3
        });
      }
      this.answerResult = {};
      this.answerStep = 0;


    },
  }
}

export default newSubject;
