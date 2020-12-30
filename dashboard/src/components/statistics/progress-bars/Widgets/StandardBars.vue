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
  <vuestic-widget headerText="Progress Bars">
    <div class="va-row">
      <div class="flex sm4 md4">
        {{ $t('progressBars.basic') }}
        <vuestic-progress-bar :value="value" animated/>
      </div>
      <div class="flex sm4 md4">
        {{ $t('progressBars.thin') }}
        <vuestic-progress-bar :value="value" size="thin" animated/>
      </div>
      <div class="flex sm4 md4">
        {{ $t('progressBars.thick') }}
        <vuestic-progress-bar
          :value="value"
          size="thick"
          animated
        />
      </div>
    </div>
    <div class="va-row">
      <div class="flex sm4 md4">
        {{ $t('progressBars.basicVertical') }}
        <div class="pb-container">
          <vuestic-progress-bar
            :value="value"
            type="vertical"
            animated
          />
        </div>
      </div>
      <div class="flex sm4 md4">
        {{ $t('progressBars.thinVertical') }}
        <div class="pb-container">
          <vuestic-progress-bar
            :value="value"
            size="thin"
            type="vertical"
            animated
          />
        </div>
      </div>
      <div class="flex sm4 md4">
        {{ $t('progressBars.circle') }}
        <div class="pb-container">
          <vuestic-progress-bar
            :value="value"
            type="circle"
            animated
          />
        </div>
      </div>
    </div>
  </vuestic-widget>
</template>

<script>
export default {
  name: 'standard-bars',
  data () {
    return {
      value: 100,
    }
  },
}
</script>

<style lang="scss">
.pb-container {
  margin-top: 1.25rem;
  margin-left: .125rem;
}
</style>
