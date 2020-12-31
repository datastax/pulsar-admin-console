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

const toggleWithoutAnimation = state => state.app.sidebar.withoutAnimation
const config = state => state.app.config
const palette = state => state.app.config.palette
const isLoading = state => state.app.isLoading
const activeTopicDetailTab = state => state.app.activeTopicDetailTab
const activeNamespaceDetailTab = state => state.app.activeNamespaceDetailTab
const activeBrokerDetailTab = state => state.app.activeBrokerDetailTab
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
  activeNamespaceDetailTab,
  activeBrokerDetailTab,
  activeFunctionDetailTab,
  activeSinkDetailTab,
  activeSourceDetailTab,
  activeClusterDetailTab
}
