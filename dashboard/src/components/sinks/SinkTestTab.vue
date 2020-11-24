<template>
    <div class="sink-test">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sinksData.data[$route.params.id]">
                    <pulsar-client :title="'Sink Test Client '"
                        :cluster="activeCluster"
                        :produceTopic="inputTopic"
                        :disableConsumer=true
                        :enableKey=true
                    ></pulsar-client>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import PulsarClient from '../clients/PulsarClient'

export default {
  name: 'sinkTest',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      isCurrentlySupported: false,
      inputSpecKeys: [
        'schemaType',
        'serdeClassName',
        'receiverQueueSize',
        'regexPattern'
      ],
      // inputSpecKeys: [],
      extraWideCopyKeys: [
      ],
      narrowCopyKeys: [
        'cleanupSubscription',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'sinksData',
      'activeCluster'
    ]),
    inputTopic () {
      const fullTopicName = Object.keys(this.sinksData.data[this.$route.params.id].inputSpecs)[0]
      return fullTopicName.replace(/^.+\//, '')
    }
  },
  components: {
    Alert,
    PulsarClient
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
