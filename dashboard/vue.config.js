//
//  Copyright 2021 DataStax, Inc. 
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  
//

const path = require('path')
const fs = require('fs')

module.exports = {
  lintOnSave: false,
  // baseUrl was deprecated https://cli.vuejs.org/config/#baseurl
  publicPath: process.env.BASE_URL,
  // filenameHashing: false,
  // delete HTML related webpack plugins
  chainWebpack: config => {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Pulsar Admin Console',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  configureWebpack: {
    devServer: {
      compress: false,
      lazy: false,
      host: 'localhost',
      inline: true,
      https: {
        key: fs.readFileSync('./ssl/localhost.key'),
        cert: fs.readFileSync('./ssl/localhost.crt'),
        ca: fs.readFileSync('./ssl/localhost.crt')
      },
      disableHostCheck: true,
      watchOptions: {
        // poll: 3000,
        ignored: /node_modules/
      },
      hot: true,
      proxy: {
        '/api/*': { 
          target: 'http://localhost:6454',
          secure: false,
          changeOrigin: true
        },
        '/ws/*': { 
          target: 'ws://localhost:8002',
          secure: false,
          ws: true,
          changeOrigin: true
        }
      },
      headers: {
        'X-Custom-Foo': 'bar',
        'Access-Control-Allow-Origin': '*'
      }
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'src': path.resolve('src'),
        'assets': path.resolve('src/assets'),
        'components': path.resolve('src/components'),
        'services': path.resolve('src/services'),
        'directives': path.resolve('src/directives'),
        'vuestic-mixins': path.resolve('src/vuestic-theme/vuestic-mixins'),
        'vuestic-components': path.resolve('src/vuestic-theme/vuestic-components'),
        'vuestic-directives': path.resolve('src/vuestic-theme/vuestic-directives'),
        'vuestic-theme': path.resolve('src/vuestic-theme'),
        'data': path.resolve('src/data'),
        'vuex-store': path.resolve('src/store')
      }
    },
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        data: `@import "@/sass/shared.scss";`
      }
    }
  }
}
