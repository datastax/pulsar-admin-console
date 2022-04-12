//
//  Copyright 2021 DataStax, Inc. 
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  
//

import ApiService from '@/services/ApiService'
import Vue from 'vue'
import utils from 'services/utils'
import AjaxService from '@/services/AjaxService'

const state = {
  tenant: '',
  counter: 0,
  activeCluster: 'useast1-gcp',
  topicListStale: true,
  functionListStale: true,
  sinkListStale: true,
  sourceListStale: true,
  test: 'unknown',
  nsListStale: false,
  allowedClusters: [],
  numAllowedClusters: 0,
  namespacesConfig: { 'list': [], 'data': {}, 'stats': {}, 'numTopics': {}, 'persist': {}, num: 0, 'numFunctions': {}, 'numSinks': {}, 'numSources': {} },
  clustersConfig: { 'list': [], 'data': {}, 'stats': {}, num: 0 },
  functionsData: { 'list': [], 'data': {}, 'stats': {}, 'status': {}, num: 0 },
  sinksData: { 'list': [], 'data': {}, 'stats': {}, 'status': {}, num: 0 },
  sourcesData: { 'list': [], 'data': {}, 'stats': {}, 'status': {}, num: 0 },
  topicsConfig: { 'list': [], 'data': {}, num: 0 },
  topicStats: { 'data': {} },
  brokersData: { 'list': [], 'data': {}, 'stats': {}, num: 0 },
  apiVersion: '2.4.1',
  clientToken: '',
  plan: '',
  planToCreate: '',
  defaultPlan: '',
  needToCreatePlan: false,
  caCertificate: '',
  adminToken: '',
  apiBaseUrl: '',
  noticeText: '',
  pollingInterval: 5000,
  wssUrlOverride: '',
  grafanaUrlOverride: '',
  disableBilling: 'false',
  runningEnv: 'web',
  authMode: 'none',
  oauthClientId: '',
  planInfo: {},
  hostOverrides: {},
  subscriptionInfo: [],
  tokenList: [],
  orgInfo: { userInfo: [] },
  entitlementInfo: '',
  clusterInfo: {
    data: [],
    info: {},
    latlong: {}
  },
  runTimer: false,
  runFunctionTimer: false,
  runSinkTimer: false,
  tenantList: [],
  runSourceTimer: false,
  multiUserOrg: 'true',
  privateOrg: 'false',
  useTokenList: 'false',
  brokerLoadData: {},
  functionsDisabled: 'false',
  renderMonitoringTab: 'false',
  clientsDisabled: 'false',
  userRole: 'admin',
  featureFlags: '',
  filterObject: {
    topicTopic: '',
    topicNamespace: '',
    functionFunction: '',
    functionNamespace: '',
    functionRuntime: '',
    sinkSink: '',
    sinkNamespace: '',
    sourceSource: '',
    sourceNamespace: '',
    topicType: '',
    topicSortKey: 'name',
    topicSortDir: 'Up'
  }
}

const mutations = {
  setTenant (state, tenant) {
    state.tenant = tenant
  },
  setLogin (state, login) {
    console.log(`Setting login to ${login}`)
    state.login = login
  },
  setMultiUserOrg (state, flag) {
    state.multiUserOrg = flag
  },
  setPrivateOrg (state, flag) {
    state.privateOrg = flag
  },
  setUseTokenList (state, flag) {
    state.useTokenList = flag
  },
  setFunctionsDisabled (state, flag) {
    state.functionsDisabled = flag
  },
  setRenderMonitoringTab (state, flag) {
    state.renderMonitoringTab = flag
  },
  setClientsDisabled (state, flag) {
    state.clientsDisabled = flag
  },
  setEmail (state, email) {
    state.email = email
  },
  setFilterObject (state, filter) {
    let key = filter.key
    const value = filter.value
    state.filterObject[key] = value
  },
  setNoticeText (state, noticeText) {
    state.noticeText = noticeText
  },
  setPollingInterval (state, pollingInterval) {
    state.pollingInterval = pollingInterval
  },
  setWssUrlOverride (state, port) {
    state.wssUrlOverride = port
  },
  setGrafanaUrlOverride (state, port) {
    state.grafanaUrlOverride = port
  },
  setDisableBilling (state, flag) {
    state.disableBilling = flag
  },
  setRunningEnv (state, value) {
    state.runningEnv = value
  },
  setAuthMode (state, value) {
    state.authMode = value
  },  
  setOauthClientId (state, value) {
    state.oauthClientId = value
  },
  setChargebeeSite (state, site) {
    state.chargebeeSite = site
  },
  setBillingProvider (state, site) {
    state.billingProvider = site
  },
  setUserRole (state, role) {
    state.userRole = role
  },
  setFeatureFlags (state, flags) {
    state.featureFlags = flags
  },
  setTest (state, value) {
    state.test = value
  },
  setRunTimer (state, value) {
    state.runTimer = value
  },
  setRunFunctionTimer (state, value) {
    state.runFunctionTimer = value
  },
  setRunSinkTimer (state, value) {
    state.runSinkTimer = value
  },
  stopAllTimers () {
    state.runTimer = false
    state.runSinkTimer = false
    state.runSourceTimer = false
    state.runFunctionTimer = false
  },
  startAllTimers () {
    state.runTimer = true
    state.runSinkTimer = true
    state.runSourceTimer = true
    state.runFunctionTimer = true
  },
  setRunSourceTimer (state, value) {
    state.runSourceTimer = value
  },
  setApiVersion (state, value) {
    state.apiVersion = value
  },
  setApiBaseUrl (state, value) {
    state.apiBaseUrl = value
  },
  setClientToken (state, value) {
    state.clientToken = value
  },
  setPlan (state, value) {
    state.plan = value
  },
  setPlanToCreate (state, value) {
    state.planToCreate = value
  },
  setDefaultPlan (state, value) {
    state.defaultPlan = value
  },
  setNeedToCreatePlan (state, value) {
    state.needToCreatePlan = value
  },
  setCaCertficate (state, value) {
    state.caCertificate = value
  },
  setAdminToken (state, value) {
    state.adminToken = value
  },
  updateNamespacesList (state, namespaces) {
    state.namespacesConfig.list = namespaces
    state.nsListStale = false
  },
  purgeNamespace (state, namespace) {
    delete state.namespacesConfig.data[namespace]
    delete state.namespacesConfig.stats[namespace]
    delete state.namespacesConfig.numTopics[namespace]
  },
  purgeFunction (state, func) {
    delete state.functionsData.data[func]
    delete state.functionsData.stats[func]
    delete state.functionsData.status[func]
  },
  purgeSink (state, sink) {
    delete state.sinksData.data[sink]
    delete state.sinksData.stats[sink]
    delete state.sinksData.status[sink]
  },
  purgeSource (state, source) {
    delete state.sourcesData.data[source]
    delete state.sourcesData.stats[source]
    delete state.sourcesData.status[source]
  },
  changeActiveCluster (state, cluster) {
    // Block actions on the ns and topic lists
    // until they are updated
    state.topicListStale = true
    state.nsListStale = true
    state.functionListStale = true
    state.sinkListStale = true
    state.sourceListStale = true
    state.activeCluster = cluster
    console.log(`Changed active cluster to ${cluster}`)
  },
  updateNamespacesInfo (state, nsData) {
    const nsInfo = Object.assign({}, nsData.info)
    nsInfo.name = nsData.name
    nsInfo.path = nsData.path
    nsInfo.index = nsData.index
    nsInfo.cluster = nsData.cluster
    // If this data is stale, do not commit it
    if (nsData.cluster === state.activeCluster) {
      Vue.set(state.namespacesConfig.data, nsData.index, Object.freeze(nsInfo))
      // state.namespacesConfig.data[nsData.index] = nsInfo
    }
  },
  updateFunctionInfo (state, funcData) {
    const funcInfo = Object.assign({}, funcData.info)
    funcInfo.name = funcData.name
    funcInfo.path = funcData.path
    funcInfo.index = funcData.index
    funcInfo.tenant = funcData.tenant
    funcInfo.cluster = funcData.cluster
    // If this data is stale, do not commit it
    if (funcData.cluster === state.activeCluster) {
      Vue.set(state.functionsData.data, funcData.index, Object.freeze(funcInfo))
    }
  },
  updateSinkInfo (state, sinkData) {
    const sinkInfo = Object.assign({}, sinkData.info)
    sinkInfo.name = sinkData.name
    sinkInfo.path = sinkData.path
    sinkInfo.index = sinkData.index
    sinkInfo.tenant = sinkData.tenant
    sinkInfo.cluster = sinkData.cluster
    // If this data is stale, do not commit it
    if (sinkData.cluster === state.activeCluster) {
      Vue.set(state.sinksData.data, sinkData.index, Object.freeze(sinkInfo))
    }
  },
  updateSourceInfo (state, sourceData) {
    const sourceInfo = Object.assign({}, sourceData.info)
    sourceInfo.name = sourceData.name
    sourceInfo.path = sourceData.path
    sourceInfo.index = sourceData.index
    sourceInfo.tenant = sourceData.tenant
    sourceInfo.cluster = sourceData.cluster
    // If this data is stale, do not commit it
    if (sourceData.cluster === state.activeCluster) {
      Vue.set(state.sourcesData.data, sourceData.index, Object.freeze(sourceInfo))
    }
  },
  updateNamespacesPersistence (state, nsData) {
    const nsInfo = Object.assign({}, nsData.info)
    nsInfo.name = nsData.name
    nsInfo.path = nsData.path
    nsInfo.index = nsData.index
    nsInfo.cluster = nsData.cluster
    // If this data is stale, do not commit it
    if (nsData.cluster === state.activeCluster) {
      Vue.set(state.namespacesConfig.persist, nsData.index, nsInfo)
      // state.namespacesConfig.data[nsData.index] = nsInfo
    }
  },
  updateClusterInfo (state, data) {
    const clustInfo = Object.assign({}, data)

    Vue.set(state.clusterInfo, 'data', clustInfo.data)
    Vue.set(state.clusterInfo, 'info', clustInfo.info)
    Vue.set(state.clusterInfo, 'latlong', clustInfo.latlong)
  },
  updatePlanInfo (state, data) {
    Vue.set(state, 'planInfo', data.data)
  },
  setHostOverrides (state, overrides) {
    Vue.set(state, 'hostOverrides', overrides)
  },
  updateSubscriptionInfo (state, data) {
    Vue.set(state, 'subscriptionInfo', data.data)
  },
  updateTokenList (state, data) {
    Vue.set(state, 'tokenList', data.data)
  },
  updateOrgInfo (state, data) {
    Vue.set(state, 'orgInfo', data.data)
  },
  updateEntitlementInfo (state, data) {
    Vue.set(state, 'entitlementInfo', data.data)
  },
  updateNamespaceStats (state, nsStats) {
    Vue.set(state.namespacesConfig.stats, nsStats.index, Object.freeze(nsStats))
    // state.namespacesConfig.stats[nsStats.index] = nsStats
  },
  updateNumTopicsNamespace (state, data) {
    Vue.set(state.namespacesConfig.numTopics, data.index, data.number)
    // state.namespacesConfig.numTopics[data.index] = data.number
  },
  updateNumFunctionsNamespace (state, data) {
    Vue.set(state.namespacesConfig.numFunctions, data.index, data.number)
  },
  updateNumSinksNamespace (state, data) {
    Vue.set(state.namespacesConfig.numSinks, data.index, data.number)
  },
  updateNumSourcesNamespace (state, data) {
    Vue.set(state.namespacesConfig.numSources, data.index, data.number)
  },
  updateClusterStats (state, clusterStats) {
    Vue.set(state.clustersConfig.stats, clusterStats.index, Object.freeze(clusterStats))
  },
  updateFunctionStats (state, functionStats) {
    Vue.set(state.functionsData.stats, functionStats.index, Object.freeze(functionStats.stats))
  },
  updateSinkStats (state, sinkStats) {
    Vue.set(state.sinksData.stats, sinkStats.index, Object.freeze(sinkStats.stats))
  },
  updateSourceStats (state, sourceStats) {
    Vue.set(state.sourcesData.stats, sourceStats.index, Object.freeze(sourceStats.stats))
  },
  updateFunctionStatus (state, functionStatus) {
    Vue.set(state.functionsData.status, functionStatus.index, Object.freeze(functionStatus.status))
  },
  updateSinkStatus (state, sinkStatus) {
    Vue.set(state.sinksData.status, sinkStatus.index, Object.freeze(sinkStatus.status))
  },
  updateSourceStatus (state, sourceStatus) {
    Vue.set(state.sourcesData.status, sourceStatus.index, Object.freeze(sourceStatus.status))
  },
  updateNumNamespaces (state, num) {
    state.namespacesConfig.num = num
  },
  incrementCounter (state) {
    state.counter++
  },
  updateAllowedClusters (state, clusters) {
    state.allowedClusters = clusters
    clusters.forEach(cluster => {
      state.clustersConfig.data[cluster] = { name: cluster }
    })
  },
  updateTenants (state, tenantList) {
    state.tenantList = tenantList
  },
  updateBrokerLoadData (state, load) {
    state.brokerLoadData = load
    console.log(state.brokerLoadData)
  },
  updateNumAllowedClusters (state, clusters) {
    state.numAllowedClusters = clusters
  },
  updateTopicsConfig (state, topicsInfo) {
    Vue.set(state.topicsConfig, 'data', Object.freeze(topicsInfo.data))
  },
  updateTopicsList (state, list) {
    state.topicsConfig.list = list
    state.topicListStale = false
  },
  updateFunctionsList (state, list) {
    state.functionsData.list = list
    state.functionListStale = false
  },
  updateSinksList (state, list) {
    state.sinksData.list = list
    state.sinkListStale = false
  },
  updateSourcesList (state, list) {
    state.sourcesData.list = list
    state.sourceListStale = false
  },
  updateTopicConfig (state, topicData) {
    if (topicData.cluster === state.activeCluster) {
      Vue.set(state.topicsConfig.data, topicData.id, Object.freeze(topicData))
    }
  },
  updateTopicStats (state, statsData) {
    // Can't directly update a value in object because Vue won't
    // react
    Vue.set(state.topicStats.data, statsData.index, Object.freeze(statsData))
    // state.topicStats.data[statsData.index] = statsData
  },
  // Delete the stats for a particular topic
  purgeTopic (state, index) {
    // Make sure this request isn't stale
    if (!state.topicListStale) {
      delete state.topicsConfig.data[index]
      delete state.topicStats.data[index]
    }
  },
  updateNumTopics (state, num) {
    state.topicsConfig.num = num
  },
  updateNumFunctions (state, num) {
    state.functionsData.num = num
  },
  updateNumSinks (state, num) {
    state.sinksData.num = num
  },
  updateNumSources (state, num) {
    state.sourcesData.num = num
  }
}

const getters = {
  filterObject: state => state.filterObject,
  namespacesConfig: state => state.namespacesConfig,
  counter: state => state.counter,
  clustersConfig: state => state.clustersConfig,
  functionsData: state => state.functionsData,
  sinksData: state => state.sinksData,
  sourcesData: state => state.sourcesData,
  numNamespaces: state => state.numNamespaces,
  allowedClusters: state => state.allowedClusters,
  numAllowedClusters: state => state.numAllowedClusters,
  topicsConfig: state => state.topicsConfig,
  numTopics: state => state.numTopics,
  topicStats: state => state.topicStats,
  test: state => state.test,
  clientToken: state => state.clientToken,
  plan: state => state.plan,
  planToCreate: state => state.planToCreate,
  defaultPlan: state => state.defaultPlan,
  needToCreatePlan: state => state.needToCreatePlan,
  adminToken: state => state.adminToken,
  apiVersion: state => state.apiVersion,
  tenant: state => state.tenant,
  login: state => state.login,
  email: state => state.email,
  multiUserOrg: state => state.multiUserOrg,
  functionsDisabled: state => state.functionsDisabled,
  renderMonitoringTab: state => state.renderMonitoringTab,
  clientsDisabled: state => state.clientsDisabled,
  privateOrg: state => state.privateOrg,
  useTokenList: state => state.useTokenList,
  tenantList: state => state.tenantList,
  brokerLoadData: state => state.brokerLoadData,
  activeCluster: state => state.activeCluster,
  apiBaseUrl: state => state.apiBaseUrl,
  noticeText: state => state.noticeText,
  pollingInterval: state => state.pollingInterval,
  wssUrlOverride: state => state.wssUrlOverride,
  grafanaUrlOverride: state => state.grafanaUrlOverride,
  disableBilling: state => state.disableBilling,
  runningEnv: state => state.runningEnv,
  authMode: state => state.authMode,
  oauthClientId: state => state.oauthClientId,
  chargebeeSite: state => state.chargebeeSite,
  billingProvider: state => state.billingProvider,
  userRole: state => state.userRole,
  featureFlags: state => state.featureFlags,
  clusterInfo: state => state.clusterInfo,
  planInfo: state => state.planInfo,
  hostOverrides: state => state.hostOverrides,
  gcpMarketplaceLink: state => state.gcpMarketplaceLink,
  subscriptionInfo: state => state.subscriptionInfo,
  tokenList: state => state.tokenList,
  orgInfo: state => state.orgInfo,
  entitlementInfo: state => state.entitlementInfo,
  runTimer: state => state.runTimer,
  runFunctionTimer: state => state.runFunctionTimer,
  runSinkTimer: state => state.runSinkTimer,
  runSourceTimer: state => state.runSourceTimer,
  caCertificate: state => state.caCertificate,
  isAdminUser: state => {
    if (state.userRole === 'administrator' || state.userRole === 'customer-admin') {
      return true
    } else {
      return false
    }
  },
  currentAvailablePlans: state => {
    var allPlans = Object.keys(state.planInfo)
    var filtered = []
    allPlans.forEach(plan => {
      var notSelfServe = state.planInfo[plan].not_self_serve
      if (notSelfServe !== '1') {
        filtered.push(plan)
      }
    })
    return filtered
  },
  currentPaidPlans: state => {
    var allPlans = Object.keys(state.planInfo)
    var filtered = []
    allPlans.forEach(plan => {
      var notSelfServe = state.planInfo[plan].not_self_serve
      var paid = state.planInfo[plan].paid
      if (notSelfServe !== '1' && paid === '1') {
        filtered.push(plan)
      }
    })
    return filtered
  },
  getTopicKey: (state) => (topic) => {
    const topicParts = topic.match(/(^.+):\/\/(.+?)\/(.+?)\/(.+?$)/)
    const topicPath = topicParts[2] + '/' + topicParts[3] + '/' + topicParts[4]
    const activeCluster = state.activeCluster
    var topicId = activeCluster + ':' + topicPath.replace(/\//g, ':')
    // If this is a non-persistent topic, need to make sure its index is unique
    if (topicParts[1] === 'non-persistent') {
      topicId = topicId + ':nonpersistent'
    }
    if (topicParts[1] === 'partition-persistent') {
      topicId = topicId + ':parent'
    }
    const nsIdx = activeCluster + ':' + topicParts[2] + ':' + topicParts[3]

    return {
      topicId: topicId,
      nsId: nsIdx,
      typeOfTopic: topicParts[1],
      tenant: topicParts[2],
      namespace: topicParts[3],
      name: topicParts[4],
      topicPath: topicPath,
      cluster: activeCluster
    }
  }
}
const actions = {
  updateAll ({ state, dispatch }) {
    if (state.privateOrg === 'true') {
      dispatch('getTenants')
      dispatch('getTenantConfig')
    }
    dispatch('getNamespaces')
    dispatch('purgeOldNamespaces')
    dispatch('getNamespacesInfo')
    dispatch('getTopics')
    dispatch('purgeOldTopics')
    if (state.featureFlags.tenantStats) {
      dispatch('getTopicStatsByTenant')
    } else {
      dispatch('getTopicStats')
    }
    dispatch('rollupStats')
    if (state.privateOrg === 'true') {
      dispatch('getBrokerLoadReport')
    }
  },
  updateAllFunctions ({ dispatch }) {
    dispatch('getNamespaces')
    dispatch('purgeOldNamespaces')
    dispatch('getFunctions')
    dispatch('purgeOldFunctions')
    dispatch('getFunctionStats')
  },
  updateAllSinks ({ dispatch }) {
    dispatch('getNamespaces')
    dispatch('purgeOldNamespaces')
    dispatch('getSinks')
    dispatch('purgeOldSinks')
    dispatch('getSinkStats')
  },
  updateAllSources ({ dispatch }) {
    dispatch('getNamespaces')
    dispatch('purgeOldNamespaces')
    dispatch('getSources')
    dispatch('purgeOldSources')
    dispatch('getSourceStats')
  },
  async getNamespaces ({ commit, state, dispatch }) {
    const activeCluster = state.activeCluster
    // Get the current set of namespaces
    var beforeNsList = []
    state.namespacesConfig.list.forEach(ns => {
      beforeNsList.push(ns.index)
    })
    var afterNsList = []
    try {
      const response = await ApiService.getNamespaces(activeCluster, state.tenant)
      // Need to use index for list
      const nsList = []
      response.data.forEach(nsPath => {
        const index = activeCluster + ':' + nsPath.replace(/\//g, ':')
        const nsParts = nsPath.match(/^.+?\/(.+?$)/)
        const nsName = nsParts[1]
        const nsObj = {
          path: nsPath,
          index: index,
          cluster: activeCluster,
          name: nsName
        }
        nsList.push(nsObj)
        afterNsList.push(index)
      })
      //  Only commit if the namespaces have changed
      if (utils.array_diff(beforeNsList, afterNsList).length > 0) {
        console.log('Namespace difference', utils.array_diff(beforeNsList, afterNsList).length)
        commit('updateNamespacesList', nsList)
        commit('updateNumNamespaces', response.data.length)
        // Since we know the list has changed, dispatch a refresh of the namespaces
        // and topics and functions
        dispatch('getNamespacesInfo')
        dispatch('getTopics')
        if (state.featureFlags.function) {
          dispatch('getFunctions')
        }
        if (state.featureFlags.sink) {
          dispatch('getSinks')
        }
        if (state.featureFlags.source) {
          dispatch('getSources')
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  async getNamespacesInfo ({ commit, state }) {
    if (state.nsListStale) {
      return
    }
    // state.namespacesConfig.list.forEach(nsObj => {
    for (let nsObj of state.namespacesConfig.list) {
      // Active cluster can change during the async call
      if (state.nsListStale) {
        // Abort the loop
        break
      }
      // Make sure this request is internally consistent
      const activeCluster = state.activeCluster
      if (nsObj.cluster !== activeCluster) {
        // Abort the loop
        break
      }
      const nsParts = nsObj.path.match(/^.+?\/(.+?$)/)
      const nsName = nsParts[1]
      const promise = ApiService.getNamespaceInfo(activeCluster, nsObj.path)
      promise
        .then(resp => {
          if (resp.data != null) {
            commit('updateNamespacesInfo', {
              'index': nsObj.index,
              'name': nsName,
              'path': nsObj.path,
              'cluster': activeCluster,
              'info': resp.data,
            })
          }
        })
        .catch(e => console.log(e)
        )
      ApiService.getNamespacePersistence(activeCluster, nsObj.path)
        .then(resp => {
          if (resp.data != null) {
            commit('updateNamespacesPersistence', {
              'index': nsObj.index,
              'name': nsName,
              'path': nsObj.path,
              'cluster': activeCluster,
              'info': resp.data,
            })
          }
        })
        .catch(e => console.log(e)
        )
    }
  },
  async purgeOldNamespaces ({ commit, state }) {
    // The namespace list is the definitive set
    // If not on the list, purge the data
    if (state.nsListStale) {
      return
    }
    const currentNsList = state.namespacesConfig.list

    Object.keys(state.namespacesConfig.data).forEach(key => {
      // Check if this key is on the namespaces list
      let onList = false
      currentNsList.forEach(obj => {
        if (obj.index === key) {
          onList = true
        }
      })
      if (!onList && (state.namespacesConfig.data[key].cluster === state.activeCluster)) {
        console.log(`Purging namespace ${key}`)
        commit('purgeNamespace', key)
      }
    })
  },
  async getTenantConfig ({ commit, state }) {
    try {
      await ApiService.getTenantConfig(state.activeCluster, state.tenant).catch(e => console.log(e))
      // Need to keep a list of replication clusters
    } catch (error) {
      console.log(error, error.response)
    }
  },
  async getTenants ({ commit, state }) {
    try {
      const response = await ApiService.getTenants(state.activeCluster).catch(e => console.log(e))

      // console.log(response)
      commit('updateTenants', response.data)
    } catch (error) {
      console.log(error, error.response)
    }
  },
  changeActiveCluster ({ commit }, cluster) {
    commit('changeActiveCluster', cluster)
  },
  // Look through each topic in topicsConfig and get their stats
  async getTopicStats (context) {
    // Don't bother if we know the topic list is stale
    if (state.topicListStale) {
      return
    }
    context.state.topicsConfig.list.forEach(topicKey => {
      context.dispatch('updateTopic', context.state.topicsConfig.data[topicKey])
    })
  },
  async getTopicStatsByTenant (context) {
    // Don't bother if we know the topic list is stale
    if (state.topicListStale) {
      return
    }
    // context.state.topicsConfig.list.forEach(topicKey => {
    //   context.dispatch('updateTopic', context.state.topicsConfig.data[topicKey])
    // })

    // console.log(context.state.topicsConfig.list)

    const promise = ApiService.getTenantStats(context.state.activeCluster, context.state.tenant)
    promise
      .then(resp => {
        if (resp.data != null) {
          console.log(resp.data)
          var idObj, topicId
          Object.keys(resp.data.data).forEach(key => {
            // console.log(key)
            idObj = context.getters['getTopicKey'](key)
            // console.log(idObj)
            topicId = idObj.topicId
            // console.log(topicId)
            // console.log(context.state.topicsConfig.data[topicId])
            // console.log(resp.data.data[key])
            context.dispatch('parseCommitTopicStats', {
              topicData: context.state.topicsConfig.data[topicId],
              resp: { data: resp.data.data[key] }
            })
          })
        }
      }
      )
      .catch(error => {
        console.log(error)
      }
      )
    // Tenant stats don't include partitioned topics
    context.state.topicsConfig.list.forEach(topicKey => {
      // Only calling for partitioned topics
      if (context.state.topicsConfig.data[topicKey].partitioned) {
        context.dispatch('updateTopic', context.state.topicsConfig.data[topicKey])
      }
    })
  },
  async getFunctionStats (context) {
    // Don't bother if we know the topic list is stale
    if (state.functionListStale) {
      return
    }
    context.state.functionsData.list.forEach(async funcKey => {
      context.dispatch('updateFunction', context.state.functionsData.data[funcKey])
    })
  },
  async getSinkStats (context) {
    // Don't bother if we know the sink list is stale
    if (state.sinkListStale) {
      return
    }
    context.state.sinksData.list.forEach(async sinkKey => {
      context.dispatch('updateSink', context.state.sinksData.data[sinkKey])
    })
  },
  async getSourceStats (context) {
    // Don't bother if we know the source list is stale
    if (state.sourceListStale) {
      return
    }
    context.state.sourcesData.list.forEach(async sourceKey => {
      context.dispatch('updateSource', context.state.sourcesData.data[sourceKey])
    })
  },
  isAdminUser ({ state }) {
    if (state.userRole === 'administrator' || state.userRole === 'customer-admin') {
      return true
    } else {
      return false
    }
  },
  async purgeOldTopics ({ commit, state }) {
    // Check that the list topics matches the keys of config data
    // If the list is stale, skip this check since we are
    // recalculating the list

    if (state.topicListStale) {
      return
    }
    const currentTopicList = state.topicsConfig.list
    Object.keys(state.topicsConfig.data).forEach(key => {
      // Check if this key is on the namespaces list
      let onList = false
      currentTopicList.forEach(obj => {
        if (obj === key) {
          onList = true
        }
      })
      // If the topic is not on the list and is in the active cluster, purge it
      if (!onList && (state.topicsConfig.data[key].cluster === state.activeCluster)) {
        commit('purgeTopic', key)
      }
    })
  },
  purgeTopic ({ commit }, key) {
    commit('purgeTopic', key)
  },
  async purgeOldFunctions ({ commit, state }) {
    // Check that the list functions matches the keys of config data
    // If the list is stale, skip this check since we are
    // recalculating the list

    if (state.functionListStale) {
      return
    }
    const currentFunctionList = state.functionsData.list
    Object.keys(state.functionsData.data).forEach(key => {
      // Check if this key is on the list
      let onList = false
      currentFunctionList.forEach(obj => {
        if (obj === key) {
          onList = true
        }
      })
      // If the function is not on the list and is in the active cluster, purge it
      if (!onList && (state.functionsData.data[key].cluster === state.activeCluster)) {
        commit('purgeFunction', key)
      }
    })
  },
  async purgeOldSinks ({ commit, state }) {
    // Check that the list sinks matches the keys of config data
    // If the list is stale, skip this check since we are
    // recalculating the list

    if (state.sinkListStale) {
      return
    }
    const currentSinkList = state.sinksData.list
    Object.keys(state.sinksData.data).forEach(key => {
      // Check if this key is on the list
      let onList = false
      currentSinkList.forEach(obj => {
        if (obj === key) {
          onList = true
        }
      })
      // If the sink is not on the list and is in the active cluster, purge it
      if (!onList && (state.sinksData.data[key].cluster === state.activeCluster)) {
        commit('purgeSink', key)
      }
    })
  },
  async purgeOldSources ({ commit, state }) {
    // Check that the list sources matches the keys of config data
    // If the list is stale, skip this check since we are
    // recalculating the list

    if (state.sourceListStale) {
      return
    }
    const currentSourceList = state.sourcesData.list
    Object.keys(state.sourcesData.data).forEach(key => {
      // Check if this key is on the list
      let onList = false
      currentSourceList.forEach(obj => {
        if (obj === key) {
          onList = true
        }
      })
      // If the source is not on the list and is in the active cluster, purge it
      if (!onList && (state.sourcesData.data[key].cluster === state.activeCluster)) {
        commit('purgeSource', key)
      }
    })
  },
  purgeFunction ({ commit }, key) {
    console.log(`Purging function: ${key}`)
    commit('purgeFunction', key)
  },
  purgeSink ({ commit }, key) {
    console.log(`Purging sink: ${key}`)
    commit('purgeSink', key)
  },
  purgeSource ({ commit }, key) {
    console.log(`Purging source: ${key}`)
    commit('purgeSource', key)
  },
  parseCommitTopicStats (context, data) {
    const resp = data.resp
    const topicData = data.topicData
    const numProducers = resp.data.publishers.length
    const numReplClusters = Object.keys(resp.data.replication).length
    const numSubscriptions = Object.keys(resp.data.subscriptions).length

    // Sum up the consumers from the subcriptions
    let numConsumers = 0
    let outRate = 0
    let outTput = 0
    Object.keys(resp.data.subscriptions).forEach(subscription => {
      numConsumers = numConsumers +
        resp.data.subscriptions[subscription].consumers.length
        // Get the rates from the consumers
      resp.data.subscriptions[subscription].consumers.forEach(consumer => {
        outRate += consumer.msgRateOut
        outTput += consumer.msgThroughputOut
      })
    })

    // Get the aggregate producer rates
    let inRate = 0
    let inTput = 0
    Object.keys(resp.data.publishers).forEach(publisher => {
      inRate += resp.data.publishers[publisher].msgRateIn
      inTput += resp.data.publishers[publisher].msgThroughputIn
    })

    let partitions = 0
    if (topicData.partitioned) {
      partitions = resp.data.metadata.partitions
    }

    context.commit('updateTopicStats', {
      'index': topicData.id,
      'stats': resp.data,
      'info': {
        'name': topicData.name,
        'namespace': topicData.namespace,
        'cluster': topicData.cluster,
        'producers': numProducers,
        'subscriptions': numSubscriptions,
        'consumers': numConsumers,
        'replClusters': numReplClusters,
        'storage': resp.data.storageSize,
        'inRate': inRate,
        'inTput': inTput,
        'outRate': outRate,
        'outTput': outTput,
        'path': topicData.path,
        'url': topicData.url,
        'partitioned': topicData.partitioned,
        'partitions': partitions,
        'type': topicData.type
      },
    })
  },
  async updateTopic (context, topicData) {
    // If active cluster has changed but the topic list hasn't been updated
    // the the cluster of the topic won't match. In that case, skip the update
    if (!topicData || context.state.activeCluster !== topicData.cluster) {
      return
    }
    if (topicData.partitioned) {
      const promise = ApiService.getPartitionedTopicStats(context.state.activeCluster, topicData.path)
      promise
        .then(resp => {
          if (topicData.id != null && resp.data != null) {
            context.dispatch('parseCommitTopicStats', {
              topicData: topicData,
              resp: resp
            })
          }
        })
        .catch(e => console.log(e)
        )
    } else {
      const promise = ApiService.getTopicStats(context.state.activeCluster, topicData.type, topicData.path)
      promise
        .then(resp => {
          if (topicData.id != null && resp.data != null) {
            context.dispatch('parseCommitTopicStats', {
              topicData: topicData,
              resp: resp
            })
          }
        }
        )
        .catch(error => {
          console.log(error)
        }
        )
    }
  },
  async updateFunction (context, funcData) {
    // If active cluster has changed but the function list hasn't been updated
    // the the cluster of the function won't match. In that case, skip the update
    if (!funcData || context.state.activeCluster !== funcData.cluster) {
      return
    }
    const promise = ApiService.getFunctionStats(context.state.activeCluster, funcData.path)
    promise
      .then(resp => {
        if (funcData.index != null && resp.data != null) {
          context.commit('updateFunctionStats', {
            'index': funcData.index,
            'stats': resp.data,
          })
        }
      }
      )
      .catch(error => {
        console.log(error)
      }
      )
    const statusPromise = ApiService.getFunctionStatus(context.state.activeCluster, funcData.path)
    statusPromise
      .then(resp => {
        if (funcData.index != null && resp.data != null) {
          context.commit('updateFunctionStatus', {
            'index': funcData.index,
            'status': resp.data,
          })
        }
      }
      )
      .catch(error => {
        console.log(error)
      }
      )
  },
  async updateSink (context, funcData) {
    // If active cluster has changed but the sink list hasn't been updated
    // the the cluster of the sink won't match. In that case, skip the update
    if (!funcData || context.state.activeCluster !== funcData.cluster) {
      return
    }
    // const promise = ApiService.getSinkStats(context.state.activeCluster, funcData.path)
    // promise
    //   .then(resp => {
    //     if (funcData.index != null && resp.data != null) {
    //       context.commit('updateSinkStats', {
    //         'index': funcData.index,
    //         'stats': resp.data,
    //       })
    //     }
    //   }
    //   )
    //   .catch(error => {
    //     console.log(error)
    //   }
    //   )
    const statusPromise = ApiService.getSinkStatus(context.state.activeCluster, funcData.path)
    statusPromise
      .then(resp => {
        if (funcData.index != null && resp.data != null) {
          context.commit('updateSinkStatus', {
            'index': funcData.index,
            'status': resp.data,
          })
        }
      }
      )
      .catch(error => {
        console.log(error)
      }
      )
  },
  async updateSource (context, funcData) {
    // If active cluster has changed but the source list hasn't been updated
    // the the cluster of the source won't match. In that case, skip the update
    if (!funcData || context.state.activeCluster !== funcData.cluster) {
      return
    }
    // const promise = ApiService.getSourceStats(context.state.activeCluster, funcData.path)
    // promise
    //   .then(resp => {
    //     if (funcData.index != null && resp.data != null) {
    //       context.commit('updateSourceStats', {
    //         'index': funcData.index,
    //         'stats': resp.data,
    //       })
    //     }
    //   }
    //   )
    //   .catch(error => {
    //     console.log(error)
    //   }
    //   )
    const statusPromise = ApiService.getSourceStatus(context.state.activeCluster, funcData.path)
    statusPromise
      .then(resp => {
        if (funcData.index != null && resp.data != null) {
          context.commit('updateSourceStatus', {
            'index': funcData.index,
            'status': resp.data,
          })
        }
      }
      )
      .catch(error => {
        console.log(error)
      }
      )
  },
  async getTopics ({ getters, commit, state, dispatch }) {
    // Get the list of topics before
    const beforeTopicList = state.topicsConfig.list

    const promises = []
    // Need to capture the active cluster in case it changes
    // while waiting for the responses
    const activeCluster = state.activeCluster
    if (state.nsListStale) {
      return
    }
    // state.namespacesConfig.list.forEach(ns => {
    for (let ns of state.namespacesConfig.list) {
      if (state.nsListStale) {
        break
      }
      // save the promise returned by the axios requests
      promises.push(
        // ApiService.getTopicsByNamespace(activeCluster, ns.path).catch(e => console.log(e))
        ApiService.getTopicsPersistent(activeCluster, ns.path).catch(e => console.log(e))

      )
      promises.push(
        ApiService.getTopicsNonPersistent(activeCluster, ns.path).catch(e => console.log(e))

      )
      promises.push(
        ApiService.getPartitionedTopics(activeCluster, ns.path).catch(e => console.log(e))
      )
    }

    const topicListByKey = []
    const topicData = await Promise.all(promises)
    // If the NS list has gone stale since the async tasks,
    // don't continue
    if (state.nsListStale) {
      return
    }
    let nsTopicCount = {}
    let errFound = false
    topicData.map(resp => {
      // If there is no response because there was an error, then skip it
      if (!resp) {
        errFound = true
        return
      }
      // Update the number of topics in the namespace
      let partitionedTopic = false
      // let nonPersistentTopic = false
      let nsIdx = ''
      if (resp.config.url.match(/partitioned/)) {
        partitionedTopic = true
        const urlParts = resp.config.url.match(/persistent\/(.+?)\/(.+?)\/partitioned/)
        nsIdx = activeCluster + ':' + urlParts[1] + ':' + urlParts[2]
      } else if (resp.config.url.match(/non-persistent/)) {
        // nonPersistentTopic = true
        const urlParts = resp.config.url.match(/non-persistent\/(.+?)\/(.+?)$/)
        nsIdx = activeCluster + ':' + urlParts[1] + ':' + urlParts[2]
      } else {
        const urlParts = resp.config.url.match(/persistent\/(.+?)\/(.+?)$/)
        // const urlParts = resp.config.url.match(/namespaces\/(.+?)\/(.+?)\/topics/)
        nsIdx = activeCluster + ':' + urlParts[1] + ':' + urlParts[2]
      }
      if (nsTopicCount[nsIdx]) {
        nsTopicCount[nsIdx] = nsTopicCount[nsIdx] + resp.data.length
      } else {
        nsTopicCount[nsIdx] = resp.data.length
      }

      // Update the topic info
      resp.data.forEach(topic => {
        const idObj = getters['getTopicKey'](topic)

        // console.log(idObj)
        var topicId = idObj.topicId
        const nsIdx = idObj.nsId
        const cluster = idObj.cluster
        // If this is a partitioned topic, need to make sure its index is unique
        if (partitionedTopic) {
          topicId = topicId + ':parent'
        }
        // Handle the case where the namespace is not configured for limits
        let retentionTime = 0
        let retentionSize = 0
        let maxProducers = 0
        let maxConsumersTopic = 0
        let maxConsumersSub = 0
        let quota = 0
        let quotaPolicy = ''
        let inRateMsg = 0
        let inRateByte = 0
        let outRateMsg = 0
        let outRateByte = 0
        let outRatePeriod = 1
        let ttl = 0
        let bookkeeperAckQuorum = 0
        let bookkeeperEnsemble = 0
        let bookkeeperWriteQuorum = 0
        let schemaAutoUpdate = 'true'
        let enforceSchema = 'false'
        let compatMode = 'FULL'
        let compactionThreshold = 0
        // console.log('Getting config from NS' + topicId + nsIdx)

        if (state.namespacesConfig.data[nsIdx]) {
          // console.log(state.namespacesConfig.data[nsIdx])
          retentionTime = state.namespacesConfig.data[nsIdx].retention_policies ? state.namespacesConfig.data[nsIdx].retention_policies.retentionTimeInMinutes : 0
          retentionSize = state.namespacesConfig.data[nsIdx].retention_policies ? state.namespacesConfig.data[nsIdx].retention_policies.retentionSizeInMB : 0
          maxProducers = state.namespacesConfig.data[nsIdx].max_producers_per_topic
          maxConsumersTopic = state.namespacesConfig.data[nsIdx].max_consumers_per_topic
          maxConsumersSub = state.namespacesConfig.data[nsIdx].max_consumers_per_subscription
          compactionThreshold = state.namespacesConfig.data[nsIdx].compaction_threshold
          ttl = state.namespacesConfig.data[nsIdx].message_ttl_in_seconds
          if (state.namespacesConfig.data[nsIdx].is_allow_auto_update_schema) {
            schemaAutoUpdate = state.namespacesConfig.data[nsIdx].is_allow_auto_update_schema.toString()
          }
          if (state.namespacesConfig.data[nsIdx].schema_validation_enforced) {
            enforceSchema = state.namespacesConfig.data[nsIdx].schema_validation_enforced.toString()
          }
          const oldStrat = state.namespacesConfig.data[nsIdx].schema_auto_update_compatibility_strategy
          const newStrat = state.namespacesConfig.data[nsIdx].schema_compatibility_strategy

          if (!newStrat || newStrat === 'UNDEFINED') {
            compatMode = oldStrat.toUpperCase()
          } else {
            compatMode = newStrat
          }
          if (state.namespacesConfig.data[nsIdx].backlog_quota_map.destination_storage) {
            // Name of property changed in 2.8. Making sure the admin console can work before and after 2.8
            if (state.namespacesConfig.data[nsIdx].backlog_quota_map.destination_storage.limit) {
              quota = state.namespacesConfig.data[nsIdx].backlog_quota_map.destination_storage.limit
            } else {
              quota = state.namespacesConfig.data[nsIdx].backlog_quota_map.destination_storage.limitSize
            }
            quotaPolicy = state.namespacesConfig.data[nsIdx].backlog_quota_map.destination_storage.policy
          } 

          if (state.namespacesConfig.data[nsIdx].publishMaxMessageRate[cluster]) {
            inRateMsg = state.namespacesConfig.data[nsIdx].publishMaxMessageRate[cluster].publishThrottlingRateInMsg
            inRateByte = state.namespacesConfig.data[nsIdx].publishMaxMessageRate[cluster].publishThrottlingRateInByte
          }

          // Use topic dispatch rate if set
          if (state.namespacesConfig.data[nsIdx].topicDispatchRate[cluster]) {
            outRateMsg = state.namespacesConfig.data[nsIdx].topicDispatchRate[cluster].dispatchThrottlingRateInMsg
            outRateByte = state.namespacesConfig.data[nsIdx].topicDispatchRate[cluster].dispatchThrottlingRateInByte
            outRatePeriod = state.namespacesConfig.data[nsIdx].topicDispatchRate[cluster].ratePeriodInSecond
          }

          if (outRateMsg === 0 && state.namespacesConfig.data[nsIdx].subscriptionDispatchRate[cluster]) {
            outRateMsg = state.namespacesConfig.data[nsIdx].subscriptionDispatchRate[cluster].dispatchThrottlingRateInMsg
            outRateByte = state.namespacesConfig.data[nsIdx].subscriptionDispatchRate[cluster].dispatchThrottlingRateInByte
            outRatePeriod = state.namespacesConfig.data[nsIdx].subscriptionDispatchRate[cluster].ratePeriodInSecond
          }
        }
        if (state.namespacesConfig.persist[nsIdx]) {
          bookkeeperEnsemble = state.namespacesConfig.persist[nsIdx].bookkeeperEnsemble ? state.namespacesConfig.persist[nsIdx].bookkeeperEnsemble : 0
          bookkeeperWriteQuorum = state.namespacesConfig.persist[nsIdx].bookkeeperWriteQuorum ? state.namespacesConfig.persist[nsIdx].bookkeeperWriteQuorum : 0
          bookkeeperAckQuorum = state.namespacesConfig.persist[nsIdx].bookkeeperAckQuorum ? state.namespacesConfig.persist[nsIdx].bookkeeperAckQuorum : 0
        }
        let typeOfTopic = idObj.typeOfTopic
        if (partitionedTopic) {
          typeOfTopic = 'partitioned'
        }
        const thisTopicData = {
          'type': typeOfTopic,
          'tenant': idObj.tenant,
          'namespace': idObj.namespace,
          'name': idObj.name,
          'path': idObj.topicPath,
          'url': topic,
          'id': topicId,
          'cluster': activeCluster,
          maxProducers,
          maxConsumersTopic,
          maxConsumersSub,
          ttl,
          retentionTime,
          retentionSize,
          'partitioned': partitionedTopic,
          bookkeeperAckQuorum,
          bookkeeperEnsemble,
          bookkeeperWriteQuorum,
          schemaAutoUpdate,
          enforceSchema,
          compatMode,
          compactionThreshold,
          quota,
          inRateMsg,
          inRateByte,
          outRateMsg,
          outRateByte,
          outRatePeriod,
          quotaPolicy
        }
        // console.log(thisTopicData)
        commit('updateTopicConfig', thisTopicData)
        topicListByKey.push(topicId)
      })
    })

    // If something went wrong, don't update the data. It's better to have stale data than no data
    if (errFound) {
      return
    }

    // Updating the topic counts
    Object.keys(nsTopicCount).forEach(key => {
      commit('updateNumTopicsNamespace', {
        index: key,
        number: nsTopicCount[key]
      })
    })

    // We will only commit if the list has changed
    if (utils.array_diff(beforeTopicList, topicListByKey).length > 0) {
      console.log('Topic difference', utils.array_diff(beforeTopicList, topicListByKey).length)
      commit('updateTopicsList', topicListByKey)
      commit('updateNumTopics', topicListByKey.length)
      // Since we know the topics have changed, trigger a stats update
      if (state.featureFlags.tenantStats) {
        dispatch('getTopicStatsByTenant')
      } else {
        dispatch('getTopicStats')
      }
    }
  },
  async getFunctions ({ commit, state, dispatch }) {
    // Get the list of functions before
    const beforeFunctionList = state.functionsData.list

    const promises = []
    // Need to capture the active cluster in case it changes
    // while waiting for the responses
    const activeCluster = state.activeCluster
    if (state.nsListStale) {
      return
    }
    for (let ns of state.namespacesConfig.list) {
      if (state.nsListStale) {
        break
      }
      // save the promise returned by the axios requests
      promises.push(
        ApiService.getFunctions(activeCluster, ns.path).catch(e => console.log(e))

      )
    }

    const functionListByKey = []
    const funcData = await Promise.all(promises)
    // If the NS list has gone stale since the async tasks,
    // don't continue
    if (state.nsListStale) {
      return
    }
    let nsFunctionCount = {}
    funcData.map(resp => {
      // If there is no response because there was an error, then skip it
      if (!resp) {
        return
      }
      // Update the number of functions in the namespace
      let nsIdx = ''
      const urlParts = resp.config.url.match(/functions\/(.+?)\/(.+?)$/)
      const tenant = urlParts[1]
      const namespace = urlParts[2]
      nsIdx = activeCluster + ':' + tenant + ':' + namespace
      if (nsFunctionCount[nsIdx]) {
        nsFunctionCount[nsIdx] = nsFunctionCount[nsIdx] + resp.data.length
      } else {
        nsFunctionCount[nsIdx] = resp.data.length
      }

      // Update the function info
      resp.data.forEach((func) => {
        const funcId = nsIdx + ':' + func
        const funcPath = tenant + '/' + namespace + '/' + func
        // Get config data for function
        const promise = ApiService.getFunctionInfo(activeCluster, funcPath)
        promise
          .then(resp => {
            if (resp.data != null) {
              commit('updateFunctionInfo', {
                'tenant': tenant,
                'namespace': namespace,
                'name': func,
                'path': funcPath,
                'url': funcPath,
                'index': funcId,
                'cluster': activeCluster,
                'info': resp.data,
              })
            }
          })
          .catch(e => console.log(e)
          )

        functionListByKey.push(funcId)
      })
    })

    // Updating the function counts
    Object.keys(nsFunctionCount).forEach((key) => {
      commit('updateNumFunctionsNamespace', {
        index: key,
        number: nsFunctionCount[key]
      })
    })

    // We will only commit if the list has changed
    if (utils.array_diff(beforeFunctionList, functionListByKey).length > 0) {
      console.log('Function difference', utils.array_diff(beforeFunctionList, functionListByKey).length)
      commit('updateFunctionsList', functionListByKey)
      commit('updateNumFunctions', functionListByKey.length)
      // Since we know the topics have changed, trigger a stats update
      dispatch('getFunctionStats')
    }
  },
  async getSinks ({ commit, state, dispatch }) {
    // Get the list of sinks before
    const beforeSinkList = state.sinksData.list

    const promises = []
    // Need to capture the active cluster in case it changes
    // while waiting for the responses
    const activeCluster = state.activeCluster
    if (state.nsListStale) {
      return
    }
    for (let ns of state.namespacesConfig.list) {
      if (state.nsListStale) {
        break
      }
      // save the promise returned by the axios requests
      promises.push(
        ApiService.getSinks(activeCluster, ns.path).catch(e => console.log(e))

      )
    }

    const sinkListByKey = []
    const funcData = await Promise.all(promises)
    // If the NS list has gone stale since the async tasks,
    // don't continue
    if (state.nsListStale) {
      return
    }
    let nsSinkCount = {}
    funcData.map(resp => {
      // If there is no response because there was an error, then skip it
      if (!resp) {
        return
      }
      // Update the number of sinks in the namespace
      let nsIdx = ''
      const urlParts = resp.config.url.match(/sinks\/(.+?)\/(.+?)$/)
      const tenant = urlParts[1]
      const namespace = urlParts[2]
      nsIdx = activeCluster + ':' + tenant + ':' + namespace
      if (nsSinkCount[nsIdx]) {
        nsSinkCount[nsIdx] = nsSinkCount[nsIdx] + resp.data.length
      } else {
        nsSinkCount[nsIdx] = resp.data.length
      }

      // Update the sink info
      resp.data.forEach((func) => {
        const funcId = nsIdx + ':' + func
        const funcPath = tenant + '/' + namespace + '/' + func
        // Get config data for sink
        const promise = ApiService.getSinkInfo(activeCluster, funcPath)
        promise
          .then(resp => {
            if (resp.data != null) {
              commit('updateSinkInfo', {
                'tenant': tenant,
                'namespace': namespace,
                'name': func,
                'path': funcPath,
                'url': funcPath,
                'index': funcId,
                'cluster': activeCluster,
                'info': resp.data,
              })
            }
          })
          .catch(e => console.log(e)
          )

        sinkListByKey.push(funcId)
      })
    })

    // Updating the sink counts
    Object.keys(nsSinkCount).forEach((key) => {
      commit('updateNumSinksNamespace', {
        index: key,
        number: nsSinkCount[key]
      })
    })

    // We will only commit if the list has changed
    if (utils.array_diff(beforeSinkList, sinkListByKey).length > 0) {
      console.log('Sink difference', utils.array_diff(beforeSinkList, sinkListByKey).length)
      commit('updateSinksList', sinkListByKey)
      commit('updateNumSinks', sinkListByKey.length)
      // Since we know the topics have changed, trigger a stats update
      dispatch('getSinkStats')
    }
  },
  async getBrokerLoadReport ({ commit, state }) {
    try {
      const response = await ApiService.getBrokerLoadReport(state.activeCluster)

      if (response) {
        // console.log(response.data.data)

        let brokerLoadData = {}
        response.data.data.forEach(brokerObj => {
          brokerLoadData[brokerObj.broker] = brokerObj
        })

        commit('updateBrokerLoadData', brokerLoadData)
      }
    } catch (error) {
      console.log(error)
    }
  },

  async getSources ({ commit, state, dispatch }) {
    // Get the list of sources before
    const beforeSourceList = state.sourcesData.list

    const promises = []
    // Need to capture the active cluster in case it changes
    // while waiting for the responses
    const activeCluster = state.activeCluster
    if (state.nsListStale) {
      return
    }
    for (let ns of state.namespacesConfig.list) {
      if (state.nsListStale) {
        break
      }
      // save the promise returned by the axios requests
      promises.push(
        ApiService.getSources(activeCluster, ns.path).catch(e => console.log(e))

      )
    }

    const sourceListByKey = []
    const funcData = await Promise.all(promises)
    // If the NS list has gone stale since the async tasks,
    // don't continue
    if (state.nsListStale) {
      return
    }
    let nsSourceCount = {}
    funcData.map(resp => {
      // If there is no response because there was an error, then skip it
      if (!resp) {
        return
      }
      // Update the number of sources in the namespace
      let nsIdx = ''
      const urlParts = resp.config.url.match(/sources\/(.+?)\/(.+?)$/)
      const tenant = urlParts[1]
      const namespace = urlParts[2]
      nsIdx = activeCluster + ':' + tenant + ':' + namespace
      if (nsSourceCount[nsIdx]) {
        nsSourceCount[nsIdx] = nsSourceCount[nsIdx] + resp.data.length
      } else {
        nsSourceCount[nsIdx] = resp.data.length
      }

      // Update the source info
      resp.data.forEach((func) => {
        const funcId = nsIdx + ':' + func
        const funcPath = tenant + '/' + namespace + '/' + func
        // Get config data for source
        const promise = ApiService.getSourceInfo(activeCluster, funcPath)
        promise
          .then(resp => {
            if (resp.data != null) {
              commit('updateSourceInfo', {
                'tenant': tenant,
                'namespace': namespace,
                'name': func,
                'path': funcPath,
                'url': funcPath,
                'index': funcId,
                'cluster': activeCluster,
                'info': resp.data,
              })
            }
          })
          .catch(e => console.log(e)
          )

        sourceListByKey.push(funcId)
      })
    })

    // Updating the source counts
    Object.keys(nsSourceCount).forEach((key) => {
      commit('updateNumSourcesNamespace', {
        index: key,
        number: nsSourceCount[key]
      })
    })

    // We will only commit if the list has changed
    if (utils.array_diff(beforeSourceList, sourceListByKey).length > 0) {
      console.log('Source difference', utils.array_diff(beforeSourceList, sourceListByKey).length)
      commit('updateSourcesList', sourceListByKey)
      commit('updateNumSources', sourceListByKey.length)
      // Since we know the topics have changed, trigger a stats update
      dispatch('getSourceStats')
    }
  },
  async rollupStats (context) {
    // Go through the topic stats and calculate stats for
    // namespaces and clusters

    // TODO: Deal with the case that the namespace/cluster has been deleted
    // in the backend since the object data will remain in vuex.
    // Something similar has already been implemented for
    // topics which will happen more commonly. Namespaces/clusters should
    // change infrequently and if they do, it is most likely the list will
    // grow, not shrink

    const nsStats = {}
    const clusterStats = {}

    Object.keys(context.state.topicStats.data).forEach(topicIdx => {
      let statsObj = context.state.topicStats.data[topicIdx].info
      const nsIdx = statsObj.cluster + ':' + context.state.tenant + ':' + statsObj.namespace
      const clusterIdx = statsObj.cluster

      const defaultStatsList = {
        'producers': 0,
        'subscriptions': 0,
        'consumers': 0,
        'inRate': 0,
        'inTput': 0,
        'outRate': 0,
        'outTput': 0,
        'storage': 0,
        'numTopics': 0,
      }

      // Create empty object if it doesn't exist
      // Need to clone the object or else they become linked!
      if (!nsStats[nsIdx]) {
        nsStats[nsIdx] = Object.assign({}, defaultStatsList)
      }
      if (!clusterStats[clusterIdx]) {
        clusterStats[clusterIdx] = Object.assign({}, defaultStatsList)
      }

      Object.keys(defaultStatsList).forEach(statName => {
        // numTopics is a special case since it doesn't exist in the topic stats
        if (statName === 'numTopics') {
          nsStats[nsIdx].numTopics++
          clusterStats[clusterIdx].numTopics++
        } else {
          // If this is a partitioned topic, skip it in the update, since
          // its data will be picked up in the individual partitions
          if (statsObj.partitioned === false) {
            nsStats[nsIdx][statName] = nsStats[nsIdx][statName] + statsObj[statName]
            clusterStats[clusterIdx][statName] = clusterStats[clusterIdx][statName] + statsObj[statName]
          }
        }
      })
    })

    // console.log(nsStats);

    // Update the namespace stats
    Object.keys(nsStats).forEach(nsIdx => {
      nsStats[nsIdx].index = nsIdx
      context.commit('updateNamespaceStats', nsStats[nsIdx])
    })

    // Update the cluster stats
    Object.keys(clusterStats).forEach(clusterIdx => {
      clusterStats[clusterIdx].index = clusterIdx
      context.commit('updateClusterStats', clusterStats[clusterIdx])
    })
  },
  async getPlanInfo (context) {
    if (state.runningEnv !== "web") {
      return
    }
    try {
      const resp = await AjaxService.ajaxAction('get_available_plans', {})
      context.commit('updatePlanInfo', resp.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async getCurrentUserSubscriptions (context) {
    try {
      const resp = await AjaxService.ajaxAction('get_current_user_subscriptions', {})
      // console.log(resp.data.data)
      context.commit('updateSubscriptionInfo', resp.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async getTokenList (context) {
    try {
      const resp = await AjaxService.ajaxAction('get_token_list', {})
      // console.log(resp.data.data)
      context.commit('updateTokenList', resp.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async getCurrentUserOrgInfo (context) {
    try {
      const resp = await AjaxService.ajaxAction('get_current_user_org_info', {})
      // console.log(resp.data.data)
      context.commit('updateOrgInfo', resp.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async getCurrentUserEntitlements (context) {
    try {
      const resp = await AjaxService.ajaxAction('get_current_user_entitlements', {})
      // console.log(resp.data.data)
      context.commit('updateEntitlementInfo', resp.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async sendEmail (context, emailData) {
    try {
      await AjaxService.ajaxAction('send_email', {
        subject: emailData.subject,
        body: emailData.body,
      })
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async sendInvite (context, emailData) {
    try {
      await AjaxService.ajaxAction('send_invite', {
        subject: emailData.subject,
        body: emailData.body,
        address: emailData.address,
        name: emailData.name,
      })
      // console.log(resp.data.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async cancelPlanToCreate (context) {
    console.log('Cancelling plan to create')
    try {
      await AjaxService.ajaxAction('cancel_plan_to_create', {
      })
      // console.log(resp.data.data)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
  async getClusterInfo (context) {

    if (state.runningEnv !== "web") {
      let clusterDataObj = {
        data: [],
        info: {},
        latlong: {}
      }

      // Default the cluster name
      clusterDataObj.info[state.activeCluster] = {
        'name': state.activeCluster,
        'host_override_pulsar': state.hostOverrides.pulsar,
        'host_override_ws': state.hostOverrides.ws,
        'host_override_http': state.hostOverrides.http,
      }
      context.commit('updateClusterInfo', clusterDataObj)

      return

    }

    // Ajax call to get cluster info

    try {
      const resp = await AjaxService.ajaxAction('get_cluster_info', {})

      let clusterDataObj = {
        data: [],
        info: {},
        latlong: {}
      }
      Object.keys(resp.data.data).forEach(key => {
        clusterDataObj.data.push({
          'code': key,
          'name': resp.data.data[key].name,
          'value': resp.data.data[key].value,
          'color': resp.data.data[key].color,
        })
        clusterDataObj.info[key] = {
          'code': key,
          'name': resp.data.data[key].name,
          'value': resp.data.data[key].value,
          'color': resp.data.data[key].color,
          'host_override_pulsar': resp.data.data[key].host_override_pulsar,
          'host_override_ws': resp.data.data[key].host_override_ws,
          'host_override_http': resp.data.data[key].host_override_http,
        }
        clusterDataObj.latlong[key] = {
          'latitude': resp.data.data[key].latitude,
          'longitude': resp.data.data[key].longitude
        }
      })
      context.commit('updateClusterInfo', clusterDataObj)
    } catch (error) {
      console.log('Ajax error', error)
    }
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
