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
  <div class="topics">
    <vuestic-widget>
      <div class="va-row">
          <alert ref="alert" :errorText="errorText"></alert>
          <vuestic-modal :show.sync="showCreateTopicModal" ref="partitionedTopicModal"
                          :okText="'modal.ok' | translate"
                          v-on:ok="createTopic()"
                          :okDisabled="!isFormValid"
                          :cancelText="'modal.cancel' | translate">
            <div slot="title">Create Topic</div>
            <div>
                <fieldset>
                      <vuestic-simple-select
                    label="Namespace"
                    v-model="createTopicNamespace"
                    name="Namespace"
                    :required="required"
                    :clearable="clearable"
                    v-validate="'required'"
                    ref="namespaceSelect"
                    v-bind:options="namespacesList">
                  </vuestic-simple-select>
                  <small v-show="namespacesConfig.list.length === 0" class="help text-danger">
                    No namespaces found for this tenant. You must create a namespace.
                  </small>
                  <div class="form-group">
                      <div class="input-group">
                        <input id="topicName"
                          name="Topic Name"
                          ref="topicName"
                          v-model="createTopicName"
                          v-validate="namedEntityValidationRegex"
                          required
                        />
                        <label class="control-label" for="topicName">Topic Name</label><i class="bar"></i>
                        <small v-show="errors.has('Topic Name')"
                             class="help text-danger">
                        {{ errors.first('Topic Name') ? namedEntityValidationError : '' }}
                      </small>
                      </div>
                  </div>
                  <div class="form-group">
                      <vuestic-checkbox
                        label="Partitioned"
                        v-model="partitionTopicFlag"
                      />
                  </div>
                  <div v-if="partitionTopicFlag" class="form-group">
                      <div class="input-group">
                        <input id="numPartitions"
                          name="Number of Partitions"
                          v-model="numPartitions"
                          v-validate="'required|numeric|min_value:2'"
                          required
                        />
                        <label class="control-label" for="numPartitions">Number of Partitions</label><i class="bar"></i>
                        <small v-show="errors.has('Number of Partitions')"
                             class="help text-danger">
                        {{ errors.first('Number of Partitions') }}
                      </small>
                      </div>
                  </div>

                </fieldset>
            </div>
          </vuestic-modal>
          <div
            class="flex sm6 lg6 xl3 justify--center">
            <button class="btn btn-primary btn-with-icon" @click="openCreateTopicModal()">
              <div class="btn-with-icon-content">
                <i class="ion-md-add ion"></i>
                Topic
              </div>
            </button>
          </div>
      </div>
    </vuestic-widget>

    <vuestic-widget>
      <div class="row">
        <div class="col-md-12">
          <div slot="body">
            <div class="row filters-page__filter-bar-container">

              <filter-bar
                v-model="topicFilter"
                class="filters-page__filter-bar"
                label="Topic"
              />
              <vuestic-simple-select
                class="filters-page__filter-bar"
                label="Namespace"
                v-model="namespaceFilter"
                name="topic-ns-filter-bar"
                :options="namespacesList"
              />
              <vuestic-simple-select
                class="filters-page__filter-bar"
                label="Type"
                v-model="typeFilter"
                name="topic-type-filter-bar"
                :options="typesList"
              />
            </div>
          </div>
          <div class="filters-page__tags">
            <vuestic-tag
              v-if="topicFilter"
              :name="`Topic: ${ topicFilter }`"
              removable
              @remove="topicFilter = ''"
            />
            <vuestic-tag
              v-if="namespaceFilter"
              :name="`Namespace: ${ namespaceFilter }`"
              removable
              @remove="namespaceFilter = ''"
            />
             <vuestic-tag
              v-if="typeFilter"
              :name="`Type: ${ typeFilter }`"
              removable
              @remove="typeFilter = ''"
            />
            <span
              v-if="this.namespaceFilter || this.topicFilter || this.typeFilter"
              class="filters-page__clear-all-text"
              @click="clearAll"
            >
              Clear all filters
            </span>
          </div>
        </div>
      </div>
    </vuestic-widget>

    <div v-for="topicId in topicsConfig.list" :key="topicId">
      <vuestic-widget :headerText="topicsConfig.data[topicId] ? topicsConfig.data[topicId].name : 'Unknown' " v-show="showTopic(topicId)" :class="{ globebackground: isGlobal(topicId), partitionbackground: isPartition(topicId)}">
        <div class="va-row" >
          <div class="flex md4">

              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="topicsConfig.data[topicId] ? topicsConfig.data[topicId].namespace : 'Unknown' " :id="'ns-'+ topicId" :name="'ns-'+ topicId"
                    class="has-value" placeholder="" readonly />
                  <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicsConfig.data[topicId] ? topicsConfig.data[topicId].namespace : 'Unknown' "
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                  </i>
                  <label class="control-label" :for="'ns-'+ topicId" role="button">{{'forms.inputs.namespace'
                    | translate}}</label><i class="bar"></i>
                </div>
              </div>
              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="topicsConfig.data[topicId] ? topicsConfig.data[topicId].cluster : 'Unknown' " :id="'cluster-'+ topicId" :name="'cluster-'+ topicId"
                    class="has-value" placeholder="" readonly />
                  <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicsConfig.data[topicId] ? topicsConfig.data[topicId].cluster : 'Unknown' "
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                  </i>
                  <label class="control-label" :for="'cluster-'+ topicId" role="button">{{'forms.inputs.cluster'
                    | translate}}</label><i class="bar"></i>
                </div>
              </div>
              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="tenant" :id="'tenant-'+ topicId" :name="'tenant-'+ topicId"
                    class="has-value" placeholder="" readonly />
                  <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="tenant"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                  </i>
                  <label class="control-label" :for="'tenant-'+ topicId" role="button">Tenant</label><i class="bar"></i>
                </div>
              </div>
              <div class="form-group with-icon-right">
                <div class="input-group">
                  <input :value="topicsConfig.data[topicId] ? topicsConfig.data[topicId].type : 'Unknown' " :id="'type-'+ topicId" :name="'type-'+ topicId"
                    class="has-value" placeholder="" readonly />
                  <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicsConfig.data[topicId] ? topicsConfig.data[topicId].type : 'Unknown'"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                  </i>
                  <label class="control-label" :for="'type-'+ topicId" role="button">{{'forms.inputs.type'
                    | translate}}</label><i class="bar"></i>
                </div>
              </div>
              <div v-if="topicsConfig.data[topicId] && topicsConfig.data[topicId].partitioned" class="form-group with-icon-right">
                <div v-if="topicStats.data[topicId]" class="input-group">
                  <input :value="topicStats.data[topicId] ? topicStats.data[topicId].info.partitions : 'Unknown' " :id="'part-'+ topicId" :name="'part-'+ topicId"
                    class="has-value" placeholder="" readonly />
                  <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicStats.data[topicId] ? topicStats.data[topicId].info.partitions : 'Unknown' "
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                  </i>
                  <label class="control-label" :for="'part-'+ topicId" role="button">Partitions</label><i class="bar"></i>
                </div>
              </div>

          </div>

          <div class="flex md4">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget ">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number">
                        {{ topicStats.data[topicId].stats.storageSize | humanBytes }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget ">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number">
                        {{ topicStats.data[topicId].info.subscriptions }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'topicDetail.tabs.subscriptions' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              
            </div>
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget ">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number">
                        {{ topicStats.data[topicId].info.producers }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'topicDetail.tabs.producers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget ">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number">
                        {{ topicStats.data[topicId].info.consumers }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'tables.headings.consumers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              
            </div>
          </div>

          <div class="flex md4">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number no-wrap">
                        {{ topicStats.data[topicId].info.inRate | numberSeparate() }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div v-if="topicStats.data[topicId]" class="stats-number no-wrap">
                        {{ topicStats.data[topicId].info.outRate | numberSeparate() }}
                      </div>
                      <div v-else>
                        N/A
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
              <button class="btn btn-primary btn-right" @click="updateNav(topicsConfig.data[topicId].id)">
                Details
              </button>
          </div>

        </div>

      </vuestic-widget>

    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'
import FilterBar
  from '../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'

export default {
  name: 'Topics',
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
      typesList: [
        'persistent',
        'non-persistent',
        'partitioned'
      ]
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'activeCluster',
      'namespacesConfig',
      'tenant',
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
    topicFilter: {
      set (topic) {
        this.$store.commit('setFilterObject', { key: 'topicTopic', value: topic })
      },
      get () {
        return this.filterObject.topicTopic
      }
    },
    namespaceFilter: {
      set (ns) {
        this.$store.commit('setFilterObject', { key: 'topicNamespace', value: ns })
      },
      get () {
        return this.filterObject.topicNamespace
      }
    },
    typeFilter: {
      set (type) {
        // console.log('Setting filter type to ' + type)
        this.$store.commit('setFilterObject', { key: 'topicType', value: type })
      },
      get () {
        console.log('Getting filter type of ' + this.filterObject.topicType)
        return this.filterObject.topicType
      }
    },
    isFormValid () {
      // return this.formFields['topicName'].valid
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {

    clearAll () {
      this.namespaceFilter = ''
      this.topicFilter = ''
      this.typeFilter = ''
    },
    updateNav (topic) {
      this.$router.push('/admin/topic/' + topic)
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
    isPartition (topicId) {
      if (this.topicStats.data[topicId]) {
        if (this.topicsConfig.data[topicId].name.includes('-partition-')) {
          return true
        }
      }

      return false
    },
    openCreateTopicModal () {
      if (this.createTopicNamespace === '' && this.namespacesConfig.list.length > 0) {
        this.createTopicNamespace = this.namespacesConfig.list[0].name
      }
      this.$refs.partitionedTopicModal.open()
    },
    showTopic (topicId) {
      let showTopic = true
      let topicInfo = {}
      if (this.topicsConfig.data[topicId]) {
        topicInfo = this.topicsConfig.data[topicId]
      } else {
        return false
      }
      if (topicInfo.cluster !== this.activeCluster) {
        showTopic = false
      }

      if (this.topicFilter) {
        if (topicInfo.name.toUpperCase().search(this.topicFilter.toUpperCase()) === -1) {
          showTopic = false
        }
      }
      // console.log(topicInfo.type)
      if (this.namespaceFilter) {
        if (topicInfo.namespace !== this.namespaceFilter) {
          showTopic = false
        }
      }
      if (this.typeFilter) {
        if (topicInfo.type !== this.typeFilter) {
          showTopic = false
        }

        if (this.typeFilter === 'partitioned' && topicInfo.name.search('-partition-') !== -1) {
          showTopic = true
        }
      }

      return showTopic
    },
    async createPartitionedTopic () {
      const topicPath = this.tenant + '/' + this.createTopicNamespace + '/' + this.createTopicName
      try {
        await ApiService.createPartitionedTopic(this.activeCluster, topicPath, this.numPartitions)

        // Need to update master list of topics
        this.$store.dispatch('getTopics')

        // Makes sure partitions are created
        ApiService.createMissingPartitions(this.activeCluster, topicPath)

        // Go to the topic overview
        const topicId = this.activeCluster + ':' + topicPath.replace(/\//g, ':') + ':parent'
        this.$router.push('/admin/topic/' + topicId)
        this.$store.dispatch('setActiveTopicDetailTab', this.$t('topicDetail.tabs.overview'))
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating topic: ${this.createTopicName} (${this.numPartitions}). Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    createTopic () {
      if (this.partitionTopicFlag) {
        this.createPartitionedTopic()
      } else {
        this.createNonPartitionedTopic()
      }
    },
    async createNonPartitionedTopic () {
      const topicPath = this.tenant + '/' + this.createTopicNamespace + '/' + this.createTopicName
      try {
        await ApiService.createNonPartitionedTopic(this.activeCluster, topicPath)

        // Need to update master list of topics
        this.$store.dispatch('getTopics')

        // Got to the topic overview
        const topicId = this.activeCluster + ':' + topicPath.replace(/\//g, ':')
        this.$router.push('/admin/topic/' + topicId)
        this.$store.dispatch('setActiveTopicDetailTab', this.$t('topicDetail.tabs.overview'))
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating topic: ${this.createTopicName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
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
