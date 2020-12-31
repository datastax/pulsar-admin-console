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
      <color-dot
        color="#AAA"
        :selected="selected"
        @click="selected = !selected"
      />
    </div>
    <div class="demo-container__item">
      <img src="https://i.imgur.com/Rm23NjT.png" alt="">
    </div>
  </div>
</template>

<script>
import ColorDot from './ColorDot.vue'

export default {
  data () {
    return {
      selected: false,
    }
  },
  components: {
    ColorDot,
  },
}
</script>
