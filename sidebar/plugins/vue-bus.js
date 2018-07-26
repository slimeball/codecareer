/**
 * vue-bus
 */

// https://rawidn.com/posts/traps-in-vue-eventbus.html

import Vue from 'vue';

function VueBus() {
  var bus = new Vue();

  Object.defineProperties(bus, {
    on: {
      get: function get() {
        return this.$on
      }
    },
    once: {
      get: function get() {
        return this.$once
      }
    },
    off: {
      get: function get() {
        return this.$off
      }
    },
    emit: {
      get: function get() {
        return this.$emit
      }
    }
  });

  Vue.bus = bus;

  Object.defineProperty(Vue.prototype, '$bus', {
    get: function get() {
      return bus
    }
  });
}

export default VueBus;


