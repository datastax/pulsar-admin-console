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
  <slider
    v-bind="sliderOptions"
    :value="value"
    @input="change"
    :bg-style="sliderOptions.bgStyle"
    :slider-style="sliderOptions.sliderStyle"
    class="vuestic-slider"
    :reverse="reverse"
  />
</template>

<script>
import Slider from 'vue-slider-component'
import store from 'vuex-store'

export default {
  name: 'vuestic-slider',

  components: {
    Slider,
  },

  props: {
    value: {
      type: Number,
      required: true,
    },

    options: {
      type: Object,
    },

    reverse: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      defaultOptions: {
        dotSize: 16,
        height: 2,
        realTime: true,
        sliderStyle: {
          'background-color': store.getters.palette.primary,
          'box-shadow': 'none',
        },
        processStyle: {
          'background-color': store.getters.palette.primary,
        },
        tooltipStyle: {
          'background-color': store.getters.palette.primary,
          'border-color': store.getters.palette.primary,
        },
      },
    }
  },

  computed: {
    sliderOptions () {
      return Object.assign({}, this.defaultOptions, this.options)
    },
  },

  methods: {
    change (value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style>
</style>
