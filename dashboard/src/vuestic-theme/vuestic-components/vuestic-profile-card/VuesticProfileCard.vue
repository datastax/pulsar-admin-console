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
  <div class="vuestic-profile-card flex align--center">
    <div class="photo">
      <img :src="photoSource"/>
    </div>
    <h5 class="name">{{name}}</h5>
    <span class="location"><span
      class="icon glyphicon glyphicon-map-marker"></span> {{location}}</span>
    <div class="social">
      <a class="icon brandico brandico-facebook-rect"
         v-if="social.facebook" :href="'https://' + social.facebook"
         target="_blank"></a>
      <a class="icon brandico brandico-instagram"
         v-if="social.instagram" :href="'https://' + social.instagram"
         target="_blank"></a>
      <a class="icon brandico brandico-twitter"
         v-if="social.twitter" :href="'https://' + social.twitter"
         target="_blank"></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-profile-card',
  props: ['photoSource', 'name', 'location', 'social'],
}
</script>

<style lang="scss">
$vuestic-profile-card-width: 12.6875rem;
$vuestic-profile-card-photo-diameter: 9.375rem;

.vuestic-profile-card {
  width: $vuestic-profile-card-width;
  .photo {
    height: $vuestic-profile-card-photo-diameter;
    width: $vuestic-profile-card-photo-diameter;
    border-radius: 50%;
    background-color: $lighter-gray;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
    }
  }
  .name {
    margin-top: 1.325rem;
    margin-bottom: 0;
  }
  .location {
    margin-top: 0.8125rem;
    .icon {
      color: $lighter-gray;
      font-size: $font-size-larger;
    }
    &:hover {
      cursor: pointer;
      .icon {
        color: red;
      }
    }
  }
  .social {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    margin-top: 1.25rem;
    width: 100%;
    border-top: solid .125rem $light-gray;
    .icon {
      color: $gray;
      text-decoration: none;
      font-size: $font-size-h4;
      margin-right: .4375rem;
      margin-left: .4375rem;
      &:hover {
        cursor: pointer;
        color: darken($gray, 50%);
      }
    }
  }
}
</style>
