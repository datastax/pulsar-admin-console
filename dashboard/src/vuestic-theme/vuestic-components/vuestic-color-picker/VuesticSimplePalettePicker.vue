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
  <div class="vuestic-simple-palette-picker">
    <ul class="vuestic-simple-palette-picker__colors">
      <color-dot
        v-for="(color, index) in palette" :key="index"
        :color="color"
        @click.native="handlerClick(color)"
        :selected="isSelected(color)"
      />
    </ul>
  </div>
</template>

<script>
import ColorDot from './ColorDot'

export default {
  name: 'vuestic-simple-palette-picker',
  components: {
    ColorDot,
  },
  props: {
    palette: {
      type: Array,
    },
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
        this.$emit('input', value)
      },
    },
  },
  methods: {
    isSelected (color) {
      return this.value === color
    },
    handlerClick (color) {
      this.valueProxy = color
    },
  },
}
</script>

<style lang="scss">
.vuestic-simple-palette-picker {
  padding-top: 3px;

  &__colors {
    padding: 3px;
    display: flex;
  }
}

</style>
