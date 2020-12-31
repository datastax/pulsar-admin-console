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
  <div class="ui-grid va-row">
    <div class="flex xs12 md12">
      <vuestic-widget headerText="Fixed Grid">
        <div>
          <div class="va-row">
            <div class="flex xs12">
              <div class="_green-rectangle">
                xs12
              </div>
            </div>
            <div class="flex xs6" v-for="i in 2" :key="`6${i}`">
              <div class="_green-rectangle">
                xs6
              </div>
            </div>
            <div class="flex xs4" v-for="i in 3" :key="`4${i}`">
              <div class="_green-rectangle">
                xs4
              </div>
            </div>
          </div>
        </div>
      </vuestic-widget>
    </div>
    <div class="flex md12 xs12">
      <vuestic-widget headerText="Desktop Grid">
        <div class="va-row">
          <div class="flex xs4" v-for="i in 3" :key="`4${i}`">
            <div class="_green-rectangle">
              xs4
            </div>
          </div>
        </div>
        <div class="va-row">
          <div v-for="i in 6" :key="i" class="flex xs2">
            <div class="_green-rectangle">xs2</div>
          </div>
        </div>
        <div class="va-row">
          <div v-for="i in 12" :key="i" class="flex xs1">
            <div class="_green-rectangle">xs1</div>
          </div>
        </div>
      </vuestic-widget>
    </div>

    <div class="flex md12 xs12">
      <vuestic-widget headerText="Mobile and Desktop Grid">
        <div class="va-row">
          <div class="flex xs12 md4">
            <div class="_green-rectangle">xs12 md4</div>
          </div>
        </div>
        <div class="va-row">
          <div class="flex xs8 md3">
            <div class="_green-rectangle">xs8 md3</div>
          </div>
          <div class="flex xs4 md9">
            <div class="_green-rectangle">xs4 md9</div>
          </div>
        </div>
        <div class="va-row">
          <div class="flex xs2 md4">
            <div class="_green-rectangle">xs2 md4</div>
          </div>
          <div class="flex xs8 md4">
            <div class="_green-rectangle">xs8 md4</div>
          </div>
          <div class="flex xs2 md4">
            <div class="_green-rectangle">xs2 md4</div>
          </div>
        </div>
      </vuestic-widget>
    </div>

    <div class="flex md12 xs12">
      <vuestic-widget headerText="Offsets">
        <div class="va-row">
          <div class="flex xs6 md6 offset--md6">
            <div class="_green-rectangle">xs6 md6 offset--md6</div>
          </div>
        </div>
        <div class="flex md6 offset--md3 ">
          <div class="_green-rectangle">md6 offset--md3</div>
        </div>
        <div class="va-row">
          <div class="flex md4">
            <div class="_green-rectangle">md4</div>
          </div>
          <div class="flex md4 offset--md4">
            <div class="_green-rectangle">md4 offset--md4</div>
          </div>
        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
export default {
  name: 'grid',
}
</script>

<style lang="scss">
.ui-grid {
  ._green-rectangle {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 3rem;
    color: $white;
    background-color: $brand-primary;
    border-radius: 0.5rem;
  }
}

</style>
