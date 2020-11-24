<template>
    <div class="sink-overview">
        <alert ref="alert" :errorText="errorText"></alert>
        <vuestic-modal :show.sync="showSinkModal" ref="deleteSinkModal"
                  :okText="'modal.confirm' | translate"
                  v-on:ok="deleteSink()"
                  :cancelText="'modal.cancel' | translate">
        <div slot="title">Delete Topic</div>
        <div>
            Are you sure you want to delete sink {{ sinksData.data[$route.params.id].name }}?
        </div>
        </vuestic-modal>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sinksData.data[$route.params.id]">
                    <div class="va-row">
                        <div class="flex md6">
                            <div v-for="statKey in wideCopyKeys" :key="statKey" class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="getHumanReadable(statKey, sinksData.data[$route.params.id][statKey])" :id="'sink-'+statKey" :name="'sink-'+statKey"
                                    class="has-value" placeholder="" readonly />
                                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="getHumanReadable(statKey, sinksData.data[$route.params.id][statKey])"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                                <label class="control-label" :for="'sink-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                </div>
                            </div>

                            <div class="va-row">
                                <div class="va-row">
                                    <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md6">
                                        <div  class="form-group with-icon-right">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, sinksData.data[$route.params.id][statKey])" :id="'sink-'+statKey" :name="'sink-'+statKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="'sink-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
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
                                            <div v-if="sinksData.status[$route.params.id]"  class="stats-number">
                                            {{ sinksData.status[$route.params.id].numInstances}}
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
                                            <div v-if="sinksData.status[$route.params.id]" class="stats-number">
                                            {{ sinksData.status[$route.params.id].numRunning}}
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
                                                                    <tr v-for="(value, key) in sinksData.data[$route.params.id].configs" :key="key">
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
                            
                        </div>
                    </div>

                    <div class="va-row">
                            <div class="flex md3">
                                <button  class="btn btn-primary" @click="updateUpdateNav($route.params.id)">
                                    Update
                                </button>
                            </div>
                            <div class="flex md3">
                                <button :disabled="isDeleted" class="btn btn-primary" @click="confirmDeleteSink()">Delete</button>
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
  name: 'SinkOverview',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      stateEnabled: false,
      showSinkModal: false,
      isDeleted: false,
      sinkStateKey: '',
      sinkStateValue: '',
      sinkStateVersion: '',
      sinkStateTypes: ['Number', 'String', 'Bytes'],
      sinkStateType: 'String',
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
      ],
      extraWideCopyKeys: [
        'output',
        'logTopic'
      ],
      narrowCopyKeys: [
        'parallelism',
        'timeoutMs',
        'autoAck',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'sinksData'
    ]),
    inputTopic () {
      let infoObject = this.sinksData.data[this.$route.params.id]

      const inputTopicObj = infoObject.inputSpecs

      return Object.keys(inputTopicObj)[0]
    },
    hasUserConfig () {
      if (!this.sinksData.data[this.$route.params.id].userConfig) {
        return false
      } else {
        return !lodash.isEmpty(this.sinksData.data[this.$route.params.id].userConfig)
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
    confirmDeleteSink () {
      this.$refs.deleteSinkModal.open()
    },
    cleanValue (key, value) {
      const lowerKey = key.toLowerCase()
      if (lowerKey.includes('token') || lowerKey.includes('password') || lowerKey.includes('secret')) {
        return value.replace(/./g, '*')
      }
      return value
    },
    updateUpdateNav (topic) {
      const dest = '/admin/sinks/add/' + topic
      console.log(`Got to dest: ${dest}`)

      this.$router.push(dest)
    },
    async deleteSink () {
      this.isDeleted = true
      let infoObject = this.sinksData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let sinkPath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteSink(cluster, sinkPath)

        this.onSuccess('Sink deleted')

        // Need to update master list of sinks
        this.$store.dispatch('getSinks')
        // Need to delete the  entry for the sink
        this.$store.dispatch('purgeSink', this.$route.params.id)
        // Redirect to the sink summary page
        this.$router.push('/admin/sinks/view')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting sink: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = false
      }
    },
  }
}
</script>

<style scoped>

</style>
