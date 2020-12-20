<template>
    <div class="function-log">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                  <div class="va-row">
                    <div class="flex md4">
                      <button class="btn btn-micro" @click="getLogsBack()">Get Older Logs</button>
                    </div>
                    <!-- <button class="btn btn-micro" @click="getLogsForward()">Newer</button> -->
                    <div class="flex md4">
                      <button class="btn btn-micro" @click="clearLogs()">Clear</button>
                    </div>
                     <div class="flex md4">
                        <vuestic-simple-select
                        label="Instance"
                        v-model="currentInstance"
                        option-key="id"
                        :options="instanceSelect"
                        @input="changeInstance"
                        ref="instSelect"
                        :clearable="false"
                        />
                    </div>
                  </div>
            </div>
        </div>
        <div class="va-row" style="margin-top: 10px;">
          <pre v-highlightjs="logData" class="prewrap"><code></code></pre>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import PulsarClient from '../clients/PulsarClient'
import ApiService from '@/services/ApiService'
export default {
  name: 'functionLog',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      logData: '',
      forwardPosition: 0,
      backwardPosition: 0,
      currentInstance: {
        id: 0,
        description: 0
      },
      bytes: 10000,
      logsPolling: false,
    }
  },
  computed: {
    ...mapGetters([
      'functionsData',
      'activeCluster',
      'activeFunctionDetailTab'
    ]),
    instanceSelect () {
      let options = []
      // Get the instance data if we have it
      if (this.functionsData.status[this.$route.params.id]) {
        this.functionsData.status[this.$route.params.id].instances.forEach(key => {
          options.push({
            id: String(key.instanceId),
            description: String(key.instanceId)
          })
        })
      } else {
        options = [{
          id: '0',
          description: '0'
        }]
      }

      return options
    },
  },
  components: {
    Alert,
    PulsarClient
  },
  mounted () {
    this.getLogsForward()
    this.logsPolling = true
    this.pollForLogs()
  },
  beforeDestroy () {
    this.logsPolling = false
  },
  methods: {
    changeInstance () {
      console.log('Calling changeInstance')
      this.logData = ''
      this.forwardPosition = 0
      this.backwardPosition = 0
      this.getLogsForward()
    },
    pollForLogs () {
      if (this.logsPolling && this.activeFunctionDetailTab === this.$t('functionDetail.tabs.logs')) {
        this.getLogsForward()
      }
      setTimeout(() => {
        this.pollForLogs()
      }, 5000)
    },
    getBurnellUrl (protocol, override) {
      if (override) {
        console.log('override: ' + override)
        const splitInfo = this.splitClusterName(this.activeCluster)
        console.log(splitInfo)
        let url = override.replace('<cluster>', splitInfo.name)
        return url.replace('<cloud>', splitInfo.cloud)
      }
      if (!protocol) {
        protocol = 'https'
      }
      return "http://localhost:8964"
    },
    clearLogs () {
      this.logData = ''
      this.backwardPosition = this.forwardPosition
    },
    async getLogsBack () {
      this.isDeleted = true
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      try {
        const response = await ApiService.getFunctionLogs(cluster, functionPath, this.backwardPosition, 0, this.currentInstance.id)
        // console.log(response.data)
        if (response.status !== 204) {
          this.logData = response.data.Logs + this.logData
          this.backwardPosition = response.data.BackwardPosition
        }
        if (this.forwardPosition === 0 && response.data.ForwardPosition > 0) {
          this.forwardPosition = response.data.ForwardPosition
        }
        // console.log('Backward: ' + this.backwardPosition)
        // console.log('Forward: ' + this.forwardPosition)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Getting logs: ${name}. Reason: ${reason} (${statusCode})`
        console.log('ERROR: ' + this.errorText)
      }
    },
    async getLogsForward () {
      this.isDeleted = true
      let infoObject = this.functionsData.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let functionPath = infoObject.path
      try {
        const response = await ApiService.getFunctionLogs(cluster, functionPath, 0, this.forwardPosition, this.currentInstance.id)
        // console.log(response)
        // If at end of file, returns 204 no content
        if (response.status !== 204) {
          this.logData = this.logData + response.data.Logs
          this.forwardPosition = response.data.ForwardPosition
        }
        // On first call, initiate the positions
        if (this.backwardPosition === 0 && response.data.BackwardPosition > 0) {
          this.backwardPosition = response.data.BackwardPosition
        }
        // console.log('Backward: ' + this.backwardPosition)
        // console.log('Forward: ' + this.forwardPosition)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Getting logs: ${name}. Reason: ${reason} (${statusCode})`
        console.log('ERROR: ' + this.errorText)
      }
    }
  }
}
</script>
<style>
</style>
