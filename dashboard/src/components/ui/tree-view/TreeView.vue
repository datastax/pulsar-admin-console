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
  <div class="sets-list va-row">
    <div class="flex md12 xs12">
      <div class="va-row">

        <div class="small-set flex lg6 xs12">
          <vuestic-widget :headerText="$t('treeView.basic')">
            <tree-view-basic-preview/>
          </vuestic-widget>
        </div>

        <div class="small-set flex lg6 xs12">
          <vuestic-widget :headerText="$t('treeView.icons')">
            <tree-view-icons-preview/>
          </vuestic-widget>
        </div>
      </div>

      <div class="va-row">
        <div class="small-set flex lg6 xs12">
          <vuestic-widget :headerText="$t('treeView.advanced')">
            <tree-view-advanced-preview/>
          </vuestic-widget>
        </div>

        <div class="small-set flex lg6 xs12">
          <vuestic-widget :headerText="$t('treeView.editable')">
            <tree-view-editable-preview/>
          </vuestic-widget>
        </div>
      </div>
      <div class="small-set flex lg6 xs12">
        <vuestic-widget :headerText="$t('treeView.selectable')">
          <tree-view-selectable-preview/>
        </vuestic-widget>
      </div>

    </div>
  </div>
</template>

<script>
import VuesticWidget
  from '../../../vuestic-theme/vuestic-components/vuestic-widget/VuesticWidget.vue'
import TreeViewBasicPreview from './TreeViewBasicPreview'
import TreeViewIconsPreview from './TreeViewIconsPreview'
import TreeViewSelectablePreview from './TreeViewSelectablePreview'
import TreeViewAdvancedPreview from './TreeViewAdvancedPreview'
import TreeViewEditablePreview from './TreeViewEditablePreview'

export default {
  name: 'tree-view',
  components: {
    TreeViewEditablePreview,
    TreeViewAdvancedPreview,
    TreeViewSelectablePreview,
    TreeViewIconsPreview,
    TreeViewBasicPreview,
    VuesticWidget,
  },
  data () {
    return {
      treeViewData: {},
    }
  },
}
</script>

<style lang="scss">

</style>
