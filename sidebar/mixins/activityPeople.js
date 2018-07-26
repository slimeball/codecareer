import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex';
import {
  getRightAnswerNum,
  getPlayerStatus,
} from '../utils/getData';

const activityPeople = {
  data() {
    return {
      peopleNum: null,
    }
  },
  computed: {
    ...mapState([
      'room'
    ]),
    ...mapState([
      'activity'
    ]),
  },
  methods: {
    ...mapMutations([
      'SET_USER_ACTIVITY_STATUS',
    ]),
    async getPeopleNum() {
      try {
        let res = await getRightAnswerNum(this.activity.id, this.room.id);
        if (res.code == 200) {
          this.peopleNum = res.data[0]
        } else {}
      } catch (error) {
        // console.log(error)
      }
    },
    async getPlayerStatus() {
      if (this.room.userIsAnchor) return;
      let res = await getPlayerStatus(this.activity.id, this.room.id);
      // console.log('用户状态:字符串,-1:出局； 1，可继续答题  0: 未报名 ', res.data)
      if (res.code == 200) {
        this.SET_USER_ACTIVITY_STATUS(res.data)
      }
    },
  }
}

export default activityPeople;
