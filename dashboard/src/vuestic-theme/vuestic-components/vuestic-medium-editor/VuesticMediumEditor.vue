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
  <div class="vuestic-medium-editor">
    <slot></slot>
  </div>
</template>

<script>
import MediumEditor from 'medium-editor'

export default {
  name: 'vuestic-medium-editor',

  props: {
    editorOptions: {
      type: Object,
      default: () => {
        return {
          buttonLabels: 'fontawesome',
          autoLink: true,
          toolbar: {
            buttons: [
              'bold',
              'italic',
              'underline',
              'anchor',
              'h1',
              'h2',
              'h3',
            ],
          },
        }
      },
    },
  },

  data () {
    return {
      editor: null,
    }
  },

  mounted () {
    this.initEditor()
  },

  beforeDestroy () {
    this.destroyEditor()
  },

  methods: {
    initEditor () {
      this.editor = new MediumEditor(this.$el, this.editorOptions)
      this.$emit('initialized', this.editor)
    },

    destroyEditor () {
      this.editor.destroy()
    },
  },
}
</script>

<style lang="scss">
@import "~medium-editor/src/sass/medium-editor";

.vuestic-medium-editor {
  &:focus {
    outline: none;
  }
}
</style>
