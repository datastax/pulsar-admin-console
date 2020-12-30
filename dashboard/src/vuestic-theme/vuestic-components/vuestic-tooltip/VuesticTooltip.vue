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
  <span class="vuestic-tooltip-target" v-tooltip="tooltipOptions">
      <slot></slot>
  </span>
</template>

<script>
import { VTooltip } from 'v-tooltip'

export default {
  name: 'vuestic-tooltip',

  directives: { tooltip: VTooltip },

  computed: {
    tooltipOptions () {
      return Object.assign({}, this.defaultOptions, this.options)
    },
  },

  props: {
    options: {
      type: Object,
      default: () => [],
    },
  },

  data () {
    return {
      defaultOptions: {
        classes: 'vuestic-tooltip',
      },
    }
  },
}
</script>

<style lang='scss' scoped>

</style>
