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
  <div class="vuestic-tree-root">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'vuestic-tree-root',
  methods: {
    /**
     * @public
     */
    collapse () {
      this.$nextTick(() => {
        this.$children.forEach(child => {
          if (child.$options.name === 'vuestic-tree-category') {
            child.collapse()
          }
        })
      })
    },
    /**
     * @public
     */
    expand () {
      this.$nextTick(() => {
        this.$children.forEach(child => {
          if (child.$options.name === 'vuestic-tree-category') {
            child.expand()
          }
        })
      })
    },
  },
}
</script>

<style lang="scss">
.vuestic-tree-root {
  padding: 0.3125rem;
  // List items require padding. Somewhat hacky, but the only remaining option is using render functions.
  .vuestic-tree-category + .vuestic-tree-category, .vuestic-tree-node + .vuestic-tree-node, .vuestic-tree-category + .vuestic-tree-node, .vuestic-tree-node + .vuestic-tree-category {
    margin-top: 0.625rem;
  }
}
</style>
