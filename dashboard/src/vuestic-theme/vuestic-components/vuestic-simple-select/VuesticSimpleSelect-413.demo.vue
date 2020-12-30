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
    <div class="demo-container__item" style="width: 500px;">
      <vuestic-simple-select
        label="Position"
        v-model="value"
        option-key="description"
        :options="imagePositions"
      />
    </div>
  </div>
</template>

<script>
// Fixes https://github.com/epicmaxco/vuestic-admin/issues/413

import VuesticSimpleSelect from './VuesticSimpleSelect'

export default {
  name: 'my-component',
  components: { VuesticSimpleSelect },
  data: () => {
    return {
      value: null,
      imagePositions: [
        {
          id: '1',
          description: '1',
        },
        {
          id: '2',
          description: '2',
        },
      ],
    }
  },
}
</script>
