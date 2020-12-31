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
    <div class="function-overview">
        <alert ref="alert" :errorText="errorText"></alert>
        <vuestic-modal :show.sync="showFunctionModal" ref="deleteFunctionModal"
                  :okText="'modal.confirm' | translate"
                  v-on:ok="deleteFunction()"
                  :cancelText="'modal.cancel' | translate">
        <div slot="title">Delete Function</div>
        <div>
            Are you sure you want to delete function {{ functionsData.data[$route.params.id].name }}?
        </div>
        </vuestic-modal>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="functionsData.data[$route.params.id]">
                    <div class="va-row">
                        <div class="flex md4">
                            <div v-for="statKey in wideCopyKeys" :key="statKey" class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="getHumanReadable(statKey, functionsData.data[$route.params.id][statKey])" :id="'func-'+statKey" :name="'func-'+statKey"
                                    class="has-value" placeholder="" readonly />
                                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="getHumanReadable(statKey, functionsData.data[$route.params.id][statKey])"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                                <label class="control-label" :for="'func-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                </div>
                            </div>
                        </div>
                        <div class="flex md4">

                            <div class="va-row">
                                <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="functionsData.stats[$route.params.id]"  class="stats-number">
                                            {{ functionsData.stats[$route.params.id].receivedTotal}}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">Processed</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>
                                <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="functionsData.stats[$route.params.id]" class="stats-number">
                                            {{ functionsData.stats[$route.params.id].processedSuccessfullyTotal}}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">Success</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>
                                <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="functionsData.stats[$route.params.id]" class="stats-number">
                                            {{ functionsData.stats[$route.params.id].systemExceptionsTotal }}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">System Exceptions</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>
                                <div class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="functionsData.stats[$route.params.id]"  class="stats-number">
                                            {{ functionsData.stats[$route.params.id].userExceptionsTotal }}
                                            </div>
                                            <div v-else class="stats-number">
                                                0
                                            </div>
                                            <div class="stats-title">User Exceptions</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>
                                <div v-if="false && functionsData.stats[$route.params.id]" class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div class="stats-number">
                                            {{ functionsData.stats[$route.params.id].systemExceptionsTotal + functionsData.stats[$route.params.id].userExceptionsTotal }}
                                            </div>
                                            <div class="stats-title">Total Exceptions</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>

                                <div class="va-row">
                                <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md6">
                                    <div  class="form-group with-icon-right">
                                        <div class="input-group">
                                        <input :value="getHumanReadable(statKey, functionsData.data[$route.params.id][statKey])" :id="'func-'+statKey" :name="'func-'+statKey"
                                            class="has-value" placeholder="" readonly />
                                        <label class="control-label" :for="'func-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div v-if="enableResources" class="flex md12">
                                <vuestic-widget class="vuestic-widget info-widget">
                                    <div class="info-widget-inner">
                                    <div class="info-widget-inner">
                                        <div class="stats">
                                        <div class="stats-number">
                                            {{ functionsData.data[$route.params.id].resources.cpu | toFixed(1) }}
                                        </div>
                                        <div class="stats-title">CPU</div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-widget>
                            </div>

                            <div v-if="enableResources" class="flex md12">
                                <vuestic-widget class="vuestic-widget info-widget">
                                    <div class="info-widget-inner">
                                    <div class="info-widget-inner">
                                        <div class="stats">
                                        <div class="stats-number">
                                            {{ functionsData.data[$route.params.id].resources.ram | humanBytes }}
                                        </div>
                                        <div class="stats-title">Memory</div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-widget>
                            </div>

                            <div v-if="enableResources" class="flex md12">
                                <vuestic-widget class="vuestic-widget info-widget">
                                    <div class="info-widget-inner">
                                    <div class="info-widget-inner">
                                        <div class="stats">
                                        <div class="stats-number">
                                            {{ functionsData.data[$route.params.id].resources.disk | humanBytes }}
                                        </div>
                                        <div class="stats-title">Disk</div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-widget>
                            </div>

                        </div>
                        <div class=" flex md4">
                            <div class="va-row">
                                <div v-if="functionsData.status[$route.params.id]" class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div class="stats-number">
                                            {{ functionsData.status[$route.params.id].numInstances}}
                                            </div>
                                            <div class="stats-title">Instances</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                    </div>
                                    <div v-if="functionsData.status[$route.params.id]" class="flex md6">
                                    <vuestic-widget class="info-widget ">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div class="stats-number">
                                            {{ functionsData.status[$route.params.id].numRunning}}
                                            </div>
                                            <div class="stats-title">Running</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                    </div>
                            </div>
                            <div class="va-row">
                                <div v-if="functionsData.stats[$route.params.id]" class="flex md12">
                                    <vuestic-widget class="info-widget brand-info">
                                        <div class="info-widget-inner">
                                        <div class="stats">
                                            <div v-if="functionsData.stats[$route.params.id].avgProcessLatency" class="stats-number no-wrap">
                                            {{ functionsData.stats[$route.params.id].avgProcessLatency | toFixed(4)}}
                                            </div>
                                            <div v-else class="stats-number no-wrap">
                                            N/A
                                            </div>
                                            <div class="stats-title">Average Process Latency (ms)</div>
                                        </div>
                                        </div>
                                    </vuestic-widget>
                                </div>

                                <div v-if="hasUserConfig" class="va-row">
                                <h5>
                                    Config Keys
                                </h5>
                                <div class="table-responsive">
                                    <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td>Key</td>
                                        <td>Value</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value, key) in functionsData.data[$route.params.id].userConfig" :key="key">
                                            <td>
                                                {{ key}}
                                            </td>
                                            <td>
                                                {{ value}}
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-if="hasWindowConfig" class="va-row">
                                <h5>
                                    Window Config
                                </h5>
                                <div class="table-responsive">
                                    <table class="table table-striped first-td-padding table-header-active">
                                        <tbody>
                                            <tr v-for="(value, key) in functionsData.data[$route.params.id].windowConfig" :key="key" v-if="value">
                                                <td>
                                                    {{ key}}
                                                </td>
                                                <td>
                                                    {{ value}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div class="va-row">
                            <div class="flex md3">
                                <button class="btn btn-primary" @click="openTriggerModal()">Trigger</button>
                            </div>
                            <div class="flex md3">
                                <button  class="btn btn-primary" @click="updateUpdateNav($route.params.id)">
                                    Update
                                </button>
                            </div>
                            <div v-if="stateEnabled" class="flex md3">
                                <button class="btn btn-primary" @click="openStateModal()">State</button>
                            </div>
                            <div class="flex md3">
                                <button :disabled="isDeleted" class="btn btn-primary" @click="confirmDeleteFunction()">Delete</button>
                            </div>
                    </div>

                </vuestic-widget>
                <vuestic-modal ref="triggerModal"
                      :okText="'modal.ok' | translate"
                      v-on:ok="resetTrigger()"
                      v-on:cancel="resetTrigger()"
                      :cancelText="'modal.cancel' | translate">
                    <div slot="title">Trigger Function</div>
                    <div>
                        <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input v-model="triggerMessage" id="trigger-msg" name="trigger-msg"/>
                                <label class="control-label" for="trigger-msg" role="button">Message To Send</label><i class="bar"></i>
                                <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('triggerMessage')"></i>
                                </div>
                            </div>

                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="inputTopic" id="trigger-topic" name="trigger-topic" readonly class="has-value" />
                                <label class="control-label" for="trigger-topic" role="button">Input Topic</label><i class="bar"></i>
                                </div>
                            </div>

                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="functionsData.data[$route.params.id].output" id="trigger-output" name="trigger-output" readonly class="has-value" />
                                <label class="control-label" for="trigger-output" role="button">Output Topic</label><i class="bar"></i>
                                </div>
                            </div>

                        <div class="flex md12">
                            <button class="btn btn-micro" @click="triggerFunction()">Trigger</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped first-td-padding table-header-active">
                            <thead>
                            <tr>
                                <td>Message Sent</td>
                                <td>Response</td>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(result, index) in triggerResults" :key="index">
                                    <td>
                                        {{ result.msgSent}}
                                    </td>
                                    <td>
                                        {{ result.response}}
                                    </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>

                    </div>
                </vuestic-modal>

                <vuestic-modal ref="stateModal"
                      :okText="'modal.ok' | translate"
                      >
                    <div slot="title">Function State</div>
                    <div>
                        <div class="va-row">
                            <div class="flex md8">
                                <div class="form-group with-icon-right">
                                        <div class="input-group">
                                        <input v-model="functionStateKey"
                                            id="function-key"
                                            name="function-key"
                                             v-on:keyDown="resetStateValue()"/>
                                        <label class="control-label" for="function-key" role="button">Key</label><i class="bar"></i>
                                        <i class="fa fa-times icon-right input-icon pointer"
                                                        @click="clear('fucntionStateKey')"></i>
                                        </div>
                                </div>
                            </div>
                            <div class="flex md4">
                                <button class="btn btn-micro" @click="getFunctionState()">Get</button>
                            </div>
                        </div>
                        <div class="va-row">
                            <div class="flex md12">
                                <div class="form-group with-icon-right">
                                    <div class="input-group">
                                    <input v-model="functionStateValue" id="function-value" name="function-value" class="has-value" />
                                    <label class="control-label" for="function-value" role="button">Value</label><i class="bar"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                            <div class="va-row">
                                <div class="flex md6">
                                    <vuestic-simple-select
                                            label="Type"
                                            v-model="functionStateType"
                                            name="state-type"
                                            :options="functionStateTypes"
                                            ref="state-type"
                                            :clearable="false"
                                            >
                                    </vuestic-simple-select>
                                </div>
                                <div class="flex md6">
                                    <div class="form-group with-icon-right">
                                        <div class="input-group">
                                        <input disabled v-model="functionStateVersion" id="function-version" name="function-version" class="has-value" />
                                        <label class="control-label" for="function-version" role="button">Version</label><i class="bar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         <div class="flex md12">
                            <button :disabled="functionStateType === 'Number' || functionStateType === 'Bytes'" class="btn btn-micro" @click="setFunctionState()">Set</button>
                        </div>

                    </div>
                </vuestic-modal>
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
  name: 'FunctionOverview',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      stateEnabled: true,
      showFunctionModal: false,
      isDeleted: false,
      triggerMessage: '',
      triggerResults: [],
      functionStateKey: '',
      functionStateValue: '',
      functionStateVersion: '',
      functionStateTypes: ['Number', 'String', 'Bytes'],
      functionStateType: 'String',
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
        'runtime',
        'namespace',
        'cluster',
        'path',
        'className',
        'processingGuarantees',
      ],
      extraWideCopyKeys: [
        'output',
        'logTopic'
      ],
      narrowCopyKeys: [
        'parallelism',
        'timeoutMs',
        'autoAck'
      ],
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'functionsData'
    ]),
    inputTopic () {
      let infoObject = this.functionsData.data[this.$route.params.id]

      const inputTopicObj = infoObject.inputSpecs

      return Object.keys(inputTopicObj)[0]
    },
    hasUserConfig () {
      if (!this.functionsData.data[this.$route.params.id].userConfig) {
        return false
      } else {
        return !lodash.isEmpty(this.functionsData.data[this.$route.params.id].userConfig)
      }
    },
    hasWindowConfig () {
      if (!this.functionsData.data[this.$route.params.id].windowConfig) {
        return false
      } else {
        return !lodash.isEmpty(this.functionsData.data[this.$route.params.id].windowConfig)
      }
    }

  },
  components: {
    Alert,
  },
  mounted () {
  },
  methods: {
    resetTrigger () {
      this.triggerResults = []
      this.triggerMessage = ''
    },
    resetStateValue () {
      this.functionStateValue = ''
      this.functionStateVersion = ''
    },
    clear (field) {
      this[field] = ''
    },
    openTriggerModal () {
      this.$refs.triggerModal.open()
    },
    openStateModal () {
      this.$refs.stateModal.open()
    },
    confirmDeleteFunction () {
      this.$refs.deleteFunctionModal.open()
    },
    updateUpdateNav (topic) {
      const dest = '/admin/functions/add/' + topic
      console.log(`Got to dest: ${dest}`)

      this.$router.push(dest)
    },
    async deleteFunction () {
      this.isDeleted = true
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteFunction(cluster, functionPath)

        this.onSuccess('Function deleted')

        // Need to update master list of functions
        this.$store.dispatch('getFunctions')
        // Need to delete the  entry for the function
        this.$store.dispatch('purgeFunction', this.$route.params.id)
        // Redirect to the function summary page
        this.$router.push('/admin/functions/view')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting function: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = false
      }
    },
    async getFunctionState () {
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.getFunctionState(cluster, functionPath, this.functionStateKey)

        console.log(response)

        this.functionStateVersion = response.data.version

        if (response.data.stringValue) {
          this.functionStateValue = response.data.stringValue
          this.functionStateType = 'String'
        }
        if (response.data.byteValue) {
          this.functionStateValue = response.data.byteValue
          this.functionStateType = 'Byte'
        }
        if (response.data.numberValue) {
          this.functionStateValue = response.data.numberValue
          this.functionStateType = 'Number'
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Getting state. Function: ${name} Key: ${this.functionStateKey} Reason: ${reason} (${statusCode})`

        // If something goes wrong, close the modal so the user can see the alter
        this.$refs.stateModal.close()
        this.$refs.alert.showAlert()
      }
    },
    async setFunctionState () {
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.setFunctionState(cluster, functionPath, this.functionStateKey, this.functionStateValue)

        console.log(response)

        this.getFunctionState()
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Setting state. Function: ${name} Key: ${this.functionStateKey} Reason: ${reason} (${statusCode})`

        // If something goes wrong, close the modal so the user can see the alter
        this.$refs.stateModal.close()
        this.$refs.alert.showAlert()
      }
    },
    async triggerFunction () {
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      let name = infoObject.name

      // console.log(infoObject);

      try {
        const response = await ApiService.triggerFunction(cluster, functionPath, this.triggerMessage, this.inputTopic)

        // console.log(response);

        this.triggerResults.push({
          msgSent: this.triggerMessage,
          response: response.data
        })
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Triggering function: ${name}. Reason: ${reason} (${statusCode})`

        // If something goes wrong, close the modal so the user can see the alter
        this.$refs.triggerModal.close()
        this.$refs.alert.showAlert()
      }
    },
  }
}
</script>

<style scoped>

</style>
