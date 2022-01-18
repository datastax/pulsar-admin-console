# Pulsar Admin Console

Pulsar Admin Console is a web based UI that administrates topics, namespaces, sources, sinks and various aspects of Apache Pulsar features.

## Auth Modes
There are three available configurations for `auth_mode`: `none`, `k8s`, and `openidconnect`.

### Auth Mode: OpenID Connect
In this auth mode, the dashboard will use your login credentials to attempt to retrieve a JWT from an authentication
provider. In the [DataStax Pulsar Helm Chart](https://github.com/datastax/pulsar-helm-chart), this is implemented by
integrating the Pulsar Admin Console with Keycloak. Upon successful retrieval of the JWT, the Pulsar Admin Console will
use the retrieved JWT as the bearer token when making calls to Pulsar.

In addition to configuring the `auth_mode`, you also need to configure the `oauth_client_id`. This is the client id that
the Console will use when authenticating with Keycloak. Note that in Keycloak, it is important that this client exists
and that it has the `sub` claim properly mapped to your desired Pulsar subject. Otherwise, the JWT won't work as desired.

#### Connecting to an OpenID Connect Auth/Identity Provider
When opening the Console, the first page is the login page. When using the `openidconnect` auth mode, the auth call
needs to go to the Provider's server. In the current design, nginx must be configured to route the call to the provider.
The [DataStax Pulsar Helm Chart](https://github.com/datastax/pulsar-helm-chart) does this automatically.

### Dev
#### Node and NPM version
Use these versions of node and npm:
```
$ npm -v
6.14.15
$ node -v
v12.22.9
```

In order to easily manage your node and npm versions, you can use [nvm](https://github.com/nvm-sh/nvm).

There are two helpful commands for setting the correct version. First, you can set the exact node and npm version by running

```shell
nvm use node 12.22.9
```

When upgrading versions of node, we should make sure to use LTS versions. You can find LTS versions on the node website or by using `nvm`.

```shell
nvm list
```

Then, pick which `lts/` version to install. Currently, we use `erbium`, so you can run the following:

```shell
nvm install lts/erbium
```

When upgrading node versions, make sure to update the [Dockerfile](./Dockerfile).


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
docker-compose up -d
```

3. Start the development dashboard server.

```
cd dashboard
npm run serve
```

4. Connect to the Admin Console dashboard on port 9080. The dashboard server will proxy Pulsar API calls to nginx which then forwards to the actual Pulsar cluster (local or remote, depending on configuration)
