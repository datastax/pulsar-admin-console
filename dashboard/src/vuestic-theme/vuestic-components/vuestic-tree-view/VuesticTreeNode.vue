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
  <div class="vuestic-tree-node"
       :class="{'vuestic-tree-node-selected': selected}"
  >
    <div class="vuestic-tree-node-checkbox" v-if="$slots.checkbox">
      <slot name="checkbox"/>
    </div>
    <div class="vuestic-tree-node-icon" v-if="$slots.icon">
      <slot name="icon"/>
    </div>
    <div class="vuestic-tree-node-label">
      <slot/>
    </div>
    <div class="vuestic-tree-node-icon-right" v-if="$slots.iconRight">
      <slot name="iconRight"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-tree-node',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },

  },
}
</script>

<style lang="scss">
.vuestic-tree-node {
  .form-group {
    margin-bottom: 0px;
  }
  display: flex;
  &-checkbox {
    margin-right: 0.75rem;
  }
  &-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 0.375rem;
  }
  &-icon-right {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 0.375rem;
  }
  &-label {
    flex-grow: 1;
    word-wrap: break-word;
    overflow: hidden;
  }
  &-selected #{&}-label {
    background-color: $vue-light-green;
  }

  // HACK Checkbox for presentation page
  .vuestic-checkbox {
    margin-bottom: 0;
    margin-top: -0.125rem;
    margin-right: -0.625rem;
  }
}
</style>
