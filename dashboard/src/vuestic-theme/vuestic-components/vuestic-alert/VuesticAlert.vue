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
  <transition name="fade">
    <div class='vuestic-alert alert' :class="alertClass" v-if="!hidden">
      <slot></slot>
      <i class="fa fa-close alert-close" v-if="withCloseBtn"
         @click="hide()"></i>
    </div>
  </transition>

</template>

<script>
export default {
  name: 'vuestic-alert',
  computed: {
    alertClass () {
      return {
        'with-close': this.withCloseBtn,
        'alert-success': this.type === 'success',
        'alert-danger': this.type === 'danger',
        'alert-warning': this.type === 'warning',
        'alert-info': this.type === 'info',
      }
    },
  },
  props: {
    type: {
      type: String,
      default: 'success',
    },
    withCloseBtn: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    hide () {
      this.hidden = true
    },
  },
}
</script>

<style lang='scss' scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0
}
</style>
