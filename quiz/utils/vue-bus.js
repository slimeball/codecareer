function VueBus (Vue) {
  var bus = new Vue()

  Object.defineProperties(bus, {
    on: {
      get: function get () {
        return this.$on
      }
    },
    once: {
      get: function get () {
        return this.$once
      }
    },
    off: {
      get: function get () {
        return this.$off
      }
    },
    emit: {
      get: function get () {
        return this.$emit
      }
    }
  })

  Vue.bus = bus

  Object.defineProperty(Vue.prototype, '$bus', {
    get: function get () {
      return bus
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueBus)
}

export default VueBus
