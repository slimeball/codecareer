import io from 'socket.io-client';
import Event from 'src/utils/Event';
import { mapState, mapMutations } from 'vuex';
import tip from 'src/mixins/tip';
import { setNodeInfo } from '../utils/getData';
import { imUrl } from '../config/env';
import { QUIZ_VISITOR_LIST_SOCKET } from '../store/mutation-types';

const socketConnect = {
  data() {
    return {
      socket: {},
      isLive: true
    }
  },
  created() {
    this.$bus.on(Event.EMIT_EVENT, this.emitEvent);
  },
  beforeDestroy() {
    this.$bus.off(Event.EMIT_EVENT, this.emitEvent);
  },
  mixins: [tip],
  computed: {
    ...mapState(['user', 'room', 'anchor', 'live', 'quizVisitorList']),
  },
  mounted() {
    if (this.live && this.live.islive == 1) { //有直播
    } else {
      this.isLive = false;
    }

    this.socket = io.connect(imUrl, {
      "transports": ['websocket']
    });
    // this.socket = io('https://im.xsm7.com:19967');
    const socket = this.socket;
    socket.on('connect', () => {
      // console.log('im链接成功');
      // this.warn("im链接成功");
      this.emitConn();
    });

    // nodeJs 告诉客户端是否连接成功
    socket.on('conn', (data) => {
      // console.log('用户连接成功', data);
      // this.warn("用户连接成功");
    });

    // 开始监听nodejs的发送过来的数据
    socket.on('broadcastingListen', (data) => {
      for (let i in data) {
        if (i != 'remove') {
          if (data[i] == "stopplay") {
            // JsInterface.superStopRoom();
          } else {
            const d = JSON.parse(data[i]);
            var msgObject = d.msg[0];
            // console.log(msgObject);
            const msgmethod = msgObject._method_;

            if (this.isLive || msgmethod == 'StartEndLive' || msgmethod == 'switchLive') {
              switch (msgmethod) {
                case "StartEndLive":
                case "CloseVideo":
                  this.$bus.emit(Event.VIDEO_EVENT, msgObject);
                  break;

                case "channel_gap":
                case "ShutUpUser":
                  this.$bus.emit(Event.CHAT_EVENT, msgObject);
                  this.$bus.emit(Event.ADD_MSG, msgObject);
                  break;
                case 'activityGuessNotice':
                 // 竞猜列表为空时用socket渲染
                  if(this.quizVisitorList.length === 0){
                    this.$bus.emit(Event.CHECK_QUIZ, msgObject);
                  }
                  this.QUIZ_VISITOR_LIST_SOCKET(JSON.parse(msgObject.ct).info);
                default:
                  this.$bus.emit(Event.ADD_MSG, msgObject);
              }
            }
            // const msgtype = msgObject.msgtype;
            // const msgaction = msgObject.action;
            // console.log(msgmethod, msgObject)
          }
        }
      }
    });
    // 百万答题
    this.socket.on('activityListen', (msg) => {
      switch (msg._method_) {
        case "next":
          this.$bus.emit(Event.ACTIVITY_NEXT_EVENT, msg);
          break;
        case "result":
        case "end":
          this.$bus.emit(Event.ACTIVITY_RESULT_EVENT, msg);
          break;
      }
    });
    socket.on('event', function (data) {
      // debugger;
    });
    socket.on('disconnect', () => {
      // this.warn("socket连接断开了");
      console.log('socket连接断开了')
    });
  },
  methods: {
    ...mapMutations(['QUIZ_VISITOR_LIST_SOCKET']),
    async emitConn() {
      let res = await setNodeInfo(this.anchor.id, this.room.typeId, this.anchor.stream);
      if (res.error == 0) {
        const userinfo = res.userinfo;
        // 客户端 向 nodeJS发送连接请求
        this.socket.emit('conn', {
          uid: userinfo.id,
          roomnum: userinfo.roomnum,
          nickname: userinfo.user_nicename,
          stream: userinfo.stream,
          equipment: 'pc',
          token: userinfo.token,
          live_type: userinfo.live_type,
          live_id: userinfo.live_id
        });
      }
    },
    emitEvent(msg) {
      if (this.isLive) {
        this.socket.emit('activity', JSON.stringify(msg));
        this.socket.emit('broadcast', JSON.stringify(msg));
      } // 无直播不允许发言
    }
  }
}
export default socketConnect;
