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

var globalConf = {
    "auth_mode": "none",
    "token_path": "",
    "token_secret": "",
    "server_config": {
        "port": "6454",
        "pulsar_url": "http://localhost:8080",
        "websocket_url": "https://websocket.example.com:8500",
        "log_level": "info",
        "k8s_namespace": "pulsar",
    },
    "ssl": {
        "ca_path": "",
        "cert_path": "",
        "key_path": "",
    },
    "kubernetes": {
        "kubernetes_service_host": "",
        "kubernetese_service_port": "",
    },
    "template_directory_uri": "",
    "ajax_url": "",
    "rest_url": "",
    "tenant": "public",
    "polling_interval": "10000",
    "wss_url": "",
    "disable_billing": "",
    "home_cluster": "standalone",
    "test": "",
    "client_token": "",
    "admin_token": "",
    "superuser_token_path": "",
    "login": "admin",
    "email": "admin@example.com",
    "client_role": "",
    "plan": "",
    "need_to_create_plan": "",
    "plan_to_create": "",
    "admin_role": "",
    "cluster_list": ["standalone"],
    "api_base_url": "/api/v1",
    "ca_certificate": "",
    "api_version": "2.6.1",
    "default_plan": "",
    "notice_text": "",
    "grafana_url": "",
    "user_role": "administrator",
    "feature_flags": {
        "function": true,
        "sink": true,
        "source": true,
        "tenantStats": false
    },
    "security": "",
    "chargebee_site": "",
    "billing_provider": "",
    "multi_user_org": "",
    "private_org": "true",
    "functions_disabled": "false",
    "render_monitoring_tab": "false",
    "clients_disabled": "false",
    "running_env": "k8s",
    "use_token_list": "false",
    "oauth_client_id": "",
    "host_overrides": {
        "pulsar": "http://localhost:6650",
        "ws": "ws://localhost:8080",
        "http": "http://localhost:8964" 
    },
    
}

module.exports = { globalConf };
