# Pulsar Admin Console

Pulsar Admin Console is a web based UI that administrates topics, namespaces, sources, sinks and various aspects of Apache Pulsar features.
### Dev
#### Node and NPM version
Use these versions of node and npm:
```
$ npm -v
6.7.0
$ node -v
v11.15.0
```

#### Build the standalone console
```
cd dashboard
npm install
npm install -g @vue/cli
npm run build-standalone
```

#### Run the standalone console 
```
npm run serve
```

### Run Admin Console in development

1. Configure the Admin Console dashboard. By default the settings expect a Pulsar running standalone mode reachable on localhost (using the Docker static IP address). Configuration is controlled by these files:

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

4. Connect to the Admin Console dashboard on port 9080. The dashboard server will proxy Pulsar API calls to nginx which then forwards to the actual Pulsar cluster (local or remote, depending on configuration)
