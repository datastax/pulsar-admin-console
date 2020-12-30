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
  <div class="filters-page">
    <vuestic-widget headerText="Show filters">
      <div class="row">
        <div class="col-md-12">
          <div slot="body">
            <div class="row filters-page__filter-bar-container">
              <filter-bar
                v-model="name"
                class="filters-page__filter-bar"
                label="Name"
              />
              <filter-bar
                v-model="email"
                class="filters-page__filter-bar"
                label="Email"
              />
              <vuestic-simple-select
                class="filters-page__filter-bar"
                label="City"
                v-model="city"
                :options="cityList"
              />
            </div>
          </div>
          <div class="filters-page__tags">
            <vuestic-tag
              v-if="name"
              :name="`Name: ${ name }`"
              removable
              @remove="name = ''"
            />
            <vuestic-tag
              v-if="email"
              :name="`Email: ${ email }`"
              removable
              @remove="email = ''"
            />
            <vuestic-tag
              v-if="city"
              :name="`City: ${ city }`"
              removable
              @remove="city = ''"
            />
            <span
              v-if="this.city || this.name || this.email"
              class="filters-page__clear-all-text"
              @click="clearAll"
            >
              Clear all filters
            </span>
          </div>
        </div>
      </div>
    </vuestic-widget>
    <vuestic-widget>
      <div class="table-responsive">
        <table class="table table-striped first-td-padding">
          <thead>
          <tr>
            <td class="filters-page__table-heading">{{ $t('tables.headings.name') }}</td>
            <td class="filters-page__table-heading">{{ $t('tables.headings.email') }}</td>
            <td class="filters-page__table-heading">{{ $t('tables.headings.city') }}</td>
            <td align="right" class="filters-page__table-heading">{{ $t('tables.headings.score') }}</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in filteredItems" v-bind:key="item.email">
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.city }}</td>
            <td align="right">{{ item.score }}</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </vuestic-widget>
  </div>
</template>

<script>
import VuesticWidget
  from '../../../vuestic-theme/vuestic-components/vuestic-widget/VuesticWidget'
import FilterBar
  from '../../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'
import VuesticSimpleSelect
  from '../../../vuestic-theme/vuestic-components/vuestic-simple-select/VuesticSimpleSelect'
import { SpringSpinner } from 'epic-spinners'
import { cityList, itemList } from './filtersData'
export default {
  name: 'filters',
  components: {
    VuesticWidget, FilterBar, SpringSpinner, VuesticSimpleSelect
  },
  data () {
    return {
      name: '',
      email: '',
      city: '',
      cityList: cityList,
      itemList: itemList,
    }
  },
  methods: {
    clearAll () {
      this.name = ''
      this.email = ''
      this.city = ''
    }
  },
  computed: {
    filteredItems () {
      let filteredItems = this.itemList
      if (this.name) {
        filteredItems = filteredItems.filter(item => item.name.toUpperCase()
          .search(this.name.toUpperCase()) !== -1)
      }
      if (this.email) {
        filteredItems = filteredItems.filter(item => item.email.toUpperCase()
          .search(this.email.toUpperCase()) !== -1)
      }
      if (this.city) {
        filteredItems = filteredItems.filter(item => item.city.toUpperCase()
          .search(this.city.toUpperCase()) !== -1)
      }
      return filteredItems
    }
  }
}
</script>

<style lang="scss">
.filters-page {
  &__tags {
    display: flex;
  }
  &__filter-bar {
    width: 300px;
  }
  &__filter-bar-container {
    margin: 0;
    justify-content: space-between;
  }
  &__table-heading {
    color: $brand-primary
  }
  &__collapse {
    .vuestic-collapse__body {
      background-color: white;
    }
  }
  &__clear-all-text {
    cursor: pointer;
    color: $brand-primary;
    margin-top: 0.3rem;
  }
}
</style>
