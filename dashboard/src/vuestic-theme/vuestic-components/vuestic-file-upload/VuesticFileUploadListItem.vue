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
  <div
    class="file-upload-list-item d-flex"
    :class="{'file-upload-list-item--undo': removed}"
  >
    <div
      class="va-row"
      v-if="removed"
    >
      <div class="flex md12">
        <vuestic-file-upload-undo
          @recover="recoverFile"
        />
      </div>
    </div>

    <div class="va-row align--center" v-else>
      <div class="file-upload-list-item__name flex xs12 lg3 ellipsis">
        {{ file.name }}
      </div>
      <div class="file-upload-list-item__size flex xs12 lg3">
        {{ file.size }}
      </div>
      <div class="file-upload-list-item__date flex xs12 lg4">
        <span>{{ $t('fileUpload.uploadedOn')}} {{ file.date }}</span>
      </div>
      <!-- TODO Use global classes instead -->
      <div class="file-upload-list-item__button-container flex xs12 lg2">
        <button
          type="button"
          class="btn-text btn-text--primary"
          @click="removeFile"
        >
          {{ $t('fileUpload.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VuesticFileUploadUndo from './VuesticFileUploadUndo'

export default {
  name: 'vuestic-file-upload-list-item',
  components: {
    VuesticFileUploadUndo: VuesticFileUploadUndo,
  },
  props: {
    file: {
      type: Object,
    },
  },
  data () {
    return {
      removed: false,
    }
  },
  methods: {
    showFilePreview () {

    },
    removeFile () {
      this.removed = true
      setTimeout(() => {
        if (this.removed) {
          this.$emit('remove')
          this.removed = false
        }
      }, 2000)
    },
    recoverFile () {
      this.removed = false
    },
  },
}
</script>

<style lang='scss'>
.file-upload-list-item {
  & + & {
    margin-top: 0.5rem;
  }

  background-color: $white;
  box-shadow: $sidebar-box-shadow;
  padding: 0.6rem 1rem;

  &__size {
    margin: auto;
    color: $gray-light;
  }

  &__date {
    margin: auto;
    color: $gray-light;
  }

  &--undo {
    background: none;
    box-shadow: none;
  }

  @include media-breakpoint-up(lg) {
    &__button-container {
      text-align: right;
    }
  }
}
</style>
