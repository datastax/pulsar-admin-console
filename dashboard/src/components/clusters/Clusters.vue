<template>
  <div class="clusters">
    <div v-for="index in allowedClusters" :key="index">
      <vuestic-widget v-if="clusterInfo.info[index]" :headerText="index + ' - ' +  clusterInfo.info[index].name" >
        <div class="va-row" v-if="index === activeCluster">
          <div class="flex md6">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ clustersConfig.stats[index] ? clustersConfig.stats[index].storage : 0 | humanBytes}}
                        </div>
                        <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ namespacesConfig.num ? namespacesConfig.num : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.namespaces' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ numAdditionalNS }}
                      </div>
                      <div class="stats-title">Additional {{'tables.headings.namespaces' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].numTopics : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.topics' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            <div class="va-row">
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].producers : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.producers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].subscriptions : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.subscriptions' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].consumers : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.consumers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            </div>
          <div class="flex md6">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].inRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="vuestic-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].inTput : 0 | humanBytes}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgThroughputIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].outRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
               <div class="flex md6">
                <vuestic-widget class="vuestic-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].outTput : 0 | humanBytes}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgThroughputOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            </div>

             <div v-if="isAdminUser" class="va-row">
                <div class="flex md12">
                  <button class="btn btn-primary btn-right" @click="updateNav(index)">Details</button>
                </div>
                <div class="flex md12" v-if="runningEnv === 'web'">
                  <button class="btn btn-primary btn-right" @click="goToMonitorIframe(index)">Monitoring</button>
                </div>
            </div>

        </div>
        <div class="va-row" v-else>
          Data only available for selected cluster
        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'clusters',
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
      'clustersConfig',
      'activeCluster',
      'allowedClusters',
      'clusterInfo',
      'namespacesConfig',
      'isAdminUser',
      'runningEnv'
    ]),
    numAdditionalNS () {
      let count = 0
      this.namespacesConfig.list.forEach(nsObj => {
        console.log(nsObj.name)
        if (!(
          nsObj.name.match('^local-') ||
            nsObj.name.match('^worldwide')
        )) {
          count++
        }
      })

      return count
    }
  },
  methods: {
    updateNav (cluster) {
      this.$router.push('/admin/cluster/' + cluster)
    },
    goToMonitorIframe (cluster) {
      this.$router.push('/admin/clusterMonitor/' + cluster)
    },

    getClusterName (index) {
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
