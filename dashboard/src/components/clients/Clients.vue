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
    <div class="clients">
        <vuestic-widget>
            <div class="va-row">

                <div class="flex md12">

                    <vuestic-widget headerText="Try It Out">
                    <p>The quickest way to try out your service is to use the test clients below. Try sending messages from one client to other.

                    <p>
                        Connect using <span class="vue-highlighted-text">Read/Earliest</span> instead of <span class="vue-highlighted-text">Consume</span> to replay all message that have been sent to a topic.
                    </p>

                    <div class="va-row">
                        <div class="flex md12">
                            <button class="btn btn-primary btn-with-icon" @click="addClient()">
                                <div class="btn-with-icon-content">
                                    <i class="ion-md-add ion"></i>
                                    Client
                                </div>
                            </button>
                        </div>
                    </div>

                    </vuestic-widget>

                </div>

            </div>

            <div class="va-row">
                <div v-for="client in clientList" :key="client.id"  class="flex md6">
                    <pulsar-client :title="'WebSocket Test Client ' + client.id"
                        :cluster="activeCluster"
                        :produceTopic="client.produceTopic"
                        :consumeTopic="client.consumeTopic"
                        :subscription="client.subscription"
                        :spinnerType="client.spinner"
                        :enableKey=true
                        :showCluster="runningEnv !== 'false'"
                        :showTenant="privateOrg === 'true'"
                    ></pulsar-client>
                </div>
            </div>
        </vuestic-widget>
    </div>
</template>

<script>
import PulsarClient from './PulsarClient'
import mixins from '@/services/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'clients',
  data () {
    return {
      currClientId: 1,
      currSpinnerIdx: 0,
      clientList: [
        {
          id: '1',
          produceTopic: 'tc1-messages',
          consumeTopic: 'tc1-messages',
          spinner: 'orbit-spinner',
          subscription: 'tc1-sub',
        }
      ],
      spinnerTypes: ['orbit-spinner', 'trinity-rings-spinner']

    }
  },
  mixins: [mixins],
  components: {
    PulsarClient,
  },
  computed: {
    ...mapGetters([
      'activeCluster',
      'allowedClusters',
      'tenant',
      'clusterInfo',
      'runningEnv',
      'privateOrg'
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
    addClient () {
      this.currClientId++
      this.currSpinnerIdx++
      if (this.currSpinnerIdx > this.spinnerTypes.length) {
        this.currSpinnerIdx = 0
      }
      this.clientList.push({
        id: this.currClientId,
        produceTopic: 'tc' + this.currClientId + '-messages',
        consumeTopic: 'tc' + this.currClientId + '-messages',
        spinner: this.spinnerTypes[this.currSpinnerIdx],
        subscription: 'tc' + this.currClientId + '-sub',
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
