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
  <div class="brokers">
    <div v-for="(index) in brokerKeys" :key="index">
      <vuestic-widget :headerText="index" >
        <div class="va-row">
            <div class="flex md3">
              <vuestic-widget class="info-widget">
                <div class="info-widget-inner">
                  <div class="stats">
                    <div class="stats-number">
                      {{ brokerLoadData[index].data.cpu.usage | numberSeparate()}} %
                    </div>
                    <div class="stats-title">CPU</div>
                  </div>
                </div>
              </vuestic-widget>
            </div>
            <div class="flex md3">
              <vuestic-widget class="info-widget brand-info">
                <div class="info-widget-inner">
                  <div class="stats">
                    <div class="stats-number">
                      {{ brokerLoadData[index].data.msgRateIn |  numberSeparate()}}
                    </div>
                    <div class="stats-title">Rate In (msg/s)</div>
                  </div>
                </div>
              </vuestic-widget>
            </div>
            <div class="flex md3">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[index].data.bandwidthIn.usage | humanBytes}}
                        </div>
                        <div class="stats-title">In (/s)</div>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md3">
                  <vuestic-widget class="info-widget">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[index].data.numProducers}}
                        </div>
                        <div class="stats-title">Producers</div>
                      </div>
                    </div>
                  </vuestic-widget>
                </div>
              
        </div>
        <div class="va-row">
          <div class="flex md3">
            <vuestic-widget class="info-widget">
              <div class="info-widget-inner">
                <div class="stats">
                  <div class="stats-number">
                    {{ brokerLoadData[index].data.memory.usage*1024*1024 | humanBytes}}
                  </div>
                  <div class="stats-title">Memory</div>
                </div>
              </div>
            </vuestic-widget>
          </div>
          <div class="flex md3">
            <vuestic-widget class="info-widget brand-info">
              <div class="info-widget-inner">
                <div class="stats">
                  <div class="stats-number">
                    {{ brokerLoadData[index].data.msgRateOut |  numberSeparate()}}
                  </div>
                  <div class="stats-title">Rate Out (msg/s)</div>
                </div>
              </div>
            </vuestic-widget>
          </div>
          <div class="flex md3">
            <vuestic-widget class="info-widget brand-info">
              <div class="info-widget-inner">
                <div class="stats">
                  <div class="stats-number">
                    {{ brokerLoadData[index].data.bandwidthOut.usage | humanBytes}}
                  </div>
                  <div class="stats-title">Out (/s)</div>
                </div>
              </div>
            </vuestic-widget>
          </div>
          <div class="flex md3">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ brokerLoadData[index].data.numConsumers}}
                      </div>
                      <div class="stats-title">Consumers</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>

        </div>
        <div class="va-row">
          <div class="flex md12">
            <button class="btn btn-primary btn-right" @click="updateNav(index)">Details</button>
          </div>
      </div>

      </vuestic-widget>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'brokers',
  components: {
  },
  data () {
    return {
      animated: true
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'brokerLoadData',
      'activeCconfig',
      'namespacesConfig',
      'isAdminUser'
    ]),
    brokerKeys () {
      let keys = Object.keys(this.brokerLoadData).sort()
      console.log(keys)
      return keys
    },
  },
  methods: {
    updateNav (broker) {
      this.$router.push('/admin/broker/' + broker)
    },
  

    getBrokerName (index) {
    }
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  }
}
</script>

<style lang="scss" scoped>

</style>
