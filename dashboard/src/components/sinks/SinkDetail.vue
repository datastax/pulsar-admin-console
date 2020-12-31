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
  <div class="sinkDetail" v-if="sinksData.data[$route.params.id] && sinksData.data[$route.params.id].cluster === activeCluster">
    <vuestic-widget :headerText="pageTitle()">
      <sink-tabs class="tabs"
                    :names="tabNames">
        <div :slot="'sinkDetail.tabs.overview' | translate"
             class="flex justify--center">
          <sink-overview-tab></sink-overview-tab>
        </div>
        <div :slot="'sinkDetail.tabs.topics' | translate" class="flex justify--center">
          <sink-topics-tab></sink-topics-tab>
        </div>
        <div :slot="'sinkDetail.tabs.instances' | translate" class="flex justify--center">
          <sink-instances-tab></sink-instances-tab>
        </div>
        <div :slot="'sinkDetail.tabs.logs' | translate" class="flex justify--center">
          <sink-logs-tab></sink-logs-tab>
        </div>

      </sink-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>

<script>
import SinkTabs from './SinkTabs.vue'
import SinkOverviewTab from './SinkOverviewTab.vue'
import SinkTopicsTab from './SinkTopicsTab.vue'
import SinkInstancesTab from './SinkInstancesTab.vue'
import SinkLogsTab from './SinkLogsTab.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'sinkDetail',
  components: {
    SinkOverviewTab,
    SinkTabs,
    SinkTopicsTab,
    SinkInstancesTab,
    SinkLogsTab
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveSinkDetailTab', this.$t('sinkDetail.tabs.overview'))
    // Turn off regular stats polling and enable sink stats polling
    console.log('Stopping regular polling Sink Detail')
    console.log('Starting sink polling Sink Detail')
    this.$store.commit('setRunTimer', false)
    if (this.featureFlags.sink) {
      this.$store.commit('setRunSinkTimer', true)
      this.$store.dispatch('updateAllSinks')
    }
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable sink stats polling
    console.log('Starting regular polling Sink Detail')
    console.log('Stopping regular polling Sink Detail')

    this.$store.commit('setRunTimer', true)
    this.$store.commit('setRunSinkTimer', false)
    // this.cancelAutoUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'sinksData',
      'activeCluster',
      'userRole',
      'activeSinkDetailTab',
      'featureFlags',
      'clientsDisabled'
    ]),
    tabNames () {
      let tabNames = [this.$t('sinkDetail.tabs.overview')]

      if (this.sinksData.data[this.$route.params.id]) {
        if (this.sinksData.data[this.$route.params.id].inputSpecs) {
          tabNames.push(this.$t('sinkDetail.tabs.topics'))
        }
        if (this.sinksData.status[this.$route.params.id]) {
          tabNames.push(this.$t('sinkDetail.tabs.instances'))
        }
        tabNames.push(this.$t('sinkDetail.tabs.logs'))
      }
      return tabNames
    },
  },
  methods: {
    pageTitle () {
      return this.sinksData.data[this.$route.params.id].name
    },
    cancelAutoUpdate () {
      console.log('Stopping auto sink update')
      this.$store.commit('setRunSinkTimer', false)
    },
    startAutoUpdate () {
      console.log('Starting auto sink update')
      this.$store.commit('setRunSinkTimer', true)
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
