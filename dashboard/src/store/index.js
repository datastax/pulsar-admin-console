import Vue from 'vue'
import Vuex from 'vuex'
import VuexI18n from 'vuex-i18n' // load vuex i18n module
import VuexPersist from 'vuex-persist'
import app from './modules/app'
import pulsar from './modules/pulsar'

import * as getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  getters,
  modules: {
    app,
    pulsar
  },
  state: {},
  mutations: {},
  // plugins: [vuexPersist.plugin]
})

Vue.use(VuexI18n.plugin, store)

window.VueStore = store
export default store
