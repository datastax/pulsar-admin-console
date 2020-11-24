<template>
    <div class="cluster-details" id="cluster-details">
        <div class="va-row">
            <div class="flex xs12 md12">
            <div class="flex md12">
                <button class="btn btn-micro btn-right">
                <span
                    class="fa fa-refresh"
                    style="`font-size: 30px`"
                    aria-hidden="true"
                    @click="getData()"
                />
                </button>
            </div>

                <vuestic-widget headerText="Runtime Configuration">
                    <div class="flex md12">
                        <div class="va-row" v-if="clusterConfig.dispatchThrottlingRatePerTopicInMsg">
                                <alert ref="alert" :errorText="errorText"></alert>
                                <div class="va-row">
                                    <div v-for="statKey in clusterConfigKeys" :key="statKey" class="flex md3">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, clusterConfig[statKey])" :id="statKey" :name="statKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div v-else>
                          Loading...
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
import AjaxService from '@/services/AjaxService'

export default {
  name: 'ClusterDetails',
  mixins: [mixins],
  data () {
    return {
      errorText: 'Something went wrong',
      clusterConfig: {},
      // clusterConfigKeys: [
      //     'dispatchThrottlingRatePerTopicInMsg',
      // ],
    }
  },
  computed: {
    ...mapGetters([
      'isAdminUser'
    ]),
    clusterConfigKeys () {
      return Object.keys(this.clusterConfig)
    }
  },
  components: {
    Alert,
  },
  mounted () {
    this.getData()
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    onLoad () {

    },
    getData () {
      if (this.isAdminUser) {
        this.getClusterConfig()
      }
    },
    async getClusterConfig () {
      let cluster = this.$route.params.id

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await AjaxService.ajaxAction('get_cluster_running_config',
          {
            cluster: cluster,
          })

        if (response) {
          this.clusterConfig = response.data.data
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving cluster config: ${cluster}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    }
  }
}
</script>

<style>

</style>
