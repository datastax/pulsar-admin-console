const state = {
  sidebar: {
    opened: false,
    withoutAnimation: false,
  },
  config: {
    googleMaps: {
      apiKey: 'AIzaSyBNAqPrTQoz9P4NBlDDyfxrnKiafkaL8iQ',
    },
    windowMatchSizeLg: '(min-width: 992px)',
    palette: {
      primary: '#4ae387',
      danger: '#e34a4a',
      info: '#4ab2e3',
      success: '#db76df',
      warning: '#f7cc36',
      white: '#fff',
      black: '#000',
      fontColor: '#34495e',
      transparent: 'transparent',
      lighterGray: '#ddd',
    },
  },
  isLoading: true,
  activeTopicDetailTab: 'Overview',
  activeNamespaceDetailTab: 'Overview',
  activeBrokerDetailTab: 'Overview',
  activeFunctionDetailTab: 'Overview',
  activeSinkDetailTab: 'Overview',
  activeSourceDetailTab: 'Overview',
  activeClusterDetailTab: 'Overview'

}

const mutations = {
  setLoading (state, isLoading) {
    state.isLoading = isLoading
  },
  'TOGGLE_WITHOUT_ANIMATION' (state, value) {
    state.sidebar.withoutAnimation = value
  },
  activeTopicDetailTab (state, tabName) {
    state.activeTopicDetailTab = tabName
  },
  activeNamespaceDetailTab (state, tabName) {
    state.activeNamespaceDetailTab = tabName
  },
  activeBrokerDetailTab (state, tabName) {
    state.activeBrokerDetailTab = tabName
  },
  activeFunctionDetailTab (state, tabName) {
    state.activeFunctionDetailTab = tabName
  },
  activeSinkDetailTab (state, tabName) {
    state.activeSinkDetailTab = tabName
  },
  activeSourceDetailTab (state, tabName) {
    state.activeSourceDetailTab = tabName
  },
  activeClusterDetailTab (state, tabName) {
    state.activeClusterDetailTab = tabName
  },
}

const actions = {
  isToggleWithoutAnimation ({ commit }, value) {
    commit('TOGGLE_WITHOUT_ANIMATION', value)
  },
  setActiveTopicDetailTab ({ commit }, value) {
    commit('activeTopicDetailTab', value)
  },
  setActiveNamespaceDetailTab ({ commit }, value) {
    commit('activeNamespaceDetailTab', value)
  },
  setActiveBrokerDetailTab ({ commit }, value) {
    commit('activeBrokerDetailTab', value)
  },
  setActiveClusterDetailTab ({ commit }, value) {
    commit('activeClusterDetailTab', value)
  },
  setActiveFunctionDetailTab ({ commit }, value) {
    commit('activeFunctionDetailTab', value)
  },
  setActiveSinkDetailTab ({ commit }, value) {
    commit('activeSinkDetailTab', value)
  },
  setActiveSourceDetailTab ({ commit }, value) {
    commit('activeSourceDetailTab', value)
  }
}

export default {
  state,
  mutations,
  actions,
}
