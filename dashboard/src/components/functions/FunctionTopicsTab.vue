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
    <div class="function-topics">
        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="functionsData.data[$route.params.id]">
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
                                            <tr v-for="(inputInfo, index) in functionsData.data[$route.params.id].inputSpecs" :key="index">
                                                <td>
                                                    <router-link :to="{ name: 'topicDetail', params: { id:  functionsData.data[$route.params.id].cluster + ':' + index.replace(/\//g, ':') }}">{{ index}}</router-link>

                                                    <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="index"
                                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                    </i>
                                                </td>
                                                <td v-for="cell in inputSpecKeys" :key="cell">
                                                    {{ getHumanReadable(cell, functionsData.data[$route.params.id].inputSpecs[index][cell])}}
                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td>Output Topic</td>
                                        <td v-if="isCurrentlySupported">Schema Type</td>
                                        <td v-if="isCurrentlySupported">Serde Class Name</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr>
                                                <td v-if="functionsData.data[$route.params.id].output">
                                                    <router-link :to="{
                                                        name: 'topicDetail',
                                                        params: { id:  functionsData.data[$route.params.id].cluster + ':' + functionsData.data[$route.params.id].output.replace(/\//g, ':') }
                                                        }">{{ functionsData.data[$route.params.id].output}}
                                                    </router-link>
                                                    <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="functionsData.data[$route.params.id].output"
                                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                    </i>
                                                </td>
                                                <td v-else></td>
                                                <td v-if="isCurrentlySupported">
                                                    {{ functionsData.data[$route.params.id].outputSchemaType }}
                                                </td>
                                                <td v-if="isCurrentlySupported">
                                                    {{ functionsData.data[$route.params.id].outputSerdeClassName }}
                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td>Log Topic</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr>
                                                <td v-if="functionsData.data[$route.params.id].logTopic">
                                                    <router-link :to="{
                                                        name: 'topicDetail',
                                                        params: { id:  functionsData.data[$route.params.id].cluster + ':' + functionsData.data[$route.params.id].logTopic.replace(/\//g, ':') }
                                                        }">{{ functionsData.data[$route.params.id].logTopic}}
                                                    </router-link>
                                                    <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="functionsData.data[$route.params.id].logTopic"
                                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                    </i>
                                                </td>
                                                <td v-else>

                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="isCurrentlySupported" class="table-responsive">
                                <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td>Dead Letter Topic</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr>
                                                <td v-if="functionsData.data[$route.params.id].deadLetterTopic" >
                                                    <router-link :to="{
                                                        name: 'topicDetail',
                                                        params: { id:  functionsData.data[$route.params.id].cluster + ':' + functionsData.data[$route.params.id].deadLetterTopic.replace(/\//g, ':') }
                                                        }">{{ functionsData.data[$route.params.id].deadLetterTopic}}
                                                    </router-link>
                                                    <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="functionsData.data[$route.params.id].deadLetterTopic"
                                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                    </i>
                                                </td>
                                                <td v-else></td>
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
                                <input :value="getHumanReadable(statKey, functionsData.data[$route.params.id][statKey])" :id="statKey" :name="statKey"
                                    class="has-value" placeholder="" readonly />
                                <label class="control-label" :for="statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
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
  name: 'FunctionTopics',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      isCurrentlySupported: false,
      futureInputSpecKeys: [
        'schemaType',
        'serdeClassName',
        'receiverQueueSize',
        'regexPattern'
      ],
      inputSpecKeys: [],
      extraWideCopyKeys: [

      ],
      narrowCopyKeys: [
        'cleanupSubscription',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'functionsData'
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
