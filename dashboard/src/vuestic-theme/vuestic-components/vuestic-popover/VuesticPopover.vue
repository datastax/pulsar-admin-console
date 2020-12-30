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
  <v-popover
    :popover-class="popoverClass"
    :open="open"
    :disabled="disabled"
    :placement="placement"
    :auto-hide="autoHide"
  >
    <slot name="trigger"></slot>
    <template slot="popover">
      <div class="popover-icon" v-if="isIconPresent">
        <slot name="icon"></slot>
      </div>
      <div class="popover-content">
        <div class="popover-header">
          <slot name="header"></slot>
        </div>
        <div class="popover-body">
          <slot name="body"></slot>
        </div>
      </div>
    </template>
  </v-popover>
</template>

<script>
import { VPopover } from 'v-tooltip'

export default {
  name: 'vuestic-popover',

  components: { VPopover },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: 'auto',
    },
    popoverClass: {
      type: [String, Array],
      default: 'vuestic-tooltip',
    },
    autoHide: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isIconPresent () {
      return !!this.$slots.icon
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
