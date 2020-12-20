<template>
    <div class="ws-python-consumer">
        <h5>Simple Consumer</h5>
        <p>This sample creates a consumer on a topic, waits for a message, acknowledges it, then closes the consumer.</p>

        <div class="va-row">
            <div class="flex md12">
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
            <pre v-highlightjs="simpleConsumer"><code class="ws-python"></code></pre>
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
        name: "WsPythonConsumer",
        data() {
            return {
                currentTopic: "test-topic",
                currentSubscription: "my-subscription",
                currentCluster: { id: this.cluster, description: this.cluster },
                currentNamespace: { id: this.namespace, description: this.namespace },
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
                'clientToken',
                'allowedClusters',
                'tenant',
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
            simpleConsumer(){
                return `import websocket, base64, json

token='${this.clientToken}'

authHeader = 'Bearer ' + token

TOPIC = '${this.serviceUrl}/ws/v2/consumer/persistent/${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}/${this.currentSubscription}'

ws = websocket.create_connection(TOPIC, header={"Authorization": authHeader})

while True:
    msg = json.loads(ws.recv())
    if not msg: break

    print ("Received: {} - payload: {}".format(msg, base64.b64decode(msg['payload'])))

    # Acknowledge successful processing
    ws.send(json.dumps({'messageId' : msg['messageId']}))

ws.close()`
            },
        },

    }
</script>


<style lang="scss" scoped>

</style>