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
  <div class="source-tabs">
    <div>
      <nav class="nav nav-pills va-row">
        <div
          class="nav-item col"
          @click="setActive(name)"
          :class="{active: name === activeSourceDetailTab}"
          v-for="name in names"
          :key="name"
        >
          <span class="nav-link"><h5>{{name}}</h5></span>
        </div>
      </nav>
      <div class="track">
        <div :class="underscoreClass"></div>
      </div>
    </div>
    <vuestic-simple-select
      class="simple-select"
      v-show="false"
      name="source-tab-select"
      v-bind:options="names" v-model="activeSourceDetailTab"></vuestic-simple-select>
    <div class="tab-content">
      <div
        class="tab-pane"
        :class="{active: name === activeSourceDetailTab}"
        v-for="name in names"
        :key="name"
      >
        <slot :name="name"></slot>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

// d-none and d-lg-flex were deleted, bug will be fixed in the nearest update
export default {
  name: 'SourceTabs',
  props: {
    'names': Array
  },
  computed: {
    ...mapGetters([
      'activeSourceDetailTab'
    ]),
    underscoreClass () {
      return 'underscore-' + this.names.length + '-' + this.names.indexOf(this.activeSourceDetailTab)
    },
  },
  methods: {
    setActive (name) {
      this.$store.dispatch('setActiveSourceDetailTab', name)
    },
  }
}
</script>

<style lang="scss">
.source-tabs {
  background-color: white;
  .simple-select {
    padding-top: 1.5rem;
  }
  .nav {
    margin: 0;
    padding-top: 2.25rem;
    .nav-item {
      flex-grow: 1;
      text-align: center;
      padding: 0;
      .nav-link {
        padding: 0;
        color: $gray;
        transition: all .3s ease;
      }
      &:hover {
        cursor: pointer;
        .nav-link {
          color: $vue-darkest-blue;
        }
      }
      &.active {
        .nav-link {
          color: $vue-darkest-blue;
        }
      }
    }
  }
  .track {
    overflow: hidden;
    width: 100%;
    height: .125rem;
    position: relative;
    div[class^='underscore-'] {
      background-color: $brand-primary;
      height: .125rem;
      position: absolute;
    }
    $koeff: 0.8;
    @for $all from 1 through 10 {
      $width: 1/$all;
      div[class^='underscore-#{$all}'] {
        width: $width * $koeff * 100%;
        transition: left .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      @for $place from 0 through $all {
        .underscore-#{$all}-#{$place} {
          left: ($place + (1 - $koeff)/2) * $width * 100%;
        }
      }
    }
  }
  .tab-content {
    padding-bottom: $tab-content-pb;
    padding-top: $tab-content-pt;
    > .tab-pane {
      width: 100%
    }
  }
}
</style>
