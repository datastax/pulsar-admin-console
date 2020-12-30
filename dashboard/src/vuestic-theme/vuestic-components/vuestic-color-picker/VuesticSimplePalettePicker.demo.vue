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
      <vuestic-simple-palette-picker
        v-model="value"
        :palette="palette"
      />
      <vuestic-simple-palette-picker
        v-model="value"
        :palette="palette"
      />
      {{ value }}
    </div>
  </div>
</template>

<script>
import VuesticSimplePalettePicker from './VuesticSimplePalettePicker'
import { colorArray } from './VuesticTheme'
import VuesticPalletCustom from './VuesticPalletCustom'

export default {
  components: {
    VuesticSimplePalettePicker,
    VuesticPalletCustom,
  },
  data () {
    return {
      value: '#AAA',
      palette: colorArray,
    }
  },
}
</script>
