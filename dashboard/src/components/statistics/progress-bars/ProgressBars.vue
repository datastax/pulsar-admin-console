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
  <div class="progress-bars">
    <div class="va-row">
      <div class="flex md12">
        <standard-bars/>
      </div>
    </div>
    <div class="va-row">
      <div class="flex md12">
        <colorful-bars/>
      </div>
    </div>
  </div>
</template>

<script>
import ColorfulBars from './Widgets/ColorfulBars'
import StandardBars from './Widgets/StandardBars'

export default {
  name: 'progress-bars',
  components: { StandardBars, ColorfulBars },
}
</script>
