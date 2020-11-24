const toggleWithoutAnimation = state => state.app.sidebar.withoutAnimation
const config = state => state.app.config
const palette = state => state.app.config.palette
const isLoading = state => state.app.isLoading
const activeTopicDetailTab = state => state.app.activeTopicDetailTab
const activeFunctionDetailTab = state => state.app.activeFunctionDetailTab
const activeSinkDetailTab = state => state.app.activeSinkDetailTab
const activeSourceDetailTab = state => state.app.activeSourceDetailTab
const activeClusterDetailTab = state => state.app.activeClusterDetailTab

export {
  toggleWithoutAnimation,
  config,
  palette,
  isLoading,
  activeTopicDetailTab,
  activeFunctionDetailTab,
  activeSinkDetailTab,
  activeSourceDetailTab,
  activeClusterDetailTab
}
