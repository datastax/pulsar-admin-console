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
  <div class="vuestic-accordion">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'vuestic-accordion',
  props: {
    expand: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      lastClickedTab: {},
    }
  },
  provide () {
    return {
      accordion: {
        onChildChange: (child, state) => this.onChildChange(child, state),
      },
    }
  },
  methods: {
    onChildChange (child, state) {
      // Expand means opening one collapse won't close others.
      if (this.expand) {
        return
      }

      // No reaction when user closes collapse.
      if (state === false) {
        return
      }

      this.$children.forEach(collapse => {
        if (collapse === child) {
          return
        }
        collapse.collapse()
      })
    },
  },
}
</script>

// HACK Accordion for presentation page
<style lang="scss">
.vuestic-accordion {

}
</style>
