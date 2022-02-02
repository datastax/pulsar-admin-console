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
    <div class="ws-python-producer">
        <h5>Simple Producer</h5>
        <p>This sample creates a producer on a topic, sends a message, then closes the producer.</p>

        <div class="va-row">
            <div class="flex md9">
                <div class="va-row">
                    <div class="flex md4">
                        <vuestic-simple-select
                        label="Cluster"
                        v-model="currentCluster"
                        option-key="id"
                        :options="clusterSelect"
                        :clearable="clearable"
                        v-on:input="updateNsSelect()"
                        />
                    </div>
                    <div class="flex md4">
                        <vuestic-simple-select
                        label="Namespace"
                        v-model="currentNamespace"
                        option-key="id"
                        :options="namespaceSelect"
                        ref="nsSelect"
                        :clearable="clearable"
                        />
                    </div>
                
                    <div class="flex md4">
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
                </div>

            </div>
        </div>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="simpleProducer"><code class="ws-python"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="simpleProducer"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

        
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from '@/services/mixins'


    export default {
        name: "WsPythonProducer",
        data() {
            return {
                currentCluster: { id: this.cluster, description: this.cluster },
                currentNamespace: { id: this.namespace, description: this.namespace },
                currentTopic: "test-topic",
                clearable: false
            }
        },
        mixins: [mixins],
        methods: {
            updateNsSelect(){
                this.currentNamespace=''

                Object.keys(this.namespacesConfig.data).forEach(key => {
                    if (this.namespacesConfig.data[key].name === 'local-'+this.currentCluster.id) {
                        this.$refs.nsSelect.selectOption({ id: 'local-'+this.currentCluster.id, description: 'local-'+this.currentCluster.id })
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
            clusterSelect() {

                const options = []

                this.allowedClusters.forEach(cluster => {
                    options.push({
                        id: cluster,
                        description: cluster
                    })
                });

                return options


            },
            namespaceSelect() {

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
                if (this.clusterInfo.info[this.currentCluster.id] && this.clusterInfo.info[this.currentCluster.id].host_override_ws) {
                    return this.clusterInfo.info[this.currentCluster.id].host_override_ws
                }
                return "ws://localhost:8080"
            },
            simpleProducer(){
                return `import websocket, base64, json

token='${this.clientToken}'

authHeader = 'Bearer ' + token

TOPIC = '${this.serviceUrl}/ws/v2/producer/persistent/${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}'

ws = websocket.create_connection(TOPIC, header={"Authorization": authHeader})

message = 'Hello World'
encodedBytes = base64.b64encode(message.encode("utf-8"))
encodedStr = str(encodedBytes, "utf-8")
# Send one message as JSON
ws.send(json.dumps({
    'payload' : encodedStr,
    'properties': {
        'key1' : 'value1',
        'key2' : 'value2'
    },
    'context' : 5
}))

response =  json.loads(ws.recv())
if response['result'] == 'ok':
    print ('Message published successfully')
else:
    print ('Failed to publish message:', response)
ws.close()
`
            },
        },

    }
</script>


<style lang="scss" scoped>

</style>