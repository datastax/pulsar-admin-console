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
  <div>
      <transition name="fade">
                    <div class='vuestic-alert alert alert-danger' v-if="!hidden">
                        <span class="badge badge-pill badge-danger">{{'notificationsPage.alerts.error' | translate}}</span>
                        {{ errorText }}
                        <i class="fa fa-close alert-close"
                        @click="hideAlert()"></i>
                    </div>
        </transition>
  </div>
</template>

<script>
export default {
    name: 'Alert',

    data() {
        return {
            hidden: this.startHidden
        }
    },

    props: {
        startHidden: {
            type: Boolean,
            default: true
        },
        scrollToTop: {
            type: Boolean,
            default: true
        },
        errorText: {
            type: String,
            default: "Something went wrong"
        },
        msToDisplay: {
            type: Number,
            default: 8000
        }
    },

    methods: {
        hideAlert () {
            this.hidden = true
        },
        showAlert () {
            this.hidden = false
            // Move to top so the alert can be seen
            if (this.scrollToTop) {
                window.scrollTo(0,0)
            }

            setTimeout(() => {
                        this.hidden = true
                    }, this.msToDisplay)

        }
    }
}
</script>

<style lang='scss' scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0
}
</style>