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
  <vuestic-tree-root>

    <vuestic-tree-category label="Electronics">
      <vuestic-tree-node v-for="electronic in electronics" :key="electronic.id">
        <div class="form-group">
          <div class="input-group">
            <input v-model="electronic.name">
            <i class="bar"></i>
          </div>
        </div>
      </vuestic-tree-node>
    </vuestic-tree-category>

    <vuestic-tree-category isOpen label="Products">
      <vuestic-tree-node v-for="product in products" :key="product.id">
        <div class="form-group">
          <div class="input-group">
            <input v-model="product.name">
            <i class="bar"></i>
          </div>
        </div>
        <div slot="iconRight" class="icon" @click="removeProduct(product)">
          <span aria-hidden="true" class="ion ion-md-close"/>
        </div>
      </vuestic-tree-node>
      <vuestic-tree-node>
        <button class="btn btn-primary btn-micro mb-2"
                @click="addProduct()"
        >
          Add new product
        </button>
      </vuestic-tree-node>
    </vuestic-tree-category>

  </vuestic-tree-root>
</template>

<script>
export default {
  name: 'tree-view-editable-preview',
  data () {
    return {
      electronics: [
        { id: 1, name: 'Cellphones' },
        { id: 2, name: 'Camera Body Kits' },
        { id: 3, name: 'External HDDs' },
      ],
      products: [
        { id: 4, name: 'Cables' },
        { id: 5, name: 'Monitors' },
        { id: 6, name: 'Keyboards' },
      ],
    }
  },
  methods: {
    addProduct () {
      this.products.push({
        id: Math.floor(Math.random() * 100000),
        name: 'New product',
      })
    },
    removeProduct (product) {
      this.products = this.products.filter(productToFilter => productToFilter !== product)
    },
  },
}
</script>

<style scoped>

</style>
