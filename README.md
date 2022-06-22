# Pulsar Admin Console

Pulsar Admin Console is a web based UI that administrates topics, namespaces, sources, sinks and various aspects of [Apache Pulsar](https://pulsar.apache.org/) features.

The admin console is a VueJS application that runs in a browser. It also includes a web server that serves up the files for the admin console as well as providing configuration and authentication services.

## Installation

To install the Pulsar Admin Console:

1. Ensure [node](https://nodejs.org/en/download/) version 16.15 or higher is installed.

2. Download the latest release tarball from the [release page](https://github.com/datastax/pulsar-admin-console/releases).

3. Extract the tarball. 
```
tar xfvz pulsar-admin-console-<version>.tar.gz
```
4. Update the configuration in the `./pulsar-admin-console-<version>/config` directory. You can update the `default.json` or add an override file named `local.json`. See "Configuration" section below.

## Starting


1. Change to the `server` subdirectory of the install directory.
```
cd ./pulsar-admin-console-<version>/server
```
2. Start the process.
```
npm start
```
3. Open the port (default 6454) in a browser.
```
google-chrome-stable http://localhost:6454
``` 

## Configuration
The configuration file for the Pulsar admin console is named `default.json` and is in the `./config` directory. Additional
configuration files (for example, `local.json`) can be placed in this directory to override parameters, as described [here](https://github.com/node-config/node-config/wiki/Configuration-Files).

The `default.json` configuration file contains a set of general configs for the admin console plus a server-specific set under `server_config`.
The admin console server proxies all requests from the admin console to the Pulsar broker (or Pulsar proxy). You need to configure `pulsar_url`
to point to one of your brokers or a proxy/loadbalancer in front of the brokers (can be Pulsar proxy). 

For the Brokers section of the 
admin console to work, the admin console server must be able to directly reach each broker by the IP/hostname that is returned by
the Pulsar CLI command `pulsar-admin brokers list <clustername>`. The cluster name can be retrieved with the CLI command `pulsar-admin clusters list`.
In a geo-replication configuration, you will want to use the cluster name for the local cluster. You must set the cluster name in the 
`cluster_name` setting of the configuration file.

### Configuration reference

| Setting     | Default | Description |
| ----------- | ----------- |---------- |
| auth_mode | none | Authentication mode. One of `none`, `user`, `k8s`, or `openidconnect`. See "Auth Modes for details| 
| cluster_name | standalone | Name of Pulsar cluster connecting to.  The cluster name can be retrieved with the CLI command `pulsar-admin clusters list`. |
| tenant | public | The default Pulsar tenant to view when starting the console. |
| oauth_client_id || This is the client ID that the console will use when authenticating with authentication provider |
| server_config.port | 6454 | The listen port for the console server |
| server_config.pulsar_url | http://localhost:8080 | URL for connecting to the Pulsar cluster. Should point to either a broker or Pulsar proxy. The console server must be able to reach this URL. 
| server_config.websocket_url | https://websocket.example.com:8500 | URL for WebSocket proxy. Used by Test Clients to connect to Pulsar. The console server must be able to reach this URL. 
| server_config.log_level | info | Log level for the console server
| server_config.token_path |  | When using `user` or `k8s` auth mode, a Pulsar token is used to connect to the Pulsar cluster. This specifies the path to a file that contains the token to use. For full access, a superuser token is recommended. Alternatively, use `admin_token`. |
| server_config.admin_token | | When using `user` or `k8s` auth mode, a Pulsar token is used to connect to the Pulsar cluster. This specifies the token as a string. For full access, a superuser token is recommended. The `token_path` setting will override this value if present.|
| server_config.token_secret| | Secret used when signing access token for logging into the console. If not specified, a default secret is used |
| server_config.ssl.verify_certs | false | Verify TLS certificate is trusted |
| server_config.ssl.hostname_validation | | Verify hostname matches the TLS certificate |
| server_config.ssl.ca_path | | Path to the CA certificate. To enable HTTPS, `ca_path`, `cert_path`, and `key_path` must all be set |
| server_config.ssl.cert_path | | Path to the server certificate. To enable HTTPS, `ca_path`, `cert_path`, and `key_path` must all be set |
| server_config.ssl.key_path | | Path to the TLS key. To enable HTTPS, `ca_path`, `cert_path`, and `key_path` must all be set |
| server_config.kubernetes.k8s_namespace | pulsar | When using `k8s` auth_mode, Kubernetes namespace that contains the username/password secrets |
| server_config.kubernetes.service_host| | When using `k8s` auth_mode, specify a custom Kubernetes host name. |
| server_config.kubernetes.service_port | | When using `k8s` auth_mode, specify a custom Kubernetes port. |
| server_config.user_auth.username | | When using `user` auth_mode, the login user name. |
| server_config.user_auth.password | | When using `user` auth_mode, the login password. |
| server_config.oauth2.enabled | | When using `openidconnect` set to `true` to forward token requests. |
| server_config.oauth2.hostname | | When using `openidconnect` set to your hostname ex: `localhost` |
| server_config.oauth2.forwardingPath | | When using `openidconnect` set to the path you need to forward to to get the token |
| server_config.oauth2.enableTls | | When using `openidconnect` set to `true` if you wish to use `HTTPS` |
| server_config.oauth2.http | | When using `openidconnect` and only using `HTTP` set to your port |
| server_config.oauth2.https | | When using `openidconnect` and using `HTTPS` set to your port |
| polling_interval | 10000 | How often the console polls Pulsar for updated values. In milliseconds. |
| ca_certificate | | String of CA certificate to display in the console under Credentials. |
| api_version | 2.8.3 | Version of the Pulsar client API to recommend under Samples. |
| notice_text | | Custom notice to appear at top of console. |
| functions_disabled | false | If functions are not enabled in the cluster, disable the function sections (Functions, Sinks, Sources)
| render_monitoring_tab | false | Enable tab that includes links to Grafana dashboards. |
| grafana_url | | If `render_monitoring_tab` is enabled, URL for Grafana. |
| clients_disabled | false | Disable test clients. Test clients depend on WebSocket proxy, so if this is not running in Pulsar cluster you may want to disable them. |
| host_overrides.pulsar | http://localhost:6650" | URL to display in console to connect to Pulsar. |
| host_overrides.ws | //localhost:8080" | URL to display in console to connect to WebSocket proxy. |
| host_overrides.http | http://localhost:8964" | URL to display in console to connect to Pulsar Beam HTTP proxy. |


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

#### Run Pulsar Standalone

Update the version to your desired version of Pulsar

```
docker run -it -p 6650:6650  -p 8080:8080 --mount source=pulsardata,target=/pulsar/data --mount source=pulsarconf,target=/pulsar/conf apachepulsar/pulsar:2.8. bin/pulsar standalone
```

#### Run Admin Console in development

1. Configure the Admin Console dashboard. By default the settings expect a Pulsar running standalone mode reachable on localhost. Configuration is controlled by these files:

* config/default.json. This specifies the dashboard global configuration, including the Pulsar URL, cluster name and various other settings.
* config/local.json. A override file that can be used for development specific settings.

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
