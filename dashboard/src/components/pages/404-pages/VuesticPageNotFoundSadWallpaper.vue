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
  <div class=" vuestic-page-not-found-sad-wallpaper">
    <img src="https://i.imgur.com/hu80UGU.png"
         class="vuestic-page-not-found-sad-wallpaper__sad-image"/>
  </div>
</template>

<script>
export default {
  name: 'VuesticPageNotFoundSadWallpaper',
}
</script>

<style lang="scss">
.vuestic-page-not-found-sad-wallpaper {
  position: absolute;
  overflow: hidden;
  height: 40%;
  width: 100%;
  bottom: 0;
  padding-left: 80%;

  &__sad-image {
    width: 505px;
    height: 400px;
    position: absolute;
    padding: 20px 20px 0 20px;
    right: 0;
    bottom: 0;
  }

  @include media-breakpoint-down(md) {
    overflow: hidden;
    height: 35%;
    padding-left: 50%;

    &__sad-image {
      width: 400px;
      height: 320px;
      overflow: hidden;
    }
  }

  @include media-breakpoint-down(xs) {
    display: none;

    &__sad-image {
      display: none;
    }
  }
}
</style>
