import Event from '../utils/Event'
import { mapMutations } from 'vuex'
import { QUIZ_VISITOR_LIST_SOCKET } from '../store/mutation-types'

const socketClient = {
  data () {
    return {
      socket: window.socket
    }
  },
  created () {
    this.$bus.on(Event.EMIT_EVENT, this.emitEvent);
  },
  beforeDestroy () {
    this.$bus.off(Event.EMIT_EVENT, this.emitEvent);
  },
  mounted() {
    this.socket.on('broadcastingListen', res => {
      try{ 
        let msg = JSON.parse(res);
        switch(msg.msg[0]._method_) {
          case 'activityGuessNotice':
            this.QUIZ_VISITOR_LIST_SOCKET(JSON.parse(msg.msg[0].ct).info);
          break;
        }
      }catch(e){}
    })
  },
  methods: {
    ...mapMutations(['QUIZ_VISITOR_LIST_SOCKET']),
    emitEvent (msg) {
      this.socket.emit('broadcast', JSON.stringify(msg));
    }
  }
}
export default socketClient
