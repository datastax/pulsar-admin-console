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
  <div class="vuestic-color-dropdown">
    <div class="vuestic-color-dropdown__toggle" ref="toggleRef"
         @click="toggle()">
      <slot name="toggle"/>
    </div>
    <div v-show="isOpen">
      <div class="vuestic-color-dropdown__content" ref="content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-color-dropdown',
  data () {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },
  },
  mounted () {
    const content = this.$refs.content
    const toggleRef = this.$refs.toggleRef
    window.addEventListener('click', (event) => {
      let target = event.target
      while (target !== null) {
        target = target.parentNode
        if (target === toggleRef || target === content) {
          break
        }
      }
      if (target !== toggleRef && target !== content) {
        this.isOpen = false
      }
    })
  },
}
</script>

<style lang="scss">
.vuestic-color-dropdown {
  &__toggle {
    position: relative;
  }

  &__content {
    position: absolute;
    padding-top: 20px;
    z-index: 1;
  }
}
</style>
