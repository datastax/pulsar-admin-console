<template>
    <div class="topic-schema">
      <vuestic-widget>
            <div
                class="flex sm6 lg6 xl3 justify--center">
                <button class="btn btn-primary btn-with-icon" @click="openUpdateSchemaModal()">
                  <div class="btn-with-icon-content">
                    <i class="ion-md-add ion"></i>
                    Schema
                  </div>
                </button>
              </div>
              <vuestic-modal ref="updateSchemaModal"
                        :okText="'modal.ok' | translate"
                        v-on:ok="updateSchema()"
                        v-on:cancel="formKeysToValidate={}"
                        :okDisabled="!isFormValid"
                        :cancelText="'modal.cancel' | translate">

              <div slot="title">Change Schema on Topic</div>

              <div>
                <div class="va-row">
                            <div class="flex md3">
                            <vuestic-simple-select
                                      label="Schema"
                                      v-model="newSchemaType"
                                      name="new-schema"
                                      :options="schemaSelect"
                                      option-key="name"
                                      ref="newSchemaSelect"
                                      :clearable="false"
                                      >
                            </vuestic-simple-select>
                          </div>
                  </div>

                <template v-if="newSchemaType.id === 'AVRO' || newSchemaType.id === 'JSON' || newSchemaType.id === 'Protobuf' || newSchemaType.id === 'KEY_VALUE'">
                  <h5>
                    Schema:
                  </h5>
                    <v-jsoneditor v-model="newSchema" :options="updateOptions" :plus="false" height="400px" @error="onError"></v-jsoneditor>
                </template>
                <p>Do you want to apply this schema to the topic?</p>
              </div>
          </vuestic-modal>
        </vuestic-widget>
        <div class="va-row">
            <div class="flex xs12 md12">
            <alert ref="alert" :errorText="errorText"></alert>
            <vuestic-modal ref="deleteSchemaModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="deleteSchema()"
                                            :cancelText="'modal.cancel' | translate">
                                <div slot="title">Delete Schema</div>
                                <div>
                                    Are you sure you want to delete the schema from this topic?
                                </div>
                    </vuestic-modal>
                    <vuestic-widget>
                        <div >
                          <div class="va-row">
                            <button v-if="hasSchema" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmDeleteSchema">
                              Delete
                            </button>
                            <button v-if="enableTest" class="btn btn-primary btn-micro btn-bottom-margin" @click="sendEmailTest">
                              Send Test Email
                            </button>
                          </div>
                          <div class="va-row">
                          <div class="flex md3">
                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                    <input :value="schemaType.name"
                                            id="schemaType"
                                            name="schemaType"
                                            class="has-value"
                                            readonly/>
                                    <label class="control-label" for="schemaType" role="button">schema</label><i class="bar"></i>
                                </div>
                            </div>
                          </div>
                          <div class="flex md3" v-if="schemaType.id !== 'NONE'">
                            <div class="form-group with-icon-right">
                                <div class="input-group">
                                    <input v-model="version"
                                            id="version"
                                            name="version"
                                            class="has-value"
                                            readonly/>
                                    <label class="control-label" for="version" role="button">Version</label><i class="bar"></i>
                                </div>
                            </div>
                          </div>
                          </div>
                          <div class="va-row" v-if="schemaType.id === 'AVRO' || schemaType.id === 'JSON' || schemaType.id === 'Protobuf' || schemaType.id === 'KEY_VALUE'">
                            <h5>Schema</h5>
                            <div class="flex md12">
                              <vue-json-pretty
                                :data="schema"
                                :showLine="true"
                                >
                              </vue-json-pretty>
                            </div>
                          </div>
                          <div class="va-row" v-if="schemaProperties">
                            <div class="flex md12">
                              <h5>Properties</h5>
                              <textarea :value="schemaProperties" :rows="schemaProperties.split(/\r\n|\r|\n/).length">
                              </textarea>
                            </div>
                          </div>
                          <div class="va-row" v-if="schema && schema.properties">
                            {{ schema.properties }}
                            <div class="flex md6">
                              <div class="table-responsive">
                            <table class="table table-striped first-td-padding table-header-active">
                            <thead>
                            <tr>
                                <td>Property</td>
                                <td>Value</td>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, name) in properties" :key="name">
                                    <td>
                                        {{ name }}
                                    </td>
                                    <td>
                                        {{ value }}
                                    </td>
                                </tr>
                            </tbody>
                            </table>
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
import ApiService from '@/services/ApiService'
import VueJsonPretty from 'vue-json-pretty'
import VJsoneditor from 'v-jsoneditor'

export default {
  name: 'TopicSchemaTab',
  mixins: [mixins],
  data () {
    return {
      isDeleted: '',
      errorText: 'Something went wrong',
      schema: '',
      schemaRaw: '',
      schemaProperties: '',
      schemaPolling: false,
      hasSchema: false,
      newSchema: '',
      properties: {},
      enableTest: false,
      viewOptions: {
        mode: 'preview'
      },
      updateOptions: {
        mode: 'code'
      },
      version: '',
      options: {},
      schemaSelect: [
        { id: 'NONE', name: 'None' },
        { id: 'AVRO', name: 'Avro' },
        { id: 'JSON', name: 'Json' },
        { id: 'KEY_VALUE', name: 'Key/Value' },
        { id: 'Protobuf', name: 'Protobuf' },
        { id: 'BOOLEAN', name: 'Boolean' },
        { id: 'INT8', name: '8-bit integer' },
        { id: 'INT16', name: '16-bit integer' },
        { id: 'INT32', name: '32-bit integer' },
        { id: 'INT64', name: '64-bit integer' },
        { id: 'FLOAT', name: 'Float' },
        { id: 'DOUBLE', name: 'Double' },
        { id: 'BYTES', name: 'Bytes' },
        { id: 'STRING', name: 'String' },
        { id: 'TIMESTAMP', name: 'Timestamp' },
        { id: 'DATE', name: 'Date' },
        { id: 'TIME', name: 'Time' },
      ],
      schemaType: { id: 'NONE', name: 'None' },
      newSchemaType: { id: 'AVRO', name: 'Avro' },

    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'activeTopicDetailTab'
    ]),

  },
  components: {
    Alert,
    VueJsonPretty,
    VJsoneditor
  },
  mounted () {
    this.getSchema()
    this.schemaPolling = true
    this.pollForSchema()
  },
  beforeDestroy () {
    this.schemaPolling = false
  },
  methods: {
    confirmDeleteSchema () {
      this.$refs.deleteSchemaModal.open()
    },
    onError () {
      console.log('error')
    },
    openUpdateSchemaModal () {
      this.newSchema = this.schema
      if (this.schemaType.id === 'NONE') {
        this.newSchemaType = { id: 'AVRO', name: 'Avro' }
      } else {
        this.newSchemaType = this.schemaType
      }
      this.$refs.updateSchemaModal.open()
    },
    sendEmailTest(){
        const emailInfo = {
          subject: `Send email test`,
          body: `This is a test of sending an email`
        }
        this.$store.dispatch('sendEmail', emailInfo)
        this.onSuccess('Email sent')

    },
    pollForSchema () {
      if (this.schemaPolling && this.activeTopicDetailTab === this.$t('topicDetail.tabs.schema')) {
        this.getSchema()
      }
      setTimeout(() => {
        this.pollForSchema()
      }, 5000)
    },
    isFormValid () {
      // return Object.keys(this.formFields).every(key => this.formFields[key].valid);
      return Object.keys(this.formKeysToValidate).every(key => this.formFields[key].valid)
    },
    stripEndQuotes (str) {
      return str.replace(/\\"/g, '"')
    },
    cleanResponse (response) {
      // Schema is in the payload
      if (response.data.data !== '') {
        this.schema = JSON.parse(response.data.data)
        this.schemaRaw = response.data.data
        this.schemaProperties = JSON.stringify(response.data.properties, null, 4)
      } else {
        this.schema = ''
        this.schemaRaw = ''
        this.schemaProperties = ''
      }
      this.schemaType = this.schemaSelect.find(o => o.id === response.data.type)
      this.version = response.data.version
      this.properties = response.data.properties
    },
    async getSchema () {
      if (!this.topicStats.data[this.$route.params.id]) {
        return
      }
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.getTopicSchema(cluster, topicPath)
        if (response.data) {
          // console.log(response)
          this.cleanResponse(response)
          this.hasSchema = true
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        if (statusCode === 404) {
          this.hasSchema = false
          this.schema = ''
          this.schemaRaw = ''
          this.schemaType = { id: 'NONE', name: 'None' }
        } else {
          console.log(`Retrieving schema: ${topicPath}. Reason: ${reason} (${statusCode})`)
        }
      }
    },
    async deleteSchema () {

      if (!this.topicStats.data[this.$route.params.id]) {
        this.errorText = `Topic no longer exists. Please refresh.`
        this.$refs.alert.showAlert()
        return
      }
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteTopicSchema(cluster, topicPath)

        // Do a get to make sure the schema is gone
        // await ApiService.getTopicSchema(cluster, topicPath)
        this.getSchema()
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting schema: ${topicPath}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async updateSchema () {
      if (!this.topicStats.data[this.$route.params.id]) {
        this.errorText = `Topic no longer exists. Please refresh.`
        this.$refs.alert.showAlert()
        return
      }
      let infoObject = this.topicStats.data[this.$route.params.id].info
      console.log(infoObject)
      let cluster = infoObject.cluster
      let topicPath = infoObject.path

      console.log(this.newSchema)
      console.log(JSON.stringify(this.newSchema))

      let schemaObj = {
        type: this.newSchemaType.id,
        schema: JSON.stringify(this.newSchema),
        properties: this.properties
      }
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.updateTopicSchema(cluster, topicPath, schemaObj)
        this.getSchema()
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating schema: ${topicPath}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    }
  }
}
</script>

<style scoped>
pre { background-color: white;}
</style>
