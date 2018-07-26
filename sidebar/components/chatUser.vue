<template>
  <div class="chat-avatar"  @mouseout="mouseOutAvatar" @mouseover="mouseOverAvatar" @click.stop="mouseClickAvatar">
    <img :src="user.avatar"/>
    <!-- <img src="https://pbs.twimg.com/profile_images/412198974066405376/V20eXpr__bigger.png"  /> -->

    <div class="chat-username" v-show="showChatUsername || showChatUsername2">
      <input class="username" ref="userNicename" type="text" maxlength="8" :class="{'setname-input':bordercolor}" @keyup.enter="resetName"
        @blur="resetNameBlur" v-model="inputValue" :disabled="!user || user.logged != 1" />
    </div>

  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { isEmpty, isNickname } from "src/utils/validation";
import tip from "src/mixins/tip";
import { editUserNiceName } from "../utils/getData";
import Event from "src/utils/Event";

export default {
  props: ["hideDropdown"],
  data() {
    return {
      inputValue: "",
      bordercolor: false, //输入框边框颜色
      disabledInput: true,
      showChatUsername: false,
      showChatUsername2: false
    };
  },
  mounted() {
    this.inputValue = this.user.user_nicename;
  },
  mixins: [tip],
  computed: {
    ...mapState(["user"])
  },
  watch: {
    hideDropdown: function(value) {
      this.hideModify();
    }
  },
  methods: {
    ...mapMutations(["RETSET_NAME"]),
    updatedUserModify(){
      // 更新用户列表
      let msg = {
          "msg": [{
              "_method_": "updateUserList",
              "action": 0,
              "ct": '',
              "live_room_id": _DATA.anchor.id,
          }],
          "retcode": "000000",
          "retmsg": "OK"
      };
      this.$bus.emit(Event.EMIT_EVENT, msg);
    },
    hideModify() {
      this.showChatUsername = false;
      this.showChatUsername2 = false;
    },
    mouseClickAvatar() {
      this.showChatUsername2 = !this.showChatUsername2;
      setTimeout(() => {
        this.$refs.userNicename.focus();
      }, 100);
    },
    mouseOverAvatar() {
      this.showChatUsername = true;
    },
    mouseOutAvatar() {
      this.showChatUsername = false;
    },
    isValid() {
      if (isEmpty(this.inputValue)) {
        this.warn("请输入昵称");
        return false;
      }
      if (!isNickname(this.inputValue)) {
        this.warn('昵称可输入中文、字母、数字、空格、“-”、"_"');
        return false;
      }
      return true;
    },
    inputThing() {
      if (isEmpty(this.inputValue) || !isNickname(this.inputValue)) {
        this.bordercolor = true;
      } else {
        this.bordercolor = false;
      }
    },
    async resetName() {
      if (this.inputValue == this.user.user_nicename) return;
      if (this.isValid()) {
        try {
          let res = await editUserNiceName(this.inputValue);
          if (res.state == 0) {
            this.RETSET_NAME(this.inputValue);
            this.disabledInput = true;
            this.warn("昵称修改成功");
            this.updatedUserModify();
          } else {
            this.warn("昵称修改失败");
            this.inputValue = this.user.user_nicename;
          }
        } catch (e) {
          console.log(e)
          this.warn("昵称修改失败");
          this.inputValue = this.user.user_nicename;
        }
        this.hideModify();
      }
    },
    isValidBlur() {
      if (isEmpty(this.inputValue)) {
        this.inputValue = this.user.user_nicename;
        return false;
      }
      if (!isNickname(this.inputValue)) {
        this.warn('昵称可输入中文、字母、数字、空格、“-”、"_"');
        this.inputValue = this.user.user_nicename;
        return false;
      }
      return true;
    },
    async resetNameBlur() {
      if (this.inputValue == this.user.user_nicename) return;
      if (this.isValidBlur()) {
        try {
          let res = await editUserNiceName(this.inputValue);
          if (res.state == 0) {
            this.RETSET_NAME(this.inputValue);
            this.disabledInput = true;
            this.warn("昵称修改成功");
            this.updatedUserModify();
          } else {
            this.warn("昵称修改失败");
            this.inputValue = this.user.user_nicename;
          }
        } catch (e) {
          console.log(e)
          this.warn("昵称修改失败");
          this.inputValue = this.user.user_nicename;
        }
        this.hideModify();
      }
    },
    editName() {
      this.disabledInput = false;
      setTimeout(() => {
        this.$refs.userNicename.focus();
      }, 100);
    }
  }
};
</script>
<style lang="scss" scoped>
.chat-avatar {
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

.chat-username {
  position: absolute;
  z-index: 2;
  top: -26px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 26px;
  input {
    color: #ffffff;
    padding-left: 10px;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    float: left;
  }
}
</style>
