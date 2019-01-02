import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Auth from './plugins/auth'
import moment from 'moment'
import vueXlsxTable from 'vue-xlsx-table'
import { createSimpleTransition } from 'vuetify/es5/util/helpers'
 
const tSlide = createSimpleTransition('tslide')
Vue.component('tslide', tSlide)

import materialIcons from 'material-design-icons/iconfont/material-icons.css'

require('typeface-roboto')

Vue.use(Auth)
Vue.use(vueXlsxTable, {rABS: false})

Vue.prototype.$moment = moment
moment.locale(['id']);

router.beforeEach(
  (to,from,next) => { 
    if(to.matched.some(record => record.meta.forPublic)){
      if(Vue.auth.isAuthenticated()){        
        next({
          path: '/'
        }) 
      } else next()
    } 

    else if(to.matched.some(record => record.meta.forAuth)){
      if( ! Vue.auth.isAuthenticated()){
        next({
          path: '/login'
        }) 
      } else next()
    }
    else next()
  }
)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
