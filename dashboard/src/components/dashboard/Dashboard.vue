<template>
  <div class="dashboard">

    <div class="va-row">
      <div class="flex md6 xs12">
        <vuestic-widget
          headerText="Getting Started"
        >
        <p>Kesque is powered by Apache Pulsar. You use Pulsar clients to send and receive messages. All connections are encrypted.</p>
        <p>When connecting you need to provide the connect token for your account. You can get the token by going to <router-link to="credentials">Credentials</router-link>.</p>

        <p v-if="this.clientsDisabled === 'false'">To try out your service right now, use our built-in <router-link to="clients">WebSocket test clients</router-link>.</p>

        <p>To see our interactive code samples, go to <router-link to="code/java">Code Samples</router-link>. </p>

          <p>To see the available namespaces, go to <router-link to="namespaces">Namespaces</router-link>. Messages published to namespaces, such as worldwide are automatically replicated to all cluster.</p>

          <p>Topics are <span class="vue-highlighted-text">automatically created</span> when you first try to publish or subscribe. To manually create a topic or to create a partitioned topic, go to <router-link to="topics">Topics</router-link>.</p>

          <p>  The first part of a full topic name is your tenant name, followed by the namespace, and then the topic name.</p>

          <p>Your tenant name is:
          <ul class="vue-unordered">
            <li class="no-padding">
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ tenant }}
                </div>
                <i class="fa fa-clipboard icon-table pointer icon-right input-icon" v-clipboard:copy="tenant"
                        v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
              </div>

            </li>
          </ul>
          </p>

        <p>Here is an example of a topic using its full name:
          <ul  class="vue-unordered">
            <li  class="no-padding">
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ tenant }}/namespace/my-topic
                </div>
              </div>

            </li>
          </ul>

        </p>

        <p>
            To see detailed information about your topics,
            got to <router-link to="topics">Topics</router-link>.

        </p>

        <p v-if="runningEnv ==='web'">
          Kesque operates in multiple locations around the world. To see details on your available clusters, use <router-link to="clusters">Clusters</router-link> in the menu.
          </p>

        </vuestic-widget>
      </div>

      <div class="flex md6 xs12">
        <vuestic-widget
          v-if="runningEnv !== 'k8s'"
          class="dashboard-map__widget"
          headerText="Cluster Locations"
        >
        <div style="display:none;">
          {{ clusterInfo }}
        </div>
          <bubble-map v-if="clusterInfo.data.length > 0" v-bind:map-data="clusterInfo"/>
        </vuestic-widget>

        <vuestic-widget
          headerText="Connecting"
        >

          <p>
            To connect using the Pulsar binary protocol, use the following URLs:
          </p>
          <ul  class="vue-unordered">
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster"  class="no-padding">
             <div class="form-group with-icon-right list-item">
               <div class="copy-text">
                 {{ getClusterUrl(allowedCluster, 'pulsar') }}
               </div>
                  <i class="fa fa-clipboard pointer icon-right input-icon" v-clipboard:copy="getClusterUrl(allowedCluster, 'pulsar')"
                        v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
             </div>
            </li>
          </ul>
          <p>To connect using the WebSocket API, use the following URLs:</p>
          <ul  class="vue-unordered">
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster"  class="no-padding">
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ getClusterUrl(allowedCluster, 'ws') }}
                </div>
                <i class="fa fa-clipboard pointer icon-right input-icon" v-clipboard:copy="getClusterUrl(allowedCluster, 'ws')"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                      </i>
              </div>
            </li>
          </ul>
          <p>To connect using HTTP, use the following URLs:</p>
          <ul  class="vue-unordered">
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster"  class="no-padding">
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ getClusterUrl(allowedCluster, 'http') }}
                </div>
                <i class="fa fa-clipboard pointer icon-right input-icon" v-clipboard:copy="getClusterUrl(allowedCluster, 'http')"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                      </i>
              </div>
            </li>
          </ul>
        </vuestic-widget>

      </div>

    </div>

  </div>
</template>

<script>
import SummaryInfoWidgets from './SummaryInfoWidgets'
import BubbleMap from './BubbleMap'
import BubbleMapData from 'data/maps/ClusterData'
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'dashboard',
  data () {
    return {
      bubbleMapData: BubbleMapData,
    }
  },
  mixins: [mixins],
  components: {
    SummaryInfoWidgets,
    BubbleMap,
  },
  computed: {
    ...mapGetters([
      'activeCluster',
      'allowedClusters',
      'tenant',
      'clusterInfo',
      'runningEnv',
      'clientsDisabled'
    ]),
  },
  mounted () {
    this.$store.dispatch('getClusterInfo')

    // Turn off stats polling
    this.$store.commit('setRunTimer', false)
    console.log('Stopping regular polling')
  },
  beforeDestroy () {
    // Turn on stats polling
    this.$store.commit('setRunTimer', true)
    console.log('Starting regular polling')

    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    getClusterUrl (cluster, type) {
      // console.log("clusterINfo", this.clusterInfo);

      if (type === 'pulsar') {
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_pulsar) {
            return this.clusterInfo.info[cluster].host_override_pulsar
        }
        return "pulsar+ssl://"+cluster.replace(/-/g,".")+".kafkaesque.io:6651"
        
      } else if (type === 'ws'){
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_ws) {
            return this.clusterInfo.info[cluster].host_override_ws
        }
        return "wss://"+cluster.replace(/-/g,".")+".kafkaesque.io:8001"

      } else if (type === 'http') {
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_http) {
            return this.clusterInfo.info[cluster].host_override_http
        }
        return "https://"+cluster.replace(/-/g,".")+".kafkaesque.io:8085"
      }

    },

  },
}

</script>
<style lang="scss">
.dashboard-map {
  &__widget {
    height: 35vh;
    .vuestic-widget-body {
      height: 30vh;
    }
  }
}
.centered {
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -200px;
}

.outer-div
{
     padding: 30px;
}
.inner-div
{
     margin: auto;
     width: 200px;
     height: 200px;
     padding-top: 200px;
}
.center-div p
{
     position: relative;
     top: 50%;
     transform: perspective(1px) translateY(-50%);
}
div {
  .copy-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    max-width: 85%;
    position: absolute;
    top: 50%;

  }
  .copy-text:hover {
    overflow: visible;
  }

}
.dashboard {
  .no-padding {
        padding-bottom: 0;
        padding-left: 0;
  }
  div {
    .list-item {
      margin-bottom: 0;
      display: inline-block;
      width: 100%;
      position: relative;
    }
  }
}

</style>
