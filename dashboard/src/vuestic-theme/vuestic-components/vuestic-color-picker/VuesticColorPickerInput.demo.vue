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
      <vuestic-color-picker-input v-model="value" mode="palette"
                                  :palette="palette">
        <color-dot :color="value"/>
      </vuestic-color-picker-input>
      {{ value }}
    </div>
    <div class="demo-container__item">
      <vuestic-color-picker-input v-model="value" mode="slider">
        <vuestic-color-square :value="value"/>
      </vuestic-color-picker-input>
      {{ value }}
    </div>
    <div class="demo-container__item">
      <vuestic-color-picker-input v-model="value" mode="advanced">
        <vuestic-color-input v-model="value"/>
      </vuestic-color-picker-input>
    </div>
    <div class="demo-container__item">
      <vuestic-color-picker-input v-model="value" mode="palette"
                                  :palette="palette"/>
    </div>
  </div>
</template>

<script>
import VuesticColorPickerInput from './VuesticColorPickerInput'
import ColorDot from './ColorDot'
import VuesticColorSquare from './VuesticColorSquare'
import VuesticColorInput from './VuesticColorInput'
import { colorArray } from './VuesticTheme'

export default {
  components: {
    VuesticColorPickerInput,
    ColorDot,
    VuesticColorSquare,
    VuesticColorInput,
  },
  data () {
    return {
      value: '#9b6caa',
      palette: colorArray,
    }
  },
}
</script>
