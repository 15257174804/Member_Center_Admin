import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    driverkey: 0,
    user_name: localStorage.getItem('user_name')?localStorage.getItem('user_name'):"请重新登录",
    group_name:sessionStorage.getItem('group_name')?sessionStorage.getItem('group_name'):"请重新登录",
    token:"",
    flodKey: 0,
    clientId:'',
    groupId:'',
    isAdmin:''
  },
  getters: {
    change(state) {
      return state.driverkey = 1;
    }
  },
  mutations: {
    setUserInfo(state,name){ //保存用户信息
      state.user_name = name;
      localStorage.setItem('user_name',name)
    },
    setGroupInfo(state,name){  //保存公司信息
      state.group_name=name;
      sessionStorage.setItem('group_name',name)
    },
    setFlodKey(state,key){
      state.flodKey = key;
    },
    setClientId(state,clientid){
      state.clientId=clientid;
    },
    setGroupId(state,groupid){
      state.groupId=groupid;
    },
    setAdmin(state,isAdmin){
      state.isAdmin=isAdmin;
    }
  },
  actions: {
    setUserInfoFun(context,name){
      context.commit("setUserInfo",name);
    },
    setGroupInfoFun(context,name){
      context.commit("setGroupInfo",name);
    },
    setFlodKeyFun(context,key){
      context.commit("setFlodKey",key);
    }
  }
})
