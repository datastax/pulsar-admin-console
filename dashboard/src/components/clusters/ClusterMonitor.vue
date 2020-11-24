<template>
    <div class="cluster-monitor" id="cluster-monitor">

      <cluster-tabs class="tabs"
                    :names="tabNames">
        <div slot="Overview"
             class="flex justify--center">
          <div v-if="activeClusterDetailTab='Overview'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Overview')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div v-if="activeClusterDetailTab='Namespaces'" slot="Namespaces" class="flex justify--center">
          <div class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Namespaces')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Topics" class="flex justify--center">
          <div v-if="activeClusterDetailTab='Topics'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Topics')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Messaging" class="flex justify--center">
          <div v-if="activeClusterDetailTab='Messaging'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Messaging')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="BookKeeper" class="flex justify--center">
          <div v-if="activeClusterDetailTab='BookKeeper'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('BookKeeper')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="ZooKeeper" class="flex justify--center">
          <div v-if="activeClusterDetailTab='ZooKeeper'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('ZooKeeper')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="Proxy" class="flex justify--center">
          <div v-if="activeClusterDetailTab='Proxy'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('Proxy')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
        <div slot="JVM" class="flex justify--center">
          <div v-if="activeClusterDetailTab='JVM'" class="iframe-wrapper">
              <vue-friendly-iframe :src="url('JVM')" @load="onLoad"></vue-friendly-iframe>
          </div>
        </div>
      </cluster-tabs>

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
      'activeClusterDetailTab'
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
      let cluster = this.$route.params.id
      let parts = cluster.split('-')
      let url = 'https://grafana.' + parts[0] + '.' + parts[1] + '.kafkaesque.io'
      url = url + '/d/' + this.pathMap[dashboard] + '?orgId=1&refresh=1m&from=now-1h'
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
