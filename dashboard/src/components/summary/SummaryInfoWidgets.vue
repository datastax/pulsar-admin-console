<template>
  <div class="va-row dashboard-info-widgets">
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ namespacesConfig.num }}
            </div>
            <div class="stats-title">{{'summary.namespaces' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ numAllowedClusters }}
            </div>
            <div class="stats-title">{{'summary.clusters' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              {{ topicsConfig.num }}
            </div>
            <div class="stats-title">{{'summary.topics' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget brand-danger">
        <div class="info-widget-inner">
          <div class="info-widget-inner has-chart">
            <div class="stats">
              <div class="stats-number">
                425
              </div>
              <div class="stats-title">Commits</div>
            </div>
            <div class="chart-container">
              <vuestic-progress-bar type="circle" :value="70" theme="White"
                                    backgroundTheme="Danger"/>
            </div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget brand-info">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="ion ion-md-people stats-icon icon-wide"></i>
              5
            </div>
            <div class="stats-title">{{'dashboard.teamMembers' | translate}}
            </div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <button @click="refreshData">Refresh</button>

  </div>
</template>

<script>
import { mapGetters } from "vuex";


export default {
  name: 'summary-info-widgets',
  data() {
    return {
      numClusters: 2
    }
  },
   computed: {
    ...mapGetters([
      'numNamespaces',
      'numAllowedClusters',
      'numTopics',
      'topicsConfig',
      'namespacesConfig'
    ]),
  },
  mounted(){
    this.$store.dispatch('updateAll')
  },
  methods: {
    refreshData(){
    this.$store.dispatch('updateAll')

    }
  }

  
}




</script>

<style lang="scss" scoped>


</style>
