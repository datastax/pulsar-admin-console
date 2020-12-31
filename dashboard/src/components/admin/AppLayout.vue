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
  <vuestic-layout v-layout style="position: absolute;width: 100%;">
    <app-navbar :isOpen="opened" @toggle-menu="toggleSidebar"/>
    <app-sidebar :isOpen="opened" @toggle-menu="toggleSidebar"/>
    <main
      slot="content"
      id="content"
      class="content va-layout gutter--lg fluid"
      role="main"
    >
      <app-breadcrumbs/>
      <loading :active.sync="isLoading" 
        :can-cancel="false" 
        loader="dots"
        color="#188FFF"
        :is-full-page="fullPage"></loading>
      <router-view/>
      <div class="trademarks">
        <small>
              APACHE, APACHE PULSAR, PULSAR AND ASSOCIATED OPEN SOURCE PROJECT NAMES ARE TRADEMARKS OF THE APACHE SOFTWARE FOUNDATION
        </small>
      </div>
    </main>
    <span slot="footer">
    </span>
  </vuestic-layout>
</template>

<script>
import VuesticLayout
  from '../../vuestic-theme/vuestic-components/vuestic-layout/VuesticLayout'
import AppNavbar from './app-navbar/AppNavbar'
import AppSidebar from './app-sidebar/AppSidebar'
import AppBreadcrumbs from './app-breadcrumbs/AppBreadcrumbs'
import Layout from '../../vuestic-theme/vuestic-directives/Layout'
import { mapGetters } from 'vuex'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';


export default {
  name: 'app-layout',
  components: {
    VuesticLayout,
    AppNavbar,
    AppSidebar,
    AppBreadcrumbs,
    Loading
  },
  directives: {
    layout: Layout,
  },
  data () {
    return {
      opened: true,
      fullPage: true
    }
  },
  methods: {
    toggleSidebar (opened) {
      this.opened = opened
    },
  },
  computed: {
    ...mapGetters([
      'isLoading',
    ]),
  },
}
</script>
<style>

.trademarks {
  color: gray;
}
</style>
