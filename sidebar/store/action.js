import {
  getUser,
  getAddressList
} from '../utils/getData'
import {
  GET_USERINFO,
  SAVE_ADDRESS
} from './mutation-types.js'

export default {

  async getUserInfo({ //参数解构
    commit,
    state
  }) {
    let res = await getUser();
    commit(GET_USERINFO, res)
  },
  async saveAddress({
    commit,
    state
  }) {

    if (state.removeAddress.length > 0) return;

    let addres = await getAddressList(state.userInfo.user_id);
    commit(SAVE_ADDRESS, addres);
  },
}
