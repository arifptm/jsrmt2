import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Login from './components/auth/Login.vue'
import Identity from './components/identity/Index'
import Background from './components/background/Index'
import Schedule from './components/schedule/Index'
import Setting from './components/setting/Index'
import Alarm from './components/setting/Alarm'
import Murottal from './components/murottal/Index'
import Correction from './components/setting/Correction'
import Silent from './components/setting/Silent'
import Other from './components/setting/Others'

import Ticker from './components/ticker/Index'
import Jumbotron from './components/jumbotron/Index'
import Khotbah from './components/khotbah/Index'
import MurottalUpload from './components/murottal/Upload'

import ChangePwd from './components/auth/Change'


Vue.use(Router)

export default new Router({
  // mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { forPublic: false, forAuth:true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { forPublic: true, forAuth:false }
    },
    {
      path: '/identities',
      name: 'identity',
      component: Identity,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    },
    {
      path: '/backgrounds',
      name: 'background',
      component: Background,
      meta: { forPublic: false, forAuth:true }
    },
    {
      path: '/schedules',
      name: 'schedule',
      component: Schedule,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    },
    {
      path: '/settings',
      name: 'setting',
      component: Setting,
      meta: { forPublic: false, forAuth:true }
    }, 
    {
      path: '/alarms',
      name: 'alarm',
      component: Alarm,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    }, 
    {
      path: '/murottals',
      name: 'murottal',
      component: Murottal,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    }, 
    {
      path: '/corrections',
      name: 'correction',
      component: Correction,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    }, 
    {
      path: '/silents',
      name: 'silent',
      component: Silent,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    }, 
    {
      path: '/others',
      name: 'other',
      component: Other,
      meta: { forPublic: false, forAuth:true, closeTo: 'setting' }
    }, 

    {
      path: '/tickers',
      name: 'ticker',
      component: Ticker,
      meta: { forPublic: false, forAuth:true }
    }, 
    
    {
      path: '/khotbahs',
      name: 'khotbah',
      component: Khotbah,
      meta: { forPublic: false, forAuth:true }
    }, 
    
    {
      path: '/jumbotrons',
      name: 'jumbotron',
      component: Jumbotron,
      meta: { forPublic: false, forAuth:true }
    }, 
    {
      path: '/murottal-upload',
      name: 'murottal-upload',
      component: MurottalUpload,
      meta: { forPublic: false, forAuth:true }
    }, 
    {
      path: '/change_pwd',
      name: 'change-pwd',
      component: ChangePwd,
      meta: { forPublic: false, forAuth:true }
    }, 

    //{
      // path: '/about',
      // name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    //}
  ]
})
