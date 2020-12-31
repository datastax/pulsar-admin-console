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
    <button class="btn btn-primary btn-sm" @click="$refs.treeView.expand()">
      EXPAND ALL
    </button>
    <button class="btn btn-primary btn-sm" @click="$refs.treeView.collapse()">
      COLLAPSE ALL
    </button>

    <vuestic-tree-root
      ref="treeView"
    >
      <vuestic-tree-category
        label="Category text"
        isOpen
      >
        <vuestic-tree-node>
          Node text
        </vuestic-tree-node>
        <vuestic-tree-node>
          Node text
        </vuestic-tree-node>
      </vuestic-tree-category>
    </vuestic-tree-root>
  </div>
</template>

<script>
import VuesticTreeRoot from './VuesticTreeRoot.vue'
import VuesticTreeNode from './VuesticTreeNode'
import VuesticTreeCategory from './VuesticTreeCategory'

export default {
  components: { VuesticTreeCategory, VuesticTreeNode, VuesticTreeRoot },
}
</script>
