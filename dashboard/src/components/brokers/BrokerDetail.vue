<template>
    <div class="broker-details" id="broker-details">
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
                        <div class="va-row" v-if="brokerLoadReport.dispatchThrottlingRatePerTopicInMsg">
                                <alert ref="alert" :errorText="errorText"></alert>
                                <div class="va-row">
                                    <div v-for="statKey in brokerLoadReportKeys" :key="statKey" class="flex md3">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, brokerLoadReport[statKey])" id="clear-input" name="clear-input"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" for="clear-input" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
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
import AjaxService from '@/services/AjaxService'

export default {
  name: 'BrokerDetails',
  mixins: [mixins],
  data () {
    return {
      errorText: 'Something went wrong',
      brokerLoadReport: {},
      // brokerLoadReportKeys: [
      //     'dispatchThrottlingRatePerTopicInMsg',
      // ],
    }
  },
  computed: {
    ...mapGetters([
      'isAdminUser'
    ]),
    brokerLoadReportKeys () {
      return Object.keys(this.brokerLoadReport)
    }
  },
  components: {
    Alert,
  },
  mounted () {
    // console.log('Mounted broker detail')
    // this.getData()
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
  }
}
</script>

<style>

</style>
