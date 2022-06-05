# Pulsar Admin Console

Pulsar Admin Console is a web based UI that administrates topics, namespaces, sources, sinks and various aspects of [Apache Pulsar](https://pulsar.apache.org/) features.

The admin console is a VueJS application that runs in a browser. It also includes a web server that serves up the files for the admin console as well as providing configuration and authentication services.

## Configuration
The configuration file for the Pulsar admin console is named `default.json` and is in the `./config` directory. Additional
configuration files can be placed in this directory to override parameters, as described [here](https://github.com/node-config/node-config/wiki/Configuration-Files).

The `default.json` configuration file contains a set of general configs for the admin console plus a server-specific set under `server_config`.
The admin console server proxies all requests from the admin console to the Pulsar broker (or Pulsar proxy). You need to configure `pulsar_url`
to point to one of your brokers or a proxy/loadbalancer in front of the brokers (can be Pulsar proxy). 

For the Brokers section of the 
admin console to work, the admin console server must be able to directly reach each broker by the IP/hostname that is returned by
the Pulsar CLI command `pulsar-admin brokers list <clustername>`. The cluster name can be retrieved with the CLI command `pulsar-admin clusters list`.
In a geo-replication configuration, you will want to use the cluster name for the local cluster. You must set the cluster name in the 
`cluster_name` setting of the configuration file.

## Auth Modes
There are four available configurations for `auth_mode`: `none`, `user`, `k8s`, and `openidconnect`.

The `user` and `k8s` mode support token based authentication to Pulsar. For this to work, you need to configure a token either using `token_path` (a file containing the token)
or `admin_token` (the token itself). This token will be used to authenticate with Pulsar. For all features of the admin console to work, a superuser token is recommended.

The `openidconnect` mode works with an OpenID Connect 1.0 compatible authentication provider (ex Okta) to authentication both the admin console and Pulsar. 

### Auth Mode: none

In this mode, no login screen is presented. Authentication must be disabled on Pulsar since the admin console will not attempt to authenticate.

### Auth Mode: user

The admin console is protected by a login screen. The credentials are configured using the `username` and `password` settings in the config file. Once authenticated with these credentials, the token for connecting to Pulsar is retrieved from the server (configured using `token_path` or `admin_token`) and used to authenticate with the Pulsar cluster.

### Auth Mode: k8
The admin console is protected by a login screen. The credentials are retrieved from a Kubernetes secret. For this to work, the admin console server must have access to a Kubernetes API, either user a kubeconfig file in the environment or by having local access (for example, by running as a pod in a Kubernetes cluster).

The namespace for the secret is set using `k8s_namespace`. The secret name must have a prefix of `dashboard-user-` followed by the username. For example, the admin user would have a secret name of `dashboard-user-admin`. The password must be stored in the secret with a key of `password` and a value of the password itself. Multiple secrets with the prefix can be configured to set up multiple users for the admin console. A password can be reset by patching the corresponding Kubernetes secret.

Once the user is authenticated using one of the Kubernetes secrets, the token for connecting to Pulsar is retrieved from the server (configured using `token_path` or `admin_token`) and used to authenticate with the Pulsar cluster.

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

### Development

#### Node and NPM version
Use these versions of node and npm:
```
$ npm -v
6.14.15
$ node -v
v14.18.3
```

In order to easily manage your node and npm versions across developer machines, we use [nvm](https://github.com/nvm-sh/nvm). We set the node version in the [.nvmrc](./.nvmrc) file. In order to set up your environment, open a shell, change to the project directory, and run the following:

```shell
nvm use
nvm install
```

When upgrading versions of node, we should make sure to use LTS versions. You can find LTS versions on the node website or by using `nvm`.

```shell
nvm list
```

Then, pick which `lts/` version to use. Currently, we use `fermium`, so you can run the following:

```shell
nvm install lts/fermium
```

When upgrading node versions, make sure to update the [Dockerfile](./Dockerfile), the [.nvmrc](./.nvmrc) file, and the CI scripts (i.e. [.github/](./github/)).

#### Install application dependencies

```
cd dashboard
npm install
cd ..
cd server
npm install
```

#### Run Admin Console in development

1. Configure the Admin Console dashboard. By default the settings expect a Pulsar running standalone mode reachable on localhost. Configuration is controlled by these files:

* config/default.json. This specifies the dashboard global configuration, including the Pulsar URL, cluster name and various other settings.

2. Start server.

```
cd server
npm run serve
```

3. Start the development dashboard server.

```
cd dashboard
npm run serve
```

4. Connect to the Admin Console dashboard on port 9080. The dashboard server will proxy Pulsar API calls to server which then forwards to the actual Pulsar cluster (local or remote, depending on configuration)

#### Run the standalone console 
```
cd dashboard
npm install
npm run serve
```

#### Run the server
```
cd server
npm install
npm run serve
```

### Build the standalone console
```
cd dashboard
npm install
npm install -g @vue/cli
npm run build-standalone
```
