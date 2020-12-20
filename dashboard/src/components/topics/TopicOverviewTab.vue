<template>

  <div class="topic-overview-tab">
  <alert ref="alert" :errorText="errorText"></alert>
    <vuestic-modal :show.sync="showTopicModal" ref="deleteTopicModal"
                  :okText="'modal.confirm' | translate"
                  v-on:ok="deleteTopic()"
                  :cancelText="'modal.cancel' | translate">

      <div slot="title">Delete Topic</div>
      <div>
          Are you sure you want to delete topic {{ topicsConfig.data[$route.params.id].name }}?
      </div>
    </vuestic-modal>

    <div class="va-row">
      <div class="flex md12">
        <vuestic-widget>

            <div v-if="topicStats.data[$route.params.id]" class="va-row">

                <div class="flex md4">

                    <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="topicStats.data[$route.params.id].info.name" id="topic-name" name="topic-name"
                          class="has-value" placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicStats.data[$route.params.id].info.name"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-name" role="button">{{'forms.inputs.name'
                          | translate}}</label><i class="bar"></i>
                      </div>
                    </div>
                    <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="toTitleCase(topicStats.data[$route.params.id].info.type)" id="topic-type" name="topic-type"
                          class="has-value" placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicStats.data[$route.params.id].info.type"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-type" role="button">{{'forms.inputs.type'
                          | translate}}</label><i class="bar"></i>
                      </div>
                    </div>
                    <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="topicStats.data[$route.params.id].info.namespace" id="topic-namespace" name="topic-namespace"
                          class="has-value" placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicStats.data[$route.params.id].info.namespace"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-namespace" role="button">{{'forms.inputs.namespace'
                          | translate}}</label><i class="bar"></i>
                      </div>
                    </div>
                    <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="topicStats.data[$route.params.id].info.cluster" id="topic-cluster" name="topic-cluster"
                          class="has-value" placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicStats.data[$route.params.id].info.cluster"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-cluster" role="button">{{'forms.inputs.cluster'
                          | translate}}</label><i class="bar"></i>
                      </div>
                    </div>
                    <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="tenant" id="tenant" name="tenant"
                          class="has-value" placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="tenant"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="tenant" role="button">Tenant</label><i class="bar"></i>
                      </div>
                    </div>
                    <div class="va-row">
                      <div class="flex md6">
                        <div class="form-group">
                          <div class="input-group">
                            <input :value="ttlHuman" id="title" name="title"
                              class="has-value" placeholder="" readonly />
                            <label class="control-label" for="title" role="button">{{'forms.inputs.ttl'
                              | translate}}</label><i class="bar"></i>
                          </div>
                        </div>
                      </div>
                        <div class="flex md12">
                          <div class="form-group">
                            <div class="input-group">
                              <input :value="retentionHuman" id="retention" name="retention"
                                class="has-value" placeholder="" readonly />
                              <label class="control-label" for="retention" role="button">{{'forms.inputs.retention'
                                | translate}}</label><i class="bar"></i>
                            </div>
                          </div>
                        </div>
                      <div v-if="topicStats.data[this.$route.params.id].stats.deduplicationStatus" class="flex md6">
                        <div class="form-group">
                          <div class="input-group">
                            <input :value="topicStats.data[this.$route.params.id].stats.deduplicationStatus" id="duplication" name="duplication"
                              class="has-value" placeholder="" readonly />
                            <label class="control-label" for="duplication" role="button">{{'forms.inputs.deduplicationEnabled'
                              | translate}}</label><i class="bar"></i>
                          </div>
                        </div>
                      </div>
                      <div class="flex md6">
                        <div class="form-group">
                          <div class="input-group">
                            <input :value="storageLimitHuman" id="storageLimit" name="storageLimit"
                              class="has-value" placeholder="" readonly />
                            <label class="control-label" for="storageLimit" role="button">Backlog Limit</label><i class="bar"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="topicsConfig.data[this.$route.params.id].bookkeeperEnsemble" class="va-row">
                        <div class="flex md6">
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="topicsConfig.data[this.$route.params.id].bookkeeperEnsemble" id="book" name="book"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="book" role="button">Storage Nodes</label><i class="bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="flex md6">
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="topicsConfig.data[this.$route.params.id].bookkeeperWriteQuorum" id="quorum" name="quorum"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="quorum" role="button">Number of Copies</label><i class="bar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="topicsConfig.data[this.$route.params.id].bookkeeperAckQuorum" class="va-row">
                        <div class="flex md6">
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="topicsConfig.data[this.$route.params.id].bookkeeperAckQuorum" id="ack-quorum" name="ack-quorum"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="ack-quorum" role="button">Writes Before Ack</label><i class="bar"></i>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="flex md4">

                    <div class="flex md12">
                      <vuestic-widget class="vuestic-widget info-widget">
                        <div class="info-widget-inner">
                          <div class="info-widget-inner has-chart">
                            <div class="stats">
                              <div class="stats-number">
                                {{ topicStats.data[$route.params.id].stats.storageSize | humanBytes }}
                              </div>
                              <div class="stats-title">Storage</div>
                            </div>
                            <!-- <div class="chart-container">
                                  <vuestic-progress-bar type="vertical" :value="calcStorePercent" theme="Primary"
                                                      backgroundTheme="White"/>
                              </div> -->
                          </div>
                        </div>
                      </vuestic-widget>
                    </div>

                  <div @click="onWidgetClick('topicDetail.tabs.producers')" style="cursor: pointer" class="flex md12">

                        <vuestic-widget class="info-widget">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner has-chart">
                              <div class="stats">
                                <div class="stats-number">
                                  {{ topicStats.data[$route.params.id].info.producers }}
                                </div>
                                <div class="stats-title">{{'topicDetail.producers' | translate}} </div>
                              </div>
                              <div class="chart-container">
                                <vuestic-progress-bar type="vertical" :value="producerPercent" :animated="animated" theme="Primary"
                                                      backgroundTheme="White"/>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>

                      </div>

                      <div @click="onWidgetClick('topicDetail.tabs.consumers')" style="cursor: pointer" class="flex md12">

                        <vuestic-widget class="info-widget">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner has-chart">
                              <div class="stats">
                                <div class="stats-number">
                                  {{ topicStats.data[$route.params.id].info.consumers }}
                                </div>
                                <div class="stats-title">{{'topicDetail.consumers' | translate}}</div>
                              </div>
                              <div class="chart-container">
                                <vuestic-progress-bar type="vertical" :value="consumerPercent" :animated="animated" theme="Primary"
                                                      backgroundTheme="White"/>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>
                      <div class="va-row" v-if="topicsConfig.data[this.$route.params.id].schemaAutoUpdate">
                      <div class="flex md6">
                          <div class="form-group">
                              <div class="input-group">
                                  <input :value="toTitleCase(topicsConfig.data[this.$route.params.id].schemaAutoUpdate)" id="schemaAutoUpdate" name="schemaAutoUpdate"
                                  class="has-value" placeholder="" readonly />
                                  <label class="control-label" for="schemaAutoUpdate" role="button">Schema Auto Update</label><i class="bar"></i>
                              </div>
                          </div>
                      </div>
                      <div class="flex md6">
                          <div class="form-group">
                              <div class="input-group">
                                  <input :value="toTitleCase(topicsConfig.data[this.$route.params.id].enforceSchema)" id="enforceSchema" name="enforceSchema"
                                  class="has-value" placeholder="" readonly />
                                  <label class="control-label" for="enforceSchema" role="button">Enforce Schema</label><i class="bar"></i>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="va-row" v-if="topicsConfig.data[this.$route.params.id].compatMode">
                      <div class="flex md6">
                          <div class="form-group">
                              <div class="input-group">
                                  <input :value="topicsConfig.data[this.$route.params.id].compatMode" id="compatMode" name="compatMode"
                                  class="has-value" placeholder="" readonly />
                                  <label class="control-label" for="compatMode" role="button">Schema Compatability Check</label><i class="bar"></i>
                              </div>
                          </div>
                      </div>
                      <div class="flex md6">
                          <div class="form-group">
                              <div class="input-group">
                                  <input :value="humanCompactionThreshold" id="compactionThreshold" name="compactionThreshold"
                                  class="has-value" placeholder="" readonly />
                                  <label class="control-label" for="compactionThreshold" role="button">Compaction Threshold</label><i class="bar"></i>
                              </div>
                          </div>
                      </div>
                    </div>
                </div>
                <div class="flex md4">
                    <div class="va-row">
                      <div class="flex md6">
                        <vuestic-widget class="vuestic-widget info-widget brand-info">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner">
                              <div class="stats">
                                <div class="stats-number no-wrap">
                                  {{ topicStats.data[$route.params.id].info.inRate | numberSeparate() }}
                                </div>
                                <div class="stats-title">Msg/s In</div>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div class="flex md6">
                        <vuestic-widget class="vuestic-widget">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner">
                              <div class="stats">
                                <div class="stats-number">
                                  {{ topicStats.data[$route.params.id].info.inTput | humanBytes('0.0', 'number') }}
                                </div>
                                <div class="stats-title">{{ topicStats.data[$route.params.id].info.inTput | humanBytes('0.0', 'unit') }} In</div>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div class="flex md6 ">
                        <vuestic-widget class="vuestic-widget info-widget brand-info">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner">
                              <div class="stats">
                                <div class="stats-number no-wrap">
                                  {{ topicStats.data[$route.params.id].info.outRate | numberSeparate() }}
                                </div>
                                <div class="stats-title">Msg/s Out</div>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div class="flex md6 ">
                        <vuestic-widget class="vuestic-widget ">
                          <div class="info-widget-inner">
                            <div class="info-widget-inner">
                              <div class="stats">
                                <div class="stats-number">
                                  {{ topicStats.data[$route.params.id].info.outTput | humanBytes('0.0', 'number') }}
                                </div>
                                <div class="stats-title">{{ topicStats.data[$route.params.id].info.outTput | humanBytes('0.0', 'unit') }} Out</div>
                              </div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>
                      <div @click="onWidgetClick('topicDetail.tabs.subscriptions')" style="cursor: pointer" class="flex md6">
                        <vuestic-widget class="info-widget">
                          <div class="info-widget-inner">
                            <div class="stats">
                              <div class="stats-number">
                                {{ topicStats.data[$route.params.id].info.subscriptions }}
                              </div>
                              <div class="stats-title">{{'topicDetail.subscriptions' | translate}}</div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div @click="onWidgetClick('topicDetail.tabs.replClusters')" style="cursor: pointer" class="flex md6">
                        <vuestic-widget class="info-widget">
                          <div class="info-widget-inner">
                            <div class="stats">
                              <div class="stats-number">
                                {{ topicStats.data[$route.params.id].info.replClusters }}
                              </div>
                              <div class="stats-title">{{'topicDetail.replClusters' | translate}}</div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div v-if="topicStats.data[this.$route.params.id].info.partitioned" @click="onWidgetClick('topicDetail.tabs.partitions')" style="cursor: pointer" class="flex md6">
                        <vuestic-widget class="info-widget">
                          <div class="info-widget-inner">
                            <div class="stats">
                              <div class="stats-number">
                                {{ topicStats.data[$route.params.id].stats.metadata.partitions }}
                              </div>
                              <div class="stats-title">Partitions</div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                      <div v-if="topicStats.data[this.$route.params.id].info.type === 'non-persistent'" class="flex md6">
                        <vuestic-widget class="info-widget brand-info">
                          <div class="info-widget-inner">
                            <div class="stats">
                              <div class="stats-number no-wrap">
                                {{ topicStats.data[$route.params.id].stats.msgDropRate | numberSeparate() }}
                              </div>
                              <div class="stats-title">{{'tables.headings.msgDropRate' | translate}}</div>
                            </div>
                          </div>
                        </vuestic-widget>
                      </div>

                    </div>

                    <div class="va-row">
                    </div>
                </div>
            </div>
            <div v-if="topicsConfig.data[$route.params.id]" class="va-row">

                <div class="flex md8">
                  <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="topicsConfig.data[$route.params.id].url" id="topic-url" name="topic-url" class="has-value force-wrap"
                          placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicsConfig.data[$route.params.id].url"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-url" role="button">{{'forms.inputs.url'
                          | translate}}</label><i class="bar"></i>
                      </div>
                  </div>
                  <div class="form-group with-icon-right">
                      <div class="input-group">
                        <input :value="topicsConfig.data[$route.params.id].path" id="topic-path" name="topic-path" class="has-value force-wrap"
                          placeholder="" readonly />
                        <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="topicsConfig.data[$route.params.id].path"
                          v-clipboard:success="onCopy" v-clipboard:error="onError">
                        </i>
                        <label class="control-label" for="topic-path" role="button">{{'forms.inputs.topicPath'
                          | translate}}</label><i class="bar"></i>
                      </div>
                  </div>
                </div>
                <div  class="flex md4">
                  <div v-if="topicStats.data[this.$route.params.id] && !topicsConfig.data[$route.params.id].partitioned && isAdminUser" class="va-row">
                      <div class="flex md12">
                        <button :disabled="unloading" class="btn btn-primary btn-left" @click="unloadTopic()">Unload</button>
                      </div>
                    </div>
                    <div  v-if="topicStats.data[this.$route.params.id] && topicStats.data[this.$route.params.id].info.type !== 'non-persistent'" class="va-row">
                      <div class="flex md12">
                        <button :disabled="compacting" class="btn btn-primary btn-left" @click="compactTopic()">Compact</button>
                      </div>
                    </div>
                    <div v-if="topicStats.data[this.$route.params.id] && topicStats.data[this.$route.params.id].info.type !== 'non-persistent' && isAdminUser"  class="va-row">
                      <div class="flex md12">
                        <button :disabled="offloading" class="btn btn-primary btn-left" @click="offloadTopic()">Offload</button>
                      </div>
                    </div>
                    <div class="va-row">
                      <div class="flex md12">
                        <fieldset>
                          <button :disabled="isDeleted" class="btn btn-primary" @click="confirmDeleteTopic()">Delete</button>
                          <div style="display: inline-block;">
                            <vuestic-checkbox :label="$t('forms.controls.forceDelete')" v-model="forceCheckbox" />
                          </div>
                        </fieldset>
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
import ApiService from '@/services/ApiService'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'TopicOverviewTab',
  data () {
    return {
      errorText: 'Something went wrong',
      isDeleted: false,
      forceCheckbox: false,
      empty: '',
      showTopicModal: false,
      animated: true,
      compacting: false,
      offloading: false,
      unloading: false,
      compactStatus: 'NOT_STARTED',
      offloadStatus: 'NOT_STARTED',
      compactPollLoop: 0
    }
  },
  components: {
    Alert
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'activeCluster',
      'tenant',
      'isAdminUser'
    ]),
    ttlHuman () {
      if (this.topicsConfig.data[this.$route.params.id].ttl > 0) {
        return this.$options.filters.humanSeconds(this.topicsConfig.data[this.$route.params.id].ttl)
      }
      return 'Forever'
    },
    humanCompactionThreshold () {
      const thresh = this.topicsConfig.data[this.$route.params.id].compactionThreshold
      if (thresh === 0) {
        return 'Disabled'
      } else {
        return this.$options.filters.humanBytes(thresh)
      }
    },
    retentionHuman () {
      if (this.topicsConfig.data[this.$route.params.id].retentionTime > 0) {
        return this.$options.filters.humanSeconds(this.topicsConfig.data[this.$route.params.id].retentionTime, 'minutes')
      }
      if (this.topicsConfig.data[this.$route.params.id].retentionTime === -1) {
        return 'Forever'
      }

      return 'Until acknowledged'
    },
    
    retentionHuman () {

      let retentionSize = 0
      let retentionTime = 0
      if (this.topicsConfig.data[this.$route.params.id]) {
        retentionSize = this.topicsConfig.data[this.$route.params.id].retentionSize
        retentionTime = this.topicsConfig.data[this.$route.params.id].retentionTime
      }

      // If either time or size is 0, then retention is disabled
      if (retentionTime === 0 || retentionSize === 0) {return "Until Acknowledged"}

      // If both are -1, infinite
       if (retentionTime === -1 && retentionSize === -1 ) {return "Forever"}

      // If time is -1, return size
      if (retentionTime === -1) {return this.$options.filters.humanBytes(retentionSize*1000*1000)}

      // If size is -1, return time
      if (retentionSize === -1 ) {return this.$options.filters.humanSeconds(retentionTime*60)}

      return this.$options.filters.humanBytes(retentionSize*1000*1000) + " or " + this.$options.filters.humanSeconds(retentionTime*60)

    },
    numProducers () {
      return this.topicStats.data[this.$route.params.id].info.producers
    },
    numConsumers () {
      return this.topicStats.data[this.$route.params.id].info.producers
    },
    producerPercent () {
      return this.calcProducerPercent()
    },
    consumerPercent () {
      return this.calcConsumerPercent()
    },
    calcStorePercent () {
      const currentStorage = this.topicStats.data[this.$route.params.id].stats.storageSize
      const storageLimit = this.topicsConfig.data[this.$route.params.id].quota
      // console.log(currentStorage / storageLimit)
      if (storageLimit > 0) {
        return Math.round((currentStorage / storageLimit) * 100)
      } else {
        return 0
      }
    },
    storageLimitHuman () {
      const limit = this.topicsConfig.data[this.$route.params.id].quota

      if (limit > 0) {
        return this.$options.filters.humanBytes(limit)
      }
      return 'Unlimited'
    }

  },
  mixins: [mixins],
  methods: {
    calcProducerPercent () {
      if (this.topicsConfig.data[this.$route.params.id].maxProducers) {
        return Math.round((this.topicStats.data[this.$route.params.id].info.producers / this.topicsConfig.data[this.$route.params.id].maxProducers) * 100)
      } else {
        return 0
      }
    },
    calcConsumerPercent () {
      if (this.topicsConfig.data[this.$route.params.id].maxConsumersTopic) {
        return Math.round((this.topicStats.data[this.$route.params.id].info.consumers / this.topicsConfig.data[this.$route.params.id].maxConsumersTopic) * 100)
      } else {
        return 0
      }
    },
    confirmDeleteTopic () {
      this.$refs.deleteTopicModal.open()
    },
    onWidgetClick (value) {
      let nameParts = value.match(/^topicDetail\.tabs\.(.+?$)/)
      let statName = nameParts[1]
      if (this.topicStats.data[this.$route.params.id] &&
            this.topicStats.data[this.$route.params.id].info[statName] > 0) {
        this.$store.dispatch('setActiveTopicDetailTab', this.$t(value))
      }
    },
    async deleteTopic () {
      this.isDeleted = true
      const force = this.forceCheckbox
      let infoObject = this.topicsConfig.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let name = infoObject.name
      let type = infoObject.type

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        if (infoObject.partitioned) {
          if (force === false) {
            await ApiService.deletePartitionedTopic(cluster, topicPath)
          } else {
            await ApiService.forceDeletePartitionedTopic(cluster, topicPath)
          }
        } else {
          if (force === false) {
            await ApiService.deleteTopic(cluster, type, topicPath)
          } else {
            await ApiService.forceDeleteTopic(cluster, type, topicPath)
          }
        }
        this.onSuccess('Topic deleted')
        // Need to update master list of topics
        this.$store.dispatch('getTopics')
        // Need to delete the stats entry for the topic
        this.$store.dispatch('purgeTopic', this.$route.params.id)
        // Redirect to the topic summary page
        this.$router.push('/admin/topics')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting topic: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = false
      }
    },
    async pollForCompactionComplete () {
      // console.log('Polling for compaction complete')
      const infoObject = this.topicsConfig.data[this.$route.params.id]
      if (this.compactStatus !== 'SUCCESS') {
        try {
          const response = await ApiService.getCompactionStatus(infoObject.cluster, infoObject.path)
          this.compactStatus = response.data.status
          console.log(this.compactStatus)
          if (this.compactStatus === 'SUCCESS') {
            this.compacting = false
            this.compactStatus = 'NOT_STARTED'
            this.onSuccess('Topic compacted')
            this.compactPollLoop = 0
          } else if (this.compactStatus === 'ERROR') {
            this.compacting = false
            this.compactStatus = 'NOT_STARTED'
            this.errorText = `Compacting topic: ${name}.`
            this.$refs.alert.showAlert()
            this.compactPollLoop = 0
          } else if (this.compactStatus === 'NOT_RUN') {
            this.compacting = false
            this.compactStatus = 'NOT_STARTED'
            this.errorText = `Compacting topic: ${name} did not run.`
            this.$refs.alert.showAlert()
            this.compactPollLoop = 0
          } else {
            this.compactPollLoop++
            if (this.compactPollLoop < 30) {
              setTimeout(this.pollForCompactionComplete, 2000)
            } else {
              this.compacting = false
              this.compactStatus = 'NOT_STARTED'
              this.errorText = `Compacting topic: ${name} timed out.`
              this.$refs.alert.showAlert()
              this.compactPollLoop = 0
            }
          }
        } catch (error) {
          let [reason, statusCode] = this.decodeErrorObject(error)
          this.errorText = `Getting compaction status of topic: ${name}. Reason: ${reason} (${statusCode})`
          this.$refs.alert.showAlert()
          // If the call fails, release the compat button
          this.compacting = false
          this.compactStatus = 'NOT_STARTED'
        }
      }
    },
    async pollForOffloadComplete () {
      console.log('Polling for offload complete')
      const infoObject = this.topicsConfig.data[this.$route.params.id]
      if (this.offloadStatus !== 'SUCCESS') {
        try {
          const response = await ApiService.getOffloadStatus(infoObject.cluster, infoObject.path)
          console.log(response)
          this.offloadStatus = response.data.status
          let offloadError = response.data.lastError
          console.log(this.offloadStatus)
          if (this.offloadStatus === 'SUCCESS') {
            this.offloading = false
            this.offloadStatus = 'NOT_STARTED'
            this.onSuccess('Topic offloaded')
          } else if (this.offloadStatus === 'ERROR') {
            this.offloading = false
            this.offloadStatus = 'NOT_STARTED'
            this.errorText = `Offloading topic: ${name}: ${offloadError}`
            this.$refs.alert.showAlert()
          } else {
            setTimeout(this.pollForOffloadComplete, 2000)
          }
        } catch (error) {
          let [reason, statusCode] = this.decodeErrorObject(error)
          this.errorText = `Getting offload status of topic: ${name}. Reason: ${reason} (${statusCode})`
          this.$refs.alert.showAlert()
          // If the call fails, release the compat button
          this.offloading = false
          this.offloadStatus = 'NOT_STARTED'
        }
      }
    },
    async compactTopic () {
      this.compacting = true
      let infoObject = this.topicsConfig.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let name = infoObject.name

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.compactTopic(cluster, topicPath)
        this.pollForCompactionComplete()
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Compacting topic: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the compat button
        this.compacting = false
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
        console.log(response)
        return {
          entryId: response.data.entryId,
          ledgerId: response.data.ledgerId
        }
      } catch (error) {
        console.log(error)
      }
    },
    async offloadTopic () {
      this.offloading = true
      let infoObject = this.topicsConfig.data[this.$route.params.id]
      let cluster = infoObject.cluster
      let topicPath = infoObject.path
      let name = infoObject.name

      // Get the last message ID
      const lastMessageInfo = await this.getLastMessageId()
      console.log(lastMessageInfo)
      if (!lastMessageInfo) {
        // If we don't get a last message ID, bial
        this.errorText = `Could not get last message ID for topic ${name}.`
        this.$refs.alert.showAlert()
        // If the call fails, release the compat button
        this.offloading = false
        return
      }
      const ledgerId = lastMessageInfo.ledgerId
      const entryId = lastMessageInfo.entryId
      if (entryId < 0) {
        this.errorText = `The topic ${name} cannot be offloaded because it is empty.`
        this.$refs.alert.showAlert()
        // If the call fails, release the compat button
        this.offloading = false
        return
      }
      const partitionIndex = -1
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.offloadTopic(cluster, topicPath, ledgerId, entryId, partitionIndex)
        this.pollForOffloadComplete()
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Offloading topic: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the compat button
        this.offloading = false
      }
    },
    async unloadTopic () {
      this.unloading = true
      const infoObject = this.topicsConfig.data[this.$route.params.id]
      try {
        await ApiService.unloadTopic(infoObject.cluster, infoObject.path)
        this.onSuccess('Topic unloaded')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Unloading topic: ${name}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      } finally {
        this.unloading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0
}
.btn-right {
  float: right ;
}
.force-wrap {
  word-wrap: break-word;
}

</style>
