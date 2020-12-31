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
  <div class="collapse-page">
    <div class="flex md12">
      <vuestic-widget :headerText="$t('collapse.accordion')">
        <vuestic-accordion>
          <vuestic-collapse>
            <span slot="header"> Expand This Block </span>
            <div slot="body">
              <div class="va-row">
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">February 2018</h4>
                    <div>
                      The unique stripes of zebras make them one of the animals
                      most familiar to people. They occur in a variety of
                      habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">March 2018</h4>
                    <div>
                      They occur in a variety of habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vuestic-collapse>
          <vuestic-collapse>
            <span slot="header"> Another Block </span>
            <div slot="body">
              <div class="va-row">
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">April 2018</h4>
                    <div>
                      The unique stripes of zebras make them one of the animals
                      most familiar to people. They occur in a variety of
                      habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">May 2018</h4>
                    <div>
                      They occur in a variety of habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vuestic-collapse>
          <vuestic-collapse>
            <span slot="header"> Let's Go </span>
            <div slot="body">
              <div class="va-row">
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">June 2018</h4>
                    <div>
                      The unique stripes of zebras make them one of the animals
                      most familiar to people. They occur in a variety of
                      habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
                <div class="flex md6">
                  <div class="collapse-page__content">
                    <h4 class="collapse-page__content__title">July 2018</h4>
                    <div>
                      They occur in a variety of habitats,
                      such as grasslands, savannas, woodlands, thorny
                      scrublands.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vuestic-collapse>
        </vuestic-accordion>
      </vuestic-widget>
    </div>
    <div class="flex md12">
      <vuestic-widget :headerText="$t('collapse.buttons')">
        <div class="va-row">
          <div class="flex md12">
            <vuestic-collapse noHeader>
              <div class="va-row" slot="header">
                <div class="flex md4">
                  <button class="btn btn-primary">
                    <span> Expand Button </span>
                  </button>
                </div>
              </div>
              <div slot="body">
                <div class="va-row">
                  <div class="flex md6">
                    <div class="collapse-page__content">
                      <h4 class="collapse-page__content__title">February
                        2018</h4>
                      <div>
                        The unique stripes of zebras make them one of the
                        animals
                        most familiar to people. They occur in a variety of
                        habitats,
                        such as grasslands, savannas, woodlands, thorny
                        scrublands.
                      </div>
                    </div>
                  </div>
                  <div class="flex md6">
                    <div class="collapse-page__content">
                      <h4 class="collapse-page__content__title">March 2018</h4>
                      <div>
                        They occur in a variety of habitats,
                        such as grasslands, savannas, woodlands, thorny
                        scrublands.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </vuestic-collapse>
          </div>
        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
export default {
  name: 'collapse',
}
</script>

<style lang="scss">
.collapse-page {
  &__content {
    padding: 2rem;
    &__title {
      font-size: 1.375rem;
      font-weight: bold;
    }
    &__description {

    }
  }
}
</style>
