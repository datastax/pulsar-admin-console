// Polyfills
import 'es6-promise/auto'
import 'babel-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import VueFilter from 'vue-filter'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'
import store from './store'
import router from './router'
import VuesticPlugin from '@/vuestic-theme/vuestic-plugin'
import './i18n'
import YmapPlugin from 'vue-yandex-maps'
import numeral from 'numeral'
import moment from 'moment'
import VueClipboard from 'vue-clipboard2'
import VueHighlightJS from 'vue-highlightjs'
import VueFriendlyIframe from 'vue-friendly-iframe'
import vPage from 'v-page'

// Use highlistjs tomorrow night  style
import 'highlight.js/styles/tomorrow-night.css'

Vue.use(VueHighlightJS)

Vue.use(VueClipboard)

Vue.use(VuesticPlugin)
Vue.use(YmapPlugin)
Vue.use(VueFilter)
Vue.use(VueFriendlyIframe)
Vue.use(vPage, {
  language: 'en'
});

// NOTE: workaround for VeeValidate + vuetable-2
Vue.use(VeeValidate, { fieldsBagName: 'formFields' })

router.beforeEach((to, from, next) => {
  store.commit('setLoading', true)
  next()
})

router.afterEach((to, from) => {
  store.commit('setLoading', false)
})

Vue.filter('humanBytes', function (value, precision = '0.0', mode = 'both') {
  const formatted = numeral(value).format(precision + ' b').split(' ')

  if (mode === 'number') {
    return formatted[0]
  }
  if (mode === 'unit') {
    return formatted[1]
  }

  return numeral(value).format(precision + ' b')
})
Vue.filter('humanSeconds', (value, units = 'seconds') => {
  return moment.duration(value, units).humanize()
})

Vue.filter('zeroIsUnlimited', (value) => {
  if (value === 0) {
    return "Unlimited"
  }
  return value
})

Vue.filter('numberSeparate', (value, digits = 1, separator = ' ') => {
  return value.toFixed(digits).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + separator)
})



/* eslint-disable no-new */

new Vue({
  el: '#wp-vue-app',
  router,
  store,
  render: h => h(App),
})
