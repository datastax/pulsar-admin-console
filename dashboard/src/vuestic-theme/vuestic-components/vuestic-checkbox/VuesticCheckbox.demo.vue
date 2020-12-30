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
    <div class="demo-container__item">
      <vuestic-checkbox v-model="value">
        <div slot="label">
         Selected
        </div>
      </vuestic-checkbox>
      <vuestic-checkbox v-model="value" label="Readonly" readonly/>
      <vuestic-checkbox v-model="value" label="Disabled" disabled/>
      <vuestic-checkbox v-model="value" error label="Error" isError/>
      <vuestic-checkbox v-model="value" errorMessages="errorMessages" label="Error-message"/>
      <vuestic-checkbox v-model="value" :errorMessages="errorMessages" :errorCount="2" label="Error-message"/>
      <vuestic-checkbox v-model="value" error disabled label="Error + disabled"/>
    </div>
  </div>
</template>

<script>
import VuesticCheckbox from './VuesticCheckbox'

export default {
  components: {
    VuesticCheckbox
  },
  data () {
    return {
      value: true,
      errorMessages: ['error message 1', 'error message 2']
    }
  }
}
</script>
