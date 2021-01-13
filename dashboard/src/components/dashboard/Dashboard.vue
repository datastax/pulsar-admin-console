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
  <div class="dashboard">

    <div class="va-row">
      <div class="flex md6 xs12">
        <vuestic-widget
          headerText="Getting Started"
        >
        <p>You use Pulsar clients to send and receive messages.</p>
        <p>When connecting you may need to provide the connect token for your account. You can get the token by going to <router-link to="credentials">Credentials</router-link>.</p>

        <p v-if="this.clientsDisabled === 'false'">To try out your service right now, use our built-in <router-link to="clients">WebSocket test clients</router-link>.</p>

        <p>To see interactive code samples, go to <router-link to="code/java">Code Samples</router-link>. </p>

          <p>To see the available namespaces, go to <router-link to="namespaces">Namespaces</router-link>. Messages published to namespaces, such as worldwide are automatically replicated to all cluster.</p>

          <p>Topics are <span class="vue-highlighted-text">automatically created</span> (by default) when you first try to publish or subscribe. To manually create a topic or to create a partitioned topic, go to <router-link to="topics">Topics</router-link>.</p>

          <p> The first part of a full topic name is your tenant name, followed by the namespace, and then the topic name.</p>


        <p>Here is an example of a topic using its full name:
          <ul  class="vue-unordered">
            <li>
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ tenant }}/namespace/my-topic
                </div>
              </div>

            </li>
          </ul>

        </p>

        <p>You can select your current tenant using the drop-down at the top right. To create a new tenant, go to <router-link to="clusters">Tenants</router-link>.</p>

        <p>
            To see detailed information about your topics,
            got to <router-link to="topics">Topics</router-link>.

        </p>



        </vuestic-widget>
      </div>

      <div class="flex md6 xs12">
 
        <vuestic-widget
          headerText="Connecting Clients"
        >

          <p>
            To connect using the Pulsar binary protocol, use the following URLs:
          </p>
          <ul  class="vue-unordered">
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster">
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
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster">
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
          <template v-if="clusterInfo.info[activeCluster] && clusterInfo.info[activeCluster].host_override_http">
            <p>To connect using HTTP, use the following URLs:</p>
            <ul  class="vue-unordered">
              <li v-for="allowedCluster in allowedClusters" :key="allowedCluster">
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
          </template>
        </vuestic-widget>
          <vuestic-widget
          headerText="Admin API"
        >
          <p>To connect to the admin API, use the following URLs:</p>
          <ul  class="vue-unordered">
            <li v-for="allowedCluster in allowedClusters" :key="allowedCluster">
              <div class="form-group with-icon-right list-item">
                <div class="copy-text">
                  {{ getClusterUrl(allowedCluster, 'admin') }}
                </div>
                <i class="fa fa-clipboard pointer icon-right input-icon" v-clipboard:copy="getClusterUrl(allowedCluster, 'admin')"
                      v-clipboard:success="onCopy" v-clipboard:error="onError">
                      </i>
              </div>
            </li>
          </ul>
          <p>For example, you can list all the tenants like this:</p>

          <div class="form-group with-icon-right">
            <pre v-highlightjs="simpleAdminCommand"><code class="bash"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="simpleAdminCommand"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
          </div>

          <p>Or if you have authentication enabled, like this: </p>
          <div class="form-group with-icon-right">
            <pre v-highlightjs="adminCommandWithAuth"><code class="bash"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="adminCommandWithAuth"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
          </div>

        <p>You can get token from <router-link to="credentials">Credentials</router-link>. 
        </p><p>Alternatively, you can save the URL authentication parameters in your <span class="vue-highlighted-text">client.conf</span> file.</p>
        </vuestic-widget>

      </div>

    </div>

  </div>
</template>

<script>
import SummaryInfoWidgets from './SummaryInfoWidgets'
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'dashboard',
  data () {
    return {
    }
  },
  mixins: [mixins],
  components: {
    SummaryInfoWidgets,
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
    simpleAdminCommand() {
      return 'pulsar-admin --admin-url ' + this.getClusterUrl(this.allowedClusters[0], 'admin')
    },
    adminCommandWithAuth() {
      return 'pulsar-admin --admin-url ' + this.getClusterUrl(this.allowedClusters[0], 'admin') + ' --auth-plugin org.apache.pulsar.client.impl.auth.AuthenticationToken ----auth-params file:///token.jwt'

    }
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
    getLocation(href) {
      var match = href.match(/^(.+\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
      return match && {
          href: href,
          protocol: match[1],
          host: match[2],
          hostname: match[3],
          port: match[4],
          pathname: match[5],
          search: match[6],
          hash: match[7]
        }
    },
    getClusterUrl (cluster, type) {
      // console.log("clusterINfo", this.clusterInfo);

      if (type === 'pulsar') {
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_pulsar) {
            return this.clusterInfo.info[cluster].host_override_pulsar
        }
        return "pulsar://localhost:6650"
        
      } else if (type === 'ws'){
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_ws) {
            return this.clusterInfo.info[cluster].host_override_ws
        }
        return "ws://localshost:8080"

      } else if (type === 'http') {
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_http) {
            return this.clusterInfo.info[cluster].host_override_http
        }
        return "http://localhost:8085"

      } else if (type === 'admin') {
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_admin) {
            return this.clusterInfo.info[cluster].host_override_admin
        }
        // Come up with a reasonable default
        let adminUrl = "http://localhost:8080"
        // If a pulsar override is given, assume admin API is similarly formatted
        if (this.clusterInfo.info[cluster] && this.clusterInfo.info[cluster].host_override_pulsar) {

          // const url = new URL(this.clusterInfo.info[cluster].host_override_pulsar)
          const url = this.getLocation(this.clusterInfo.info[cluster].host_override_pulsar)
          console.log(url)

          let proto = 'http'
          let port  = '8080'
          if (url.protocol.includes('ssl') ) {
            proto = 'https'
            port = '8443'
          }

          adminUrl = proto + '://' + url.hostname + ':' + port

        }

        return adminUrl
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
