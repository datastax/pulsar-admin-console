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
  <div class="demo-container">
    <div
      class="demo-container__item"
      v-for="(dropdown, index) in dropdowns"
      :key="index"
    >
      <button
        type="button"
        class="btn btn-primary dropdown-toggle theme-toggle"
        slot="actuator"
      >
        {{ dropdown.text }}
        <i class="ion-ios-arrow-down arrow-down"></i>
        <vuestic-dropdown
          v-model="dropdown.value"
          :position="dropdown.position"
        >
          <div class="q-popover__container">
            <a
              class="dropdown-item"
              href="#"
              v-for="(link, index) in links"
              :key="index"
            >{{ link }}</a>
            <div class="flex lg6"></div>
          </div>
        </vuestic-dropdown>
      </button>
    </div>
  </div>
</template>

<script>
import VuesticDropdown from './VuesticDropdown.vue'

export default {
  components: {
    VuesticDropdown,
  },
  data () {
    return {
      links: [
        'Action',
        'Another action',
        'Something else here',
      ],
      dropdowns: [
        {
          text: 'top',
          value: false,
          position: 'top',
        },
        {
          text: 'right',
          value: false,
          position: 'right',
        },
        {
          text: 'bottom',
          value: false,
          position: 'bottom',
        },
        {
          text: 'left',
          value: false,
          position: 'left',
        },
      ],
    }
  },
}
</script>
