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
    <div class="sink-topics">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sinksData.data[$route.params.id]">
                    <div class="va-row">
                        <div class="flex md12">
                            <div class="table-responsive">
                                <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td>Input Topic</td>
                                        <td v-for="name in inputSpecKeys" :key="name">{{ convertCamelCaseToTitleCase(name) }}</td>

                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr v-for="(inputInfo, index) in sinksData.data[$route.params.id].inputSpecs" :key="index">
                                                <td>
                                                    <router-link :to="{ name: 'topicDetail', params: { id:  sinksData.data[$route.params.id].cluster + ':' + index.replace(/\//g, ':') }}">{{ index}}</router-link>

                                                    <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="index"
                                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                    </i>
                                                </td>
                                                <td v-for="cell in inputSpecKeys" :key="cell">
                                                    {{ getHumanReadable(cell, sinksData.data[$route.params.id].inputSpecs[index][cell])}}
                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="va-row">
                        <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md4">
                            <div  class="form-group with-icon-right">
                                <div class="input-group">
                                <input :value="getHumanReadable(statKey, sinksData.data[$route.params.id][statKey])" :id="'sink-'+statKey" :name="'sink-'+statKey"
                                    class="has-value" placeholder="" readonly />
                                <label class="control-label" :for="'sink-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'SinkTopics',
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
      'sinksData'
    ]),

  },
  components: {
    Alert,
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
