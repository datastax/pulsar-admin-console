<template>
  <div class="functions">
    <vuestic-widget>
      <div class="row">
        <div class="col-md-12">
          <div slot="body">
            <div class="row filters-page__filter-bar-container">

              <div class="va-row">
                <div class="flex md4">
                  <filter-bar
                    v-model="functionFilter"
                    class="filters-page__filter-bar"
                    label="Function"
                  />
                </div>
                <div class="flex md4">
                  <vuestic-simple-select
                    class="filters-page__filter-bar"
                    label="Runtime"
                    name="runtime-filter-select"
                    v-model="runtimeFilter"
                    :options="runtimeList"
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
              v-if="functionFilter"
              :name="`Function: ${ functionFilter }`"
              removable
              @remove="functionFilter = ''"
            />
            <vuestic-tag
              v-if="runtimeFilter"
              :name="`Runtime: ${ runtimeFilter }`"
              removable
              @remove="runtimeFilter = ''"
            />
            <vuestic-tag
              v-if="namespaceFilter"
              :name="`Namespace: ${ namespaceFilter }`"
              removable
              @remove="namespaceFilter = ''"
            />
            <span
              v-if="this.namespaceFilter || this.functionFilter || this.runtimeFilter"
              class="filters-page__clear-all-text"
              @click="clearAll"
            >
              Clear all filters
            </span>
          </div>
        </div>
      </div>
    </vuestic-widget>

    <div v-for="funcId in functionsData.list" :key="funcId">
      <div v-if="functionsData.data[funcId]">
        <vuestic-widget :headerText="functionsData.data[funcId].name" v-if="showFunction(funcId)">
          <div class="va-row" >
            <div class="flex md4">

                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input :value="functionsData.data[funcId].namespace" id="func-namespace" name="func-namespace"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="functionsData.data[funcId].namespace"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" for="func-namespace" role="button">{{'forms.inputs.namespace'
                      | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input v-model="functionsData.data[funcId].cluster" id="func-cluster" name="func-cluster"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="functionsData.data[funcId].cluster"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" for="func-cluster" role="button">{{'forms.inputs.cluster'
                      | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input v-model="functionsData.data[funcId].path" id="func-path" name="func-path"
                      class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="functionsData.data[funcId].path"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" for="func-path" role="button">Path</label><i class="bar"></i>
                  </div>
                </div>

                <div class="form-group with-icon-right">
                  <div class="input-group">
                    <input :value="toTitleCase(functionsData.data[funcId].runtime)" id="func-runtime" name="func-runtime"
                      class="has-value" placeholder="" readonly />
                    <label class="control-label" for="func-runtime" role="button">Runtime</label><i class="bar"></i>
                  </div>
                </div>

            </div>

            <div class="flex md4">
              <div class="va-row">
                <div v-if="functionsData.status[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ functionsData.status[funcId].numInstances}}
                        </div>
                        <div class="stats-title">Instances</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>

                <div v-if="functionsData.status[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ functionsData.status[funcId].numRunning}}
                        </div>
                        <div class="stats-title">Running</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>

              </div>

              <div class="va-row">
                <div v-if="functionsData.stats[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ functionsData.stats[funcId].processedSuccessfullyTotal}}
                        </div>
                        <div class="stats-title">Success</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>

                <div v-if="functionsData.stats[funcId]" class="flex md6">
                  <vuestic-widget class="info-widget ">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ functionsData.stats[funcId].systemExceptionsTotal + functionsData.stats[funcId].userExceptionsTotal }}
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
                <div v-if="functionsData.stats[funcId]" class="flex md12">
                  <vuestic-widget class="info-widget brand-info">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div v-if="functionsData.stats[funcId].avgProcessLatency" class="stats-number no-wrap">
                          {{ functionsData.stats[funcId].avgProcessLatency | toFixed(4)}}
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
              <button style="margin-bottom: 10px;" class="btn btn-primary btn-right" @click="updateNav(functionsData.data[funcId].index)">
                Manage
              </button>

            </div>

          </div>

          <div class="va-row">
            <div class="flex md8">
              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="functionsData.data[funcId].className" id="func-classname" name="func-classname"
                    class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="functionsData.data[funcId].path"
                    v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                  <label class="control-label" for="func-classname" role="button">Class Name</label><i class="bar"></i>
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
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import FilterBar
  from '../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'

export default {
  name: 'Functions',
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
      maxFunctions: 1

    }
  },
  mixins: [mixins],
  mounted () {
    // Turn off regular stats polling and enable function stats polling
    console.log('Stopping regular polling Functions')

    this.$store.commit('setRunTimer', false)

    console.log('Starting function polling Functions')

    this.$store.commit('setRunFunctionTimer', true)

    if (this.featureFlags.function) {
      this.$store.dispatch('updateAllFunctions')
    }
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable function stats polling
    console.log('Starting regular polling Functions')

    this.$store.commit('setRunTimer', true)
    console.log('Stopping function polling Functions')

    this.$store.commit('setRunFunctionTimer', false)

    // this.cancelAutoFunctionUpdate()
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
      'functionsData',
      'runFunctionTimer',
      'featureFlags',
      'filterObject'
    ]),
    namespacesList () {
      const nsList = []
      this.namespacesConfig.list.forEach(ns => {
        // nsList.push({ id: ns.name, description: ns.name} )
        nsList.push(ns.name)
      })
      return nsList
    },
    functionFilter: {
      set (func) {
        this.$store.commit('setFilterObject', { key: 'functionFunction', value: func })
      },
      get () {
        return this.filterObject.functionFunction
      }
    },
    namespaceFilter: {
      set (ns) {
        this.$store.commit('setFilterObject', { key: 'functionNamespace', value: ns })
      },
      get () {
        return this.filterObject.functionNamespace
      }
    },
    runtimeFilter: {
      set (runtime) {
        this.$store.commit('setFilterObject', { key: 'functionRuntime', value: runtime })
      },
      get () {
        return this.filterObject.functionRuntime
      }
    },
    runtimeList () {
      const runtimeList = []
      this.functionsData.list.forEach(funcId => {
        if (this.functionsData.data[funcId]) {
          // If the runtime isn't on the list, add it
          const runtime = this.toTitleCase(this.functionsData.data[funcId].runtime)
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
      this.functionFilter = ''
    },
    toTitleCase (text) {
      var result = text.toLowerCase()
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1)
      return finalResult
    },
    updateNav (topic) {
      const dest = '/admin/functions/view/' + topic
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
    showFunction (funcId) {
      let showFunction = true
      let funcStat = {}
      if (this.functionsData.data[funcId]) {
        funcStat = this.functionsData.data[funcId]
      } else {
        return false
      }

      if (funcStat.cluster !== this.activeCluster) {
        showFunction = false
      }

      if (this.functionFilter) {
        if (funcStat.name.toUpperCase().search(this.functionFilter.toUpperCase()) === -1) {
          showFunction = false
        }
      }

      if (this.namespaceFilter) {
        if (funcStat.namespace !== this.namespaceFilter) {
          showFunction = false
        }
      }

      if (this.runtimeFilter) {
        if (funcStat.runtime.toLowerCase() !== this.runtimeFilter.toLowerCase()) {
          showFunction = false
        }
      }

      return showFunction
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
