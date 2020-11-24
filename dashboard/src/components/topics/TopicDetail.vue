<template>
  <div class="topicDetail" v-if="topicsConfig.data[$route.params.id] && topicsConfig.data[$route.params.id].cluster === activeCluster">
    <vuestic-widget :headerText="pageTitle()" :class="{ globebackground: isGlobal(), partitionbackground: isPartition()}"
                    >
      <topic-tabs class="tabs"
                    :names="tabNames">
        <div :slot="'topicDetail.tabs.overview' | translate"
             class="flex justify--center">
          <topic-overview-tab></topic-overview-tab>
        </div>
        <div v-if="topicStats.data[$route.params.id] && topicStats.data[$route.params.id].info.producers" :slot="'topicDetail.tabs.producers' | translate" class="producers-tab">
          <topic-producers-tab></topic-producers-tab>
        </div>
        <div :slot="'topicDetail.tabs.subscriptions' | translate" class="subscriptions-tab">
          <topic-subscriptions-tab></topic-subscriptions-tab>
        </div>
        <div v-if="topicStats.data[$route.params.id] && topicStats.data[$route.params.id].info.consumers" :slot="'topicDetail.tabs.consumers' | translate"
             class="flex justify--center">
          <topic-consumers-tab></topic-consumers-tab>
        </div>
        <div v-if="topicStats.data[$route.params.id] && topicStats.data[$route.params.id].info.replClusters" :slot="'topicDetail.tabs.replication' | translate"
             class="flex justify--center">
          <topic-replication-tab></topic-replication-tab>
        </div>
        <div v-if="topicStats.data[$route.params.id] && topicStats.data[$route.params.id].info.partitioned" :slot="'topicDetail.tabs.partitions' | translate"
             class="flex justify--center">
          <topic-partitions-tab></topic-partitions-tab>
        </div>
        <div v-if="topicStats.data[$route.params.id] && topicStats.data[$route.params.id].info.type !== 'partitioned'" :slot="'topicDetail.tabs.schema' | translate" class="subscriptions-tab">
          <topic-schema-tab></topic-schema-tab>
        </div>
        <div :slot="'topicDetail.tabs.advanced' | translate"
             class="flex justify--center">
          <topic-advanced-tab></topic-advanced-tab>
        </div>
      </topic-tabs>
    </vuestic-widget>
    <div class="row bottom-widgets">
    </div>
  </div>
</template>

<script>
import TopicTabs from './TopicTabs.vue'
import TopicOverviewTab from './TopicOverviewTab.vue'
import TopicSubscriptionsTab from './TopicSubscriptionsTab.vue'
import TopicProducersTab from './TopicProducersTab.vue'
import TopicAdvancedTab from './TopicAdvancedTab.vue'
import TopicSchemaTab from './TopicSchemaTab.vue'
import TopicReplicationTab from './TopicReplicationTab.vue'
import TopicConsumersTab from './TopicConsumersTab.vue'
import TopicPartitionsTab from './TopicPartitionsTab.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'topicDetail',
  components: {
    TopicOverviewTab,
    TopicSubscriptionsTab,
    TopicReplicationTab,
    TopicProducersTab,
    TopicConsumersTab,
    TopicTabs,
    TopicPartitionsTab,
    TopicAdvancedTab,
    TopicSchemaTab
  },
  data () {
    return {
      posts: {},
      news: {},
    }
  },
  mounted () {
    this.$store.dispatch('setActiveTopicDetailTab', this.$t('topicDetail.tabs.overview'))
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'activeCluster',
      'userRole',
      'topicsConfig',
      'isAdminUser'
    ]),
    tabNames () {
      let tabNames = [this.$t('topicDetail.tabs.overview')]
      tabNames.push(this.$t('topicDetail.tabs.subscriptions'))
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.producers) {
        tabNames.push(this.$t('topicDetail.tabs.producers'))
      }
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.consumers) {
        tabNames.push(this.$t('topicDetail.tabs.consumers'))
      }
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.replClusters) {
        tabNames.push(this.$t('topicDetail.tabs.replClusters'))
      }
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.partitioned) {
        tabNames.push(this.$t('topicDetail.tabs.partitions'))
      }
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.type !== 'partitioned') {
        tabNames.push(this.$t('topicDetail.tabs.schema'))
      }
      if (this.topicStats.data[this.$route.params.id] && this.isAdminUser && !this.topicStats.data[this.$route.params.id].info.partitioned) {
        tabNames.push(this.$t('topicDetail.tabs.advanced'))
      }
      return tabNames
    },
  },
  methods: {
    pageTitle () {
      // let translatedName = this.$options.filters.translate('topicDetail.tabs.title')

      // let topicName = ""
      // if (this.topicsConfig.data[this.$route.params.id]) {
      //   topicName = " - " + this.topicsConfig.data[this.$route.params.id].name

      // }

      return this.topicsConfig.data[this.$route.params.id].name
    },
    isGlobal () {
      if (this.topicStats.data[this.$route.params.id] && this.topicStats.data[this.$route.params.id].info.replClusters > 0) {
        return true
      }
      return false
    },
    isPartition () {
      if (this.topicStats.data[this.$route.params.id]) {
        if (this.topicsConfig.data[this.$route.params.id].name.includes('-partition-')) {
          return true
        }
      }

      return false
    },
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  .overview-tab {
    .explore-row {
      display: none !important;
    }
  }

  .maps-tab {
    height: 500px;
  }
}
.btn-right {
  float: right ;
}
.profile-card-widget, .chat-widget {
  width: 100%;
  .widget-body {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      width: 100%;
    }
  }
}

.bottom-widgets {
  > div[class^='col'] {
    & > div {
      width: 100%;
    }
  }
}
</style>
