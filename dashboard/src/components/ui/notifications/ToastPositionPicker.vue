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
  <div class="toast-position-picker">
    <div class="position-boxes-row">
      <div class="position-box"
           @click="updatePosition('top-left')"
           :class="{'selected': isBoxSelected('top-left')}">
      </div>
      <div class="position-box"
           @click="updatePosition('top-center')"
           :class="{'selected': isBoxSelected('top-center')}">
      </div>
      <div class="position-box"
           @click="updatePosition('top-right')"
           :class="{'selected': isBoxSelected('top-right')}">
      </div>
    </div>
    <div class="position-boxes-row">
      <div class="position-box"
           @click="updatePosition('bottom-left')"
           :class="{'selected': isBoxSelected('bottom-left')}">
      </div>
      <div class="position-box"
           @click="updatePosition('bottom-center')"
           :class="{'selected': isBoxSelected('bottom-center')}">
      </div>
      <div class="position-box"
           @click="updatePosition('bottom-right')"
           :class="{'selected': isBoxSelected('bottom-right')}">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toast-position-picker',

  props: {
    value: {
      type: String,
      default: 'bottom-center',
    },
  },

  methods: {
    updatePosition (position) {
      this.$emit('input', position)
    },

    isBoxSelected (position) {
      return this.value === position
    },
  },
}
</script>

<style lang='scss' scoped>
.toast-position-picker {
  width: 112px;
  height: 76px;
  margin-right: 2rem;
}

.position-boxes-row {
  display: flex;
  flex-direction: row;

  &:first-child {
    margin-bottom: 2px;
  }
}

.position-box {
  height: 36px;
  width: 36px;
  margin-right: 2px;
  cursor: pointer;
  background-color: $brand-primary;
  opacity: 0.3;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 0.6;
  }

  &.selected {
    opacity: 1;
  }
}
</style>
