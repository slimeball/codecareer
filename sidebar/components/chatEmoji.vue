<template>
  <div id="chatEmoji" class="chat-emoji">
    <div class="emoji-enter" @click="toggleEmojis">
      <img src="https://twemoji.maxcdn.com/2/72x72/1f600.png" alt="">
    </div>
    <!-- 表情添加： http://twitter.github.io/twemoji/2/test/preview.html -->
    <ul id="emojisWrap" class="emojis-wrap" v-show="showEmojis" @click="selectEmoji">
      <li>😀</li>
      <li>😁</li>
      <li>😂</li>
      <li>😃</li>
      <li>😄</li>
      <li>😄</li>
      <li>😆</li>
      <li>😇</li>
      <li>😈</li>
      <li>😉</li>
      <li>😊</li>
      <li>😋</li>
      <li>😌</li>
      <li>😍</li>
      <li>😎</li>
      <li>😏</li>
      <li>😐</li>
      <li>😑</li>
      <li>😑</li>
      <li>😒</li>
      <li>😓</li>
      <li>😔</li>
      <li>😕</li>
      <li>😖</li>
      <li>😗</li>
      <li>😘</li>
      <li>😙</li>
      <li>😚</li>
      <li>😛</li>
      <li>😜</li>
      <li>😝</li>
      <li>😞</li>
      <li>😟</li>
      <li>😠</li>
      <li>😡</li>
      <li>😢</li>
      <li>😣</li>
      <li>😤</li>
      <li>😥</li>
      <li>😦</li>
      <li>😧</li>
      <li>😨</li>
      <li>😩</li>
      <li>😪</li>
      <li>😫</li>
      <li>😬</li>
      <li>😭</li>
      <li>😮</li>
      <li>😯</li>
      <li>😰</li>
      <li>😱</li>
      <li>😲</li>
      <li>😳</li>
      <li>😴</li>
      <li>😵</li>
      <li>😵</li>
      <li>😶</li>
      <li>😷</li>
      <li>🙁</li>
      <li>🙂</li>
      <li>🙃</li>
      <li>🙄</li>
      <li>🤐</li>
      <li>🤑</li>
      <li>🤒</li>
      <li>🤓</li>
      <li>🤔</li>
      <li>🤕</li>
      <li>🤖</li>
      <li>🤗</li>
      <li>🤣</li>
      <li>🤤</li>
      <li>🤥</li>
      <li>🤧</li>
      <li>💝</li>
      <li>💔</li>
      <li>💋</li>
      <li>👄</li>
      <li>💪</li>
      <li>👆</li>
      <li>👇</li>
      <li>👈</li>
      <li>👉</li>
      <li>👎</li>
      <li>👌</li>
      <li>👊</li>
      <li>👐</li>
      <li>👋</li>
      <li>🀄</li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import tip from "src/mixins/tip";
import { editUserNiceName } from "../utils/getData";
import Event from "src/utils/Event";
import twemoji from "twemoji";

export default {
  props: ["hideDropdown"],
  data() {
    return {
      showEmojis: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      var ul = document.getElementById("emojisWrap");
      twemoji.parse(ul, { size: 72 });
    });
  },
  mixins: [tip],
  computed: {
    ...mapState(["user"])
  },
  watch: {
    hideDropdown: function(value) {}
  },
  methods: {
    toggleEmojis() {
      this.showEmojis = !this.showEmojis;
    },
    selectEmoji(e) {
      if (e.target.nodeName.toLowerCase() === "img") {
        this.$emit("getEmojiMsg", e.target.alt);
        this.showEmojis = false;
      }
    }
  }
};
</script>
<style lang="scss">
.emojis-wrap .emoji {
  margin: 0 5px 5px 0;
  float: left;
  width: 22px;
  height: 22px;
}
</style>

<style lang="scss" scoped>
.chat-emoji {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  padding: 2px 0 2px 4px;
  overflow: hidden;
  cursor: pointer;
  img {
    float: left;
    border-radius: 30px;
    width: 100%;
    height: 100%;
  }
}

.emoji-enter {
  width: 22px;
  height: 22px;
  margin-top: 2px;
  img {
    width: 100%;
    height: 100%;
  }
}

.emojis-wrap {
  position: absolute;
  z-index: 2;
  top: -116px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 113px;
  background: RGBA(255, 255, 255, 1);
  overflow-y: auto;
  padding-left: 5px;
  padding-top: 5px;
}
</style>
