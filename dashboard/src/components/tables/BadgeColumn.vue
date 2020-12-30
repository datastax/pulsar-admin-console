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
  <span class="circle" :class="classObject"></span>
</template>

<script>
export default {
  name: 'badgeColumn',

  props: {
    rowData: {
      type: Object,
      required: true,
    },

    rowIndex: {
      type: Number,
    },
  },

  computed: {
    classObject: function () {
      return {
        'badge-warning': this.rowIndex % 6 === 0,
        'badge-primary': this.rowIndex % 6 === 1,
        'badge-danger': this.rowIndex % 6 === 2,
        'badge-info': this.rowIndex % 6 === 3,
        'badge-violet': this.rowIndex % 6 === 4,
        'badge-dark-blue': this.rowIndex % 6 === 5,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.circle {
  width: .75rem;
  height: .75rem;
  border-radius: 50%;
  display: inline-block;
}
</style>
