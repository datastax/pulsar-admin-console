<template>
    <div class="cluster-monitor" id="cluster-monitor">

      <cluster-tabs class="tabs" :names="tabNames">

      </cluster-tabs>
        <div class="flex justify--center">
          <div class="iframe-wrapper">
            <vue-friendly-iframe :src="url(activeClusterDetailTab)" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import ClusterTabs from './ClusterTabs.vue'

export default {
  name: 'ClusterMonitor',
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
        'Pulsar Monitor',
        'JVM'
      ],
      currentTab: 'Overview',
      pathMap: {
        'Overview': 'XlS0CN-mk/pulsar-overview',
        'Namespaces': 'jRZR0aEWk/pulsar-namespace',
        'Topics': '3xEtii5ml/pulsar-topic',
        'BookKeeper': 'ormR0-PZz/pulsar-bookkeeper',
        'ZooKeeper': '16iR0-EZk/pulsar-zookeeper',
        'Proxy': 'IMCFzlbiz/pulsar-proxy',
        'JVM': 'tlig0-EZk/pulsar-jvm',
        'Messaging': 'sWPi0L-mk/pulsar-messaging',
        'Pulsar Monitor': 'j55zWy2Mk/pulsar-pulsar-monitor'
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeClusterDetailTab',
      'activeCluster',
      'grafanaUrlOverride'
    ]),
  },
  components: {
    Alert,
    ClusterTabs
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    onLoad () {
    },
    url (dashboard) {
      let cluster = this.activeCluster
      let parts = cluster.split('-')
      let url = 'https://grafana.' + parts[0] + '.' + parts[1] + '.kafkaesque.io'
      if (this.grafanaUrlOverride) {
        url = this.grafanaUrlOverride
      }
      url = url + '/d/' + this.pathMap[dashboard] + '?orgId=1&refresh=1m&from=now-1h'
      console.log(url)
      return url
    }
  }
}
</script>

<style>

#cluster-monitor .iframe-wrapper {
  border: none;
  height: 1200px;
}
#cluster-monitor .iframe-wrapper .vue-friendly-iframe {
  height: 100%;
  width: 100%;
}
#cluster-monitor .iframe-wrapper .vue-friendly-iframe iframe {
  height: 100%;
  width: 100%;
}

</style>
