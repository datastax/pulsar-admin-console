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
  <vuestic-tree-root>
    <vuestic-tree-category label="Images">
      <div slot="icon" class="icon">
        <span aria-hidden="true" class="ion ion-md-images"/>
      </div>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-image"/>
        </div>
        sick_catz_cuddling.jpg
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-image"/>
        </div>
        pins-and-needles.jpg
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-image"/>
        </div>
        avatar_50x50.jpg
      </vuestic-tree-node>
    </vuestic-tree-category>
    <vuestic-tree-category label="Music" isOpen>
      <div slot="icon" class="icon">
        <span aria-hidden="true" class="ion ion-md-star-outline"/>
      </div>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-musical-notes"/>
        </div>
        Taylor_swift_hello.mp3
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-musical-notes"/>
        </div>
        straight_to_the_bank.wav
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-musical-notes"/>
        </div>
        imagine_dragons_promo.mp3
      </vuestic-tree-node>
    </vuestic-tree-category>
    <vuestic-tree-category label="Miscellaneous">
      <div slot="icon" class="icon">
        <span aria-hidden="true" class="ion ion-md-list"/>
      </div>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-grid"/>
        </div>
        dump.sql
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-help"/>
        </div>
        unknown-file
      </vuestic-tree-node>
      <vuestic-tree-node>
        <div slot="icon" class="icon">
          <span aria-hidden="true" class="ion ion-md-key"/>
        </div>
        secure.key
      </vuestic-tree-node>
    </vuestic-tree-category>
  </vuestic-tree-root>
</template>

<script>
export default {
  name: 'tree-view-icons-preview',
}
</script>
