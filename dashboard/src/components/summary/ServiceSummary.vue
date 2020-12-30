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
