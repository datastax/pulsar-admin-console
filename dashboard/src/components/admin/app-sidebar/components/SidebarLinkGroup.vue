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
  <li class="sidebar-link-group sidebar-link">
    <a href="#"
       target="_self"
       @click.stop.prevent="toggleMenuItem()"
       class="sidebar-link__router-link"
       :class="classObject">
      <slot name="title"></slot>
      <i class="expand-icon fa fa-angle-down"></i>
    </a>
    <expanding>
      <ul class="sidebar-submenu in" v-show="this.expanded"
          ref="linkGroupWrapper">
        <slot></slot>
      </ul>
    </expanding>
  </li>
</template>

<script>
import SidebarLink from './SidebarLink'
import Expanding from 'vue-bulma-expanding/src/Expanding'

export default {
  name: 'sidebar-link-group',
  components: {
    SidebarLink,
    Expanding,
  },
  data () {
    return {
      expanded: this.expanded,
    }
  },
  mounted () {
    let linkGroup = this.$refs.linkGroupWrapper
    if (linkGroup.querySelector('.router-link-active') !== null) {
      this.expanded = true
    }
  },
  watch: {
    $route (route) {
      this.expanded = false
    },
  },
  methods: {
    toggleMenuItem () {
      this.expanded = !this.expanded
    },
  },
  computed: {
    classObject: function () {
      return {
        'expanded': this.expanded,
      }
    },
  },
}

</script>

<style lang="scss">

.sidebar-link {
  .sidebar-link__router-link {
    color: white;
  }
}


.sidebar-link-group {
  .sidebar-link__router-link {
    color: white;

    .expand-icon {
      position: absolute;
      right: $sidebar-arrow-right;
      top: calc(50% - #{$font-size-root} / 2);
      font-weight: bold;
      transition: transform 0.3s ease;

    }
    &.expanded {
      .expand-icon {
        transform: rotate(180deg);
      }
    }
  }

  .sidebar-submenu {
    list-style: none;
    padding-left: 0;

    li {
      display: block;
      padding-left: 0;
    }
    .sidebar-link__router-link {
      height: $sidebar-submenu-link-height;
      padding-left: $sidebar-submenu-link-pl;
      font-size: $font-size-smaller;

    }
  }
}

.expand-icon {
  color: $brand-primary;
}

</style>
