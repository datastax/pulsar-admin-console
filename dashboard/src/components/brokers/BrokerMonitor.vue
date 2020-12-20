<template>
    <div class="broker-monitor" id="broker-monitor">

      <broker-tabs class="tabs"
                    :names="tabNames">
        <div slot="Overview"
             class="flex justify--center">
          <div v-if="activeBrokerDetailTab='Overview'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Overview')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div v-if="activeBrokerDetailTab='Namespaces'" slot="Namespaces" class="flex justify--center">
          <div class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Namespaces')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Topics" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='Topics'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Topics')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Messaging" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='Messaging'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Messaging')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="BookKeeper" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='BookKeeper'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('BookKeeper')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="ZooKeeper" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='ZooKeeper'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('ZooKeeper')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Proxy" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='Proxy'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Proxy')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="JVM" class="flex justify--center">
          <div v-if="activeBrokerDetailTab='JVM'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('JVM')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
      </broker-tabs>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import BrokerTabs from './BrokerTabs.vue'

export default {
  name: 'BrokerMonitor',
  mixins: [mixins],
  data () {
    return {
      errorText: 'Something went wrong',
      tabNames: [
        'Overview',
        'Namespaces',
        'Topics',
        'Messaging',
        'BookKeeper',
        'ZooKeeper',
        'Proxy',
        'JVM'
      ],
      pathMap: {
        'Overview': 'XlS0CN-mk/pulsar-overview',
        'Namespaces': 'jRZR0aEWk/pulsar-namespace',
        'Topics': '3xEtii5ml/pulsar-topic',
        'BookKeeper': 'ormR0-PZz/pulsar-bookkeeper',
        'ZooKeeper': '16iR0-EZk/pulsar-zookeeper',
        'Proxy': 'IMCFzlbiz/pulsar-proxy',
        'JVM': 'tlig0-EZk/pulsar-jvm',
        'Messaging': 'sWPi0L-mk/pulsar-messaging'
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeBrokerDetailTab'
    ]),
  },
  components: {
    Alert,
    BrokerTabs
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    onLoad () {
    },
    url (dashboard) {
      let url = "http://localhost:3000"
      if (this.grafanaUrlOverride) {
        url = this.grafanaUrlOverride
      }
      url = url + '/d/' + this.pathMap[dashboard] + '?orgId=1&refresh=1m&from=now-1h'
      return url
    }
  }
}
</script>

<style>

#broker-monitor .iframe-wrapper {
  border: none;
  height: 1200px;
}
#broker-monitor .iframe-wrapper .vue-friendly-iframe {
  height: 100%;
  width: 100%;
}
#broker-monitor .iframe-wrapper .vue-friendly-iframe iframe {
  height: 100%;
  width: 100%;
}

</style>
