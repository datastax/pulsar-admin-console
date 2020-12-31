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
  <div class="tags-page">
    <div class="flex md12">
      <vuestic-widget :headerText="$t('tags.default')">
        <vuestic-tag-group v-model="tags"/>
      </vuestic-widget>
    </div>

    <div class="flex md12">
      <vuestic-widget :headerText="$t('tags.removable')">
        <vuestic-tag-group v-model="removableTags" removable/>
      </vuestic-widget>
    </div>

    <div class="flex md12">
      <vuestic-widget :headerText="$t('tags.colored')">
        <vuestic-tag-group v-model="coloredTags" removable/>
      </vuestic-widget>
    </div>

  </div>
</template>

<script>
export default {
  name: 'tags',
  data () {
    return {
      tagss: [],
      tags: [
        'Ford',
        'Toyota',
        'Volkswagen',
        'Opel',
        'Honda',
        'Porsche',
      ],
      removableTags: [
        'Ford',
        'Toyota',
        'Volkswagen',
        'Opel',
        'Honda',
        'Porsche',
      ],
      coloredTags: [
        {
          name: 'Potato',
          type: 'primary',
        },
        {
          name: 'Tomato',
          type: 'danger',
        },
        {
          name: 'Sweet corn',
          type: 'info',
        },
        {
          name: 'Carrot',
          type: 'dark',
        },
        {
          name: 'Broccoli',
          type: 'warning',
        },
        {
          name: 'Green bean',
          type: 'pale',
        },
      ],
    }
  },
}
</script>
