<template>
  <div class="cluster-tabs">
    <div>
      <nav class="nav nav-pills va-row">
        <div
          class="nav-item col"
          @click="setActive(name)"
          :class="{active: name === activeClusterDetailTab}"
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
      name="cluster-tab-select"
      v-bind:options="names" v-model="activeClusterDetailTab"></vuestic-simple-select>
    <div class="tab-content">
      <div
        class="tab-pane"
        :class="{active: name === activeClusterDetailTab}"
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
  name: 'ClusterTabs',
  props: {
    'names': Array
  },
  computed: {
    ...mapGetters([
      'activeClusterDetailTab'
    ]),
    underscoreClass () {
      return 'underscore-' + this.names.length + '-' + this.names.indexOf(this.activeClusterDetailTab)
    },
  },
  methods: {
    setActive (name) {
      this.$store.dispatch('setActiveClusterDetailTab', name)
    },
  }
}
</script>

<style lang="scss">
.cluster-tabs {
  background-color: black;
  .simple-select {
    padding-top: 0.2rem;
  }
  .nav {
    margin: 0;
    padding-top: 0.25rem;
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
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    > .tab-pane {
      width: 100%
    }
  }
}
</style>
