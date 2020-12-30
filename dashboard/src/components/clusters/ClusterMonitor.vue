<!--
  Copyright 2021 DataStax, Inc. 
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
 -->

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
      let url = "http://localhost:3000"
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
