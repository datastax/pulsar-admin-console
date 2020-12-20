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
$ npm run dev
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

cd ./dashboard

npm install 
npm install -g @vue/cli 
npm run build


# Run Dashboard in development


1. Configure the dashboard. By default the settings expect a Pulsar running standalone mode reachable on localhost (using the Docker static IP address). Configuration is controlled by these files:

* nginx.conf. This defines the forwarding rules. The name of the cluster in the form `/api/v1/cluster` (default: standalone) needs to forward to the actual Pulsar cluster for the various rules.
* dashboard/public/config.js. This specifies the dashboard global configuration, including the cluster name (default: standalone), cluster_list (default: ["standaone]) and various other settings.

2. Start nginx in Docker. Note that the compose file will also start the dashboard container, but it is not used for the development work flow.

```
docker-compose up -dashboard
```

3. Start the development dashboard server.

```
cd dashboard
npm run serve
```

4. Connect to dashboard on port 9080. The dashboard server will proxy Pulsar API calls to nginx which then forwards to the actual Pulsar cluster (local or remote, depending on configuration)
