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
  <div class="vuestic-breadcrumbs">
    <div class="vuestic-breadcrumbs__nav-section">
      <router-link
        class="vuestic-breadcrumbs__nav-section-item"
        :to="{ path: breadcrumbs.root.name }"
      >
        {{ $t(breadcrumbs.root.displayName) }}
      </router-link>
      <router-link
        v-for="(item, index) in displayedCrumbs"
        :to="{ name: item.name }"
        :key="index"
        class="vuestic-breadcrumbs__nav-section-item"
        :class="{ disabled: item.disabled }"
      >
        {{ $t(item.displayName) }}
      </router-link>
    </div>
    <!-- <button class="btn btn-micro">
      <span
        class="fa fa-refresh"
        style="`font-size: 30px`"
        aria-hidden="true"
        @click="refreshData"
      />
    </button> -->
    
  </div>
</template>

<script>
export default {
  name: 'vuestic-breadcrumbs',
  props: {
    breadcrumbs: {
      type: Object,
      default: () => ({}),
    },
    currentRouteName: {
      type: String,
      default: '',
    },
  },
  computed: {
    displayedCrumbs () {
      // Breadcrumbs object has root and routes. Root is required for us to display home page.
      const routeBreadcrumbList = this.breadcrumbs.routes

      const foundBreadcrumbs = this.findInNestedByName(routeBreadcrumbList, this.currentRouteName)

      if (!foundBreadcrumbs.length) {
        // eslint-disable-next-line no-console
        console.warn(`No breadcrumbs registered for route with name "${this.currentRouteName}"`)
      }

      return foundBreadcrumbs
    },
    currentRoute () {
      return this.$route.meta.wikiLink
    },
  },
  methods: {
    findInNestedByName (routeBreadcrumbList, name) {
      for (const routeBreadcrumb of routeBreadcrumbList) {
        // We found breadcrumbs for route
        if (routeBreadcrumb.name === name) {
          return [routeBreadcrumb]
        }
        // We didn't find any breadcrumbs for route - means we have to go deeper!
        // Which works only if route breadcrumb has children declared.
        if (!routeBreadcrumb.children) {
          continue
        }
        let result = this.findInNestedByName(routeBreadcrumb.children, name)
        if (result.length) {
          return [routeBreadcrumb, ...result]
        }
      }
      return []
    },
    refreshData(){
      this.$store.dispatch('updateAll')
    },
  },
}
</script>

<style lang='scss'>
.vuestic-breadcrumbs {
  min-height: $breadcrumbs-height;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .vuestic-breadcrumbs__nav-section-item {
    color: $text-gray;

    &:hover {
      color: $brand-primary;
    }

    text-transform: capitalize;

    &.disabled {
      pointer-events: none;
    }

    &:last-child::after {
      display: none;
    }

    &::after {
      padding: 0 5px;
      display: inline-block;
      content: $breadcrumbs-arrow-content;
      vertical-align: middle;
      color: $brand-primary;
      font-size: $breadcrumbs-arrow-font;
      font-family: FontAwesome;
    }
  }

  .vuestic-breadcrumbs__help-section {
    .vuestic-icon {
      font-size: 20px;
    }
  }
}
</style>
