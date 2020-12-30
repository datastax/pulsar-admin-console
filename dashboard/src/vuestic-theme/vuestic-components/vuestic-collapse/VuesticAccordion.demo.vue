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
    <div class="demo-container__item" style="width: 900px;">
      <vuestic-accordion>
        <vuestic-collapse>
          <span slot="header"> Expand This Block </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand first content
            </div>
          </div>
        </vuestic-collapse>
        <vuestic-collapse>
          <span slot="header"> Another Block </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand second content
            </div>
          </div>
        </vuestic-collapse>
        <vuestic-collapse>
          <span slot="header"> Let's Go </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand three content
            </div>
          </div>
        </vuestic-collapse>
      </vuestic-accordion>
    </div>
    <div class="demo-container__item" style="width: 900px;">
      <vuestic-accordion expand>
        <vuestic-collapse>
          <span slot="header"> Expand This Block </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand first content
            </div>
          </div>
        </vuestic-collapse>
        <vuestic-collapse>
          <span slot="header"> Another Block </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand second content
            </div>
          </div>
        </vuestic-collapse>
        <vuestic-collapse>
          <span slot="header"> Let's Go </span>
          <div slot="body">
            <div style="padding: 10px;">
              Expand three content
            </div>
          </div>
        </vuestic-collapse>
      </vuestic-accordion>
    </div>
  </div>
</template>

<script>
import VuesticCollapse from './VuesticCollapse.vue'
import VuesticAccordion from './VuesticAccordion.vue'

export default {
  components: { VuesticCollapse, VuesticAccordion },
}
</script>
