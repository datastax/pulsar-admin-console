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
  <div
    style="left: 420px; top: 180px; background-color: white; position: absolute"
  >
    <vuestic-tree-node>
      <vuestic-checkbox
        slot="checkbox"
        v-model="checkboxValue"
      />
      <div slot="icon" class="icon">
        <span aria-hidden="true"
              class="ion ion-md-nutrition"
        />
      </div>
      Some text
    </vuestic-tree-node>
  </div>
</template>

<script>
import VuesticTreeNode from './VuesticTreeNode.vue'

import VuesticCheckbox from '../vuestic-checkbox/VuesticCheckbox'

export default {
  components: {
    VuesticTreeNode,
    VuesticCheckbox,
  },
  data () {
    return {
      checkboxValue: false,
    }
  },
}
</script>
