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
    <div class="function-create">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget>
                    <div class="va-row">
                        <div class="flex md6">
                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input style="margin-top: 10px;" type="file"
                                    id="funcadd-filename"
                                    name="funcadd-filename"
                                    ref="file"
                                    v-on:change="handleFileUpload()"
                                    />
                                <label class="control-label" for="funcadd-filename" role="button">Function File</label>
                                </div>
                            </div>

                        </div>
                        <div v-if="classListInFile.length > 0" class="flex md6">
                            <vuestic-simple-select
                                    label="Class Name"
                                    v-model="className"
                                    name="funcadd-class"
                                    :options="classListInFile"
                                    ref="classSelect"
                                    :clearable="false"
                                    >
                            </vuestic-simple-select>
                        </div>
                        <div v-else class="flex md6">
                            <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('funcadd-classname'), 'valid': isFormFieldValid('funcadd-classname')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="className"
                                            id="funcadd-classname"
                                            v-validate="{ required: true, regex: /^[-=:.\w]*$/  }"
                                            data-vv-as="Class Name"
                                            name="funcadd-classname"
                                            placeholder="class"/>
                                        <label class="control-label" for="funcadd-classname" role="button">Class Name</label><i class="bar"></i>
                                        <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('className')"></i>
                                        <small v-show="errors.has('funcadd-classname')"
                                                class="help text-danger">
                                            {{ errors.first('funcadd-classname') }}
                                            For Python functions with no classes, enter the file name without extension.
                                        </small>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div class="va-row">
                        <h5>Input Topics<small> (Add at least one)</small></h5>
                      </div>
                    <div class="va-row">
                      <div class="flex md3">
                          <div class="form-group with-icon-right" :class="{'has-error': errors.has('funcadd-intopic'), 'valid': isFormFieldValid('funcadd-intopic')}">
                                  <div class="input-group">
                                  <input v-model="inputTopicToAdd"
                                      id="funcadd-intopic"
                                      name="funcadd-intopic"
                                      v-validate="{ required: true, regex: /^[-=:.\w]*$/  }"
                                      data-vv-as="Input Topic"
                                      :placeholder="functionName ? functionName +'-input' : 'newFunction-input'"
                                      />
                                  <label class="control-label" for="funcadd-intopic" role="button">Topic</label><i class="bar"></i>
                                  <small v-show="errors.has('funcadd-intopic')"
                                                            class="help text-danger">
                                                        {{ errors.first('funcadd-intopic') }}
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
                                    name="funcadd-schema"
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
                        <div class="flex md4">
                            <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('funcadd-name'), 'valid': isFormFieldValid('funcadd-name')}"
                                 >
                                <div class="input-group">
                                    <input v-model="functionName"
                                            id="funcadd-name"
                                            name="funcadd-name"
                                            v-validate="{ required: true, regex: /^[-=:.\w]*$/  }"
                                            data-vv-as="Function Name"
                                            placeholder="newFunction"/>
                                            <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('functionName')"></i>
                                    <label class="control-label" for="funcadd-name" role="button">Function Name</label><i class="bar"></i>
                                    </div>
                            </div>
                            <vuestic-simple-select
                                label="Namespace"
                                v-model="functionNamespace"
                                name="funcadd-namespace"
                                :options="namespaceSelect"
                                option-key="id"
                                ref="nsSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>
                            <small v-show="namespacesConfig.list.length === 0" class="help text-danger">
                              No namespaces found for this tenant. You must create a namespace.
                            </small>
                            <vuestic-simple-select
                                label="Runtime"
                                v-model="runtime"
                                name="funcadd-runtime"
                                :options="runtimeSelect"
                                ref="rtSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>

                            

                        </div>
                        <div class="flex md4">
                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input v-model="outputTopic" id="funcadd-outtopic" name="funcadd-outtopic"
                                    :placeholder="functionName ? functionName +'-output' : 'newFunction-output'"/>
                                <label class="control-label" for="funcadd-outtopic" role="button">Output Topic</label><i class="bar"></i>
                                <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('outputTopic')"></i>
                                </div>
                            </div>
                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                <input v-model="logTopic" id="funcadd-logtopic" name="funcadd-logtopic"
                                    :placeholder="functionName ? functionName +'-logs' : 'newFunction-logs'"/>
                                <label class="control-label" for="funcadd-logtopic" role="button">Logs Topic</label><i class="bar"></i>
                                <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('logTopic')"></i>
                                </div>
                            </div>

                            <vuestic-checkbox v-if="autoAckEnabled" label="Auto Ack" v-model="autoAckCheck" />

                            <div v-if="false" class="form-group with-icon-right">
                                <div class="input-group">
                                <input v-model="topicPattern" id="funcadd-topicPattern" name="funcadd-topicPattern"
                                    />
                                <label class="control-label" for="funcadd-logtopic" role="button">Input Topic Pattern</label><i class="bar"></i>
                                <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('topicPattern')"></i>
                                </div>
                            </div>

                        </div>
                        <div class="flex md4">

                            <div class="md6">
                                <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('funcadd-parallel'), 'valid': isFormFieldValid('funcadd-parallel')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="parallelism"
                                                id="funcadd-parallel"
                                                name="funcadd-parallel"
                                                v-validate="'required|min_value:1'"
                                                data-vv-as="Instances"
                                            />
                                        <label class="control-label" for="funcadd-parallel" role="button">Instances</label><i class="bar"></i>
                                        <small v-show="errors.has('funcadd-parallel')"
                                                            class="help text-danger">
                                                        {{ errors.first('funcadd-parallel') }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="md6">
                                <vuestic-simple-select
                                    label="Processing Guarantee"
                                    v-model="guarantee"
                                    name="funcadd-guarantee"
                                    :options="guaranteeSelect"
                                    option-key="name"
                                    ref="guarSelect"
                                    :clearable="false"
                                    >
                                </vuestic-simple-select>
                            </div>

                            <div v-if="timeoutEnabled && guarantee.id === 'ATLEAST_ONCE'" class="md6">
                                <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('funcadd-timeout'), 'valid': isFormFieldValid('funcadd-timeout')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="timeoutMs"
                                                id="funcadd-timeout"
                                                name="funcadd-timeout"
                                                v-validate="'min_value:1000'"
                                                data-vv-as="Timeout"
                                                />
                                        <label class="control-label" for="funcadd-timeout" role="button">Time Out in Ms</label><i class="bar"></i>
                                        <small v-show="errors.has('funcadd-timeout')"
                                                            class="help text-danger">
                                                        {{ errors.first('funcadd-timeout') }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>


                     

                     <div class="va-row">
                         <div class="flex md12">
                             <vuestic-collapse ref="keyCollapse">
                                        <span slot="header">Click for Config Keys</span>
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
                         <div class="flex md12">
                             <vuestic-collapse ref="windowCollapse">
                                        <span slot="header">Click for Window Config</span>
                                        <div slot="body">
                                                <div class="va-row collapse-page__content">
                                                        <div class="flex md3">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="windowLengthCount" id="window-length" name="window-length"/>
                                                                    <label class="control-label" for="user-key" role="button">Window Length Count</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex md3">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="windowLengthDurationMs" id="window-duration" name="window-duration"/>
                                                                    <label class="control-label" for="user-value" role="button">Window Length Duration (ms)</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex md3">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="slidingIntervalCount" id="sliding-interval" name="sliding-interval"/>
                                                                    <label class="control-label" for="user-key" role="button">Sliding Interval Count</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex md3">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="slidingIntervalDurationMs" id="sliding-duration" name="sliding-duration"/>
                                                                    <label class="control-label" for="user-value" role="button">Sliding Interval Duration (ms)</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                        </div>
                            </vuestic-collapse>
                         </div>
                     </div>

                    <div v-if="showPreview">
                        <h5>Code Preview</h5>
                        <div class="form-group with-icon-right">
                            <pre v-highlightjs="pythonPreview"><code></code></pre>
                            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="pythonPreview"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                        </div>
                    </div>

                    <div class="va-row">
                        <div class="flex md3">
                            <button class="btn btn-secondary  btn-micro" @click="clearValues()">
                                Clear
                            </button>
                        </div>
                        <div class="flex md3">
                            <button :disabled="!currentFunctionId" class="btn btn-secondary  btn-micro" @click="goToFunctionDetail(currentFunctionId)">
                                Go To
                            </button>
                        </div>
                        <div class="flex md3">
                                <button :disabled="!currentFunctionId" class="btn btn-primary " @click="updateFunction()">
                                Update
                            </button>
                        </div>
                        <div class="flex md3">
                            <button :disabled="currentFunctionId" class="btn btn-primary " @click="createFunction()">
                                Add
                            </button>
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
import JSZip from 'jszip'

export default {
  name: 'FunctionCreate',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      functionName: '',
      functionNamespace: '',
      logTopic: '',
      className: '',
      outputTopic: '',
      inputTopicToAdd: '',
      inputTopicNamespace: '',
      inputTopicList: [],
      showSchemaSelect: false,
      topicPattern: '',
      parallelism: 1,
      cpuResource: '0.3',
      ramResource: '512000000 ',
      diskResource: '512000000 ',
      runtime: 'Java',
      file: '',
      userConfig: [],
      userKey: '',
      userValue: '',
      outputSchemaType: '',
      classListInFile: [],
      timeoutEnabled: false,
      autoAckEnabled: true,
      timeoutMs: 5000,
      disableCreate: false,
      maxFunctionNameLength: 20,
      disableUpdate: false,
      autoAckCheck: true,
      pythonPreview: 'import json',
      showPreview: false,
      guarantee: { id: 'ATLEAST_ONCE', name: 'At Least Once' },
      runtimeSelect: ['Java', 'Python', 'Go'],
      guaranteeSelect: [
        { id: 'ATLEAST_ONCE', name: 'At Least Once' },
        { id: 'ATMOST_ONCE', name: 'At Most Once' },
        { id: 'EFFECTIVELY_ONCE', name: 'Effectively Once' }
      ],
      functionData: {},
      windowLengthCount: '',
      windowLengthDurationMs: '',
      slidingIntervalCount: '',
      slidingIntervalDurationMs: '',
      schema: { id: 'NONE', name: 'None' },
    }
  },
  computed: {
    ...mapGetters([
      'functionsData',
      'sinksData',
      'sourcesData',
      'namespacesConfig',
      'activeCluster',
      'tenant',
      'apiBaseUrl',
      'adminToken',
      'featureFlags'
    ]),
    currentFunctionId () {
      if (this.functionName && this.functionNamespace) {
        const funcId = this.activeCluster + ':' + this.tenant + ':' + this.functionNamespace.id + ':' + this.functionName

        // Check this function exists
        if (this.functionsData.data[funcId]) {
          return funcId
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
      if (!this.functionNamespace || this.functionNamespace === '') {
        this.functionNamespace = options[0]
        this.inputTopicNamespace = options[0]

      }

      return options
    },

  },
  components: {
    Alert,
  },
  mounted () {
    // Turn off regular stats polling and enable function stats polling
    console.log('Stopping regular polling')

    this.$store.commit('setRunTimer', false)

    console.log('Starting function polling')

    this.$store.commit('setRunFunctionTimer', true)
    if (this.featureFlags.function) {
      this.$store.dispatch('updateAllFunctions')
    }
    // If an id is passed, load that function info
    if (this.$route.params.id) {
      this.loadFunction(this.$route.params.id)
    }

    // this.startAutoFunctionUpdate()
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable function stats polling
    console.log('Starting regular polling')

    this.$store.commit('setRunTimer', true)
    console.log('Stopping function polling')

    this.$store.commit('setRunFunctionTimer', false)

    // this.cancelAutoFunctionUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    clear (field) {
      this[field] = ''
    },
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        isValid = this.formFields[field].validated && this.formFields[field].valid
      }
      return isValid
    },
    async isFormValid () {
      await this.$validator.validateAll()
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },

    clearValues () {
      this.functionName = ''
      this.functionNamespace = ''
      this.inputTopic = ''
      this.logTopic = ''
      this.className = ''
      this.outputTopic = ''
      this.parallelism = 1
      this.cpuResource = '0.1'
      this.ramResource = '256000000 '
      this.diskResource = '512000000 '
      this.runtime = 'Java'
      this.file = ''
      this.userConfig = []
      this.outputSchemaType = ''
      this.classListInFile = []
      this.timeoutMs = 5000
      this.autoAckCheck = true
      this.pythonPreview = 'import json'
      this.showPreview = false
      this.windowLengthCount = ''
      this.windowLengthDurationMs = ''
      this.slidingIntervalCount = ''
      this.slidingIntervalDurationMs = ''
      // Clear the file loading widget
      this.$refs.file.value = ''
      this.guarantee = { id: 'ATLEAST_ONCE', name: 'At Least Once' }
      this.$validator.validateAll()
      this.inputTopicList = []

    },
    loadFunction (id) {
      console.log(id)

      if (!this.functionsData.data[id]) {
        return
      }
      const funcData = this.functionsData.data[id]
      console.log(funcData)

      const runtime = this.toTitleCase(funcData.runtime)
      var classname = funcData.className

      this.functionName = funcData.name
      this.functionNamespace = {
        id: funcData.namespace,
        description: funcData.namespace
      }

      this.guaranteeSelect.forEach((guar) => {
        if (guar.id === funcData.processingGuarantees) {
          this.guarantee = guar
        }
      })

      this.inputTopicList = []
      Object.keys(funcData.inputSpecs).forEach(key => {
        this.inputTopicList.push({
          key: key,
          schema: funcData.inputSpecs[key].schemaType
        })
      })

      const firstTopicParts = this.inputTopicList[0]['key'].split('/')

      this.inputTopicToAdd = firstTopicParts.slice(-1)[0]

      if (funcData.logTopic) {
        this.logTopic = funcData.logTopic.replace(/^.+\//, '')
      } else {
        this.logTopic = ''
      }
      this.className = classname

      // Need to strip off the tenant and namespace from the topic name
      if (funcData.output) {
        this.outputTopic = funcData.output.replace(/^.+\//, '')
      } else {
        this.outputTopic = ''
      }
      // Convert key data to table format

      const keyData = []
      // Get the namespace data if we have it
      Object.keys(funcData.userConfig).forEach(key => {
        keyData.push({
          key: key,
          value: funcData.userConfig[key]
        })
      })

      this.parallelism = funcData.parallelism
      this.cpuResource = funcData.resources.cpu
      this.ramResource = funcData.resources.ram
      this.diskResource = funcData.resources.disk
      this.runtime = runtime
      this.userConfig = keyData
      this.outputSchemaType = funcData.outputSchemaType
      this.classListInFile = []
      this.timeoutMs = funcData.timeoutMs
      this.autoAckCheck = funcData.autoAck
      if (funcData.windowConfig) {
        this.windowLengthCount = funcData.windowConfig.windowLengthCount
        this.windowLengthDurationMs = funcData.windowConfig.windowLengthDurationMs
        this.slidingIntervalCount = funcData.windowConfig.slidingIntervalCount
        this.slidingIntervalDurationMs = funcData.windowConfig.slidingIntervalDurationMs
      }
      // File is not known, so clear it
      this.file = ''
      this.$refs.file.value = ''
    },
    findClassNamesInPythonFile () {
      // See if we can find a class name
      const regex = /class\s+(.+)\(/gm
      var matches = []
      let m
      while ((m = regex.exec(this.pythonPreview)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          console.log(`Found match, group ${groupIndex}: ${match}`)
          if (groupIndex === 1) {
            matches.push(match)
          }
        })
      }
      console.log(matches)

      const fileNoExt = this.file.name.replace(/\.[^/.]+$/, '')

      if (matches.length > 0) {
        console.log('in here')

        this.className = fileNoExt + '.' + matches[0]
        this.classListInFile = []
        matches.forEach((match) => {
          this.classListInFile.push(fileNoExt + '.' + match)
        })
      } else {
        this.className = fileNoExt
        this.classListInFile = [fileNoExt]
      }

      console.log(`classname: ${this.className}`)
    },
    handleFileUpload () {
      this.pythonPreview = ''
      this.showPreview = false
      if (this.$refs.file.files[0]) {
        this.file = this.$refs.file.files[0]
        console.log(this.file)
      } else {
        return
      }

      // Use the file name without extension as function name
      // Kubernetes only allows lowercase names
      // Maximum length for a Kubernetes job is 55 chars, so we limit the function
      // name length
      this.functionName = this.file.name.replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .substring(0, this.maxFunctionNameLength)
      this.inputTopicToAdd = this.functionName + '-input'

      // this.outputTopic =this.functionName + '-output'
      // this.logTopic =this.functionName + '-logs'

      let reader = new FileReader()

      reader.addEventListener('load', function () {
        this.showPreview = true
        this.pythonPreview = reader.result

        if (this.runtime === 'Python') {
          this.findClassNamesInPythonFile()
        }
      }.bind(this), false)

      if (this.file) {
        if (this.file.type === 'text/x-python' || this.file.type === 'text/x-python-script') {
          this.runtime = 'Python'
          // We will read the file and the load callback will
          // set the preview and find classnames
          reader.readAsText(this.file)
        } else if (this.file.type === 'text/plain') {
          // If its a text file, it's probably Python, so we'll load the preview
          reader.readAsText(this.file)
          // If it ends in py we'll set the runtime, so it will scan for classnames
          // Note that Windows uses text/plain as content type for Python files
          if (this.file.name.includes('.py')) {
            this.runtime = 'Python'
          }
        } else if (this.file.type === 'application/zip') {
          // If its a zip file, let's see if there is a Python file in there
          var zip = new JSZip()

          zip.loadAsync(this.file /* = file blob */)
            .then(function (zip) {
              let pythonZipEntry = ''
              zip.forEach(function (relativePath, zipEntry) {
                console.log(zipEntry.name)

                if (zipEntry.name.includes('.py') && pythonZipEntry === '') {
                  console.log('Found a python file')
                  pythonZipEntry = zipEntry
                }
              })

              if (pythonZipEntry !== '') {
                // Set the runtime
                this.runtime = 'Python'
                // Load the file into preview
                this.showPreview = true
                pythonZipEntry.async('text').then((txt) => {
                  this.pythonPreview = txt
                })
                // Scan for classes
                this.findClassNamesInPythonFile()
              }
            }.bind(this), function () { console.log('Not a valid zip file') })
        } else if (this.file.type === 'application/x-java-archive') {
          this.runtime = 'Java'

          var zip = new JSZip()

          var classList = []

          zip.loadAsync(this.file /* = file blob */)
            .then(function (zip) {
              zip.forEach(function (relativePath, zipEntry) {
                if (zipEntry.name.includes('.class')) {
                  var extStripped = zipEntry.name.replace(/\.class/, '')
                  var className = extStripped.replace(/[\\\/]/g, '.')
                  classList.push(className)
                }
              })

              this.classListInFile = classList
              this.className = classList[0]
            }.bind(this), function () { console.log('Not a valid jar file') })

          console.log(this.classListInFile)
        } else {
          // Did not detect file type
          console.log('Did not detect file type')
        }
      }
    },
    goToFunctionDetail (funcId) {
      this.$router.push('/admin/functions/view/' + funcId)
      this.$store.dispatch('setActiveFunctionDetailTab', this.$t('functionDetail.tabs.overview'))
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
    async createFunction () {
      if (!this.isFormValid()) {
        return
      }

      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      this.disableCreate = true

      // Check that this action doesn't exceed max function instances

      const functionConfig = this.getFunctionConfig()

      const functionPath = `${this.tenant}/${this.functionNamespace.id}/${this.functionName}`

      try {
        const response = await ApiService.createFunction(this.activeCluster, functionPath, functionConfig, this.file, this.file.name)

        this.disableCreate = true

        // Clear the local file variable
        this.file = ''
        this.onSuccess('Function created')

        // // Trigger a refresh of all functions
        this.$store.dispatch('updateAllFunctions')

        // // Go to the function overview
        const funcId = this.activeCluster + ':' + functionPath.replace(/\//g, ':')
        this.goToFunctionDetail(funcId)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating function: ${this.functionName} in namespace ${this.functionNamespace.id}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
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
    getFunctionConfig () {
      // For Python, class name needs to be filename without extension plus the class if
      // there is a class provided. Otherwise it is just file without extension

      if (this.runtime === 'Dummy') {
        var fullClassName = ''
        if (this.className) {
          fullClassName = this.file.name.replace(/\.[^/.]+$/, '') + '.' + this.className
        } else {
          fullClassName = this.file.name.replace(/\.[^/.]+$/, '')
        }
      } else {
        fullClassName = this.className
      }

      let inputTopics = []
      let topicSchemaMap = {}
      this.inputTopicList.forEach(item => {
        inputTopics.push(item.key)
        if (item.schema) {
          topicSchemaMap[item.key] = item.schema
        }
      })

      var fullOutputTopic = this.outputTopic
      if (this.outputTopic) {
        fullOutputTopic = `${this.tenant}/${this.functionNamespace.id}/${this.outputTopic}`
      }

      var fullLogTopic = this.logTopic
      if (this.logTopic) {
        fullLogTopic = `${this.tenant}/${this.functionNamespace.id}/${this.logTopic}`
      }

      // Set user config keys in expected format
      const userConfigKeys = {}
      this.userConfig.forEach(item => {
        userConfigKeys[item.key] = item.value
      })

      const functionConfig = {
        autoAck: this.autoAckCheck,
        tenant: this.tenant,
        namespace: this.functionNamespace.id,
        name: this.functionName,
        className: fullClassName,
        inputs: inputTopics,
        output: fullOutputTopic,
        outputSchemaType: this.outputSchemaType,
        logTopic: fullLogTopic,
        userConfig: userConfigKeys,
        subName: this.functionName,
        parallelism: this.parallelism,
        processingGuarantees: this.guarantee.id,
        resources: {
          cpu: this.cpuResource,
          ram: this.ramResource,
          disk: this.diskResource
        }
      }

      if (this.runtime === 'Java') {
        functionConfig['jar'] = this.file.name
      } else if (this.runtime === 'Python') {
        functionConfig['py'] = this.file.name
      } else if (this.runtime === 'Go') {
        functionConfig['go'] = this.file.name
      }

      if (this.timeoutEnabled && this.guarantee.id === 'ATLEAST_ONCE') {
        // Python throws an exception if you pass it a timeout, so
        // won't do that for now
        if (this.runtime !== 'Python') {
          functionConfig['timeoutMs'] = this.timeoutMs
        }
      }

      if (this.windowLengthCount) {
        functionConfig['windowConfig'] = functionConfig['windowConfig'] || {}
        functionConfig['windowConfig']['windowLengthCount'] = this.windowLengthCount
      }

      if (this.windowLengthDurationMs) {
        functionConfig['windowConfig'] = functionConfig['windowConfig'] || {}
        functionConfig['windowConfig']['windowLengthDurationMs'] = this.windowLengthDurationMs
      }

      if (this.slidingIntervalCount) {
        functionConfig['windowConfig'] = functionConfig['windowConfig'] || {}
        functionConfig['windowConfig']['slidingIntervalCount'] = this.slidingIntervalCount
      }

      if (this.slidingIntervalDurationMs) {
        functionConfig['windowConfig'] = functionConfig['windowConfig'] || {}
        functionConfig['windowConfig']['slidingIntervalDurationMs'] = this.slidingIntervalDurationMs
      }

      if (this.topicPattern) {
      const fullInputTopic = `${this.tenant}/${this.functionNamespace.id}/${this.topicPattern}`
      }

      console.log(functionConfig)

      return functionConfig
    },
    async updateFunction () {
      console.log('updating function')

      if (!this.isFormValid()) {
        console.log('form is not valid')

        return
      }

      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      this.disableUpdate = true

      const functionConfig = this.getFunctionConfig()

      const functionPath = `${this.tenant}/${this.functionNamespace.id}/${this.functionName}`

      try {
        await ApiService.updateFunction(this.activeCluster, functionPath, functionConfig, this.file, this.file.name)

        // Clear the local file variable
        this.disableUpdate = false

        this.file = ''
        this.onSuccess('Function updated')

        // // Trigger a refresh of all functions
        this.$store.dispatch('updateAllFunctions')

        // // Go to the function overview
        const funcId = this.activeCluster + ':' + functionPath.replace(/\//g, ':')

        setTimeout(() => {
          // Wait a bit to let the data update
          this.goToFunctionDetail(funcId)
        }, 500)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating function: ${this.functionName} in namespace ${this.functionNamespace.id}. Reason: ${reason} (${statusCode})`
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
