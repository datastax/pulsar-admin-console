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
    <div>
        <div class="va-row" v-if="topicStats.data[$route.params.id]">
            <div class="flex xs12 md12" v-if="topicStats.data[$route.params.id].info.consumers">
                <vuestic-widget >

                    <div class="va-row">
                        <div class="flex md3">
                            <div class="form-group">
                              <div class="input-group">
                                <input v-model="topicsConfig.data[$route.params.id].maxConsumersTopic" id="max-consumers-topic" name="max-consumers-topic"
                                  class="has-value" placeholder="" readonly />
                                <label class="control-label" for="max-consumers-topic" role="button">{{'forms.inputs.maxConsumersTopic'
                                  | translate}}</label><i class="bar"></i>
                              </div>
                            </div>
                        </div>

                        <div class="flex md3">
                            <div class="form-group">
                              <div class="input-group">
                                <input v-model="topicsConfig.data[$route.params.id].maxConsumersSub" id="max-consumers-sub" name="max-consumers-sub"
                                  class="has-value" placeholder="" readonly />
                                <label class="control-label" for="max-consumers-sub" role="button">{{'forms.inputs.maxConsumersSub'
                                  | translate}}</label><i class="bar"></i>
                              </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td @click="sort('consumerName')" :class="addSortClass('consumerName')">{{'tables.headings.name' | translate}}</td>
                            <td @click="sort('subscription')" :class="addSortClass('subscription')">{{'tables.headings.subscriptionName' | translate}}</td>
                            <td @click="sort('unackedMessages')" :class="addSortClass('unackedMessages')" align="right">{{'tables.headings.unackedMessages' | translate}}</td>
                            <td @click="sort('msgRateOut')" :class="addSortClass('msgRateOut')">{{'tables.headings.msgRateOut' | translate}}</td>
                            <td @click="sort('msgThroughputOut')" :class="addSortClass('msgThroughputOut')">{{'tables.headings.msgThroughputOut' | translate}}</td>
                            <td @click="sort('blockedConsumerOnUnackedMsgs')" :class="addSortClass('blockedConsumerOnUnackedMsgs')" align="right">{{'tables.headings.blockedConsumerOnUnackedMsgs' | translate}}</td>
                            <td @click="sort('availablePermits')" :class="addSortClass('availablePermits')" align="right">{{'tables.headings.availablePermits' | translate}}</td>
                            <td @click="sort('clientVersion')" :class="addSortClass('clientVersion')" align="right">{{'tables.headings.clientVersion' | translate}}</td>
                            <td @click="sort('lastAckedTimestamp')" :class="addSortClass('lastAckedTimestamp')" align="right">Last Ack Timestamp</td>
                            <td @click="sort('lastConsumedTimestamp')" :class="addSortClass('lastConsumedTimestamp')" align="right">Last Consume Timestamp</td>
                            <td @click="sort('connectedSince')" :class="addSortClass('connectedSince')" align="right">{{'tables.headings.connectedSince' | translate}}</td>

                        </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(consumer, index) in sortedList" :key="index">
                          <td>{{ consumer.consumerName}}
                              <i class="fa fa-clipboard pointer icon-table"
                                  v-clipboard:copy="consumer.consumerName"
                                  v-clipboard:success="onCopy"
                                  v-clipboard:error="onError">
                              </i>
                          </td>
                          <td>{{ consumer.subscription }}
                              <i class="fa fa-clipboard pointer icon-table"
                                  v-clipboard:copy="consumer.subscription"
                                  v-clipboard:success="onCopy"
                                  v-clipboard:error="onError">
                              </i>
                          </td>
                          <td>{{ consumer.unackedMessages }}</td>
                          <td class="no-wrap">{{ consumer.msgRateOut | numberSeparate() }}</td>
                          <td align="right">{{ consumer.msgThroughputOut | humanBytes }}</td>
                          <td align="right">{{ consumer.blockedConsumerOnUnackedMsgs }}</td>
                          <td align="right">{{ consumer.availablePermits }}</td>
                          <td align="right">{{ consumer.clientVersion }}</td>
                          <td align="right">{{ getHumanReadable('timestamp', consumer.lastAckedTimestamp) }}</td>
                          <td align="right">{{ getHumanReadable('timestamp', consumer.lastConsumedTimestamp) }}</td>
                          <td align="right">{{ consumer.connectedSince | date('%c') }}</td>
                          </tr>
                        </tbody>
                        </table>
                         <v-page
                          :total-row="totalRow"
                          v-model="currentPage"
                          align="center"
                          :pageSizeMenu="pageSizeMenu"
                          @page-change="pageChange"
                        ></v-page>
                    </div>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'TopicConsumersTab',
  mixins: [mixins],
  data() {
    return {
        sortBy: 'consumerName',
        sortDir: 'asc',
        pageSize: 10,
        pageSizeMenu: [10, 20, 50, 100],
        currentPage: 1,
        totalRow: 0
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig'
    ]),
    
    sortedList () {
      let consumerList = new Array
      // Consumers are list under subscriptions
      // Subscription is an object, consumer are an array
      let subscriptionList = Object.keys(this.topicStats.data[this.$route.params.id].stats.subscriptions)
      subscriptionList.forEach(element => {
        if (this.topicStats.data[this.$route.params.id].stats.subscriptions[element].consumers) {
          this.topicStats.data[this.$route.params.id].stats.subscriptions[element].consumers.forEach(consumer => {
            consumer.subscription = element
            consumerList.push(consumer)
          })
        }
      })

      this.totalRow = consumerList.length

      return consumerList.sort((a,b) => {
          let modifier = 1
          if(this.sortDir === 'desc') modifier = -1
          let c = a[this.sortBy]
          let d = b[this.sortBy]
          // Treat nulls as empty string 
          if (c===null || c === undefined) c=''
          if (d===null || d === undefined) d=''
          if(c < d) return -1 * modifier
          if(c > d) return 1 * modifier
          return 0
        }).filter((row, index) => {
            let start = (this.currentPage-1)*this.pageSize;
            let end = this.currentPage*this.pageSize;
            if(index >= start && index < end) return true;
        })

    }
  },
    methods: {
    sort (s) {
        //if s == current sort, reverse
        if(s === this.sortBy) {
        this.sortDir = this.sortDir==='asc'?'desc':'asc';
        }
        this.sortBy = s;
    },
    addSortClass (field) {
        let classArray = [ 'sortable']
        if (this.sortBy === field) {
            classArray.push('sortField')
            if (this.sortDir === 'desc') {
                classArray.push('headerSortDown')
            } else {
                classArray.push('headerSortUp')
            }
        }
        return classArray
    },
    pageChange(pInfo) {
        this.currentPage = pInfo.pageNumber
        this.pageSize = pInfo.pageSize
    },
  }


}
</script>

<style scoped>
.sortField {
    background-color: #eff4f5;
}
.sortable {
    text-decoration: underline;
}
.headerSortDown:after,
.headerSortUp:after{
    content: ' ';
    position: relative;
    left: 10px;
    border: 7px solid transparent;
}
.headerSortDown:after{
    top: 10px;
    border-top-color: silver;
}
.headerSortUp:after{
    bottom: 15px;
    border-bottom-color: silver;
}
.headerSortDown,
.headerSortUp{
    padding-left: 20px;
}

</style>