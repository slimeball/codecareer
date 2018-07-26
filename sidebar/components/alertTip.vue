 <template>
    <div class="alet_container">
	    <section class="tip_text_container">
        <p class="tip_text">{{alertText}}</p>
      </section>
    </div>
</template>

<script>
export default {
  data() {
    return {
      positionY: 0,
      timer: null
    };
  },
  mounted() {
    setTimeout(() => {
      this.$emit("closeTip");
    }, 1800);
  },
  props: ["alertText"],
  methods: {
    closeTip() {
      this.$emit("closeTip");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/mixin";
@keyframes tipMove {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.alet_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}
.tip_text_container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  margin-left: -50px;
  margin-top: -50px;
  animation: tipMove 0.4s;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 10px 20px;
  .tip_text {
    color: #ffffff;
    text-align: center;
  }
}
</style>
