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
  <div class="vuestic-page-not-found-large-text">
    <div class="vuestic-page-not-found-large-text__content">
      <div class="vuestic-page-not-found-large-text__wallpaper">
        <router-link
          class="i-vuestic vuestic-page-not-found-large-text__i-vuestic"
          :to="{path: '/'}"/>
      </div>
      <div class="vuestic-page-not-found-large-text__wallpaper">
        <h1 class="vuestic-page-not-found-large-text__number">404</h1>
      </div>
      <div class="vuestic-page-not-found-large-text__wallpaper">
        <h3 class="vuestic-page-not-found-large-text__text">The page's gone
          fishing.</h3>
      </div>
      <div class="vuestic-page-not-found-large-text__wallpaper flex md12">
        <div class="va-row vuestic-page-not-found-large-text__message justify--center">
          <h4 class="vuestic-page-not-found-large-text__text-small">
            If you feel that it's not right, please send us a message at &nbsp;
          </h4>
          <a href="mailto:hello@epicmax.co">hello@epicmax.co</a>
        </div>
      </div>
      <div
        class="vuestic-page-not-found-large-text__wallpaper-button flex md12">
        <router-link :to="{ path: './dashboard' }">
          <button class="btn btn-primary back-button">
            {{'Back to dashboard'}}
          </button>
        </router-link>
      </div>
    </div>
    <vuestic-page-not-found-sad-wallpaper/>
    <made-by-component/>
  </div>
</template>

<script>
import MadeByComponent from './MadeByComponent'
import VuesticPageNotFoundSadWallpaper
  from './VuesticPageNotFoundSadWallpaper.vue'

export default {
  name: 'vuestic-page-not-found-large-text',
  components: {
    MadeByComponent,
    VuesticPageNotFoundSadWallpaper,
  },
}
</script>

<style lang="scss">
.vuestic-page-not-found-large-text {
  min-height: 100vh;
  padding-bottom: 84px;
  background-color: $top-nav-bg;

  &__number {
    font-size: 350px;
    text-align: center;
    line-height: 1.4;
    letter-spacing: 15px;
    margin-right: -15px;
    margin-bottom: 0;
    color: white;
  }
  &__text {
    color: white;
  }
  &__text-small {
    font-size: $font-size-root;
    line-height: 1.5;
    text-align: center;
    color: white;
    font-weight: normal;
  }
  &__wallpaper {
    background-color: $top-nav-bg;
    overflow: hidden;
    display: flex;
    text-align: center;
    align-items: flex-start;
    justify-content: center;

    a {
      margin-top: 2rem;
    }
  }
  &__wallpaper-button {
    padding-top: 20px;
    padding-bottom: 10px;
    text-align: center;
    background-color: $top-nav-bg;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  &__i-vuestic {
    z-index: 2;
    margin-top: 8%;
    height: $auth-wallpaper-ivuestic-h;
    width: 100%;
  }
  @include media-breakpoint-down(xs) {
    .vuestic-page-not-found-large-text {
      height: $auth-mobile-main-h;

      &__wallpaper-button {
        width: 100%;
        margin-left: 0;

        .back-button {
          max-width: 300px;
          padding-left: 30px;
          padding-right: 30px;
        }
      }
      &__number {
        font-size: 150px;
      }
      &__i-vuestic {
        margin-top: 5%;
      }
      &__text-small {
        font-size: 15px;
      }
    }
  }
}
</style>
