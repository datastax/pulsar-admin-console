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
    <div class="demo-container__item" style="width: 300px">
      <horizontal-bar :value="10" theme="Primary"/>
      <horizontal-bar :value="20" size="thin" theme="Danger"/>
      <horizontal-bar :value="40" theme="Success" :animated="true"/>
      <horizontal-bar :value="50" size="thick" theme="Warning"/>
      <horizontal-bar :value="60" theme="Info"/>
      <horizontal-bar :value="70" size="thick" theme="Primary" text="black"/>
      <horizontal-bar :value="80" theme="Success" size="basic"/>
      <horizontal-bar :value="90" size="thin" theme="Info"/>
      <horizontal-bar :value="100" theme="Danger"/>
    </div>
  </div>
</template>

<script>

import HorizontalBar from './../progress-types/HorizontalProgressBar'

export default {
  components: {
    HorizontalBar,
  },
}
</script>
