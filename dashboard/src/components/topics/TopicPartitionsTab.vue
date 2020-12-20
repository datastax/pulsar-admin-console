<template>
    <div>
        <div class="va-row" v-if="topicStats.data[$route.params.id]">
            <alert ref="alert" :errorText="errorText"></alert>

            <div class="flex xs12 md12" v-if="topicStats.data[$route.params.id].info.partitioned">
                <vuestic-widget >

                    <div class="table-responsive">
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td v-if="isAdminUser"></td>
                            <td>{{'tables.headings.name' | translate}}</td>
                            <td>{{'tables.headings.msgRateIn' | translate}}</td>
                            <td>{{'tables.headings.msgRateOut' | translate}}</td>
                            <td>{{'tables.headings.msgThroughputIn' | translate}}</td>
                            <td>{{'tables.headings.msgThroughputOut' | translate}}</td>
                            <td>{{'tables.headings.averageMsgSize' | translate}}</td>
                            <td>{{'tables.headings.storageSize' | translate}}</td>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(partitionInfo, partIdx) in topicStats.data[$route.params.id].stats.partitions" v-bind:key="partIdx">
                                <td v-if="isAdminUser">
                                <button class="btn btn-primary btn-micro btn-bottom-margin" @click="unloadTopic(partIdx)">Unload</button>
                                </td>
                                <td>
                                    <a href="#" @click="gotoPartionedTopic(partIdx)">
                                        {{ partIdx}}
                                    </a>

                                    <i class="fa fa-clipboard pointer icon-table"
                                        v-clipboard:copy="partIdx"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError">
                                    </i>
                                </td>
                                <td class="no-wrap">{{ partitionInfo.msgRateIn | numberSeparate() }}</td>
                                <td class="no-wrap">{{ partitionInfo.msgRateOut | numberSeparate() }}</td>
                                <td align="right">{{ partitionInfo.msgThroughputIn | humanBytes }}</td>
                                <td align="right">{{ partitionInfo.msgThroughputOut | humanBytes }}</td>
                                <td>{{ partitionInfo.averageMsgSize | humanBytes }}</td>
                                <td>{{ partitionInfo.storageSize | humanBytes }}</td>

                            </tr>
                        </tbody>
                        </table>
                    </div>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'


export default {
  name: 'TopicPartitionsTab',
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'activeCluster',
      'isAdminUser'
    ]),

  },
  data () {
    return {
      errorText: 'Something went wrong',
    }
  },
  components: {
    Alert
  },
  methods: {
    gotoPartionedTopic (url) {
      const topicParts = url.match(/(^.+):\/\/(.+?)\/(.+?)\/(.+?$)/)
      const topicPath = topicParts[2] + '/' + topicParts[3] + '/' + topicParts[4]
      const topicId = this.activeCluster + ':' + topicPath.replace(/\//g, ':')
      this.$router.push('/admin/topic/' + topicId)
      this.$store.dispatch('setActiveTopicDetailTab', this.$t('topicDetail.tabs.overview'))
    },

    async unloadTopic (url) {
      this.unloading = true
      const infoObject = this.topicsConfig.data[this.$route.params.id]
      const topicParts = url.match(/(^.+):\/\/(.+?)\/(.+?)\/(.+?$)/)

      let topic = topicParts[4]
      let tenant = topicParts[2]
      let namespace = topicParts[3]

      const topicPath = `${tenant}/${namespace}/${topic}`
      try {
        await ApiService.unloadTopic(this.activeCluster, topicPath)
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

<style scoped>

</style>
