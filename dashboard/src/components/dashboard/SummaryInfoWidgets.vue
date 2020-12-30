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
  <div class="va-row dashboard-info-widgets">
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ numAllowedClusters }}
            </div>
            <div class="stats-title">{{'summary.clusters' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ namespacesConfig.num }}
            </div>
            <div class="stats-title">{{'summary.namespaces' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ topicsConfig.num }}
            </div>
            <div class="stats-title">{{'summary.topics' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
  </div>
    
</template>

<script>
import { mapGetters } from "vuex";


export default {
  name: 'summary-info-widgets',
  data() {
    return {
      numClusters: 2
    }
  },
   computed: {
    ...mapGetters([
      'numNamespaces',
      'numAllowedClusters',
      'numTopics',
      'topicsConfig',
      'namespacesConfig'
    ]),
  },
  mounted(){
    this.$store.dispatch('updateAll')
  },
  methods: {
    refreshData(){
    this.$store.dispatch('updateAll')

    }
  }

  
}




</script>

<style lang="scss">


</style>
