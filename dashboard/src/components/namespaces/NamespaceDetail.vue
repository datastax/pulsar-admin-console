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
  <div class="namespaceDetail" v-if="namespacesConfig.data[$route.params.id] && namespacesConfig.data[$route.params.id].cluster === activeCluster">
    <vuestic-widget :headerText="pageTitle()">
      <namespace-tabs class="tabs"
                    :names="tabNames">
        <div :slot="'namespaceDetail.tabs.overview' | translate"
             class="flex justify--center">
          <namespace-overview-tab></namespace-overview-tab>
        </div>
        <div :slot="'namespaceDetail.tabs.limits' | translate"
             class="flex justify--center">
          <namespace-limits-tab></namespace-limits-tab>
        </div>
        <div v-if="isAdminUser"  :slot="'namespaceDetail.tabs.authorization' | translate"
             class="flex justify--center">
          <namespace-authorization-tab></namespace-authorization-tab>
        </div>
        <div v-if="isAdminUser"  :slot="'namespaceDetail.tabs.offload' | translate"
             class="flex justify--center">
          <namespace-offload-tab></namespace-offload-tab>
        </div>
        <div v-if="isAdminUser" :slot="'namespaceDetail.tabs.bundles' | translate"
             class="flex justify--center">
          <namespace-bundles-tab></namespace-bundles-tab>
        </div>
      </namespace-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>
<script>
import NamespaceTabs from './NamespaceTabs.vue'
import NamespaceOverviewTab from './NamespaceOverviewTab.vue'
import NamespaceLimitsTab from './NamespaceLimitsTab.vue'
import NamespaceBundlesTab from './NamespaceBundlesTab'
import NamespaceOffloadTab from './NamespaceOffloadTab'
import NamespaceAuthorizationTab from './NamespaceAuthorizationTab'
import { mapGetters } from 'vuex'
export default {
  name: 'namespaceDetail',
  components: {
    NamespaceOverviewTab,
    NamespaceTabs,
    NamespaceBundlesTab,
    NamespaceLimitsTab,
    NamespaceOffloadTab,
    NamespaceAuthorizationTab
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveNamespaceDetailTab', this.$t('namespaceDetail.tabs.overview'))
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'activeCluster',
      'userRole',
      'activeNamespaceDetailTab',
      'featureFlags',
      'isAdminUser'

    ]),
    tabNames () {
      let tabNames = [this.$t('namespaceDetail.tabs.overview')]
      tabNames.push(this.$t('namespaceDetail.tabs.limits'))
      if (this.isAdminUser) {
        tabNames.push(this.$t('namespaceDetail.tabs.authorization'))
        tabNames.push(this.$t('namespaceDetail.tabs.offload'))
        tabNames.push(this.$t('namespaceDetail.tabs.bundles'))
      }
      return tabNames
    },
  },
  methods: {
    pageTitle () {
      return this.namespacesConfig.data[this.$route.params.id].name
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