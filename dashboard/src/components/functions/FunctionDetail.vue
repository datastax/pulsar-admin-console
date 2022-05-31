<!--
  Copyright 2021 DataStax, Inc. 
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
 -->

<template>
  <div class="functionDetail" v-if="functionsData.data[$route.params.id] && functionsData.data[$route.params.id].cluster === activeCluster">
    <vuestic-widget :headerText="pageTitle()">
      <function-tabs class="tabs"
                    :names="tabNames">
        <div :slot="'functionDetail.tabs.overview' | translate"
             class="flex justify--center">
          <function-overview-tab></function-overview-tab>
        </div>
        <div :slot="'functionDetail.tabs.topics' | translate" class="flex justify--center">
          <function-topics-tab></function-topics-tab>
        </div>
        <div :slot="'functionDetail.tabs.instances' | translate" class="flex justify--center">
          <function-instances-tab></function-instances-tab>
        </div>
        <div :slot="'functionDetail.tabs.logs' | translate" class="flex justify--center">
          <function-logs-tab></function-logs-tab>
        </div>
      </function-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>
<script>
import FunctionTabs from './FunctionTabs.vue'
import FunctionOverviewTab from './FunctionOverviewTab.vue'
import FunctionTopicsTab from './FunctionTopicsTab.vue'
import FunctionInstancesTab from './FunctionInstancesTab.vue'
import FunctionLogsTab from './FunctionLogsTab.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'functionDetail',
  components: {
    FunctionOverviewTab,
    FunctionTabs,
    FunctionTopicsTab,
    FunctionInstancesTab,
    FunctionLogsTab
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveFunctionDetailTab', this.$t('functionDetail.tabs.overview'))
    // Turn off regular stats polling and enable function stats polling
    console.log('Stopping regular polling Function Detail')
    console.log('Starting function polling Function Detail')
    this.$store.commit('setRunTimer', false)
    this.$store.commit('setRunFunctionTimer', true)
    if (this.featureFlags.function) {
      this.$store.dispatch('updateAllFunctions')
    }
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable function stats polling
    console.log('Starting regular polling Function Detail')
    console.log('Stopping regular polling Function Detail')
    this.$store.commit('setRunTimer', true)
    this.$store.commit('setRunFunctionTimer', false)
    // this.cancelAutoUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'functionsData',
      'activeCluster',
      'userRole',
      'activeFunctionDetailTab',
      'featureFlags'
    ]),
    tabNames () {
      let tabNames = [this.$t('functionDetail.tabs.overview')]
      if (this.functionsData.data[this.$route.params.id]) {
        if (this.functionsData.data[this.$route.params.id].inputSpecs) {
          tabNames.push(this.$t('functionDetail.tabs.topics'))
        }
        if (this.functionsData.status[this.$route.params.id]) {
          tabNames.push(this.$t('functionDetail.tabs.instances'))
        }
        // tabNames.push(this.$t('functionDetail.tabs.logs'))
      }
      return tabNames
    },
  },
  methods: {
    pageTitle () {
      return this.functionsData.data[this.$route.params.id].name
    },
    cancelAutoUpdate () {
      console.log('Stopping auto function update')
      this.$store.commit('setRunFunctionTimer', false)
    },
    startAutoUpdate () {
      console.log('Starting auto function update')
      this.$store.commit('setRunFunctionTimer', true)
    },
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  .overview-tab {
    .explore-row {
      display: none !important;
    }
  }
  .maps-tab {
    height: 500px;
  }
}
.btn-right {
  float: right ;
}
.profile-card-widget, .chat-widget {
  width: 100%;
  .widget-body {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      width: 100%;
    }
  }
}
.bottom-widgets {
  > div[class^='col'] {
    & > div {
      width: 100%;
    }
  }
}
</style>