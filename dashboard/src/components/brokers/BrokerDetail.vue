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
  <div class="brokerDetail" v-if="brokerLoadData[$route.params.id]">
    <vuestic-widget :headerText="pageTitle()">
      <broker-tabs class="tabs"
                    :names="tabNames">

        <div :slot="'brokerDetail.tabs.overview' | translate"
             class="flex justify--center">
          <broker-overview-tab></broker-overview-tab>
        </div>
        <div :slot="'brokerDetail.tabs.bundles' | translate"
             class="flex justify--center">
          <broker-bundles-tab></broker-bundles-tab>
        </div>
      </broker-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>
<script>
import BrokerTabs from './BrokerTabs.vue'
import BrokerBundlesTab from './BrokerBundlesTab'
import BrokerOverviewTab from './BrokerOverviewTab'
import { mapGetters } from 'vuex'
export default {
  name: 'brokerDetail',
  components: {
    BrokerBundlesTab,
    BrokerOverviewTab,
    BrokerTabs
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveBrokerDetailTab', this.$t('brokerDetail.tabs.overview'))
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'brokerLoadData',
      'activeCluster',
      'userRole',
      'activeBrokerDetailTab',
      'featureFlags'
    ]),
    tabNames () {
      let tabNames = [this.$t('brokerDetail.tabs.overview')]
      tabNames.push(this.$t('brokerDetail.tabs.bundles'))
      return tabNames
    },
  },
  methods: {
    pageTitle () {
      // return this.brokerLoadData.data[this.$route.params.id].name
      return this.$route.params.id

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
