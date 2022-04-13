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
    <div class="sink-create">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget headerText="Basics">
                    <div class="va-row">
                        <div class="flex md4">
                            <vuestic-simple-select
                                    label="Sinks"
                                    v-model="sinkType"
                                    name="builtInSinks"
                                    :options="builtInSinks"
                                    option-key="name"
                                    ref="builtInSinks"
                                    :clearable="false"
                                    >
                            </vuestic-simple-select>
                            <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('sinkadd-name'), 'valid': isFormFieldValid('sinkadd-name')}"
                                 >
                                <div class="input-group">
                                    <input v-model="sinkName"
                                            id="sinkadd-name"
                                            name="sinkadd-name"
                                            v-validate="{ required: true, regex: /^[-=:.\w]*$/  }"
                                            data-vv-as="Sink Name"
                                            placeholder="newSink"/>
                                            <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('sinkName')"></i>
                                    <label class="control-label" for="sinkadd-name" role="button">Sink Name</label><i class="bar"></i>
                                </div>
                            </div>
                             <vuestic-simple-select
                                label="Namespace"
                                v-model="sinkNamespace"
                                name="sinkadd-namespace"
                                :options="namespaceSelect"
                                option-key="id"
                                ref="nsSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>
                            <small v-show="namespacesConfig.list.length === 0" class="help text-danger">
                              No namespaces found for this tenant. You must create a namespace.
                            </small>

                        </div>
                        <div class="flex md8">
                          <div class="form-group with-icon-right">
                                <div class="input-group">
                                    <input v-model="description"
                                            id="description"
                                            name="description"
                                            class="has-value"
                                            readonly
                                            placeholder="description"/>
                                    <label class="control-label" for="description" role="button">Description</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group with-icon-right">
                              <div class="input-group">
                                  <input v-model="className"
                                          id="class-name"
                                          name="class-name"
                                          class="has-value"
                                          readonly
                                          placeholder="classname"/>
                                  <label class="control-label" for="class-name" role="button">Class Name</label><i class="bar"></i>
                              </div>
                          </div>
                        </div>
                    </div>
                    <div style="float: right;">
                        <vuestic-tooltip :options="{content: 'Click to view an example setup', placement: 'bottom'}">
                          <a target="_blank" :href="exampleLinks[sinkType.name]">Example Setup</a>
                        </vuestic-tooltip>
                    </div>
                    <div class="table-responsive">
                          <table class="table table-striped first-td-padding table-header-active">
                          <thead>
                          <tr>
                              <td>Setting <br><small>(mouse over for description)</small></td>
                              <!-- <td>Type</td> -->
                              <td>Value <br> <small>(* indicates required)</small></td>
                          </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, name) in currentConfigData" :key="name">
                                  <td>
                                      <vuestic-tooltip :options="{content: item.Description, placement: 'bottom'}">
                                      {{ name }}
                                    </vuestic-tooltip>
                                  </td>
                                  <td>

                                      <template v-if="item.Required === 'true' && item.Type ==='String'">
                                        <input   :placeholder="item.Default"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="{ required: true }"
                                                :name="name"/>
                                          *
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <template v-else-if="item.Required === 'true' && (item.Type ==='Integer' || item.Type ==='Long' )">
                                        <input   :placeholder="item.Default"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="'required|min_value:0'"
                                                :name="name"/>
                                          *
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <template v-else-if="item.Required === 'true' && (item.Type ==='Boolean')">
                                        <input   :placeholder="item.Default"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="'required|included:true,false'"
                                                :name="name"/>
                                        *
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <template v-else-if="item.Required === 'false' && (item.Type ==='Integer' || item.Type ==='Long' )">
                                        <input   :placeholder="item.Default"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="'min_value:0'"
                                                :name="name"/>
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <template v-else-if="item.Required === 'false' && (item.Type ==='Boolean')">
                                        <input   :placeholder="item.Default"
                                                
                                                v-model="item.Value"
                                                v-validate="'in:true,false'"
                                                :name="name"/>
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <template v-else-if="item.Required === 'false' && (item.Type ==='File')">
                                        <div class="form-group with-icon-right">
                                          <div class="input-group">
                                          <input style="margin-top: 10px;" type="file"
                                              :id="name"
                                              :ref="name"
                                              :name="name"
                                              v-on:change="handleFileUpload(name)"
                                              />
                                          </div>
                                          <i v-show="item.Value !==''" class="fa fa-times pointer"
                                                  @click="item.Value =''"></i>
                                      </div>
                                      </template>
                                      <template v-else-if="item.Required === 'true'">
                                        <input   :placeholder="item.Default"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="{ required: true }"
                                                :name="name"/>
                                          *
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
                                      </template>
                                      <input  v-else :placeholder="item.Default"
                                              :id="name"
                                              :ref="name"
                                              v-model="item.Value"
                                              :name="name"/>

                                  </td>
                              </tr>
                          </tbody>
                          </table>
                      </div>
                      <div class="va-row">
                         <div class="flex md12">
                             <vuestic-collapse ref="keyCollapse">
                                        <span slot="header">Click for Extra Settings</span>
                                        <div slot="body">
                                                <div class="va-row collapse-page__content">
                                                        <div class="flex md4">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="userKey" id="user-key" name="user-key"/>
                                                                    <label class="control-label" for="user-key" role="button">Key</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex md4">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="userValue" id="user-value" name="user-value"/>
                                                                    <label class="control-label" for="user-value" role="button">Value</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>

                                                        <div class="flex md4">
                                                            <button :disabled="!userKey || !userValue" class="btn btn-micro" @click="addKeyValue()">Add Key</button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table table-striped first-td-padding table-header-active">
                                                            <thead>
                                                            <tr>
                                                                <td></td>
                                                                <td>Key</td>
                                                                <td>Value</td>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(item, index) in userConfig" :key="index">
                                                                    <td>
                                                                        <i class="fa fa-times pointer"
                                                                                    @click="removeKeyValue(item.key)"></i>
                                                                    </td>
                                                                    <td>
                                                                        {{ item.key}}
                                                                    </td>
                                                                    <td>
                                                                        {{ item.value}}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                            </table>
                                                        </div>

                                                    </div>

                                        </div>
                            </vuestic-collapse>
                         </div>
                     </div>
                       <div class="va-row">

                        <div class="flex md3">
                          <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('sinkadd-parallel'), 'valid': isFormFieldValid('sinkadd-parallel')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="parallelism"
                                                id="sinkadd-parallel"
                                                name="sinkadd-parallel"
                                                v-validate="'required|min_value:1'"
                                                data-vv-as="Instances"
                                            />
                                        <label class="control-label" for="sinkadd-parallel" role="button">Instances</label><i class="bar"></i>
                                        <small v-show="errors.has('sinkadd-parallel')"
                                                            class="help text-danger">
                                                        {{ errors.first('sinkadd-parallel') }}
                                        </small>
                                    </div>
                                </div>
                        </div>
                        <div class="flex md3">
                          <vuestic-simple-select
                                    label="Processing Guarantee"
                                    v-model="guarantee"
                                    name="sinkadd-guarantee"
                                    :options="guaranteeSelect"
                                    option-key="name"
                                    ref="guarSelect"
                                    :clearable="false"
                                    >
                          </vuestic-simple-select>
                        </div>
                        <div class="flex md3">
                          <div v-if="guarantee.id === 'ATLEAST_ONCE'" class="md6">
                                <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('sinkadd-timeout'), 'valid': isFormFieldValid('sinkadd-timeout')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="timeoutMs"
                                                id="sinkadd-timeout"
                                                name="sinkadd-timeout"
                                                v-validate="'min_value:1000'"
                                                data-vv-as="Timeout"
                                                />
                                        <label class="control-label" for="sinkadd-timeout" role="button">Time Out in Ms</label><i class="bar"></i>
                                        <small v-show="errors.has('sinkadd-timeout')"
                                                            class="help text-danger">
                                                        {{ errors.first('sinkadd-timeout') }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex md3">
                            <vuestic-checkbox label="Auto Ack" v-model="autoAckCheck" />
                        </div>
                      </div>
                      <div class="va-row">
                        <h5>Input Topics<small>(Add at least one)</small></h5>
                      </div>
                    <div class="va-row">
                      <div class="flex md3">
                          <div class="form-group with-icon-right" :class="{'has-error': errors.has('sinkadd-intopic'), 'valid': isFormFieldValid('sinkadd-intopic')}">
                                  <div class="input-group">
                                  <input v-model="inputTopicToAdd"
                                      id="sinkadd-intopic"
                                      name="sinkadd-intopic"
                                      v-validate="{ required: true, regex: /^[-=:.\w]*$/  }"
                                      data-vv-as="Input Topic"
                                      />
                                  <label class="control-label" for="sinkadd-intopic" role="button">Topic</label><i class="bar"></i>
                                  <small v-show="errors.has('sinkadd-intopic')"
                                                            class="help text-danger">
                                                        {{ errors.first('sinkadd-intopic') }}
                                        </small>
                                  </div>
                          </div>
                      </div>
                      <div class="flex md3">
                        <vuestic-simple-select
                                label="Namespace"
                                v-model="inputTopicNamespace"
                                name="input-namespace"
                                :options="namespaceSelect"
                                option-key="id"
                                ref="inputNsSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>
                      </div>
                      <div v-if="showSchemaSelect === true" class="flex md3">
                          <vuestic-simple-select
                                    label="Schema"
                                    v-model="schema"
                                    name="sinkadd-schema"
                                    :options="schemaSelect"
                                    option-key="name"
                                    ref="schemaSelect"
                                    :clearable="false"
                                    >
                          </vuestic-simple-select>
                        </div>
                      <div class="flex md3">
                          <button :disabled="!inputTopicToAdd" class="btn btn-micro" @click="addInputTopic()">Add Topic</button>
                      </div>
                      <div v-for="(item, index) in inputTopicList" :key="index" class="filters-page__tags">
                        <div>
                          <vuestic-tag
                            :name="item.schema ? `${item.key} (${item.schema})` : item.key"
                            removable
                            type="primary"
                            @remove="removeInputTopic(item.key)"
                          />
                        </div>
                      </div>

                  </div>
                   <div class="va-row">
                    <p></p>
                   </div>
                    <div class="va-row">
                        <div class="flex md3">
                            <button class="btn btn-secondary  btn-micro" @click="clearValues()">
                                Clear
                            </button>
                        </div>
                        <div class="flex md3">
                            <button :disabled="!currentSinkId" class="btn btn-secondary  btn-micro" @click="goToSinkDetail(currentSinkId)">
                                Go To
                            </button>
                        </div>
                        <div class="flex md3">
                                <button :disabled="!currentSinkId" class="btn btn-primary " @click="updateSink()">
                                Update
                            </button>
                        </div>
                        <div class="flex md3">
                            <button :disabled="currentSinkId || inputTopicList.length == 0" class="btn btn-primary " @click="createSink()">
                                Add
                            </button>
                            <small v-if="hasFormError"
                                class="help text-danger">
                                Please correct form errors
                            </small>
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
import ConfigData from './configs'
import JSZip from 'jszip'


export default {
  name: 'SinkCreate',
  mixins: [mixins],
  data () {
    return {
      configData: ConfigData,
      currentConfigData: {},
      errorText: '',
      sinkName: '',
      hasFormError: false,
      sinkNamespace: '',
      inputTopicNamespace: '',
      exampleLinks: {
        'cassandra': 'http://pulsar.apache.org/docs/en/io-quickstart/#connect-pulsar-to-cassandra',
        'jdbc': 'http://pulsar.apache.org/docs/en/io-quickstart/#connect-pulsar-to-mysql'
      },
      configValues: '',
      description: '',
      showSchemaSelect: false,
      sinkType: {
        name: 'Loading...',
        sinkType: '',
        description: ''
      },
      loadedSinkType: '',
      loadedSinkConfig: {},
      inputTopic: '',
      logTopic: '',
      className: '',
      outputTopic: '',
      parallelism: 1,
      cpuResource: '0.3',
      ramResource: '512000000 ',
      diskResource: '512000000 ',
      runtime: 'Java',
      file: '',
      userConfig: [],
      userKey: '',
      userValue: '',
      mode: 'Create',
      inputTopicToAdd: '',
      inputTopicList: [],
      outputSchemaType: '',
      classListInFile: [],
      builtInSinks: [],
      timeoutMs: 5000,
      disableCreate: false,
      maxSinkNameLength: 20,
      disableUpdate: false,
      autoAckCheck: true,
      pythonPreview: 'import json',
      showPreview: false,
      guarantee: { id: 'ATLEAST_ONCE', name: 'At Least Once' },
      schema: { id: 'NONE', name: 'None' },
      topicSchemaMap: {},
      runtimeSelect: ['Java', 'Python', 'Go'],
      guaranteeSelect: [
        { id: 'ATLEAST_ONCE', name: 'At Least Once' },
        { id: 'ATMOST_ONCE', name: 'At Most Once' },
        { id: 'EFFECTIVELY_ONCE', name: 'Effectively Once' }
      ],
      schemaSelect: [
        { id: 'NONE', name: 'None' },
        { id: 'AVRO', name: 'Avro' },
        { id: 'JSON', name: 'Json' },
      ],
      sinkData: {},
      configFile: ''
    }
  },
  computed: {
    ...mapGetters([
      'sinksData',
      'sourcesData',
      'functionsData',
      'namespacesConfig',
      'activeCluster',
      'tenant',
      'apiBaseUrl',
      'adminToken',
      'featureFlags'
    ]),
    currentSinkId () {
      if (this.sinkName && this.sinkNamespace) {
        const sinkId = this.activeCluster + ':' + this.tenant + ':' + this.sinkNamespace.id + ':' + this.sinkName

        // Check this sink exists
        if (this.sinksData.data[sinkId]) {
          return sinkId
        } else {
          return false
        }
      } else {
        return false
      }
    },
    namespaceSelect () {
      const options = []
      // Get the namespace data if we have it
      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].cluster === this.activeCluster && this.namespacesConfig.data[key].name !== 'worldwide') {
          options.push({
            id: this.namespacesConfig.data[key].name,
            description: this.namespacesConfig.data[key].name
          })
        }
      })
      if (!this.sinkNamespace || this.sinkNamespace === '') {
        this.sinkNamespace = options[0]
        this.inputTopicNamespace = options[0]
      }
      return options
    },
  },
  components: {
    Alert,
  },
  mounted () {
    // Get the list of built-in sinks
    console.log('Get built-in sinks')
    this.getBuiltinSinks()
    // Turn off regular stats polling and enable sink stats polling
    console.log('Stopping regular polling')
    this.$store.commit('setRunTimer', false)

    console.log('Starting sink polling')

    this.$store.commit('setRunSinkTimer', true)
    if (this.featureFlags.sink) {
      this.$store.dispatch('updateAllSinks')
    }
    // If an id is passed, load that sink info
    if (this.$route.params.id) {
      this.mode = "Update"
      this.loadSink(this.$route.params.id)
    } else {
      this.mode = "Create"
    }
    // this.startAutoSinkUpdate()
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable sink stats polling
    console.log('Starting regular polling')

    this.$store.commit('setRunTimer', true)
    console.log('Stopping sink polling')

    this.$store.commit('setRunSinkTimer', false)

    // this.cancelAutoSinkUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  watch: {
    sinkType: function (val) {
      if (val) {
        this.className = val.sinkClass
        this.description = val.description
        this.currentConfigData = this.configData[val.name]
        if (this.mode === "Create") {
          this.sinkName = val.name + 'Sink'
          this.clearValues()
        }
        this.inputTopicToAdd = this.sinkName + '-input'
        if (this.mode === "Update") {
          console.log('Updating config based on loaded values')

          Object.keys(this.loadedSinkConfig).forEach(key => {
            console.log(key)

            // If the key exists in the standard config, add it there
            if (this.currentConfigData.hasOwnProperty(key)) {
              this.currentConfigData[key].Value = this.loadedSinkConfig[key]

            } else {
              // Assume it is part of the user added config
              this.userConfig.push(
                {key: key,
                value: this.loadedSinkConfig[key]
              })

              // Since we are loading data into userConfig, expand the widget
              setTimeout(() => {
                // Wait a bit to let the data update
                this.$refs.keyCollapse.expand()
              }, 1000)
              
            }

            // this.$refs[key][0].value = ''
          })
        }
      }
    }
  },
  methods: {
    clear (field) {
      this[field] = ''
    },
   handleFileUpload (refName) {

      let configFile = ''

      if (this.$refs[refName][0].files[0]) {
        configFile = this.$refs[refName][0].files[0]
        console.log(configFile)
      } else {
        console.log("No file found")
        return
      }

      let reader = new FileReader()

      reader.addEventListener('load', function () {
        this.currentConfigData[refName].Value = 'base64:'+ reader.result.split(',')[1]
        console.log(this.currentConfigData[refName])
      }.bind(this), false)

      if (configFile) {
        reader.readAsDataURL(configFile)
      }
    },
    loadSink (id) {
      console.log('Loading Sink')

      // console.log(`***${id}***`)
      // console.log(this.sinksData)
      // console.log(this.sinksData.data)
      Object.keys(this.sinksData.data).forEach(key => {
        console.log(`***${key}***`)
      })

      if (!this.sinksData.data[id]) {
        console.log('Did not find sink data')

        return
      }
      const sinkData = this.sinksData.data[id]

      this.sinkName = sinkData.name
      this.loadedSinkType = sinkData.archive.replace(/^.+\//, '')
      this.loadedSinkConfig = sinkData.configs

      console.log(sinkData.archive.replace(/^.+\//, ''))
      console.log(this.builtInSinks)

      this.sinkNamespace = {
        id: sinkData.namespace,
        description: sinkData.namespace
      }
      this.className = sinkData.className

      this.guaranteeSelect.forEach((guar) => {
        if (guar.id === sinkData.processingGuarantees) {
          this.guarantee = guar
        }
      })

      this.inputTopicList = []
      Object.keys(sinkData.inputSpecs).forEach(key => {
        this.inputTopicList.push({
          key: key,
          schema: sinkData.inputSpecs[key].schemaType
        })
      })

      this.parallelism = sinkData.parallelism
      this.timeoutMs = sinkData.timeoutMs
      this.autoAckCheck = sinkData.autoAck
    },
    async getBuiltinSinks () {
      try {
        const response = await ApiService.getBuiltinSinks(this.activeCluster)
        if (response.data) {
          console.log(response.data)

          // Need to remove the data-generator, which is erroneously returned as a sink

          this.builtInSinks = []
          response.data.forEach((item) => {
            if (item.name !== 'data-generator') {
              this.builtInSinks.push(item)
            }
          })

          // If we've loads a sinkType, use that
          if (this.mode === "Update") {
            this.sinkType = this.builtInSinks.find(o => o.name === this.loadedSinkType)
            this.loadedSinkType = ''
            return
          }

          // If there is no sinkType set, default to the first on the list
          if (!this.sinkType || this.sinkType.name === '' || this.sinkType.name === 'Loading...') {
            this.sinkType = this.builtInSinks[0]
          }
          console.log(this.configData)
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving builtin sinks. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        isValid = this.formFields[field].validated && this.formFields[field].valid
      }
      return isValid
    },
    addKeyValue () {
      this.userConfig.push(
        {
          key: this.userKey,
          value: this.userValue
        }
      )
      this.userKey = ''
      this.userValue = ''
      this.$refs.keyCollapse.expand()
    },
    removeKeyValue (key) {
      this.userConfig.splice(this.userConfig.findIndex(item => item.key === key), 1)
    },
    clearValues () {
      this.inputTopicList = []

      Object.keys(this.currentConfigData).forEach(key => {
        this.currentConfigData[key].Value = ''
        // this.$refs[key][0].value = ''
      })
      this.parallelism = 1
      this.timeoutMs = 5000
      this.autoAckCheck = true
      this.guarantee = { id: 'ATLEAST_ONCE', name: 'At Least Once' }
      this.userConfig = []

    },
    goToSinkDetail (sinkId) {
      this.$router.push('/admin/sinks/view/' + sinkId)
      this.$store.dispatch('setActiveSinkDetailTab', this.$t('sinkDetail.tabs.overview'))
    },
    addInputTopic () {
      const topicPath = `${this.tenant}/${this.inputTopicNamespace.id}/${this.inputTopicToAdd}`

      if (this.schema.id !== 'NONE') {
        this.inputTopicList.push(
          {
            key: topicPath,
            schema: this.schema.id
          }
        )
      } else {
        this.inputTopicList.push(
          {
            key: topicPath
          }
        )
      }
      // console.log(this.schema.id);
      // if (this.schema.id !== 'NONE') {
      //   this.topicSchemaMap[topicPath] = this.schema.id
      // }
      // this.inputTopicToAdd = ''
    },
    removeInputTopic (key) {
      this.inputTopicList.splice(this.inputTopicList.findIndex(item => item.key === key), 1)
      // delete this.topicSchemaMap[key]
    },
    async createSink () {
      const isValid = await (this.$validator.validateAll())
      if (!isValid) {
        this.hasFormError = true
        return
      }
      this.hasFormError = false

      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      this.disableCreate = true

      // Check that this action doesn't exceed max sink instances

      const sinkConfig = this.getSinkConfig()

      const sinkPath = `${this.tenant}/${this.sinkNamespace.id}/${this.sinkName}`

      try {
        await ApiService.createSink(this.activeCluster, sinkPath, sinkConfig)

        this.disableCreate = true

        // Clear the local file variable
        this.file = ''
        this.onSuccess('Sink created')

        // // Trigger a refresh of all sinks
        this.$store.dispatch('updateAllSinks')

        // // Go to the sink overview
        const sinkId = this.activeCluster + ':' + sinkPath.replace(/\//g, ':')
        this.goToSinkDetail(sinkId)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating sink: ${this.sinkName} in namespace ${this.sinkNamespace.id}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    getSinkConfig () {
      let inputTopics = []
      let topicSchemaMap = {}
      this.inputTopicList.forEach(item => {
        inputTopics.push(item.key)
        if (item.schema) {
          topicSchemaMap[item.key] = item.schema
        }
      })

      // Set user config keys in expected format
      const userConfigKeys = {}
      Object.keys(this.currentConfigData).forEach(key => {
        // If there is a value set, then use it
        if (this.currentConfigData[key].Value) {
          userConfigKeys[key] = this.currentConfigData[key].Value
        }
      })

      // Add the custom config
      Object.keys(this.userConfig).forEach(key => {
        userConfigKeys[this.userConfig[key].key] = this.userConfig[key].value
      })

      const sinkConfig = {
        tenant: this.tenant,
        namespace: this.sinkNamespace.id,
        name: this.sinkName,
        inputs: inputTopics,
        configs: userConfigKeys,
        topicToSchemaType: topicSchemaMap,
        parallelism: this.parallelism,
        archive: 'builtin://' + this.sinkType.name,
        processingGuarantees: this.guarantee.id,
        autoAck: this.autoAckCheck,
      }

      if (this.guarantee.id === 'ATLEAST_ONCE') {
        sinkConfig['timeoutMs'] = this.timeoutMs
      }

      return sinkConfig
    },
    async updateSink () {
      console.log('updating sink')

      const isValid = await (this.$validator.validateAll())

      console.log(isValid)

      if (!isValid) {
        this.hasFormError = true
        return
      }
      this.hasFormError = false

      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      this.disableUpdate = true

      const sinkConfig = this.getSinkConfig()

      const sinkPath = `${this.tenant}/${this.sinkNamespace.id}/${this.sinkName}`

      try {
        await ApiService.updateSink(this.activeCluster, sinkPath, sinkConfig, this.file, this.file.name)

        // Clear the local file variable
        this.disableUpdate = false

        this.file = ''
        this.onSuccess('Sink updated')

        // // Trigger a refresh of all sinks
        this.$store.dispatch('updateAllSinks')

        // // Go to the sink overview
        const sinkId = this.activeCluster + ':' + sinkPath.replace(/\//g, ':')

        setTimeout(() => {
          // Wait a bit to let the data update
          this.goToSinkDetail(sinkId)
        }, 500)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating sink: ${this.sinkName} in namespace ${this.sinkNamespace.id}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
  }

}
</script>

<style>

pre {
    background-color: #282a36;
    width: 100%;
}
</style>
