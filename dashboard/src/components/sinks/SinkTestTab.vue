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
    <div class="sink-test">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sinksData.data[$route.params.id]">
                    <pulsar-client :title="'Sink Test Client '"
                        :cluster="activeCluster"
                        :produceTopic="inputTopic"
                        :disableConsumer=true
                        :enableKey=true
                    ></pulsar-client>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import PulsarClient from '../clients/PulsarClient'

export default {
  name: 'sinkTest',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      isCurrentlySupported: false,
      inputSpecKeys: [
        'schemaType',
        'serdeClassName',
        'receiverQueueSize',
        'regexPattern'
      ],
      // inputSpecKeys: [],
      extraWideCopyKeys: [
      ],
      narrowCopyKeys: [
        'cleanupSubscription',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'sinksData',
      'activeCluster'
    ]),
    inputTopic () {
      const fullTopicName = Object.keys(this.sinksData.data[this.$route.params.id].inputSpecs)[0]
      return fullTopicName.replace(/^.+\//, '')
    }
  },
  components: {
    Alert,
    PulsarClient
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
