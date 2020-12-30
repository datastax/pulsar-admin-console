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
  <vuestic-widget headerText="Colorful Bars">
    <div class="va-row">
      <div class="flex sm4 md4">
        {{'progressBars.basic' | translate}}
        <vuestic-progress-bar :value="100" theme="Danger"/>
      </div>
      <div class="flex sm4 md4">
        {{'progressBars.thin' | translate}}
        <vuestic-progress-bar :value="100" size="thin" theme="Info"/>
      </div>
      <div class="flex sm4 md4">
        {{'progressBars.thick' | translate}}
        <vuestic-progress-bar :value="100" size="thick" theme="Warning"/>
      </div>
    </div>
    <div class="va-row">
      <div class="flex sm4 md4">
        {{'progressBars.basicVertical' | translate}}
        <div class="pb-container">
          <vuestic-progress-bar :value="100" type="vertical" theme="Success"/>
        </div>
      </div>
      <div class="flex sm4 md4">
        {{'progressBars.thinVertical' | translate}}
        <div class="pb-container">
          <vuestic-progress-bar :value="100" size="thin" type="vertical"
                                theme="Black"/>
        </div>
      </div>
      <div class="flex sm4 md4">
        {{'progressBars.circle' | translate}}
        <div class="pb-container">
          <vuestic-progress-bar :value="100" type="circle"/>
        </div>
      </div>
    </div>
  </vuestic-widget>
</template>

<script>
export default {
  name: 'standard-bars',
}
</script>
