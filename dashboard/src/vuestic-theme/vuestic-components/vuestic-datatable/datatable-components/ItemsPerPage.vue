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
  <vuestic-dropdown
    class="form-group"
    placement="bottom"
  >
    <button
      class="btn btn-primary btn-sm dropdown-toggle"
      type="button"
      slot="actuator"
    >
      {{selected}} {{label}}
      <i class="ion-ios-arrow-down arrow-down"/>
    </button>
    <template>
      <a
        class="dropdown-item"
        v-for="(option, index) in options"
        :key="index"
        @click="selectedItemsPerPage(option.value)"
      >
        {{option.value}} per page
      </a>
    </template>
  </vuestic-dropdown>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    options: {
      type: Array,
      required: true,
    },
    defaultPerPage: {
      type: Number,
    },
  },
  data () {
    return {
      selected: this.defaultPerPage,
    }
  },
  methods: {
    selectedItemsPerPage (optionValue) {
      this.selected = optionValue
      this.$emit('items-per-page', this.selected)
    },
  },
}
</script>

<style lang="scss" scoped>
.btn.dropdown-toggle, .dropdown-menu {
  min-width: 13rem;
  max-width: 13rem;
}

.dropdown-item, .dropdown-toggle {
  text-transform: uppercase;
}
</style>
