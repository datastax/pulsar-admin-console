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
    <div class="demo-container__item">
      <vuestic-timeline-item :isFirst="true" :isLast="true">
        <div slot="before">22 February, 2018</div>
        <vuestic-card
          slot="after"
          stripe="warning"
          title-on-image
          overlay
          image="https://picsum.photos/300/200/?random">
          <template slot="title">
            Card with overlay and text on top of image
          </template>
          Running out of pages in your passport. Two trailer park girls go
          around the outside.
        </vuestic-card>
      </vuestic-timeline-item>
    </div>
  </div>
</template>

<script>
import VuesticTimelineItem from './VuesticTimelineItem.vue'
import VuesticCard from '../vuestic-card/VuesticCard'

export default {
  components: {
    VuesticCard,
    VuesticTimelineItem,
  },
}
</script>
