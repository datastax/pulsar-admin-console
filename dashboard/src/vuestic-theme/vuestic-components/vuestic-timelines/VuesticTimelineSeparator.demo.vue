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
  <div class="demo-container">
    <div class="demo-container__item" style="width: 100px; height: 100px">
      <vuestic-timeline-separator/>
    </div>
    <div class="demo-container__item" style="width: 100px; height: 100px">
      <vuestic-timeline-separator vertical/>
    </div>
    <div class="demo-container__item" style="width: 100px; height: 100px">
      <vuestic-timeline-separator active/>
    </div>
    <div class="demo-container__item" style="width: 100px; height: 100px">
      <vuestic-timeline-separator activePrevious/>
    </div>
    <div class="demo-container__item" style="width: 100px; height: 100px">
      <vuestic-timeline-separator activeNext/>
    </div>
  </div>
</template>

<script>
import VuesticTimelineSeparator from './VuesticTimelineSeparator.vue'

export default {
  components: {
    VuesticTimelineSeparator,
  },
}
</script>
