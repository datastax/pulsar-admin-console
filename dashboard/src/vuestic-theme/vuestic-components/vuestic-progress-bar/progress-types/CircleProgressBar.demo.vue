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
  <VbDemo>
    <VbContainer title="Default">
      <circle-bar :value="value"/>
    </VbContainer>

    <VbContainer title="No value">
      <circle-bar/>
    </VbContainer>

    <VbContainer title="Disabled">
      <circle-bar
        :value="value"
        disabled
      />
    </VbContainer>

    <VbContainer title="Start animated" refresh>
      <circle-bar
        :value="value"
        start-animated
      />
    </VbContainer>

    <VbContainer title="No animation">
      <circle-bar
        :value="value"
        no-animation
      />
    </VbContainer>

    <VbContainer title="With text">
      <circle-bar
        :value="value"
        text="some long text text text text"
      />
    </VbContainer>

    <VbContainer>
      <button @click="value -= 100">-100</button>
      <button @click="value -= 10">-10</button>
      {{ value }}
      <button @click="value += 10">+10</button>
      <button @click="value += 100">+100</button>
    </VbContainer>
  </VbDemo>
</template>

<script>

import CircleBar from './../progress-types/CircleProgressBar'

export default {
  components: {
    CircleBar,
  },
  data () {
    return {
      value: 35
    }
  },
}
</script>
