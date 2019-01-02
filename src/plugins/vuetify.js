import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
		primary: colors.blueGrey, // #E53935
		secondary: colors.orange.darken4, // #FFCDD2
		success: colors.blueGrey.lighten4
  }
})
