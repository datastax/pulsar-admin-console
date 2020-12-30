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
  


  <div class="va-row dashboard-info-widgets">
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="ion ion-md-arrow-up text-primary stats-icon"></i>
              59
            </div>
            <div class="stats-title">{{'dashboard.elements' | translate}}</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md6 xl3 xs12">
      <vuestic-widget class="info-widget">
        <div class="info-widget-inner">
          <div class="stats">
            <div class="stats-number">
              <i class="ion ion-md-arrow-down text-danger stats-icon"></i>
              12
            </div>
            <div class="stats-title">{{'dashboard.versions' | translate}}</div>
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
  </div>


</template>

<script>
export default {
  name: 'dashboard-info-widgets',
}
</script>

<style lang="scss" scoped>


</style>
