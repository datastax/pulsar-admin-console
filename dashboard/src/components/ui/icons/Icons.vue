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
  <div class="ui-icons">
    <router-view :sets="sets"></router-view>
  </div>
</template>

<script>
const iconTypes = [
  'vuestic',
  'brandico',
  'entypo',
  'font-awesome',
  'fontelico',
  'glyphicons',
  'iconic-stroke',
  'ionicons',
  'maki',
  'openweb',
]

export default {
  name: 'icons',
  computed: {
    sets () {
      let sets = []
      iconTypes.forEach(iconType => {
        let set = require('./sets/' + iconType + '.json')
        this.addFilteredListsTo(set)
        sets.push(set)
      })
      return sets
    },
  },
  methods: {
    addFilteredListsTo (set) {
      // This allows us to add icons to icon set.
      const list = set.lists[0].icons
      const filteredLists = []
      filteredLists.push(list.slice(0, 6))
      filteredLists.push(list.slice(6, 8))
      filteredLists.push(list.slice(8, 14))
      set.filteredLists = filteredLists
    },
  },
  data () {
    return {
      setsPath: './sets/',
    }
  },
}
</script>

<style lang="scss">
.ui-icons {

}
</style>
