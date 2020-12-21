'use strict'
/*
 * a logger
 */
const { createLogger, format, transports } = require('winston');

const L = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(format.timestamp(), format.colorize(), format.simple() ),
    transports: [
        new transports.Console({})
    ]
});
/*
 * All dashboard and node server config is sourced from environment variables at runtime 
 **/
let dashboardConfig = {
    'template_directory_uri': '',
    'ajax_url': '',
    'rest_url': '',
    'tenant': 'public',
    'polling_interval': '10000',
    'wss_url': '',
    'disable_billing': '',
    'home_cluster': 'standalone',
    'test': '',
    'client_token': '',
    'admin_token': '',
    'login': 'admin',
    'email': 'admin@example.com',
    'client_role': '',
    'plan': '',
    'need_to_create_plan': '',
    'plan_to_create': '',
    'admin_role': '',
    'cluster_list': ["standalone"],
    'api_base_url': 'https://localhost:8001/api/v1',
    'backend_url': 'http://localhost',
    'ca_certificate': '',
    'api_version': '2.6.1',
    'default_plan': '',
    'notice_text': '',
    'user_role': 'administrator',
    'feature_flags': "{\"function\":true,\"sink\":true,\"source\":true,\"tenantStats\":false}",
    'security': '',
    'chargebee_site': '',
    'billing_provider': '',
    'multi_user_org': '',
    'private_org': 'true',
    'functions_disabled': 'false',
    'clients_disabled': 'false',
    'running_env': 'k8s',
    'use_token_list': 'false',
    'auth_mode': 'none'
}

let serverConfig = {
    'PORT': '6454',
    'LOG_LEVEL': 'info',
    'K8S_NAMESPACE': 'pulsar'
}

const reconcileConfig = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        if (process.env[key]) {
            obj[key] = JSON.parse(process.env[key])
        }
    }
}

const config = (indexHtml) => {
    reconcileConfig(serverConfig)
    dashboardConfig.backend_url = dashboardConfig.backend_url + ":" + serverConfig.PORT;
    reconcileConfig(dashboardConfig)
    generateIndexHtml(indexHtml)
}
const fs = require('fs');

const generateIndexHtml = (indexHtml) => {

    const data = '<div id=wp-vue-app></div><script type=\'text/javascript\' id=\'chunk-index-js-extra\'> /* <![CDATA[ */'
           + 'var globalConf = ' + JSON.stringify(dashboardConfig)
           + '/* ]]> */</script>';

    fs.readFile(indexHtml+'.template', 'utf8', function (err,fileData) {
        if (err) {
            L.error(err);
            return
        }
        var result = fileData.replace(/<div id=wp-vue-app><\/div>/g, data);
        
        fs.writeFile(indexHtml, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
    
}

module.exports = {
    L,
    config,
    dashboardConfig,
    serverConfig
};
