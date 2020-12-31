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
  <div class="vuestic-feed">
    <div v-if="posts.length == 0" class="empty">Your feed is empty.</div>
    <div
      class="post"
      v-for="(post, index) in posts"
      :key="index"
      :class="{last: posts.indexOf(post) === posts.length - 1}"
    >
      <div class="photo-container">
        <div class="photo" :style="`background: url(${post.photoURL})`"></div>
      </div>
      <div class="underscored">
        <span class="text"><span class="name">{{post.name}}</span> {{post.text}}.</span>
        <button v-on:click="removePost(post)"
                class="btn btn-micro btn-primary btn-with-icon close-btn rounded-icon">
          <i class="ion-md-close ion"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vuestic-feed',
  props: ['initialPosts'],
  methods: {
    removePost (target) {
      let result = []
      for (let post of this.posts) {
        if (post !== target) {
          result.push(post)
        }
      }
      this.posts = result
    },
  },
  data () {
    return {
      posts: this.initialPosts,
    }
  },
}
</script>

<style lang="scss">
.vuestic-feed {
  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .empty {
    text-align: center;
  }
  .post {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .photo-container {
      margin-right: 1rem;
      border-radius: 50%;
      border: 2px solid $lighter-gray;
      .photo {
        background-size: cover !important;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
    }
    .underscored {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: $light-gray2 2px solid;
      overflow: hidden;
      padding-right: 0.7rem;
      height: 3.5rem;
      .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .name {
          font-weight: $font-weight-bold;
        }
      }
      .close-btn {
        margin-left: 1rem;
        i {
          left: 10.5px;
        }
      }
    }
    &.last {
      .underscored {
        border-bottom: none;
      }
    }
  }
}
</style>
