<template>
  <div class="va-row dashboard-info-widgets">
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
              {{ topicsConfig.num }}
            </div>
            <div class="stats-title">{{'summary.topics' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
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

<style lang="scss">


</style>
