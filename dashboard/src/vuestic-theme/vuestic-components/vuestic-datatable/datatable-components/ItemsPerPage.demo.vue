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
    <div class="demo-container__item" style="width: 200px">
      <items-per-page
        :options="options"
        label="Label"
        :defaultPerPage="itemsPerPage"
        @items-per-page="onItemsPerPage"
      />
    </div>
  </div>
</template>

<script>
import ItemsPerPage from './ItemsPerPage.vue'

export default {
  components: {
    ItemsPerPage,
  },
  data () {
    return {
      itemsPerPage: 7,
      options: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
      ],
    }
  },
  methods: {
    onItemsPerPage (value) {
      // eslint-disable-next-line no-console
      console.log('onItemsPerPage', value)
    },
  },
}
</script>
