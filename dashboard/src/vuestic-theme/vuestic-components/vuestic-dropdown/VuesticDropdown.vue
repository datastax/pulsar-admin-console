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

<script>
import VuesticPopup
  from '../vuestic-popup/quasar/components/popup/VuesticPopup.vue'

const positionMap = {
  top: { anchor: 'top middle', self: 'bottom middle' },
  right: { anchor: 'center right', self: 'center left' },
  bottom: { anchor: 'bottom middle', self: 'top middle' },
  left: { anchor: 'center left', self: 'center right' },
}

const generatePosition = position => {
  if (!position) {
    return {}
  }

  return { ...positionMap[position], offset: [12, 12] }
}

export default {
  name: 'vuestic-dropdown',
  extend: VuesticPopup,
  props: {
    position: {
      type: String,
      validate: position => position in positionMap,
    },
  },
  render (createElement) {
    return createElement(
      VuesticPopup,
      {
        class: {
          'vuestic-dropdown': true,
        },
        props: {
          ...generatePosition(this.position),
          ...this.$attrs,
        },
        on: this.$listeners,
      },
      this.$slots.default,
    )
  },
}
</script>

<style lang="scss">
.vuestic-dropdown {
  background: $darkest-gray;
}
</style>
