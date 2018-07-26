import Event from 'src/utils/Event';
const tip = {
  methods: {
    warn(text) {
      this.$bus.emit(Event.ADD_MSG, {
        _method_: 'warning',
        type: 'warning',
        text: text
      });
    },
    showTip(text) {
      this.$bus.emit(Event.SHOW_ALERT, {
        text: text
      });
    }
  }
}

export default tip;
