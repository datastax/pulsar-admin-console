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
    <div class="python-producer">
        <h5>Simple Producer</h5>
        <p>This sample creates a producer on a topic, sends 3 messages synchronously and 3 messages asynchronously.</p>

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
                                    v-validate="{ required: true, regex: /^[-=:.\w]*$/ }"
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
            <pre v-highlightjs="simpleProducer"><code class="golang"></code></pre>
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
        name: "GolangProducer",
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
                if (this.clusterInfo.info[this.currentCluster.id] && this.clusterInfo.info[this.currentCluster.id].host_override_pulsar) {
                    return this.clusterInfo.info[this.currentCluster.id].host_override_pulsar
                }
                return "pulsar://localhost:6650"
            },
            simpleProducer(){
                return `package main
import (
	"context"
	"fmt"
	"log"

	"github.com/apache/pulsar/pulsar-client-go/pulsar"
)

func main() {
    fmt.Println("Pulsar Producer")

    // Configuration variables pertaining to this consumer
    tokenStr := "${this.clientToken}"
    uri := "${this.serviceUrl}"
    // RHEL CentOS:
    trustStore := "/etc/ssl/certs/ca-bundle.crt"
    // Debian Ubuntu:
    // trustStore := '/etc/ssl/certs/ca-certificates.crt'
    // OSX:
    // Export the default certificates to a file, then use that file:
    // security find-certificate -a -p /System/Library/Keychains/SystemCACertificates.keychain > ./ca-certificates.crt
    // trust_certs='./ca-certificates.crt'
    topicName := "persistent://${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}"

	token := pulsar.NewAuthenticationToken(tokenStr)

	client, err := pulsar.NewClient(pulsar.ClientOptions{
		URL:                     uri,
		Authentication:          token,
		TLSTrustCertsFilePath:   trustStore,
		IOThreads:               3,
		OperationTimeoutSeconds: 5,
	})

	if err != nil {
		log.Fatalf("Could not instantiate Pulsar client: %v", err)
	}

	defer client.Close()

	log.Printf("creating producer...")

	// Use the client to instantiate a producer
	producer, err := client.CreateProducer(pulsar.ProducerOptions{
		Topic: topicName,
	})

	log.Printf("checking error of producer creation...")
	if producer == nil {
		log.Print("producer is null")
	}
	if err != nil {
		log.Fatal(err)
	}

	defer producer.Close()

	ctx := context.Background()

	// Send 3 messages synchronously and 3 messages asynchronously
	for i := 0; i < 3; i++ {
		// Create a message
		msg := pulsar.ProducerMessage{
			Payload: []byte(fmt.Sprintf("messageId-%d", i)),
		}

		// Attempt to send the message
		if err := producer.Send(ctx, msg); err != nil {
			log.Fatal(err)
		}

		// Create a different message to send asynchronously
		asyncMsg := pulsar.ProducerMessage{
			Payload: []byte(fmt.Sprintf("asyncMessageId-%d", i)),
		}

		// Attempt to send the message asynchronously and handle the response
		producer.SendAsync(ctx, asyncMsg, func(msg pulsar.ProducerMessage, err error) {
			if err != nil {
				log.Fatal(err)
			}

			fmt.Println("successfully published ", string(msg.Payload))
		})
	}
}
`
            },
        },

    }
</script>


<style lang="scss" scoped>

</style>