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
  <div class="color-dot flex-center"
       @click="$emit('click')"
       :class="{'color-dot--selected': selected}"
  >
    <div
      class="color-dot__core"
      :style="{'background-color': color}"
    />
  </div>
</template>

<script>
export default {
  name: 'color-dot',
  props: {
    color: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.color-dot {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 1.5rem;
  cursor: pointer;

  border-radius: 50%;
  border: solid 0.125rem transparent;

  &--selected {
    border-color: $vue-darkest-blue;
  }

  &__core {
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
  }
}
</style>
