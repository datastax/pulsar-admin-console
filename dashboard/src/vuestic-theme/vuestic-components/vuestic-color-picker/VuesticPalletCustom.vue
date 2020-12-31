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
  <div class="vuestic-pallet-custom">
    <vuestic-simple-palette-picker :palette="palette" v-model="valueProxy"
                                   class="vuestic-pallet-custom__palette"/>
    <vuestic-color-picker-input mode="advanced" v-model="valueProxy"
                                class="vuestic-pallet-custom__input">
      <vuestic-color-input :selected="dotisSelected" v-model="valueProxy"/>
    </vuestic-color-picker-input>
  </div>
</template>

<script>

import VuesticColorPickerInput from './VuesticColorPickerInput'
import VuesticSimplePalettePicker from './VuesticSimplePalettePicker'
import VuesticColorInput from './VuesticColorInput'

export default {
  name: 'vuestic-pallet-custom',
  components: {
    VuesticColorInput,
    VuesticColorPickerInput,
    VuesticSimplePalettePicker,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    palette: {
      type: Array,
    },
  },
  computed: {
    valueProxy: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      },
    },
    dotisSelected () {
      if (this.value !== '') {
        if (this.palette.includes(this.value)) {
          return false
        } else {
          return true
        }
      }
    },
  },
}
</script>

<style lang="scss">
.vuestic-pallet-custom {
  display: flex;

  &__palette {
    margin-right: 20px;
  }

  &__input {
    float: right;
  }
}
</style>
