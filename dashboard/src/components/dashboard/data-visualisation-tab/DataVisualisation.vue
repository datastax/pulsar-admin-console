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
  <div class="data-visualisation-tab dashboard-tab">
    <div class="va-row">
      <div class="flex md6 xs12">
        <div class="chart-container">
          <vuestic-chart v-bind:data="donutChartData"
                         type="donut"></vuestic-chart>
        </div>
      </div>
      <div class="flex md6">
        <vuestic-data-table
          :apiMode="apiMode"
          :tableData="topicsConfig"
          :tableFields="tableFields"
          :itemsPerPage="itemsPerPage"
          :onEachSide="onEachSide"
          :sortFunctions="sortFunctions"
          :dataModeFilterableFields="dataModeFilterableFields"
        />
      </div>
    </div>
    <!-- <button @click='dumpData'>Dump</button>
    <ul>
      <li v-for="namespace in namespacesConfig" :key="namespace.id">
        {{ namespace }}
      </li>
    </ul>

    <ul>
      <li v-for="tdata in topicsConfig.data" :key="tdata.id">
        {{ tdata.name }}
      </li>
    </ul> -->
    
  </div>
</template>

<script>
import Vue from 'vue'
import BadgeColumn from 'components/tables/BadgeColumn.vue'
// import TableData from './TableData'
import DonutChartData from './DonutChartData'
import FieldsDef from './fields-definition'


import ApiService from '@/services/ApiService'

import { mapGetters } from "vuex";


// TableData = {data: []}

Vue.component('badge-column', BadgeColumn)

export default {
  name: 'data-visualisation-tab',

  data () {
    return {
      donutChartData: DonutChartData,
      apiMode: false,
      sortFunctions: FieldsDef.sortFunctions,
      tableData: {'data': []},
      onEachSide: 1,
      tableFields: FieldsDef.tableFields,
      dataModeFilterableFields: ['name'],
      tenant: "public",
      timer: '',
      itemsPerPage: [
        {
          value: 5,
        },
        {
          value: 6,
        },
      ],
    }
  },
  created() {
 
  },
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'topicsConfig',
    ]),
  },
  mounted() {
    
    // this.timer = setInterval(this.updateNamespacesTopics(this.tenant), 5000)

    // this.updateNamespacesTopics(this.tenant)

    // this.timer = setInterval(() => {
    //       this.updateNamespacesTopics(this.tenant)
    // }, 5000)



  },
  beforeDestroy() {
    // this.cancelAutoUpdate()
  },
  methods: {
    dumpData() {
      
      console.log("Data", this.namespaces)   
    },

    cancelAutoUpdate() {
      clearInterval(this.timer)
    },
  
    async updateNamespacesTopics (tenant){

      this.tableData.data = [];
      this.topics = [];

      const nsResponse = await ApiService.getNamespaces(this.tenant)
      // console.log(response)
      this.namespaces = nsResponse.data

      const promises = [];
      this.namespaces.forEach( ns => {

        // save the promise returned by the axios requests.

        if (ns.includes('global')) {
          promises.push(
            ApiService.getGlobalTopics(ns)
          );
        } else {
          promises.push(
            ApiService.getLocalTopics(ns)
          );
        }
       
      })

      const topicData = await Promise.all( promises );
      topicData.map( resp => {

        this.topics.push( ...resp.data )

        resp.data.forEach( topic => {
          this.tableData.data.push({name: topic})

        })
        
      } );

    },


	}
}
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 0 2rem;
  height: 24rem;
}

</style>
