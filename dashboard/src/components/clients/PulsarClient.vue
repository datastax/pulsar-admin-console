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
    <div class="pulsar-client">
        <vuestic-widget :headerText="title" class="chat-widget">
            <div class="va-row">
                <div class="btn btn-primary btn-micro spacing" v-if="!allConnected" :disabled="connecting" @click="connectAll()">Connect</div>
                <div class="btn btn-primary btn-micro spacing" v-if="allConnected" @click="disconnectAll()">Disconnect</div>
                <div class="spinner" v-if="spinnerType === 'orbit-spinner'">
                    <orbit-spinner
                            v-if="allConnected"
                            :animation-duration="2400"
                            :size="40"
                            color="#188FFF"
                    />
                </div>
                <div class="spinner" v-if="spinnerType === 'trinity-rings-spinner'">
                    <trinity-rings-spinner
                            v-if="allConnected"
                            :animation-duration="2400"
                            :size="40"
                            color="#188FFF"
                    />
                </div>
        </div>

        <div class="va-row connected-message">
            <small v-show="connectError"
                            class="help text-danger">
                    {{ errorText }}
            </small>
            <small v-show="allConnected">
                To apply changes, disconnect then reconnect the client.
            </small>
        </div>

        <div class="va-row">
            <div class="flex md6">
                <fieldset v-if="showCluster">
                    <vuestic-simple-select
                    label="Cluster"
                    name="client-cluster-select"
                    v-model="currentCluster"
                    option-key="description"
                    :options="clusterSelect"
                    :clearable="clearable"
                    v-on:input="updateNsSelect()"
                    />
                </fieldset>
                <fieldset v-if="showTenant">
                    <vuestic-simple-select
                    label="Tenant"
                    name="client-tenant-select"
                    :value="{ id: tenant, description: tenant }"
                    option-key="description"
                    :options="tenantSelect"
                    :clearable="false"
                    />
                </fieldset>
                <div class="form-group with-icon-right"
                    :class="{'has-error': errors.has('currentProduceTopic'), 'valid': isFormFieldValid('currentProduceTopic')}">
                    <div class="input-group">
                            <input id="produce-topic-input"
                            v-model="currentProduceTopic"
                            class="has-value"
                            v-validate="{ required: true, regex: /^[a-zA-Z0-9_.-]+$/ }"
                            name="currentProduceTopic"
                            data-vv-as="Produce Topic"
                            />
                            <i
                            class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                            <label class="control-label" for="simple-input">Produce Topic</label><i class="bar"></i>
                    </div>
                </div>
                <div v-if="consumerInterface && !disableConsumer" class="form-group with-icon-right"
                    :class="{'has-error': errors.has('currentSubscription'), 'valid': isFormFieldValid('currentSubscription')}">
                    <div class="input-group">
                            <input id="subscription-input"
                            v-model="currentSubscription"
                            class="has-value"
                            v-validate="{ required: true, regex: /^[a-zA-Z0-9_.-]+$/ }"
                            name="currentSubscription"
                            data-vv-as="Subscription"
                            />
                            <i
                            class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                            <label class="control-label" for="subscription-input">Subscription Name</label><i class="bar"></i>
                    </div>
                </div>
                <fieldset>
                    <vuestic-simple-select
                    label="Topic Type"
                    v-model="topicType"
                    name="topic-type-select"
                    :options="topicTypeList"
                    ref="topic-type-select"
                    :clearable="false"
                    />
                </fieldset>

            </div>
            <div class="flex md6">
                <fieldset>
                    <vuestic-simple-select
                    label="Namespace"
                    v-model="currentNamespace"
                    name="client-namespace-select"
                    option-key="description"
                    :options="namespaceSelect"
                    ref="nsSelect"
                    :clearable="clearable"
                    />
                </fieldset>
                <div v-if="!disableConsumer" class="form-group with-icon-right"
                    :class="{'has-error': errors.has('currentConsumeTopic'), 'valid': isFormFieldValid('currentConsumeTopic')}">
                    <div class="input-group">
                            <input id="consume-topic-input"
                            v-model="currentConsumeTopic"
                            class="has-value"
                            v-validate="{ required: true, regex: /^[a-zA-Z0-9_.-]+$/ }"
                            name="currentConsumeTopic"
                            data-vv-as="Consume Topic"
                            />
                            <i
                            class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                            <label class="control-label" for="simple-input">Consume Topic</label><i class="bar"></i>
                    </div>
                </div>
                <fieldset v-if="consumerInterface && !disableConsumer">
                    <vuestic-simple-select
                    label="Subscription Type"
                    v-model="subscriptionType"
                    name="sub-type-select"
                    :options="subscriptionTypeList"
                    ref="sub-type-select"
                    :clearable="false"
                    />
                </fieldset>
                <div v-if="enableKey" class="form-group with-icon-right"
                        :class="{'has-error': errors.has('key'), 'valid': isFormFieldValid('key')}">
                        <div class="input-group">
                                <input id="key"
                                v-model="key"
                                class="has-value"
                                v-validate="{ required: false, regex: /^[a-zA-Z0-9_.-]+$/ }"
                                name="key"
                                data-vv-as="Key"
                                />
                                <i
                                class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                                <label class="control-label" for="key">Key</label><i class="bar"></i>
                        </div>
                </div>
                
            </div>
            </div>
            <div v-if="!disableConsumer" class="flex md12">
                <fieldset>
                    <vuestic-switch v-model="consumerInterface">
                    <span
                        slot="trueTitle">Consume</span>
                    <span slot="falseTitle">Read</span>
                    </vuestic-switch>
                </fieldset>
            </div>
            <div v-if="!consumerInterface" class="flex md12">
                <fieldset>
                    <vuestic-switch v-model="earliestMessages">
                    <span
                        slot="trueTitle">Earliest</span>
                    <span slot="falseTitle">Latest</span>
                    </vuestic-switch>
                </fieldset>
            </div>

        
        <div class="va-row">
            <vuestic-chat v-on:input="sendMessage" v-model="messages" :canSend="allConnected"></vuestic-chat>
            <button class="btn btn-secondary btn-micro"   @click="clearMessages">Clear</button>
        </div>

        </vuestic-widget>

    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { OrbitSpinner, TrinityRingsSpinner } from 'epic-spinners'
import _ from 'lodash'
import mixins from '@/services/mixins'

export default {
  name: 'pulsar-client',
  mixins: [mixins],
  data () {
    return {
      messages: [],
      producerSocket: null,
      consumerSocket: null,
      topicType: 'persistent',
      topicTypeList: ['persistent', 'non-persistent'],
      producerConnected: false,
      consumerConnected: false,
      currentCluster: { id: this.cluster, description: this.cluster },
      currentNamespace: {},
      currentConsumeTopic: this.consumeTopic,
      currentProduceTopic: this.produceTopic,
      currentSubscription: this.subscription,
      subscriptionType: 'Exclusive',
      subscriptionTypeList: ['Exclusive', 'Failover', 'Shared', 'Key_Shared'],
      connecting: false,
      key: '',
      disconnecting: false,
      clearable: false,
      connectError: false,
      consumerInterface: true,
      earliestMessages: true,
      errorText: 'Error detected with client connnection. Try again.'
    }
  },
  components: {
    OrbitSpinner,
    TrinityRingsSpinner
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
    produceTopic: {
      type: String,
      default: 'my-topic',
    },
    consumeTopic: {
      type: String,
      default: 'my-topic',
    },
    subscription: {
      type: String,
      default: 'my-sub'
    },
    title: {
      type: String,
      default: 'Client'
    },
    spinnerType: {
      type: String,
      default: 'orbit-spinner'
    },
    disableConsumer: {
      type: Boolean,
      default: false
    },
    enableKey: {
      type: Boolean,
      default: false
    },
    showCluster: {
      type: Boolean,
      default: true
    },
    showTenant: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'activeCluster',
      'allowedClusters',
      'tenant',
      'clientToken',
      'namespacesConfig',
      'wssUrlOverride'
    ]),
    allConnected () {
      if (this.disableConsumer) {
        return this.producerConnected
      } else {
        return this.producerConnected && this.consumerConnected
      }
    },
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
     tenantSelect () {
      const options = []

      options.push({
        id: this.tenant,
        description: this.tenant
      })

      console.log(options)

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

      // console.log(options)
      // console.log(this.currentNamespace)

      if (_.isEmpty(this.currentNamespace) && options[0]) {

        this.currentNamespace = {
          id: options[0].id,
          description: options[0].description
        }
      }

      return options
    }
  },
  beforeDestroy () {
    if (this.producerConnected) {
      this.disconnectProducer()
    }
    if (this.consumerConnected) {
      this.disconnectConsumer()
    }
  },
  methods: {
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        isValid = this.formFields[field].validated && this.formFields[field].valid
      }
      return isValid
    },
    validateFormField (fieldName) {
      this.$validator.validate(fieldName, this[fieldName])
    },
    getClusterUrl (clusterName, protocol, override) {
      if (override) {
        // console.log('override: ' + override)
        const splitInfo = this.splitClusterName(clusterName)
        // console.log(splitInfo)
        let url = override.replace('<cluster>', splitInfo.name)
        return url.replace('<cloud>', splitInfo.cloud)
      }
      const currentHost = document.location.host
      let currentProto = 'ws'
      if (document.location.protocol === 'https:') {
        currentProto = 'wss'
      }
      return currentProto + "://" + currentHost
    },
    updateNsSelect () {
      this.currentNamespace = ''

      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].name === 'local-' + this.currentCluster.id) {
          this.$refs.nsSelect.selectOption({ id: 'local-' + this.currentCluster.id, description: 'local-' + this.currentCluster.id })
        }
      })
    },
    connectAll () {
      this.connecting = true
      this.connectProducer()
      if (!this.disableConsumer) {
        this.connectConsumer()
      }
    },
    disconnectAll () {
      this.disconnectProducer()
      if (!this.disableConsumer) {
        this.disconnectConsumer()
      }
    },
    clearMessages () {
      this.messages = []
    },
    connectProducer () {
      this.connectError = false

      const wsEndpoint = this.getClusterUrl(this.currentCluster.id, 'wss', this.wssUrlOverride) +
                    '/ws/v2/producer/' + this.topicType + '/' + this.tenant + '/' + this.currentNamespace.id + '/' + this.currentProduceTopic +
                    '/?token=' + this.clientToken

      console.log('connecting producer', wsEndpoint)

      this.producerSocket = new WebSocket(wsEndpoint)
      this.producerSocket.onopen = () => {
        this.producerConnected = true
        this.$emit('connected')
        console.log('Producer connected', this.currentCluster.id)
      }
      this.producerSocket.onerror = (e) => {
        console.log('WebSocket Error on producer: ', e)
        this.producerConnected = false
        this.$emit('disconnected')
        this.connectError = true
        this.connecting = false
        // Disconnect the consumer on error to producer
        this.disconnectConsumer()
      }
      this.producerSocket.onclose = (e) => {
        console.log('WebSocket produce connection close: ', e)
        this.producerConnected = false
        this.$emit('disconnected')
        this.connecting = false
      }
      this.producerSocket.onmessage = ({ data }) => {
        // console.log('Message received on producer', data)

      }
    },
    connectConsumer () {
      this.connectError = false
      let consumeType = 'consumer'
      if (this.consumerInterface === false) {
        consumeType = 'reader'
      }
      let queryParms = '&subscriptionType=' + this.subscriptionType
      let subscriptionInfo = '/' + this.currentSubscription
      if (consumeType === 'reader') {
        let startPos = 'latest'
        if (this.earliestMessages === true) {
          startPos = 'earliest'
        }
        queryParms = '&messageId=' + startPos
        subscriptionInfo = ''
      }

      console.log('subscription', this.currentSubscription)
      console.log('subscription type', this.subscriptionType)

      const wsEndpoint = this.getClusterUrl(this.currentCluster.id, 'wss', this.wssUrlOverride) +
                    '/ws/v2/' + consumeType + '/' + this.topicType +'/' + this.tenant + '/' +
                    this.currentNamespace.id + '/' + this.currentConsumeTopic + subscriptionInfo +
                    '?token=' + this.clientToken + queryParms 
      console.log('connecting consumer', wsEndpoint)

      this.consumerSocket = new WebSocket(wsEndpoint)

      this.consumerSocket.onerror = (e) => {
        console.log('WebSocket Error on consumer: ', e)
        this.consumerConnected = false
        this.$emit('disconnected')
        this.connectError = true
        this.connecting = false
        // Disconnect the producer on error to consumer
        this.disconnectProducer()
      }
      this.consumerSocket.onclose = (e) => {
        console.log('WebSocket consumer connection close: ', e)
        this.consumerConnected = false
        this.$emit('disconnected')
        this.connecting = false
      }
      this.consumerSocket.onopen = () => {
        this.consumerConnected = true
        this.$emit('connected')
        console.log('Consumer connected', this.currentCluster.id)
        this.connecting = false
      }

      this.consumerSocket.onmessage = (message) => {
        const receiveMsg = atob(JSON.parse(message.data).payload)

        this.messages.push({
          text: receiveMsg,
          yours: false
        })
        // Ack the message
        const ackMsg = { 'messageId': JSON.parse(message.data).messageId }
        this.consumerSocket.send(JSON.stringify(ackMsg))
      }
    },
    disconnectProducer () {
      this.producerSocket.close()
      this.producerConnected = false
      console.log('Producer disconnected')
    },
    disconnectConsumer () {
      this.consumerSocket.close()
      this.consumerConnected = false
      console.log('Consumer disconnected')
    },
    sendMessage (message) {
      let formattedMessage = {
        payload: btoa(message[message.length - 1].text)
      }
      if (this.key) {
        formattedMessage.key = this.key
      }
      if (this.producerSocket) {
        this.producerSocket.send(JSON.stringify(formattedMessage))
        // console.log(`Sent message ${message[0].text}`);
      } else {
        console.log('Could not send. No producer connection.')
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.pulsar-client {
    .spacing {
        margin-bottom: 15px;
    }
    .spinner {
        margin-left: auto;
        margin-right: 10px;
    }
    .clear-button {
        margin-left: auto;
        margin-right: 15px;
    }
    .connected-message {
        padding-bottom: 10px;
    }
    .consumer-switch {
        margin-left: auto;
        margin-right: auto;
    }
    // .form-group {
    //     margin-right: 5px;
    // }
}
</style>
