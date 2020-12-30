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
  <div class="not-found-pages va-row">
    <div class="flex md12">
      <div class="va-row">
        <vuestic-card
          class="not-found-pages__cards"
          :image="item.imageUrl"
          v-for="item in items"
          :key="item.$index"
        >
          {{ item.label }}
          <div class="not-found-pages__button-container pt-3 mb-0">
            <router-link
              :to="{ name: item.buttonTo }"
              target="_blank"
            >
              <button
                class="btn btn-primary btn-sm not-found-pages__advanced-button">
                {{ 'View Example' }}
              </button>
            </router-link>
          </div>
        </vuestic-card>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'not-found-pages',
  data () {
    return {
      items: [
        {
          imageUrl: 'https://i.imgur.com/GzUR0Wz.png',
          label: 'Advanced layout',
          buttonTo: 'not-found-advanced',
        },
        {
          imageUrl: 'https://i.imgur.com/HttcXPi.png',
          label: 'Simple',
          buttonTo: 'not-found-simple',
        },
        {
          imageUrl: 'https://i.imgur.com/dlcZMiG.png',
          label: 'Custom image',
          buttonTo: 'not-found-custom',
        },
        {
          imageUrl: 'https://i.imgur.com/qcOlDz7.png',
          label: 'Large text heading',
          buttonTo: 'not-found-large-text',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.not-found-pages {
  $cardGutter: #{(19/16)}rem;
  .vuestic-card.not-found-pages__cards {
    min-width: 220px;
    text-align: center;
    margin: 0 $cardGutter calc(#{$cardGutter} * 2) $cardGutter;
  }
  &__button-container {
    .btn.not-found-pages__advanced-button {
      font-size: $font-size-root;
      font-weight: $font-weight-bold;
      padding-left: 0;
      padding-right: 0;
      width: 180px;
    }
    text-align: center;
  }
}
</style>
