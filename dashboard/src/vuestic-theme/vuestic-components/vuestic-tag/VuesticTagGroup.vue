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
  <div class="vuestic-tag-group">
    <vuestic-tag
      v-for="(item, index) in value"
      :key="index"
      :name="item.name || item"
      :type="type || item.type"
      :removable="removable"
      @remove="removeTag(index)"
    />
  </div>
</template>

<script>
import VuesticTag from './VuesticTag.vue'

export default {
  name: 'vuestic-tag-group',
  props: {
    removable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
    },
    type: {
      type: String,
      default: '',
    },
  },
  components: {
    VuesticTag,
  },
  methods: {
    removeTag (tagIndex) {
      this.$emit('input', this.value.filter((item, i) => i !== tagIndex))
    },
  },
}
</script>

<style lang="scss">
.vuestic-tag-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
