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
  <div class="charts-page">
    <div class="va-row">
      <div class="flex md6 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.verticalBarChart')"
        >
          <vuestic-chart :data="verticalBarChartData" type="vertical-bar"/>
        </vuestic-widget>
      </div>
      <div class="flex md6 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.horizontalBarChart')"
        >
          <vuestic-chart :data="horizontalBarChartData" type="horizontal-bar"/>
        </vuestic-widget>
      </div>
    </div>

    <div class="va-row">
      <div class="flex md12 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.lineChart')"
        >
          <vuestic-chart :data="lineChartData" type="line"/>
        </vuestic-widget>
      </div>
    </div>

    <div class="va-row">
      <div class="flex md6 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.pieChart')"
        >
          <vuestic-chart :data="pieChartData" type="pie"/>
        </vuestic-widget>
      </div>
      <div class="flex md6 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.donutChart')"
        >
          <vuestic-chart :data="donutChartData" type="donut"/>
        </vuestic-widget>
      </div>
    </div>

    <div class="va-row">
      <div class="flex md12 xs12">
        <vuestic-widget
          class="chart-widget"
          :headerText="$t('charts.bubbleChart')"
        >
          <vuestic-chart :data="bubbleChartData" type="bubble"/>
        </vuestic-widget>
      </div>
    </div>
  </div>
</template>

<script>
import { getLineChartData } from '../../../data/charts/LineChartData'
import BubbleChartData from '../../../data/charts/BubbleChartData'
import PieChartData from '../../../data/charts/PieChartData'
import DonutChartData from '../../../data/charts/DonutChartData'
import VerticalBarChartData from '../../../data/charts/VerticalBarChartData'
import HorizontalBarChartData from '../../../data/charts/HorizontalBarChartData'
import SidebarLink from '../../admin/app-sidebar/components/SidebarLink'

export default {
  name: 'charts',
  components: {
    SidebarLink,
  },
  data: () => ({
    bubbleChartData: BubbleChartData,
    lineChartData: getLineChartData(),
    pieChartData: PieChartData,
    donutChartData: DonutChartData,
    verticalBarChartData: VerticalBarChartData,
    horizontalBarChartData: HorizontalBarChartData,
  }),
  methods: {
    refreshData () {
      this.lineChartData = getLineChartData()
    },
  },
}
</script>

<style lang="scss">
.widget.chart-widget {
  .widget-body {
    height: 550px;
  }
}
</style>
