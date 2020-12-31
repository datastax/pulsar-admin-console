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
  <div class="sourceDetail" v-if="sourcesData.data[$route.params.id] && sourcesData.data[$route.params.id].cluster === activeCluster">
    <vuestic-widget :headerText="pageTitle()">
      <source-tabs class="tabs"
                    :names="tabNames">
        <div :slot="'sourceDetail.tabs.overview' | translate"
             class="flex justify--center">
          <source-overview-tab></source-overview-tab>
        </div>
        <div :slot="'sourceDetail.tabs.topics' | translate" class="flex justify--center">
          <source-topics-tab></source-topics-tab>
        </div>
        <div :slot="'sourceDetail.tabs.instances' | translate" class="flex justify--center">
          <source-instances-tab></source-instances-tab>
        </div>
        <div :slot="'sourceDetail.tabs.logs' | translate" class="flex justify--center">
          <source-logs-tab></source-logs-tab>
        </div>

      </source-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>

<script>
import SourceTabs from './SourceTabs.vue'
import SourceOverviewTab from './SourceOverviewTab.vue'
import SourceTopicsTab from './SourceTopicsTab.vue'
import SourceInstancesTab from './SourceInstancesTab.vue'
import SourceLogsTab from './SourceLogsTab.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'sourceDetail',
  components: {
    SourceOverviewTab,
    SourceTabs,
    SourceTopicsTab,
    SourceInstancesTab,
    SourceLogsTab
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveSourceDetailTab', this.$t('sourceDetail.tabs.overview'))
    // Turn off regular stats polling and enable source stats polling
    console.log('Stopping regular polling Source Detail')
    console.log('Starting source polling Source Detail')
    this.$store.commit('setRunTimer', false)
    if (this.featureFlags.source) {
      this.$store.commit('setRunSourceTimer', true)
      this.$store.dispatch('updateAllSources')
    }
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable source stats polling
    console.log('Starting regular polling Source Detail')
    console.log('Stopping regular polling Source Detail')

    this.$store.commit('setRunTimer', true)
    this.$store.commit('setRunSourceTimer', false)
    // this.cancelAutoUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'sourcesData',
      'activeCluster',
      'userRole',
      'activeSourceDetailTab',
      'featureFlags'
    ]),
    tabNames () {
      let tabNames = [this.$t('sourceDetail.tabs.overview')]

      if (this.sourcesData.data[this.$route.params.id]) {
        // if (this.sourcesData.data[this.$route.params.id].topicName) {
        //   tabNames.push(this.$t('sourceDetail.tabs.topics'))
        // }
        if (this.sourcesData.status[this.$route.params.id]) {
          tabNames.push(this.$t('sourceDetail.tabs.instances'))
        }
        tabNames.push(this.$t('sourceDetail.tabs.logs'))
      }

      return tabNames
    },
  },
  methods: {
    pageTitle () {
      return this.sourcesData.data[this.$route.params.id].name
    },
    cancelAutoUpdate () {
      console.log('Stopping auto source update')
      this.$store.commit('setRunSourceTimer', false)
    },
    startAutoUpdate () {
      console.log('Starting auto source update')
      this.$store.commit('setRunSourceTimer', true)
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
