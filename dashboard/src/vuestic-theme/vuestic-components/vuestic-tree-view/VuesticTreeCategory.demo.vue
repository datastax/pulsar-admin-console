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
    style="left: 420px; top: 180px; width: 400px; background-color: white; position: absolute">
    <vuestic-tree-category label="Category with icon">
      <div slot="icon" class="icon">
        <span aria-hidden="true" class="ion ion-md-nutrition"/>
      </div>
      <vuestic-tree-node>
        One
      </vuestic-tree-node>
      <vuestic-tree-node>
        Two
      </vuestic-tree-node>
      <vuestic-tree-node>
        Three
      </vuestic-tree-node>
    </vuestic-tree-category>

    <vuestic-tree-category label="Category open" isOpen>
      <vuestic-tree-node>
        One
      </vuestic-tree-node>
      <vuestic-tree-node>
        Two
      </vuestic-tree-node>
      <vuestic-tree-node>
        Three
      </vuestic-tree-node>
    </vuestic-tree-category>
  </div>
</template>

<script>

import VuesticTreeCategory from './VuesticTreeCategory'
import VuesticTreeNode from './VuesticTreeNode'

export default {
  components: { VuesticTreeNode, VuesticTreeCategory },
}
</script>
