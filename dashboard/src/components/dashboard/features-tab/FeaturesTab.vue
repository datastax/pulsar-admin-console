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
  <div class="overview-tab dashboard-tab">
    <div
      class="d-flex overview-row justify--space-around justify--start">

      <div class="overview-col">
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-vue/>
          </div>
          Built with Vue.js framework
        </div>
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-free/>
          </div>
          Absolutely free for everyone
        </div>
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-fresh/>
          </div>
          Fresh and crisp design
        </div>
      </div>

      <div class="overview-col">
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-responsive/>
          </div>
          Responsive and optimized for mobile
        </div>
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-rich/>
          </div>
          Tons of useful components
        </div>
        <div class="overview-item">
          <div class="overview-icon-container">
            <vuestic-icon-clean-code/>
          </div>
          Completely jQuery free
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuesticIconVue
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconVue'
import VuesticIconFree
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconFree'
import VuesticIconFresh
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconFresh'
import VuesticIconResponsive
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconResponsive'
import VuesticIconRich
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconRich'
import VuesticIconCleanCode
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconCleanCode'

export default {
  name: 'features-tab',
  components: {
    VuesticIconVue,
    VuesticIconFree,
    VuesticIconFresh,
    VuesticIconResponsive,
    VuesticIconRich,
    VuesticIconCleanCode,
  },
}
</script>

<style lang="scss" scoped>
.overview-item {
  display: flex;
  align-items: center;
  height: 55px;
  margin-bottom: 3rem;
  padding-right: 1rem;
  font-size: 1.25rem;
  font-weight: bold;

  .overview-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    min-width: 85px;
    max-width: 85px;
    height: 100%;
  }
}

.overview-row {
  @include media-breakpoint-down(xs) {
    flex-wrap: wrap;
  }
}

.overview-col:first-child {
  margin-left: 2rem;
  @include media-breakpoint-down(md) {
    margin-left: 0;
  }
}

.explore-btn {
  margin-top: 6rem;
  margin-bottom: 1rem;
}
</style>
