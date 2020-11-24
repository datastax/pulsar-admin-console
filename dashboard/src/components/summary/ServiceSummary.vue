<template>
  <div class="service-summary">

    <summary-info-widgets></summary-info-widgets>

  

    <summary-bottom-widgets></summary-bottom-widgets>

  </div>
</template>

<script>
import SummaryInfoWidgets from './SummaryInfoWidgets'
import SummaryBottomWidgets from './SummaryBottomWidgets.vue'

export default {
  name: 'ServiceSummary',
  components: {
    SummaryInfoWidgets,
    SummaryBottomWidgets,
  },
  

  methods: {
    // launchEpicmaxToast () {
    //   this.showToast(`Let's work together!`, {
    //     icon: 'fa-star-o',
    //     position: 'top-right',
    //     duration: Infinity,
    //     action: {
    //       text: 'Hire us',
    //       href: 'http://epicmax.co/#/contact',
    //       class: 'vuestic-toasted-link',
    //     },
    //   })
    // },
  },
}

</script>
<style lang="scss" scoped>
</style>
