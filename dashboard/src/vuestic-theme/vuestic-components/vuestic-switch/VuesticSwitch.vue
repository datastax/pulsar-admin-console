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
  <div class="vuestic-switch">
    <div class="vuestic-switch-option true-option" :class="{'active': value}"
         @click.prevent="setValue(true)">
      <slot name="trueTitle"></slot>
    </div>
    <div class="vuestic-switch-option false-option" :class="{'active': !value}"
         @click.prevent="setValue(false)">
      <slot name="falseTitle"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-switch',
  props: {
    value: Boolean,
  },
  mounted () {
    this.$emit('input', this.value)
  },
  methods: {
    setValue (newVal) {
      this.$emit('input', newVal)
    },
  },
}
</script>

<style lang="scss">
.vuestic-switch {
  cursor: pointer;
  display: flex;
  flex-direction: row;

  .vuestic-switch-option {
    padding: $vuestic-switch-padding;
    border-top: $vuestic-switch-border-size solid transparent;
    border-bottom: $vuestic-switch-border-size solid $vuestic-switch-bg;
    background-color: transparent;
    transition: all 0.15s ease;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      color: $white;
      background-color: $vuestic-switch-bg;
    }

    &:not(.active):hover {
      color: $brand-primary;
    }
  }
}
</style>
