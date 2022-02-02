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
    <div class="topic-subscriptions">

        <vuestic-widget>
            <div v-if="topicStats.data[this.$route.params.id] && topicStats.data[this.$route.params.id].info.type === 'persistent'"
                class="flex sm6 lg6 xl3 justify--center">
                <button class="btn btn-primary btn-with-icon" @click="openCreateSubModal()">
                  <div class="btn-with-icon-content">
                    <i class="ion-md-add ion"></i>
                    Subscription
                  </div>
                </button>
              </div>
              <vuestic-modal ref="createSubModal"
                        :okText="'modal.ok' | translate"
                        v-on:ok="createSub()"
                        v-on:cancel="formKeysToValidate={}"
                        :okDisabled="!isFormValid"
                        :cancelText="'modal.cancel' | translate">

            <div slot="title">Create Subscription</div>

            <div>
                <div class="form-group">
                    <div class="input-group">
                        <input id="subscriptionName"
                        name="subscriptionName"
                        ref="subscriptionName"
                        v-model="subToCreate"
                        v-validate="namedEntityValidationRegex()"
                        required
                        />
                        <label class="control-label" for="subscriptionName">Subscription Name</label><i class="bar"></i>
                        <small v-show="errors.has('subscriptionName')"
                            class="help text-danger">
                        {{ errors.first('subscriptionName') ? namedEntityValidationError() : '' }}
                    </small>
                    </div>
                </div>
                <p>
                    <span class="vue-highlighted-text">Note:</span> Consumer sets the type of the subscription when it connects.
                </p>

                <p>Select position in topic to start the subscription:</p>
                <div class="va-row">
                        <div class="md4">
                            <fieldset>
                                <vuestic-radio-button
                                    option="latest"
                                    v-model="subPosition"
                                    label="Latest"
                                />
                                <vuestic-radio-button
                                    option="earliest"
                                    v-model="subPosition"
                                    label="Earliest"
                                />
                                <vuestic-radio-button
                                    option="number"
                                    v-model="subPosition"
                                    label="Specific Position"
                                />
                            </fieldset>
                        </div>
                            <div v-show="subPosition === 'number'" class="flex md6 offset--md2">
                                <div class="va-layout">
                                    <div class="va-row">
                                        <div class="md2">
                                            <div class="form-group">
                                                <div class="input-group">
                                                    <input id="createLedgerId"
                                                    name="createLedgerId"
                                                    ref="createLedgerId"
                                                    v-model="createLedgerId"
                                                    v-validate="'required|integer'"
                                                    required
                                                    />
                                                    <label class="control-label" for="createLedgerId">Ledger ID</label><i class="bar"></i>
                                                    <small v-show="errors.has('createLedgerId')"
                                                        class="help text-danger">
                                                    {{ errors.first('createLedgerId') }}
                                                </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md2">
                                            <div class="form-group">
                                                <div class="input-group">
                                                    <input id="createEntryId"
                                                    name="createEntryId"
                                                    ref="createEntryId"
                                                    v-model="createEntryId"
                                                    v-validate="'required|integer'"
                                                    required
                                                    />
                                                    <label class="control-label" for="createEntryId">Entry ID</label><i class="bar"></i>
                                                    <small v-show="errors.has('createEntryId')"
                                                        class="help text-danger">
                                                    {{ errors.first('createEntryId') }}
                                                </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
            </div>
            </vuestic-modal>
        </vuestic-widget>

        <vuestic-widget>
            <div class="row">
                <div class="col-md-12">
                <div slot="body">
                    <div class="row filters-page__filter-bar-container">

                    <filter-bar
                        v-model="nameFilter"
                        class="filters-page__filter-bar"
                        label="Name"
                    />
                    <vuestic-simple-select
                        class="filters-page__filter-bar"
                        name='subcription-type-filter'
                        label="Type"
                        v-model="typeFilter"
                        :options="typeList"
                    />
                    </div>
                </div>
                <div class="filters-page__tags">
                    <vuestic-tag
                    v-if="nameFilter"
                    :name="`Name: ${ nameFilter }`"
                    removable
                    @remove="nameFilter = ''"
                    />
                    <vuestic-tag
                    v-if="typeFilter"
                    :name="`Type: ${ typeFilter }`"
                    removable
                    @remove="typeFilter = ''"
                    />
                    <span
                    v-if="this.typeFilter || this.nameFilter"
                    class="filters-page__clear-all-text"
                    @click="clearAll"
                    >
                    Clear all filters
                    </span>
                </div>
                </div>
            </div>
            </vuestic-widget>
            <alert ref="alert" :errorText="errorText"></alert>

        <div class="va-row" v-if="topicStats.data[$route.params.id]">

            <div class="flex xs12 md12" v-if="topicStats.data[$route.params.id].info.subscriptions">
                <vuestic-widget>

                    <div class="table-responsive">
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td></td>
                            <td @click="sort('subscriptionName')" :class="addSortClass('subscriptionName')">{{'tables.headings.name' | translate}}</td>
                            <td @click="sort('type')" :class="addSortClass('type')">{{'tables.headings.type' | translate}}</td>
                            <td @click="sort('msgBacklog')" :class="addSortClass('msgBacklog')">{{'tables.headings.msgBacklog' | translate}}</td>
                            <td @click="sort('msgRateOut')" :class="addSortClass('msgRateOut')">{{'tables.headings.msgRateOut' | translate}}</td>
                            <td @click="sort('msgThroughputOut')" :class="addSortClass('msgThroughputOut')">{{'tables.headings.msgThroughputOut' | translate}}</td>
                            <td @click="sort('msgRateRedeliver')" :class="addSortClass('msgRateRedeliver')" align="right">{{'tables.headings.msgRateRedeliver' | translate}}</td>
                            <td @click="sort('blockedSubscriptionOnUnackedMsgs')" :class="addSortClass('blockedSubscriptionOnUnackedMsgs')" align="right">{{'tables.headings.blockedSubscriptionOnUnackedMsgs' | translate}}</td>
                            <td @click="sort('unackedMessages')" :class="addSortClass('unackedMessages')" align="right">{{'tables.headings.unackedMessages' | translate}}</td>
                            <td @click="sort('msgRateExpired')" :class="addSortClass('msgRateExpired')" align="right">{{'tables.headings.msgRateExpired' | translate}}</td>
                            <td @click="sort('msgDropRate')" :class="addSortClass('msgDropRate')" v-if="topicStats.data[$route.params.id].info.type === 'non-persistent'" align="right">{{'tables.headings.msgDropRate' | translate}}</td>
                            <td @click="sort('numConsumers')" :class="addSortClass('numConsumers')" align="right">{{'tables.headings.consumers' | translate}} (Max: {{ topicsConfig.data[$route.params.id].maxConsumersSub }})</td>

                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(topicStat, index) in sortedList" :key="index" v-show="showSub(topicStat.subscriptionName, topicStat)">
                            <td>
                                <button :disabled="isDeleted == topicStat.subscriptionName" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmDeleteSub(topicStat.subscriptionName)">Delete</button>
                                <button v-if="topicStats.data[$route.params.id].info.type === 'persistent'" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmClearSub(topicStat.subscriptionName)">Skip</button>
                                <button v-if="topicStats.data[$route.params.id].info.type === 'persistent'" class="btn btn-primary btn-micro btn-bottom-margin" @click="openRewindSub(topicStat.subscriptionName)">Rewind</button>
                                <button v-if="topicStats.data[$route.params.id].info.type === 'persistent'" class="btn btn-primary btn-micro btn-bottom-margin" @click="openExpireSub(topicStat.subscriptionName)">Expire</button>
                                <button v-if="topicStats.data[$route.params.id].info.type === 'persistent'" class="btn btn-primary btn-micro btn-bottom-margin" @click="openPeekSub(topicStat.subscriptionName)">Peek</button>
                            </td>
                            <td>{{ topicStat.subscriptionName }}
                                <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="topicStat.subscriptionName"
                            v-clipboard:success="onCopy" v-clipboard:error="onError">
                            </i>
                            </td>
                            <td>{{ topicStat.type }}</td>
                            <td>{{ topicStat.msgBacklog }}</td>
                            <td class="no-wrap">{{ topicStat.msgRateOut | numberSeparate()}}</td>
                            <td align="right">{{ topicStat.msgThroughputOut | humanBytes }}</td>
                            <td align="right">{{ topicStat.msgRateRedeliver }}</td>
                            <td align="right">{{ topicStat.blockedSubscriptionOnUnackedMsgs }}</td>
                            <td align="right">{{ topicStat.unackedMessages }}</td>
                            <td class="no-wrap" align="right">{{ topicStat.msgRateExpired | numberSeparate()}}</td>
                            <td v-if="topicStats.data[$route.params.id].info.type === 'non-persistent'" class="no-wrap" align="right">{{ topicStat.msgDropRate | numberSeparate()}}</td>
                            <td align="right">{{ topicStat.numConsumers }}</td>

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
                    <vuestic-modal :show.sync="showSubModal" ref="deleteSubModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="deleteSub()"
                                            v-on:cancel="subToDelete=''"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Delete Subscription</div>
                                <div>
                                    Are you sure you want to delete subscription {{ subToDelete }}?
                                </div>
                    </vuestic-modal>
                    <vuestic-modal :show.sync="showClearModal" ref="clearSubModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="clearBacklog()"
                                            v-on:cancel="formKeysToValidate={}"
                                            :okDisabled="!isFormValid"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Skip Backlog</div>

                                <div>

                                    <p>This will skip the oldest messages from the backlog.</p>
                                    <div class="va-row">
                                            <div class="md4">
                                                <fieldset>
                                                    <vuestic-radio-button
                                                        option="all"
                                                        v-model="skipType"
                                                        label="All"
                                                    />
                                                    <vuestic-radio-button
                                                        option="number"
                                                        v-model="skipType"
                                                        label="Number"
                                                    />
                                                </fieldset>
                                            </div>
                                                <div v-show="skipType === 'number'" class="flex md6 offset--md2">
                                                    <div class="va-layout">
                                                        <div class="va-row">
                                                            <div class="md2">
                                                                <div class="form-group">
                                                                    <div class="input-group">
                                                                        <input id="skipNumber"
                                                                        name="skipNumber"
                                                                        ref="skipNumber"
                                                                        v-model="skipNumber"
                                                                        v-validate="'required|integer'"
                                                                        required
                                                                        />
                                                                        <label class="control-label" for="skipNumber">Number of Messages to Skip</label><i class="bar"></i>
                                                                        <small v-show="errors.has('skipNumber')"
                                                                            class="help text-danger">
                                                                        {{ errors.first('skipNumber') }}
                                                                    </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>

                                    <p>
                                    Are you sure you want to skip messages in the backlog of subscription {{ subToClear }}?

                                    </p>
                                </div>
                                </vuestic-modal>
                                <vuestic-modal ref="rewindSubModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="rewindSub()"
                                            v-on:cancel="formKeysToValidate={}"
                                            :okDisabled="!isFormValid"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Rewind Subscription</div>
                                <div>
                                    <p>If messages have been retained, you can rewind the subscription.</p>
                                    <p>You can rewind to a publish time or a specific position. Use Peek to find the position identifiers for a message.</p>
                                    <div class="va-layout">
                                        <div class="va-row">
                                            <div class="md4">
                                                <fieldset>
                                                    <vuestic-radio-button
                                                        option="time"
                                                        v-model="rewindType"
                                                        label="Publish Time"
                                                    />
                                                    <vuestic-radio-button
                                                        option="position"
                                                        v-model="rewindType"
                                                        label="Specific Position"
                                                    />
                                                </fieldset>
                                            </div>
                                                <div v-show="rewindType === 'time'" class="flex md6 offset--md2">
                                                    <div  class="form-group">
                                                        <div class="input-group">
                                                        <vuestic-date-picker
                                                            id="rewind-time-input"
                                                            v-model="rewindDateTime"
                                                            :config="{enableTime: true}"
                                                        />
                                                        <label class="control-label" for="rewind-time-input">Target Date and Time</label>
                                                        <i class="bar"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-show="rewindType === 'position'" class="flex md6 offset--md2">
                                                    <div class="va-layout">
                                                        <div class="va-row">
                                                            <div class="md2">
                                                                <div class="form-group">
                                                                    <div class="input-group">
                                                                        <input id="ledgerId"
                                                                        name="ledgerId"
                                                                        ref="ledgerId"
                                                                        v-model="ledgerId"
                                                                        v-validate="'required|integer'"
                                                                        required
                                                                        />
                                                                        <label class="control-label" for="ledgerId">Ledger ID</label><i class="bar"></i>
                                                                        <small v-show="errors.has('ledgerId')"
                                                                            class="help text-danger">
                                                                        {{ errors.first('ledgerId') }}
                                                                    </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="md2">
                                                                <div class="form-group">
                                                                    <div class="input-group">
                                                                        <input id="entryId"
                                                                        name="entryId"
                                                                        ref="entryId"
                                                                        v-model="entryId"
                                                                        v-validate="'required|integer'"
                                                                        required
                                                                        />
                                                                        <label class="control-label" for="entryId">Entry ID</label><i class="bar"></i>
                                                                        <small v-show="errors.has('entryId')"
                                                                            class="help text-danger">
                                                                        {{ errors.first('entryId') }}
                                                                    </small>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div v-show="false" class="md2">
                                                                <div class="form-group">
                                                                    <div class="input-group">
                                                                        <input id="partitionIndex"
                                                                        name="partitionIndex"
                                                                        ref="partitionIndex"
                                                                        v-model="partitionIndex"
                                                                        v-validate="'required|integer'"
                                                                        required
                                                                        />
                                                                        <label class="control-label" for="partitionIndex">Partition Index</label><i class="bar"></i>
                                                                        <small v-show="errors.has('partitionIndex')"
                                                                            class="help text-danger">
                                                                        {{ errors.first('partitionIndex') }}
                                                                    </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>

                                    <p>
                                    Are you sure you want to rewind subscription {{ subToClear }}?
                                    </p>
                                </div>
                                </vuestic-modal>
                                <vuestic-modal ref="expireSubModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="expireSub()"
                                            v-on:cancel="subToModify=''"
                                            :okDisabled="!isFormValid"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Expire Message</div>
                                <div>
                                    <div class="va-layout">
                                        <div class="va-row">
                                                <div class="flex md6">
                                                    <div  class="form-group">
                                                        <div class="input-group">
                                                        <vuestic-date-picker
                                                            id="rewind-time-input"
                                                            v-model="expireDateTime"
                                                            :config="{enableTime: true}"
                                                        />
                                                        <label class="control-label" for="rewind-time-input">Target Date and Time</label>
                                                        <i class="bar"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <p>Messages older than the target date and time will be removed from the subscription.</p>
                                </div>
                                </vuestic-modal>
                                <vuestic-modal ref="peekSubModal"
                                            :okText="'modal.ok' | translate"
                                            v-on:ok="resetPeek()"
                                            v-on:cancel="resetPeek()"
                                            v-bind:large="true"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Peek Messages</div>
                                <div>
                                    <div class="table-responsive">
                                        <table class="table table-striped first-td-padding table-header-active">
                                        <thead>
                                        <tr>
                                            <td>Position</td>
                                            <td>Publish Time</td>
                                            <td>Batch Size</td>
                                            <td>View</td>
                                            <td>Content</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(messageInfo, index) in peekMessages" :key="index">
                                                <td>
                                                    {{ messageInfo.position}}
                                                </td>
                                                <td>
                                                    {{ messageInfo.publishTime}}
                                                </td>
                                                <td>
                                                    {{ messageInfo.batchSize}}
                                                </td>
                                                <td>
                                                  <i class="fa fa-eye pointer icon-medium" @click="showMessage(index)"></i>
                                                </td>
                                                <td>
                                                   <div>
                                                    {{ truncateString(messageInfo.content, maxLength) }}
                                                   </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                    <button class="btn btn-micro" :disabled="peekHasNoMore" @click="peekSub()">More</button>

                                </div>
                                </vuestic-modal>
                                <vuestic-modal ref="showMessageModal"
                                            :okText="'modal.ok' | translate"
                                            v-bind:large="true"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">View Message</div>
                                <div>
                                 <textarea :value="currentPeekedMessage" :rows="peekRows" style="width: 100%;">
                                 </textarea>
                                  <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="currentPeekedMessage"
                                  v-clipboard:success="onCopy" v-clipboard:error="onError">
                                  </i>
                                </div>
                                </vuestic-modal>

                    </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiService from '@/services/ApiService'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import lodash from 'lodash'
import FilterBar
  from '../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'

export default {
  name: 'TopicSubscriptionTab',
  mixins: [mixins],
  components: {
    FilterBar,
    Alert
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig'
    ]),
    isFormValid () {
      // return Object.keys(this.formFields).every(key => this.formFields[key].valid);
      return Object.keys(this.formKeysToValidate).every(key => this.formFields[key].valid)
    },
    isCreateFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    sortedList () {
      let subscriptionKeys = Object.keys(this.topicStats.data[this.$route.params.id].stats.subscriptions)
      let subscriptionList = new Array
            subscriptionKeys.forEach(element => {
              let subscription = this.topicStats.data[this.$route.params.id].stats.subscriptions[element]
              subscription.subscriptionName = element
              subscription.numConsumers = 0
              if (subscription.consumers) {
                subscription.numConsumers = subscription.consumers.length
              }
              subscriptionList.push(subscription)
            })

      this.totalRow = subscriptionList.length

        return subscriptionList.sort((a,b) => {
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
  data () {
    return {
      isDeleted: '',
      errorText: 'Something went wrong',
      showSubModal: false,
      showClearModal: false,
      subToDelete: '',
      subToClear: '',
      subToModify: '',
      formKeysToValidate: {},
      nameFilter: '',
      rewindDateTime: '',
      typeFilter: '',
      rewindType: 'time',
      skipType: 'all',
      skipNumber: 1,
      entryId: 0,
      ledgerId: 0,
      peekMessages: [],
      peekRows: 5,
      currentPeekedMessage: '',
      partitionIndex: -1,
      expireDateTime: '',
      subToPeek: '',
      currentPeekIdx: 1,
      maxLength: 70,
      peekHasNoMore: false,
      subPosition: 'latest',
      createEntryId: 0,
      createLedgerId: 0,
      createPartitonIndex: -1,
      subToCreate: '',
      typeList: ['Exclusive', 'Shared', 'Failover'],
      sortBy: 'subscriptionName',
      sortDir: 'asc',
      pageSize: 10,
      pageSizeMenu: [10, 20, 50, 100],
      currentPage: 1,
      totalRow: 0
    }
  },
  methods: {
    clearAll () {
      this.nameFilter = ''
      this.typeFilter = ''
    },
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
    confirmDeleteSub (subName) {
      this.subToDelete = subName
      this.$refs.deleteSubModal.open()
    },
    openCreateSubModal () {
      this.getLastMessageId()

      if (this.subToCreate === '') {
        this.subToCreate = lodash.uniqueId('sub-')
      }

      this.formKeysToValidate = {
        'createEntryId': '',
        'createLedgerId': '',
        'subscriptionName': ''
      }
      this.$refs.createSubModal.open()
    },
    confirmClearSub (subName) {
      this.subToClear = subName
      this.formKeysToValidate = {
        'skipNumber': '',
      }
      this.$refs.clearSubModal.open()
    },
    openPeekSub (subName) {
      this.subToPeek = subName
      this.peekHasNoMore = false
      this.peekSub()
      this.$refs.peekSubModal.open()
      this.currentPeekIdx = 1
    },
    showMessage (index) {
      this.currentPeekedMessage = this.peekMessages[index].content

      const lines = this.currentPeekedMessage.split(/\r\n|\r|\n/).length
      const textChunks = Math.round((this.currentPeekedMessage.length) / 100)

      if (textChunks > lines) {
        this.peekRows = textChunks
      } else {
        this.peekRows = lines
      }
      this.$refs.showMessageModal.open()
    },
    resetPeek () {
      this.currentPeekIdx = 1
      this.peekMessages = []
    },
    openRewindSub (subName) {
      this.subToModify = subName
      var today = new Date()
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      this.rewindDateTime = date + ' ' + time

      this.getLastMessageId()
      this.formKeysToValidate = {
        'entryId': '',
        'ledgerId': '',
      }

      this.$refs.rewindSubModal.open()
    },
    openExpireSub (subName) {
      this.subToModify = subName
      var today = new Date()
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      this.expireDateTime = date + ' ' + time
      this.$refs.expireSubModal.open()
    },
    showSub (subscription, topicStat) {
      let showSub = true

      if (this.nameFilter) {
        if (subscription.toUpperCase().search(this.nameFilter.toUpperCase()) === -1) {
          showSub = false
        }
      }

      if (this.typeFilter) {
        if (topicStat.type !== this.typeFilter) {
          showSub = false
        }
      }

      return showSub
    },
    async createSub () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToCreate
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      try {
        if (this.subPosition === 'latest') {
          const response = await ApiService.createSubscriptionLatest(cluster, type, topicPath, subName)
        } else if (this.subPosition === 'earliest') {
          const response = await ApiService.createSubscriptionPosition(cluster, type, topicPath, subName, -1, -1, -1)
        } else if (this.subPosition === 'number') {
          const response = await ApiService.createSubscriptionPosition(cluster, type, topicPath, subName, this.createLedgerId, this.createEntryId, this.createPartitonIndex)
        } else {
          console.log(`Position ${this.subPosition} not found`)
          return
        }
        // Force an update to the topic immediately
        this.$store.dispatch('updateTopic', this.topicsConfig.data[this.$route.params.id])

        this.onSuccess('Created subscription')

        this.subToCreate = lodash.uniqueId('sub-')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating subscription: ${subName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
      }
    },
    async deleteSub () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToDelete
      this.isDeleted = subName
      let infoObject = this.topicStats.data[this.$route.params.id].info
      console.log(infoObject)
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type
      if (type === 'partitioned') {
        type = 'persistent'
      }
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteSubscription(cluster, type, topicPath, subName)
        // Force an update to the topic immediately
        this.$store.dispatch('updateTopic', this.topicsConfig.data[this.$route.params.id])

        this.onSuccess('Deleted subscription')

        // Reset isDeleted
        
        setTimeout(() => {
          // Wait a bit to let screen refresh
          this.isDeleted = ''
        }, 2000)

      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting subscription: ${subName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async clearBacklog () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToClear
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        if (this.skipType === 'all') {
          const response = await ApiService.clearBacklog(cluster, type, topicPath, subName)
        } else {
          const response = await ApiService.clearBacklogNumber(cluster, type, topicPath, subName, this.skipNumber)
        }
        // Force an update to the topic immediately
        this.$store.dispatch('updateTopic', this.topicsConfig.data[this.$route.params.id])
        this.onSuccess('Skipped messages')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Clearing subscription backlog: ${subName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
        this.subToClear = ''
      }
    },
    async getLastMessageId () {
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.lastMessageId(cluster, type, topicPath)

        this.entryId = response.data.entryId
        this.ledgerId = response.data.ledgerId
        this.createEntryId = response.data.entryId
        this.createLedgerId = response.data.ledgerId
      } catch (error) {
        console.log(error)
      }
    },
    async rewindSub () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToModify
      console.log('Sub to modify', this.subToModify)

      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type
      let timestamp = this.toTimestamp(this.rewindDateTime)

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        if (this.rewindType === 'time') {
          const response = await ApiService.rewindSubTime(cluster, type, topicPath, subName, timestamp)
        } else if (this.rewindType === 'position') {
          const response = await ApiService.rewindSubPosition(cluster, type, topicPath, subName, this.ledgerId, this.entryId, this.partitionIndex)
        }
        // Force an update to the topic immediately
        this.$store.dispatch('updateTopic', this.topicsConfig.data[this.$route.params.id])
        this.onSuccess('Rewound subscription')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)

        if (this.rewindType === 'time') {
          this.errorText = `Rewinding subscription: ${subName} to time ${this.rewindDateTime}. Reason: ${reason} (${statusCode})`
        } else if (this.rewindType === 'position') {
          this.errorText = `Rewinding subscription: ${subName} to position ${this.ledgerId}, ${this.entryId}. Reason: ${reason} (${statusCode})`
        }
        this.$refs.alert.showAlert()
        this.subToClear = ''
      }
    },
    async expireSub () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToModify
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      const now = new Date()
      const targetTime = new Date(this.expireDateTime)
      let expireSeconds = Math.round((now - targetTime) / 1000)


      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.expireSubTime(cluster, type, topicPath, subName, expireSeconds)
        // Force an update to the topic immediately
        this.$store.dispatch('updateTopic', this.topicsConfig.data[this.$route.params.id])
        this.onSuccess('Expired messages')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)

        this.errorText = `Expiring messages on subscription ${subName} older than ${this.expireDateTime}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        this.subToClear = ''
      }
    },
    truncateString (str, num) {
      if (str.length <= num) {
        return str
      }
      return str.slice(0, num) + '...'
    },
    async peekSub () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      const subName = this.subToPeek
      let infoObject = this.topicStats.data[this.$route.params.id].info
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const targetIdx = this.currentPeekIdx + 5
        for (this.currentPeekIdx; this.currentPeekIdx < targetIdx; this.currentPeekIdx++) {
          const response = await ApiService.peekSubIndex(cluster, type, topicPath, subName, this.currentPeekIdx)
          // console.log(response)
          const rawContent = response.data

          var message = ''
          if (typeof (rawContent) === 'number') {
            message = rawContent.toString()
          } else if (typeof (rawContent) === 'string') {
            message = rawContent
          } else if (typeof (rawContent) === 'object') {
            // Assume this is a JSON object
            message = JSON.stringify(rawContent, null, 4)
          } else {
            message = rawContent.toString()
          }

          // // Check for properties
          // let properties = ''
          // response.headers.forEach(header => {
          //   if (header.toLowerCase.includes('x-pulsar-property')) {
          //     properties = properties + header
          //   }
          // })

          // console.log(properties)

          this.peekMessages.push({
            position: response.headers['x-pulsar-message-id'],
            content: message,
            publishTime: response.headers['x-pulsar-publish-time'],
            batchSize: response.headers['x-pulsar-num-batch-message'],
            // properties: properties
          })
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        if (statusCode === 404) {
          this.peekHasNoMore = true
        } else {
          this.errorText = `Peeking messages on ${subName} at position ${this.currentPeekIdx}. Reason: ${reason} (${statusCode})`
          this.$refs.alert.showAlert()
          this.subToClear = ''
        }
      }
    },
    toTimestamp (strDate) {
      var datum = Date.parse(strDate)
      return datum
    },
  }
}
</script>

<style lang='scss'>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.btn-bottom-margin {
    margin-bottom: 10px;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0
}

.filters-page {
  &__tags {
    display: flex;
  }
  &__filter-bar {
    width: 300px;
  }
  &__filter-bar-container {
    margin: 0;
    justify-content: space-between;
  }
  &__table-heading {
    color: $brand-primary
  }
  &__collapse {
    .vuestic-collapse__body {
      background-color: white;
    }
  }
  &__clear-all-text {
    cursor: pointer;
    color: $brand-primary;
    margin-top: 0.3rem;
  }
}
@import "~flatpickr/dist/flatpickr.css";

$datepickerActive: $brand-primary;
$datepickerBackground: #333333;
$datepickerText: $white;

$datepickerToday: lighten($datepickerBackground, 5);
$datepickerOtherMonth: darken($datepickerText, 40);
$datepickerWeekday: darken($datepickerText, 50);
$datepickerDayHover: darken($datepickerText, 70);
$datepickerDayRange: $almost-black;
$datepickerSeparatorColor: $almost-black;

$borderPadding: 0.5rem;
$dayPadding: 0.375rem;
$daySize: 1.75rem;

.flatpickr-calendar {
  width: $daySize * 7 + $dayPadding * 6 + $borderPadding * 2 !important;
  background-color: $datepickerBackground;
  border-radius: 0;
  box-shadow: none;

  &.arrowTop {
    &:before {
      content: none;
      border-bottom-color: $datepickerBackground;
    }
    &:after {
      content: none;
      border-bottom-color: $datepickerBackground;
    }
  }

  &.arrowBottom {
    &:before {
      content: none;
      border-top-color: $datepickerBackground;
    }
    &:after {
      content: none;
      border-top-color: $datepickerBackground;
    }
  }

  .flatpickr-days {
    width: $daySize * 7 + $dayPadding * 6 + $borderPadding * 2 !important;
    padding: 0 $borderPadding $borderPadding;
    display: block;
    .dayContainer {
      width: ($daySize + $dayPadding) * 7;
      max-width: ($daySize + $dayPadding) * 7;
      min-width: ($daySize + $dayPadding) * 7;
      margin: -$dayPadding / 2;
      .flatpickr-day {
        height: $daySize;
        line-height: 1.7;
        font-size: 1rem;
        flex: 0 0 $daySize;
        margin: $dayPadding / 2;
        border: none;
        color: $datepickerText;
        &.today {
          color: $datepickerActive;
          &.selected {
            color: $datepickerText;
          }
        }
        &:hover {
          background-color: $datepickerDayHover;
        }
        &.selected {
          background-color: $datepickerActive;
        }
        &.nextMonthDay, &.prevMonthDay {
          color: $datepickerOtherMonth;
        }
        &.disabled {
          color: $datepickerOtherMonth;
          &:hover {
            background-color: inherit;
          }
        }
        &.startRange, &.endRange, &.inRange {
          border-radius: 2rem;
          box-shadow: none;
        }
        &.startRange, &.endRange {
          background-color: $datepickerActive;
        }
        &.inRange {
          background-color: $datepickerDayRange;
        }
      }
    }
  }

  .flatpickr-months {
    height: 2.625rem;
    border-bottom: solid 0.125rem $datepickerSeparatorColor;
    .flatpickr-month {
      height: 100%;
      .flatpickr-current-month {
        padding-top: 0.625rem;
        color: $datepickerText;
        .cur-month {
          font-size: 1rem;
          font-weight: inherit;
        }
        .cur-year {
          font-size: 1rem;
        }
        .numInputWrapper {
          .numInput.cur-year {
            color: $white;
          }

          .arrowUp {
            &:hover {
              &::after {
                border-bottom-color: $datepickerActive;
              }
            }
            &::after {
              border-bottom-color: $datepickerText;
            }
          }
          .arrowDown {
            &:hover {
              &::after {
                border-top-color: $datepickerActive;
              }
            }
            &::after {
              border-top-color: $datepickerText;
            }
          }
        }
      }
    }

    .flatpickr-prev-month, .flatpickr-next-month {
      height: 2.625rem;
      width: 1.625rem;
      @include va-flex-center();
      padding: 0;
      color: $datepickerText;
      &:hover {
        color: $datepickerActive;
      }
    }
  }

  .flatpickr-weekdays {
    padding: 0 $borderPadding;
    .flatpickr-weekdaycontainer {
      justify-content: space-between;
      .flatpickr-weekday {
        letter-spacing: 0.0625rem;
        flex: 0 0 $daySize;
        color: $datepickerWeekday;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.6875rem;
      }
    }
  }

  .flatpickr-weekwrapper {
    .flatpickr-weekday {
      text-transform: uppercase;
      letter-spacing: 0.0625rem;
      color: $datepickerWeekday;
      font-weight: bold;
      font-size: 0.6875rem;
    }
    .flatpickr-weeks {
      box-shadow: 2px 0 0 $datepickerSeparatorColor;
      padding-bottom: $borderPadding;
      margin-top: -$dayPadding;
      .flatpickr-day {
        height: $daySize;
        line-height: 1.7;
        font-size: 1rem;
        flex: 0 0 $daySize;
        margin-top: $dayPadding;
        color: $datepickerOtherMonth;
      }
    }
  }

  &.showTimeInput.hasTime .flatpickr-time {
    border-top: solid 0.125rem $datepickerSeparatorColor;

    .numInputWrapper {
      &:hover {
        background-color: $datepickerDayHover;
      }
      .numInput {
        color: $datepickerText;
        &:hover, &:focus {
          background: $datepickerDayHover;
        }
      }
      .arrowUp {
        &::after {
          border-bottom-color: $datepickerText;
        }
        &:hover::after {
          border-bottom-color: $datepickerActive;
        }
      }
      .arrowDown {
        &::after {
          border-top-color: $datepickerText;
        }
        &:hover::after {
          border-top-color: $datepickerActive;
        }
      }
    }
    .flatpickr-time-separator {
      color: $datepickerText;
    }
    .flatpickr-am-pm {
      color: $datepickerText;
      &:hover {
        background-color: $datepickerDayHover;
      }
    }
  }
}

.form-group {
  .flatpickr-input {
    width: 100%;
    background: none;
    outline: none;
    box-shadow: none;
  }
}

input[type=text] {
    background: transparent;
}

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
