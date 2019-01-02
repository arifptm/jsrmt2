import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	baseUrl: process.env.VUE_APP_BASEDOMAIN,
  	version: process.env.VUE_APP_VERSION,
  	serial:"",
    license:"",
  	isAuth: false,
  	pageTitle:'',
  	drawer: false,
    template: ''
  },
  mutations: {  	
  	licensing (state, value) {
      state.license = value
    },

    authenticate(state, value){    	
    	state.isAuth = value
    },

    drawerState(state){
    	state.drawer = !state.drawer
    },

    pageTitle(state, value){
    	state.pageTitle = value
    },

    baseUrl(state, value){
      state.baseUrl = value
    },

    serial(state, value){
      state.serial = value
    },

    template(state,value){
      state.template = value
    }

  },
  actions: {

  }
})
