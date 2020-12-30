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
  <div class="vuestic-social-news">
    <div class="d-flex justify--space-between align--center vuestic-social-news__text-with-button">
      <span class="text">That what users have posted about your business.</span>
      <a :href="url" target="_blank">
        <button class="btn btn-micro btn-primary">VIEW</button>
      </a>
    </div>
    <div class="d-flex justify--space-around vuestic-social-news__photo-list">
      <div
        class="vuestic-social-news__photo-list__photo"
        v-for="(pieceOfNews, index) in news"
        :key="index"
        :style="`background: url(${pieceOfNews.photoURL})`"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-social-news',
  props: ['news', 'url'],
}
</script>

<style lang="scss">
.vuestic-social-news {
  &__text-with-button {
    padding-bottom: 1.5rem;
    overflow: hidden;
    .text {
      font-size: $font-size-base;
      @include va-ellipsis();
    }
    .btn {
      margin-left: 1rem;
      line-height: 1; //TODO: review btn styles
    }
  }
  &__photo-list {
    // This hides photos that won't fit.
    height: 80px;
    overflow: hidden;
    flex-wrap: wrap;

    &__photo {
      background-size: cover !important;
      width: 80px;
      height: 80px;
      margin-right: 2px;
    }
  }
}
</style>
