# Dashboard and its backend
This is a private repo.

### Dev
#### Node and NPM version
Node and npm version required are. In fact, do not upgrade to node 14+. Some 12 versions may not work either especially on OSX.
```
$ npm -v
6.7.0
$ node -v
v11.15.0
```

#### Build Dashboard
```
$ npm install
```

##### Run dev 
```
$ npm run serve
```

##### Build vue components
This is required since the Node server loads these components
```
$ npm run build
```
#### Node server
```
npm install

npm server.js
```

cd ./wp-content/themes/kafkaesque/dashboard

RUN npm install 
RUN npm install -g @vue/cli 
RUN npm run build
cp ./backend/* ./wp-content/themes/kafkaesque/dashboard/dist/ 

### wordpress

Current bootstrap wp script
wp-content/themes/kafkaesque/includes/enqueue-scripts.php
