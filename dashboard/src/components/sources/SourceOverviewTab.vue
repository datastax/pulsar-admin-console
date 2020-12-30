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
    <div class="source-overview">
        <alert ref="alert" :errorText="errorText"></alert>
        <vuestic-modal :show.sync="showSourceModal" ref="deleteSourceModal"
                  :okText="'modal.confirm' | translate"
                  v-on:ok="deleteSource()"
                  :cancelText="'modal.cancel' | translate">
        <div slot="title">Delete Topic</div>
        <div>
            Are you sure you want to delete source {{ sourcesData.data[$route.params.id].name }}?
        </div>
        </vuestic-modal>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sourcesData.data[$route.params.id]">
                    <div class="va-row">
                        <div class="flex md6">
                            <div v-for="statKey in wideCopyKeys" :key="statKey" class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="getHumanReadable(statKey, sourcesData.data[$route.params.id][statKey])" :id="'source-'+statKey" :name="'source-'+statKey"
                                    class="has-value" placeholder="" readonly />
                                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="getHumanReadable(statKey, sourcesData.data[$route.params.id][statKey])"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                                <label class="control-label" :for="'source-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                </div>
                            </div>

                            <div class="va-row">
                                <div class="va-row">
                                    <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md6">
                                        <div  class="form-group with-icon-right">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, sourcesData.data[$route.params.id][statKey])" :id="'source-'+statKey" :name="'source-'+statKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="'source-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class=" flex md6">
                            <div class="va-row">
                                <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="sourcesData.status[$route.params.id]"  class="stats-number">
                                            {{ sourcesData.status[$route.params.id].numInstances}}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">Instances</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                    </div>
                                    <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="sourcesData.status[$route.params.id]" class="stats-number">
                                            {{ sourcesData.status[$route.params.id].numRunning}}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">Running</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                    </div>
                            </div>
                            <div class="va-row">

                                <div class="flex md12">
                                    <vuestic-widget>
                                    <h5>
                                        Config
                                    </h5>
                                    <div class="table-responsive">
                                                                <table class="table table-striped first-td-padding table-header-active">
                                                                <thead>
                                                                <tr>
                                                                    <td>Setting</td>
                                                                    <td>Value</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(value, key) in sourcesData.data[$route.params.id].configs" :key="key">
                                                                        <td>
                                                                            {{ key}}
                                                                        </td>
                                                                        <td>
                                                                            {{ cleanValue(key, value)}}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                                </table>
                                                            </div>
                                    </vuestic-widget>
                                </div>
                            </div>
                             <div class="va-row">

                                <div class="flex md12">
                                    <vuestic-widget>
                                      <h5>
                                          Topic
                                      </h5>
                                      <router-link :to="{ name: 'topicDetail', params: { id:  sourcesData.data[$route.params.id].cluster + ':' + sourcesData.data[$route.params.id].topicName.replace(/\//g, ':') }}">{{ sourcesData.data[$route.params.id].topicName }}</router-link>
                                                                       
                                    </vuestic-widget>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="va-row">
                            <div class="flex md3">
                                <button  class="btn btn-primary" @click="updateUpdateNav($route.params.id)">
                                    Update
                                </button>
                            </div>
                            <div class="flex md3">
                                <button :disabled="isDeleted" class="btn btn-primary" @click="confirmDeleteSource()">Delete</button>
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
import ApiService from '@/services/ApiService'
import lodash from 'lodash'

export default {
  name: 'SourceOverview',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      stateEnabled: false,
      showSourceModal: false,
      isDeleted: false,
      sourceStateKey: '',
      sourceStateValue: '',
      sourceStateVersion: '',
      sourceStateTypes: ['Number', 'String', 'Bytes'],
      sourceStateType: 'String',
      enableResources: false,
      // returnsContent: true,
      inputSpecKeys: [
        'schemaType',
        'serdeClassName',
        'receiverQueueSize',
        'regexPattern'
      ],
      wideCopyKeys: [
        'name',
        'namespace',
        'cluster',
        'path',
        'className',
        'processingGuarantees',
        'topicName'
      ],
      extraWideCopyKeys: [
        'output',
        'logTopic'
      ],
      narrowCopyKeys: [
        'parallelism',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'sourcesData'
    ]),
    inputTopic () {
      let infoObject = this.sourcesData.data[this.$route.params.id]

      const inputTopicObj = infoObject.inputSpecs

      return Object.keys(inputTopicObj)[0]
    },
    hasUserConfig () {
      if (!this.sourcesData.data[this.$route.params.id].userConfig) {
        return false
      } else {
        return !lodash.isEmpty(this.sourcesData.data[this.$route.params.id].userConfig)
      }
    }

  },
  components: {
    Alert,
  },
  mounted () {
  },
  methods: {
    clear (field) {
      this[field] = ''
    },
    cleanValue (key, value) {
      const lowerKey = key.toLowerCase()
      if (lowerKey.includes('token') || lowerKey.includes('password') || lowerKey.includes('secret')) {
        return value.replace(/./g, '*')
      }
      return value
    },
    confirmDeleteSource () {
      this.$refs.deleteSourceModal.open()
    },
    updateUpdateNav (topic) {
      const dest = '/admin/sources/add/' + topic
      console.log(`Got to dest: ${dest}`)

      this.$router.push(dest)
    },
    async deleteSource () {
      this.isDeleted = true
      let infoObject = this.sourcesData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let sourcePath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteSource(cluster, sourcePath)

        this.onSuccess('Source deleted')

        // Need to update master list of sources
        this.$store.dispatch('getSources')
        // Need to delete the  entry for the source
        this.$store.dispatch('purgeSource', this.$route.params.id)
        // Redirect to the source summary page
        this.$router.push('/admin/sources/view')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting source: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = false
      }
    },
  }
}
</script>

<style lang="scss">

pre {
    background-color: #282a36;
    width: 100%;
    white-space: pre-wrap;
}
</style>
