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
      <vuestic-radio-button
        v-for="(option, index) in options"
        :key="index"
        v-model="selectedOptionString"
        :option="option"
      />
    </div>
    <div class="demo-container__item">
      <vuestic-radio-button
        v-for="(option, index) in options"
        :key="index"
        v-model="selectedOptionString"
        :option="option"
        :label="`((${option}))`"
      />
    </div>
    <div class="demo-container__item">
      <vuestic-radio-button
        v-for="(option, index) in options"
        :key="index"
        v-model="selectedOptionString"
        :option="option"
        disabled
      />
    </div>
    <div class="demo-container__item">
      {{ selectedOptionString }}
    </div>

    <div class="demo-container__item">
      <vuestic-radio-button
        v-for="option in objectOptions"
        :key="option.key"
        v-model="selectedOptionObject"
        :option="option"
        :label="option.name"
      />
      {{selectedOptionObject}}
    </div>
  </div>
</template>

<script>
import VuesticRadioButton from './VuesticRadioButton'

export default {
  components: { VuesticRadioButton },
  data () {
    const objectOptions = [
      { key: 1, name: 'one' },
      { key: 2, name: 'two' },
      { key: 3, name: 'three' },
    ]

    return {
      options: [
        'one',
        'two',
        'three',
      ],
      selectedOptionString: 'one',

      objectOptions,
      selectedOptionObject: objectOptions[0],
    }
  },
}
</script>
