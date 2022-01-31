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
    <div class="httpclients-consumer">
        <h5>HTTP SSE Consumer</h5>
        <p>This sample creates a consumer on a topic and waits for the next message by listening HTTP SSE stream.</p>

        <div class="va-row">
            <div class="flex md9">
                <div class="va-row">
                    <div class="flex md3">
                        <vuestic-simple-select
                        label="Cluster"
                        v-model="currentCluster"
                        option-key="id"
                        :options="clusterSelect"
                        :clearable="clearable"
                        v-on:input="updateNsSelect()"
                        />
                    </div>
                    <div class="flex md3">
                        <vuestic-simple-select
                        label="Namespace"
                        v-model="currentNamespace"
                        option-key="id"
                        :options="namespaceSelect"
                        ref="nsSelect"
                        :clearable="clearable"
                        />
                    </div>

                    <div class="flex md3">
                        <div class="form-group with-icon-right"
                            :class="{'has-error': errors.has('currentTopic'), 'valid': isFormFieldValid('currentTopic')}">
                            <div class="input-group">
                                    <input id="topic-input"
                                    v-model="currentTopic"
                                    class="has-value"
                                    v-validate="'required|alpha_dash'"
                                    name="currentTopic"
                                    data-vv-as="Produce Topic"
                                    />
                                    <i
                                    class="fa fa-exclamation-triangle error-icon icon-right input-icon icon-medium"></i>
                                    <label class="control-label" for="simple-input">Topic</label><i class="bar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="flex md3">
                        <div class="form-group with-icon-right"
                            :class="{'has-error': errors.has('currentSubscription'), 'valid': isFormFieldValid('currentSubscription')}">
                            <div class="input-group">
                                    <input id="subscription-input"
                                    v-model="currentSubscription"
                                    class="has-value"
                                    v-validate="'required|alpha_dash'"
                                    name="currentSubscription"
                                    data-vv-as="Subscription"
                                    />
                                    <i
                                    class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                                    <label class="control-label" for="simple-input">Subscription</label><i class="bar"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="simpleConsumer"><code class="javascript"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="simpleConsumer"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'HttpClientsConsumer',
  data () {
    return {
      currentTopic: 'test-topic',
      currentSubscription: 'my-subscription',
      currentCluster: { id: this.cluster, description: this.cluster },
      currentNamespace: { id: this.namespace, description: this.namespace },
      clearable: false
    }
  },
  mixins: [mixins],
  methods: {
    updateNsSelect () {
      this.currentNamespace = ''

      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].name === 'local-' + this.currentCluster.id) {
          this.$refs.nsSelect.selectOption({ id: 'local-' + this.currentCluster.id, description: 'local-' + this.currentCluster.id })
        }
      })
    },
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        isValid = this.formFields[field].validated && this.formFields[field].valid
      }
      return isValid
    },
  },
  props: {
    cluster: {
      type: String,
      default: 'useast1-gcp',
    },
    namespace: {
      type: String,
      default: 'worldwide',
    },
  },
  computed: {
    ...mapGetters([
      'apiVersion',
      'activeCluster',
      'clientToken',
      'allowedClusters',
      'tenant',
      'namespacesConfig',
      'clusterInfo'
    ]),
    clusterSelect () {
      const options = []

      this.allowedClusters.forEach(cluster => {
        options.push({
          id: cluster,
          description: cluster
        })
      })

      return options
    },
    namespaceSelect () {
      const options = []
      // Get the namespace data if we have it
      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].cluster === this.currentCluster.id) {
          options.push({
            id: this.namespacesConfig.data[key].name,
            description: this.namespacesConfig.data[key].name
          })
        }
      })

      return options
    },
    serviceUrl() {
        if (this.clusterInfo.info[this.currentCluster.id] && this.clusterInfo.info[this.currentCluster.id].host_override_http) {
            return this.clusterInfo.info[this.currentCluster.id].host_override_http
        }
        return "pulsar://localhost:6650"
    },
    serviceFqdn () {
      const urlObject = new URL(this.serviceUrl)
      return urlObject.hostname
    },
    servicePort () {
      const urlObject = new URL(this.serviceUrl)
      return urlObject.port
    },
    serviceScheme () {
      const urlObject = new URL(this.serviceUrl)
      return urlObject.protocol.replace(':','')
    },
    simpleConsumer () {
      return `const ${this.serviceScheme} = require('${this.serviceScheme}');

const options = {
  'hostname': '${this.serviceFqdn}',
  'port': ${this.servicePort},
  'path': '/v2/sse/p/${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}?SubscriptionName=${this.currentSubscription}&SubscriptionType=exclusive',
  'headers': {
    'Authorization': 'Bearer ${this.clientToken}',
    'Accept': 'text/event-stream'
  },
}

${this.serviceScheme}.get(options, (response) => {

    var result = ''
    response.on('data', function (chunk) {
        console.log(chunk.toString())
    });

    response.on('error', function(err) {
        console.error(err)
    });

    response.on('end', function () {
        console.log('end');
    });

});
`
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
