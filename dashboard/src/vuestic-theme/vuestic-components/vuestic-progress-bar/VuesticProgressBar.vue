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
  <div class="vuestic-progress-bar">
    <horizontal-bar
      :value="value"
      :text="text"
      :size="size"
      :disabled="disabled"
      :animated="animated"
      :theme="theme"
      v-if="type == 'horizontal'"
    />
    <vertical-bar
      :value="value"
      :text="text"
      :size="size"
      :disabled="disabled"
      :animated="animated"
      :theme="theme"
      v-if="type == 'vertical'"
    />
    <circle-bar
      :value="value"
      :text="text"
      :disabled="disabled"
      :animated="animated"
      :theme="theme"
      :background-theme="backgroundTheme"
      v-if="type == 'circle'"
    />
  </div>
</template>

<script>
import HorizontalBar from './progress-types/HorizontalProgressBar.vue'
import VerticalBar from './progress-types/VerticalProgressBar.vue'
import CircleBar from './progress-types/CircleProgressBar.vue'

export default {
  name: 'vuestic-progress-bar',
  components: {
    HorizontalBar,
    VerticalBar,
    CircleBar,
  },
  props: {
    value: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0 && value <= 100
      },
    },
    text: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'Primary',
    },
    backgroundTheme: {
      type: String,
      default: 'White',
    },
    type: {
      type: String,
      default: 'horizontal',
    },
    size: {
      type: String,
      default: 'basic',
      validator: function (value) {
        return ['thin', 'thick', 'basic'].indexOf(value) !== -1
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    animated: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      transformedValue: 0,
      valueAnimationInterval: 1000,
    }
  },
  mounted () {
    if (this.type === 'circle' && this.animated) {
      this.animateValue()
    } else {
      this.transformedValue = this.value
    }
  },
  methods: {
    animateValue () {
      let valueMsecs = this.valueAnimationInterval / 200
      let delta = Math.sign(this.value - this.transformedValue)
      let valueInterval = setInterval(() => {
        if (this.transformedValue === this.value) {
          clearInterval(valueInterval)
        } else {
          this.transformedValue += delta
        }
      }, valueMsecs)
    },
  },
}
</script>
