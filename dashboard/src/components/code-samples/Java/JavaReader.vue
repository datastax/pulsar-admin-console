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
    <div class="java-reader">
        <h5>Simple Reader</h5>
        <p>This sample creates a reader on a topic and reads the earliest or latest message, then closes the reader.</p>

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
                                    v-validate="namedEntityValidationRegex"
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
                        <vuestic-simple-select
                        label="Position"
                        v-model="currentPosition"
                        option-key="description"
                        :options="positionSelect"
                        ref="posSelect"
                        :clearable="clearable"
                        />
                    </div>
                </div>

            </div>
        </div>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="simpleReader"><code class="java"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="simpleReader"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'JavaReader',
  data () {
    return {
      currentTopic: 'test-topic',
      currentSubscription: 'my-subscription',
      currentCluster: { id: this.cluster, description: this.cluster },
      currentNamespace: { id: this.namespace, description: this.namespace },
      clearable: false,
      currentPosition: { id: 'earliest', description: 'Earliest' },
      positionSelect: [
        {
          id: 'earliest',
          description: 'Earliest'
        },
        {
          id: 'latest',
          description: 'Latest'
        }
      ]
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
      'allowedClusters',
      'tenant',
      'clientToken',
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
        if (this.clusterInfo.info[this.currentCluster.id] && this.clusterInfo.info[this.currentCluster.id].host_override_pulsar) {
            return this.clusterInfo.info[this.currentCluster.id].host_override_pulsar
        }
        return "pulsar://localhost:6650"
    },
    simpleReader () {
      return `import org.apache.pulsar.client.api.*;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class simpleReader {

    private static final String SERVICE_URL = "${this.serviceUrl}";

    public static void main(String[] args) throws IOException {

        // Create client object
        PulsarClient client = PulsarClient.builder()
                .serviceUrl(SERVICE_URL)
                .authentication(
                    AuthenticationFactory.token("${this.clientToken}")
                )
                .build();

        // Create a reader on a topic starting at the earliest retained message
        // No subscription is necessary. Depending on retention policy, the
        // earliest message may be days old
        Reader<byte[]> reader = client.newReader()
                .topic("${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}")
                .startMessageId(MessageId.${this.currentPosition.id})
                .create();

        boolean receivedMsg = false;
        // Loop until a message is received
        do {
            // Block for up to 1 second for a message
            Message msg = reader.readNext(1, TimeUnit.SECONDS);

            if(msg != null){
                System.out.printf("Message received: %s%n",  new String(msg.getData()));
                
                receivedMsg = true;
            }

        } while (!receivedMsg);

        //Close the reader
        reader.close();

        // Close the client
        client.close();

    }
}`
    },
  },

}
</script>

<style lang="scss" scoped>

</style>
