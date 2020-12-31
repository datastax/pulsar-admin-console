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
  <div class="form-group with-icon-left">
    <div class="input-group">
      <input id="input-icon-left" name="input-icon-left"
             v-model="valueProxy" required/>
      <i
        class="glyphicon glyphicon-search icon-left input-icon search-icon"></i>
      <label class="control-label" for="input-icon-left">{{label}}</label><i
      class="bar"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filterBar',
  props: {
    label: {
      type: String,
    },
    value: ''
  },
  data () {
    return {}
  },
  methods: {},
  computed: {
    valueProxy: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.search-icon {
  transform: rotate(90deg);
}
.form-group {
  min-width: 7rem;
}
@media (max-width: 768px) {
  .form-group {
    width: 80%;
  }
}
</style>
