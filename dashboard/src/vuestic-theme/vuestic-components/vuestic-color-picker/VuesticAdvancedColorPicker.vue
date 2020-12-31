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
  <ChromePicker v-model="valueProxy" class="vuestic-advanced-picker"/>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
  name: 'vuestic-advanced-color-picker',
  components: {
    ChromePicker: Chrome,
  },
  props: {
    value: {
      default: '',
    },
  },
  computed: {
    valueProxy: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value.hex)
      },
    },
  },
}
</script>

<style lang="scss">
.vuestic-advanced-picker {
  .vc-chrome-alpha-wrap {
    display: none;
  }
  .vc-chrome-hue-wrap {
    margin-top: 10px;
  }
  .vc-chrome-toggle-btn {
    display: none;
  }
}
</style>
