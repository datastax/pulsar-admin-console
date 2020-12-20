<template>
    <div class="source-create">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget headerText="Basics">
                    <div class="va-row">
                        <div class="flex md4">
                            <vuestic-simple-select
                                    label="Sources"
                                    v-model="sourceType"
                                    name="builtInSources"
                                    :options="builtInSources"
                                    option-key="name"
                                    ref="builtInSources"
                                    :clearable="false"
                                    >
                            </vuestic-simple-select>
                            <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('sourceadd-name'), 'valid': isFormFieldValid('sourceadd-name')}"
                                 >
                                <div class="input-group">
                                    <input v-model="sourceName"
                                            id="sourceadd-name"
                                            name="sourceadd-name"
                                            v-validate="{ required: true, regex: /^[a-zA-Z0-9_.-]+$/ }"
                                            data-vv-as="Source Name"
                                            placeholder="newSource"/>
                                            <i class="fa fa-times icon-right input-icon pointer"
                                                @click="clear('sourceName')"></i>
                                    <label class="control-label" for="sourceadd-name" role="button">Source Name</label><i class="bar"></i>
                                </div>
                            </div>
                             <vuestic-simple-select
                                label="Namespace"
                                v-model="sourceNamespace"
                                name="sourceadd-namespace"
                                :options="namespaceSelect"
                                option-key="id"
                                ref="nsSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>

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
                          <a target="_blank" :href="exampleLinks[sourceType.name]">Example Setup</a>
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
                                                v-validate="'required'"
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
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                v-validate="'in:true,false'"
                                                :name="name"/>
                                         <small v-show="errors.has(name)"
                                                            class="help text-danger">
                                                        {{ errors.first(name) }}
                                          </small>
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
                                      <template v-else-if="item.Required === 'false' && item.DefaultOverride !== undefined">
                                        <input   :placeholder="item.DefaultOverride"
                                                :id="name"
                                                :ref="name"
                                                v-model="item.Value"
                                                :name="name"/>
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

                        <div class="flex md3">
                          <div class="form-group with-icon-right"
                                 :class="{'has-error': errors.has('sourceadd-parallel'), 'valid': isFormFieldValid('sourceadd-parallel')}"
                                 >
                                    <div class="input-group">
                                        <input v-model="parallelism"
                                                id="sourceadd-parallel"
                                                name="sourceadd-parallel"
                                                v-validate="'required|min_value:1'"
                                                data-vv-as="Instances"
                                            />
                                        <label class="control-label" for="sourceadd-parallel" role="button">Instances</label><i class="bar"></i>
                                        <small v-show="errors.has('sourceadd-parallel')"
                                                            class="help text-danger">
                                                        {{ errors.first('sourceadd-parallel') }}
                                        </small>
                                    </div>
                                </div>
                        </div>
                        <div class="flex md3">
                          <vuestic-simple-select
                                    label="Processing Guarantee"
                                    v-model="guarantee"
                                    name="sourceadd-guarantee"
                                    :options="guaranteeSelect"
                                    option-key="name"
                                    ref="guarSelect"
                                    :clearable="false"
                                    >
                          </vuestic-simple-select>
                        </div>
                      </div>
                      <div class="va-row">
                        <h5>Output Topic<small>(Add only one)</small></h5>
                      </div>
                    <div class="va-row">
                      <div class="flex md3">
                          <div class="form-group with-icon-right" :class="{'has-error': errors.has('sourceadd-outtopic'), 'valid': isFormFieldValid('sourceadd-outtopic')}">
                                  <div class="input-group">
                                  <input v-model="outputTopicToAdd"
                                      id="sourceadd-outtopic"
                                      name="sourceadd-intopic"
                                      v-validate="{ required: true, regex: /^[a-zA-Z0-9_.-]+$/ }"
                                      data-vv-as="Output Topic"
                                      />
                                  <label class="control-label" for="sourceadd-intopic" role="button">Topic</label><i class="bar"></i>
                                  <small v-show="errors.has('sourceadd-intopic')"
                                                            class="help text-danger">
                                                        {{ errors.first('sourceadd-intopic') }}
                                        </small>
                                  </div>
                          </div>
                      </div>
                      <div class="flex md3">
                        <vuestic-simple-select
                                label="Namespace"
                                v-model="outputTopicNamespace"
                                name="output-namespace"
                                :options="namespaceSelect"
                                option-key="id"
                                ref="outputNsSelect"
                                :clearable="false"
                                >
                            </vuestic-simple-select>
                      </div>
                      <div v-if="showSchemaSelect === true" class="flex md3">
                          <vuestic-simple-select
                                    label="Schema"
                                    v-model="schema"
                                    name="sourceadd-schema"
                                    :options="schemaSelect"
                                    option-key="name"
                                    ref="schemaSelect"
                                    :clearable="false"
                                    >
                          </vuestic-simple-select>
                        </div>
                      <div class="flex md3">
                          <button :disabled="outputTopicList.length !== 0" class="btn btn-micro" @click="addOutputTopic()">Add Topic</button>
                      </div>
                      <div v-for="(item, index) in outputTopicList" :key="index" class="filters-page__tags">
                        <div>
                          <vuestic-tag
                            :name="item.schema ? `${item.key} (${item.schema})` : item.key"
                            removable
                            type="primary"
                            @remove="removeOutputTopic(item.key)"
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
                            <button :disabled="!currentSourceId" class="btn btn-secondary  btn-micro" @click="goToSourceDetail(currentSourceId)">
                                Go To
                            </button>
                        </div>
                        <div class="flex md3">
                                <button :disabled="!currentSourceId" class="btn btn-primary " @click="updateSource()">
                                Update
                            </button>
                        </div>
                        <div class="flex md3">
                            <button :disabled="currentSourceId || outputTopicList.length == 0" class="btn btn-primary " @click="createSource()">
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

export default {
  name: 'SourceCreate',
  mixins: [mixins],
  data () {
    return {
      configData: ConfigData,
      currentConfigData: {},
      errorText: '',
      sourceName: '',
      hasFormError: false,
      sourceNamespace: '',
      outputTopicNamespace: '',
      configValues: '',
      description: '',
      showSchemaSelect: false,
      sourceType: {
        name: 'Loading...',
        sourceType: '',
        description: ''
      },
      loadedSourceType: '',
      loadedSourceConfig: {},
      outputTopic: '',
      logTopic: '',
      className: '',
      exampleLinks: {
        'canal': 'http://pulsar.apache.org/docs/en/io-canal-source/#example',
        'debezium-mysql': 'http://pulsar.apache.org/docs/en/io-debezium-source/#example-of-mysql',
        'debezium-postgres': 'http://pulsar.apache.org/docs/en/io-debezium-source/#example-of-postgresql',
        'debezium-mongodb': 'http://pulsar.apache.org/docs/en/io-debezium-source/#example-of-mongodb',
        'kafka': 'http://pulsar.apache.org/docs/en/io-kafka-source/#example'
      },
      parallelism: 1,
      cpuResource: '0.3',
      ramResource: '512000000 ',
      diskResource: '512000000 ',
      runtime: 'Java',
      file: '',
      userConfig: [],
      userKey: '',
      userValue: '',
      outputTopicToAdd: '',
      outputTopicList: [],
      outputSchemaType: '',
      classListInFile: [],
      builtInSources: [],
      disableCreate: false,
      maxSourceNameLength: 20,
      disableUpdate: false,
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
      sourceData: {},
    }
  },
  computed: {
    ...mapGetters([
      'sourcesData',
      'sinksData',
      'functionsData',
      'namespacesConfig',
      'activeCluster',
      'tenant',
      'apiBaseUrl',
      'adminToken',
      'featureFlags',
      'clientToken'
    ]),
    currentSourceId () {
      if (this.sourceName && this.sourceNamespace) {
        const sourceId = this.activeCluster + ':' + this.tenant + ':' + this.sourceNamespace.id + ':' + this.sourceName

        // Check this source exists
        if (this.sourcesData.data[sourceId]) {
          return sourceId
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
      if (!this.sourceNamespace || this.sourceNamespace === '') {
        this.sourceNamespace = options[0]
        this.outputTopicNamespace = options[0]
      }
      return options
    },
  },
  components: {
    Alert,
  },
  mounted () {
    // Get the list of built-in sources
    console.log('Get built-in sources')
    this.getBuiltinSources()
    // Turn off regular stats polling and enable source stats polling
    console.log('Stopping regular polling')
    this.$store.commit('setRunTimer', false)

    console.log('Starting source polling')

    this.$store.commit('setRunSourceTimer', true)
    if (this.featureFlags.source) {
      this.$store.dispatch('updateAllSources')
    }
    // If an id is passed, load that source info
    if (this.$route.params.id) {
      this.loadSource(this.$route.params.id)
    }
    // this.startAutoSourceUpdate()
  },
  beforeDestroy () {
    // Turn on regular stats polling and disable source stats polling
    console.log('Starting regular polling')

    this.$store.commit('setRunTimer', true)
    console.log('Stopping source polling')

    this.$store.commit('setRunSourceTimer', false)

    // this.cancelAutoSourceUpdate()
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  watch: {
    sourceType: function (val) {
      if (val) {
        let configName = val.name
        this.className = val.sourceClass
        this.description = val.description
        this.sourceName = val.name + 'Source'
        this.outputTopic = this.sourceName + '-output'
        this.outputTopicToAdd = this.sourceName + '-output'
        this.currentConfigData = this.configData[configName]
        if (this.loadedSourceConfig) {
          console.log('Updating config based on loaded values')

          Object.keys(this.loadedSourceConfig).forEach(key => {
            console.log(key)
            if (this.currentConfigData[key]) {
              this.currentConfigData[key].Value = this.loadedSourceConfig[key]
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
    // updateConfigValue (name, value) {
    //   console.log(`Updating config value for ${name} to value ${value}`)
    //   this.currentConfigData[name].Value = value
    //   console.log(this.currentConfigData)
    // },
    loadSource (id) {
      console.log('Loading Source')

      console.log(`***${id}***`)
      console.log(this.sourcesData)
      console.log(this.sourcesData.data)
      Object.keys(this.sourcesData.data).forEach(key => {
        console.log(`***${key}***`)
      })

      if (!this.sourcesData.data[id]) {
        console.log('Did not find source data')

        return
      }
      const sourceData = this.sourcesData.data[id]

      this.sourceName = sourceData.name
      this.loadedSourceType = sourceData.archive.replace(/^.+\//, '')
      this.loadedSourceConfig = sourceData.configs

      console.log(sourceData.archive.replace(/^.+\//, ''))
      console.log(this.builtInSources)

      this.sourceNamespace = {
        id: sourceData.namespace,
        description: sourceData.namespace
      }
      this.className = sourceData.className

      this.guaranteeSelect.forEach((guar) => {
        if (guar.id === sourceData.processingGuarantees) {
          this.guarantee = guar
        }
      })

      this.outputTopicList = []
      this.outputTopicList.push({
        key: sourceData.topicName
      })

      this.parallelism = sourceData.parallelism
    },
    async getBuiltinSources () {
      try {
        const response = await ApiService.getBuiltinSources(this.activeCluster)
        if (response.data) {
          console.log(response.data)

          // Need to remove sources that can't run in the service
          this.builtInSources = []
          response.data.forEach((item) => {
            if (item.name !== 'file' &&
                item.name !== 'netty' &&
                item.name !== 'mongo' &&
                item.name !== 'kafka-connect-adaptor'
            ) {
              this.builtInSources.push(item)
            }
          })

          // If we've loads a sourceType, use that
          if (this.loadedSourceType) {
            this.sourceType = this.builtInSources.find(o => o.name === this.loadedSourceType)
            this.loadedSourceType = ''
            return
          }

          // If there is no sourceType set, default to the first on the list
          if (!this.sourceType || this.sourceType.name === '' || this.sourceType.name === 'Loading...') {
            this.sourceType = this.builtInSources[0]
          }
          console.log(this.configData)
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving builtin sources. Reason: ${reason} (${statusCode})`
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
    clearValues () {
      this.outputTopicList = []

      Object.keys(this.currentConfigData).forEach(key => {
        this.currentConfigData[key].Value = ''
        // this.$refs[key][0].value = ''
      })
      this.parallelism = 1
      this.guarantee = { id: 'ATLEAST_ONCE', name: 'At Least Once' }
    },
    goToSourceDetail (sourceId) {
      this.$router.push('/admin/sources/view/' + sourceId)
      this.$store.dispatch('setActiveSourceDetailTab', this.$t('sourceDetail.tabs.overview'))
    },
    addOutputTopic () {
      const topicPath = `${this.tenant}/${this.outputTopicNamespace.id}/${this.outputTopicToAdd}`

      if (this.schema.id !== 'NONE') {
        this.outputTopicList.push(
          {
            key: topicPath,
            schema: this.schema.id
          }
        )
      } else {
        this.outputTopicList.push(
          {
            key: topicPath
          }
        )
      }
      // console.log(this.schema.id);
      // if (this.schema.id !== 'NONE') {
      //   this.topicSchemaMap[topicPath] = this.schema.id
      // }
      // this.outputTopicToAdd = ''
    },
    removeOutputTopic (key) {
      this.outputTopicList.splice(this.outputTopicList.findIndex(item => item.key === key), 1)
      // delete this.topicSchemaMap[key]
    },
    async createSource () {
      const isValid = await (this.$validator.validateAll())
      if (!isValid) {
        this.hasFormError = true
        return
      }
      this.hasFormError = false

      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      this.disableCreate = true

      // Check that this action doesn't exceed max source instances

      const sourceConfig = this.getSourceConfig()

      const sourcePath = `${this.tenant}/${this.sourceNamespace.id}/${this.sourceName}`

      try {
        await ApiService.createSource(this.activeCluster, sourcePath, sourceConfig)

        this.disableCreate = true

        // Clear the local file variable
        this.file = ''
        this.onSuccess('Source created')

        // // Trigger a refresh of all sources
        this.$store.dispatch('updateAllSources')

        // // Go to the source overview
        const sourceId = this.activeCluster + ':' + sourcePath.replace(/\//g, ':')
        this.goToSourceDetail(sourceId)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating source: ${this.sourceName} in namespace ${this.sourceNamespace.id}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    getServiceUrl (clusterName, protocol, override) {
      if (override) {
        console.log('override: ' + override)
        const splitInfo = this.splitClusterName(clusterName)
        console.log(splitInfo)
        let url = override.replace('<cluster>', splitInfo.name)
        return url.replace('<cloud>', splitInfo.cloud)
      }
      return "pulsar://localhost:6650"
    },
    getSourceConfig () {
      let outputTopics = []
      let topicSchemaMap = {}
      this.outputTopicList.forEach(item => {
        outputTopics.push(item.key)
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
        // If the there is a default override, set it
        if (this.currentConfigData[key].DefaultOverride && this.currentConfigData[key].Value === undefined) {
          console.log("Setting default value for key " + key)
          userConfigKeys[key] = this.currentConfigData[key].DefaultOverride
        }
      })

      // For Debezium sources, adding Pulsar URL and token info
      if (this.sourceType.name.includes('debezium')) {
        userConfigKeys['database.history.pulsar.token'] = this.clientToken
        userConfigKeys['pulsar.auth.token'] = this.clientToken
        userConfigKeys['pulsar.service.url'] = this.getServiceUrl(this.activeCluster)
        userConfigKeys['database.history.pulsar.service.url'] = this.getServiceUrl(this.activeCluster)
      }

      const sourceConfig = {
        tenant: this.tenant,
        namespace: this.sourceNamespace.id,
        name: this.sourceName,
        topicName: outputTopics[0],
        configs: userConfigKeys,
        parallelism: this.parallelism,
        archive: 'builtin://' + this.sourceType.name,
        processingGuarantees: this.guarantee.id,
      }

      console.log(sourceConfig)

      return sourceConfig
    },
    async updateSource () {
      console.log('updating source')

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

      const sourceConfig = this.getSourceConfig()

      const sourcePath = `${this.tenant}/${this.sourceNamespace.id}/${this.sourceName}`

      try {
        await ApiService.updateSource(this.activeCluster, sourcePath, sourceConfig, this.file, this.file.name)

        // Clear the local file variable
        this.disableUpdate = false

        this.file = ''
        this.onSuccess('Source updated')

        // // Trigger a refresh of all sources
        this.$store.dispatch('updateAllSources')

        // // Go to the source overview
        const sourceId = this.activeCluster + ':' + sourcePath.replace(/\//g, ':')

        setTimeout(() => {
          // Wait a bit to let the data update
          this.goToSourceDetail(sourceId)
        }, 500)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating source: ${this.sourceName} in namespace ${this.sourceNamespace.id}. Reason: ${reason} (${statusCode})`
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
