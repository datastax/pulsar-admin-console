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
  <div class="va-row">
    <div class="flex md12 xs12">
      <transition name="fade">
          <div class='vuestic-alert alert alert-info' v-if="noticeText">
            <span class="badge badge-pill badge-info">NOTICE</span>
            {{ noticeText }}
          </div>
          <div v-if="debugInfo">
            T: {{ runTimer }} F: {{ runFunctionTimer }} Si: {{ runSinkTimer }}
          </div>
      </transition>
      <vuestic-widget class="no-padding no-v-padding">
        <vuestic-breadcrumbs
          :breadcrumbs="breadcrumbs"
          :currentRouteName="currentRouteName"
        />
      
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
import { breadcrumbs } from './Breadcrumbs'
import { mapGetters } from 'vuex'

export default {
  name: 'app-breadcrumbs',
  data () {
    return {
      breadcrumbs: breadcrumbs,
      debugInfo: false
    }
  },
  computed: {
    ...mapGetters([
      'noticeText',
      'runTimer',
      'runFunctionTimer',
      'runSinkTimer'
    ]),
    currentRouteName () {
      return this.$route.name
    },
  },
}

</script>
