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
  <div class="sinks">
    <vuestic-widget>
      <div class="row">
        <div class="col-md-12">
          <div slot="body">
            <div class="row filters-page__filter-bar-container">
              <div class="va-row">
                <div class="flex md4">
                  <filter-bar
                    v-model="sinkFilter"
                    class="filters-page__filter-bar"
                    label="Sink"
                  />
                </div>
                <div class="flex md4">
                  <vuestic-simple-select
                    class="filters-page__filter-bar"
                    label="Namespace"
                    name="namespace-filter-select"
                    v-model="namespaceFilter"
                    :options="namespacesList"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="filters-page__tags">
            <vuestic-tag
              v-if="sinkFilter"
              :name="`Sink: ${ sinkFilter }`"
              removable
              @remove="sinkFilter = ''"
            />
            <vuestic-tag
              v-if="namespaceFilter"
              :name="`Namespace: ${ namespaceFilter }`"
              removable
              @remove="namespaceFilter = ''"
            />
            <span
              v-if="this.namespaceFilter || this.sinkFilter"
              class="filters-page__clear-all-text"
              @click="clearAll"
            >
              Clear all filters
            </span>
          </div>
        </div>
      </div>
    </vuestic-widget>

    <div v-for="funcId in sinksData.list" :key="funcId">
      <div v-if="sinksData.data[funcId]">
        <vuestic-widget :headerText="sinksData.data[funcId].name" v-if="showSink(funcId)">
          <div class="va-row" >
            <div class="flex md4">
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input :value="sinksData.data[funcId].archive" :id="'sink-archive'+ funcId" :name="'sink-archive'+ funcId"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="sinksData.data[funcId].archive"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" :for="'sink-archive'+ funcId" role="button">{{'forms.inputs.type'
                      | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input :value="sinksData.data[funcId].namespace" :id="'sink-namespace'+ funcId" :name="'sink-namespace'+ funcId"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="sinksData.data[funcId].namespace"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" :for="'sink-namespace'+ funcId" role="button">{{'forms.inputs.namespace'
                      | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input v-model="sinksData.data[funcId].cluster" :id="'sink-cluster'+ funcId" :name="'sink-cluster'+ funcId"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="sinksData.data[funcId].cluster"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" :for="'sink-cluster'+ funcId" role="button">{{'forms.inputs.cluster'
                      | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input v-model="sinksData.data[funcId].path" :id="'sink-path'+ funcId" :name="'sink-cluster'+ funcId"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="sinksData.data[funcId].path"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" :for="'sink-cluster'+ funcId" role="button">Path</label><i class="bar"></i>
                  </div>
                </div>

            </div>
            <div class="flex md4">
              <div class="va-row">
                <div v-if="sinksData.status[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ sinksData.status[funcId].numInstances}}
                        </div>
                        <div class="stats-title">Instances</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>

                <div v-if="sinksData.status[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ sinksData.status[funcId].numRunning}}
                        </div>
                        <div class="stats-title">Running</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>
              </div>

              <div class="va-row">
                <div v-if="sinksData.stats[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ sinksData.stats[funcId].processedSuccessfullyTotal}}
                        </div>
                        <div class="stats-title">Success</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>

                <div v-if="sinksData.stats[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ sinksData.stats[funcId].systemExceptionsTotal + sinksData.stats[funcId].userExceptionsTotal }}
                        </div>
                        <div class="stats-title">Fails</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>
              </div>
            </div>

            <div class="flex md4">
              <div class="va-row">
                <div v-if="sinksData.stats[funcId]" class="flex md12">
                  <vuestic-widget class="info-widget brand-info">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div v-if="sinksData.stats[funcId].avgProcessLatency" class="stats-number no-wrap">
                          {{ sinksData.stats[funcId].avgProcessLatency | toFixed(4)}}
                        </div>
                        <div v-else class="stats-number no-wrap">
                          N/A
                        </div>
                        <div class="stats-title">Average Process Latency (ms)</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>
              </div>
              <button style="margin-bottom: 10px;" class="btn btn-primary btn-right" @click="updateNav(sinksData.data[funcId].index)">
                Manage
              </button>
            </div>
          </div>

          <div class="va-row">
            <div class="flex md8">
              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="sinksData.data[funcId].className" :id="'sink-className'+ funcId" :name="'sink-className'+ funcId"
                    class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="sinksData.data[funcId].path"
                    v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                  <label class="control-label" :for="'sink-className'+ funcId" role="button">Class Name</label><i class="bar"></i>
                </div>
              </div>
            </div>
          </div>
        </vuestic-widget>
      </div>
    </div>
        </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
// import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'
import FilterBar
  from '../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'

export default {
  name: 'Sinks',
  components: {
    FilterBar,
    Alert
  },
  data () {
    return {
      errorText: 'Something went wrong',
      showCreateTopicModal: false,
      animated: true,
      createTopicName: '',
      createTopicNamespace: '',
      partitionTopicFlag: false,
      numPartitions: 2,
      required: true,
      clearable: false,
      cancelTimer: false,
      maxSinks: 1
    }
  },
  mixins: [mixins],
  mounted () {
    // Turn off regular stats polling and enable sink stats polling
    console.log('Stopping regular polling Sinks')

    this.$store.commit('setRunTimer', false)

    console.log('Starting sink polling Sinks')

    if (this.featureFlags.sink) {
      this.$store.commit('setRunSinkTimer', true)
      this.$store.dispatch('updateAllSinks')
    }
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable sink stats polling
    console.log('Starting regular polling Sinks')

    this.$store.commit('setRunTimer', true)
    console.log('Stopping sink polling Sinks')

    this.$store.commit('setRunSinkTimer', false)

    // this.cancelAutoSinkUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'activeCluster',
      'namespacesConfig',
      'tenant',
      'sinksData',
      'runSinkTimer',
      'featureFlags',
      'filterObject'
    ]),
    sinkFilter: {
      set (sink) {
        this.$store.commit('setFilterObject', { key: 'sinkSink', value: sink })
      },
      get () {
        return this.filterObject.sinkSink
      }
    },
    namespaceFilter: {
      set (ns) {
        this.$store.commit('setFilterObject', { key: 'sinkNamespace', value: ns })
      },
      get () {
        return this.filterObject.sinkNamespace
      }
    },
    namespacesList () {
      const nsList = []
      this.namespacesConfig.list.forEach(ns => {
        // nsList.push({ id: ns.name, description: ns.name} )
        nsList.push(ns.name)
      })
      return nsList
    },
    runtimeList () {
      const runtimeList = []
      this.sinksData.list.forEach(funcId => {
        if (this.sinksData.data[funcId]) {
          // If the runtime isn't on the list, add it
          const runtime = this.toTitleCase(this.sinksData.data[funcId].runtime)
          if (!runtimeList.includes(runtime)) {
            runtimeList.push(runtime)
          }
        }
      })
      return runtimeList
    },
    isFormValid () {
      // return this.formFields['topicName'].valid
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    filteredItems () {
      let filteredItems = this.itemList
      if (this.name) {
        filteredItems = filteredItems.filter(item => item.name.toUpperCase()
          .search(this.name.toUpperCase()) !== -1)
      }
      if (this.email) {
        filteredItems = filteredItems.filter(item => item.email.toUpperCase()
          .search(this.email.toUpperCase()) !== -1)
      }
      if (this.city) {
        filteredItems = filteredItems.filter(item => item.city.toUpperCase()
          .search(this.city.toUpperCase()) !== -1)
      }
      return filteredItems
    }
  },
  methods: {
    clearAll () {
      this.namespaceFilter = ''
      this.sinkFilter = ''
    },
    toTitleCase (text) {
      var result = text.toLowerCase()
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1)
      return finalResult
    },
    updateNav (topic) {
      const dest = '/admin/sinks/view/' + topic
      console.log(`Got to dest: ${dest}`)
      this.$router.push(dest)
    },
    isGlobal (topicId) {
      let topicStat = {}
      if (this.topicStats.data[topicId]) {
        topicStat = this.topicStats.data[topicId]
      } else {
        return false
      }
      if (topicStat.info.replClusters > 0) {
        return true
      }
      return false
    },
    openCreateTopicModal () {
      if (this.createTopicNamespace === '') {
        this.createTopicNamespace = this.namespacesConfig.list[0].name
      }
      this.$refs.partitionedTopicModal.open()
    },
    showSink (funcId) {
      let showSink = true
      let funcStat = {}
      if (this.sinksData.data[funcId]) {
        funcStat = this.sinksData.data[funcId]
      } else {
        return false
      }
      if (funcStat.cluster !== this.activeCluster) {
        showSink = false
      }

      if (this.sinkFilter) {
        if (funcStat.name.toUpperCase().search(this.sinkFilter.toUpperCase()) === -1) {
          showSink = false
        }
      }

      if (this.namespaceFilter) {
        if (funcStat.namespace !== this.namespaceFilter) {
          showSink = false
        }
      }

      return showSink
    },
  }
}
</script>

<style lang="scss" scoped>

.filter-control {
  font-size: 13px;
}

.color-icon-label-table {
  td:first-child {
    width: 1rem;
  }
}
.btn-right {
  float: right ;
}

.no-bottom-padding {
    padding-bottom: 0;
}

.filters-page {
  &__tags {
    display: flex;
  }
  &__filter-bar {
    width: 300px;
  }
  &__filter-bar-container {
    margin: 0;
    justify-content: space-between;
  }
  &__table-heading {
    color: $brand-primary
  }
  &__collapse {
    .vuestic-collapse__body {
      background-color: white;
    }
  }
  &__clear-all-text {
    cursor: pointer;
    color: $brand-primary;
    margin-top: 0.3rem;
  }
}

</style>
