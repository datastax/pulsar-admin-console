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
    <div class="topic-advanced">
        <div class="va-row">
            <div class="flex xs12 md12">
            <div class="flex md12">
                <button class="btn btn-micro btn-right">
                <span
                    class="fa fa-refresh"
                    style="`font-size: 30px`"
                    aria-hidden="true"
                    @click="getData()"
                />
                </button>
            </div>
                <vuestic-widget headerText="Backlog" v-if="backlog.storageSize">
                    <div class="flex md12">
                        <div class="va-row">
                                <alert ref="alert" :errorText="errorText"></alert>
                                <div class="va-row">
                                    <div v-for="statKey in backlogKeys" :key="statKey" class="flex md3">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, backlog[statKey])" :id="statKey" :name="statKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>

                </vuestic-widget>
                <vuestic-widget headerText="Internal Stats">
                    <div class="flex md12">
                        <div class="va-row" v-if="hasStats">
                                <alert ref="alert" :errorText="errorText"></alert>
                                <div class="va-row">
                                    <div v-for="statKey in internalStatsKeys" :key="statKey" class="flex md3">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, internalStats[statKey])" :id="statKey + 'internal'" :name="statKey + 'internal'"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="statKey + 'internal'" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>

                </vuestic-widget>

                    <vuestic-widget headerText="Ledgers">
                        <div class="flex md12">
                            <div class="va-row" v-if="hasStats">
                                    <div class="table-responsive">
                                        <table class="table table-striped first-td-padding table-header-active">
                                        <thead>
                                        <tr>
                                            <td v-for="name in ledgerKeys" :key="name">{{ convertCamelCaseToTitleCase(name) }}</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(ledgerInfo, index) in internalStats.ledgers" :key="index">
                                                    <td v-for="cell in ledgerKeys" :key="cell">
                                                        {{ getHumanReadable(cell, internalStats.ledgers[index][cell])}}
                                                    </td>
                                                </tr>
                                        </tbody>
                                        </table>
                                    </div>
                            </div>
                        </div>
                    </vuestic-widget>
                    <vuestic-widget headerText="Cursors">
                        <div class="flex md12">
                            <div class="va-row" v-if="hasStats">
                                    <div class="table-responsive">
                                        <table class="table table-striped first-td-padding table-header-active">
                                        <thead>
                                        <tr>
                                            <td>Cursor</td>
                                            <td v-for="name in cursorKeys" :key="name">{{ convertCamelCaseToTitleCase(name) }}</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="(cursorInfo, index) in internalStats.cursors" :key="index">
                                                    <td>{{index}}</td>
                                                    <td v-for="cell in cursorKeys" :key="cell">
                                                        {{ getHumanReadable(cell, internalStats.cursors[index][cell])}}
                                                    </td>
                                                </tr>
                                        </tbody>
                                        </table>
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
import ApiService from '@/services/ApiService'

export default {
  name: 'TopicAdvancedTab',
  mixins: [mixins],
  data () {
    return {
      isDeleted: '',
      errorText: 'Something went wrong',
      backlog: {},
      internalStats: {},
      hasStats: false,
      internalStatsKeys: [
        'entriesAddedCounter',
        'numberOfEntries',
        'totalSize',
        'currentLedgerEntries',
        'currentLedgerSize',
        'lastLedgerCreatedTimestamp',
        'waitingCursorsCount',
        'pendingAddEntriesCount',
        'lastConfirmedEntry',
        'state'
      ],
      backlogKeys: [
        'storageSize',
        'totalMessages',
        'messageBacklog',
        'brokerName'
      ],
      ledgerKeys: [
        'ledgerId',
        'entries',
        'size',
        'offloaded'
      ],
      cursorKeys: [
        'markDeletePosition',
        'readPosition',
        'waitingReadOps',
        'pendingReadOps',
        'messagesConsumedCounter',
        'cursorLedger',
        'cursorLedgerLastEntry',
        'individuallyDeletedMessages',
        'lastLedgerSwitchTimestamp',
        'state',
        'numberOfEntriesSinceFirstNotAckedMessage',
        'totalNonContiguousDeletedMessagesRange',
        'properties'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig'
    ]),

  },
  components: {
    Alert,
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      // this.getBacklog()
      this.getInternalStats()
    },
    async getBacklog () {
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.getTopicBacklog(cluster, type, topicPath)

        if (response && response.data) {
          this.backlog = response.data
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving backlog info: ${topicPath}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async getInternalStats () {
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.getTopicInternalStats(cluster, type, topicPath)
        if (response.data) {
          this.internalStats = response.data
          this.hasStats = true
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving internal stats: ${topicPath}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    }
  }
}
</script>

<style scoped>

</style>
