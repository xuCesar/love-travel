// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import router from './router'

import * as GLOBAL from '@/scripts/_variables'
import * as utils from '@/scripts/utils'

import 'normalize.css/normalize.css'
import 'lib-flexible/flexible'
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, 'GLOBAL', {
  value: GLOBAL
})
Object.defineProperty(Vue.prototype, 'utils', {
  value: utils
})


Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
