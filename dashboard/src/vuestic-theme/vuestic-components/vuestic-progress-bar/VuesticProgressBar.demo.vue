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
    <div class="demo-container__item" style="width: 300px;">
      <div class="va-row">
        <div class="flex lg4">
          <vuestic-progress-bar
            :value="35"
            type="circle"
            theme="Warning"
            background-theme="White"
          />
        </div>
        <div class="flex lg4">
          <vuestic-progress-bar
            :value="75"
            text="circle"
            type="circle"
            theme="Info"
            :animated="true"
            background-theme="White"
          />
        </div>
      </div>
    </div>
    <div class="demo-container__item" style="width: 300px">
      <div class="va-row">
        <div class="flex lg4">
          <vuestic-progress-bar :value="55" theme="Warning" type="vertical"
                                size="thin"/>
        </div>
        <div class="flex lg4">
          <vuestic-progress-bar :value="40" theme="Danger" text="second"
                                type="vertical"/>
        </div>
        <div class="flex lg4">
          <vuestic-progress-bar :value="85" theme="Info" type="vertical"
                                size="thick" :animated="true"/>
        </div>
      </div>
    </div>
    <div class="demo-container__item" style="width: 300px">
      <vuestic-progress-bar :value="10" theme="Primary"/>
      <vuestic-progress-bar :value="30" theme="Info" text="blue"
                            :animated="true"/>
      <vuestic-progress-bar :value="50" theme="Warning"/>
      <vuestic-progress-bar :value="70" theme="Danger" text="Text"/>
      <vuestic-progress-bar :value="90" theme="Success" :animated="true"/>
    </div>
  </div>
</template>

<script>

import VuesticProgressBar from './VuesticProgressBar'

export default {
  components: {
    VuesticProgressBar,
  },
}
</script>
