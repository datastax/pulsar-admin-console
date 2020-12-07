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
    'tenant': '',
    'polling_interval': '',
    'wss_url': '',
    'disable_billing': '',
    'home_cluster': '',
    'test': '',
    'client_token': '',
    'admin_token': '',
    'login': '',
    'email': '',
    'client_role': '',
    'plan': '',
    'need_to_create_plan': '',
    'plan_to_create': '',
    'admin_role': '',
    'cluster_list': '',
    'api_base_url': '',
    'backend_url': 'http://localhost',
    'ca_certificate': '',
    'api_version': '',
    'default_plan': '',
    'notice_text': '',
    'user_role': '',
    'feature_flags': '',
    'security': '',
    'chargebee_site': '',
    'billing_provider': '',
    'multi_user_org': '',
    'private_org': '',
    'functions_disabled': '',
    'clients_disabled': '',
    'running_env': 'k8s',
    'use_token_list': '',
}

let serverConfig = {
    'PORT': '6454',
    'LOG_LEVEL': 'info',
    'K8S_NAMESPACE': 'pulsar'
}

const reconcileConfig = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        if (process.env[key]) {
            obj[key] = process.env[key]
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
    let data = ''
    for (const [key, value] of Object.entries(dashboardConfig)) {
        data = data + '"' + key + '":"' + value + '",'
    }
    data = data.replace(/,$/,'};');

    data = '<script type=\'text/javascript\' id=\'chunk-index-js-extra\'> /* <![CDATA[ */'
           + 'var wpData = {' + data
           + '/* ]]> */</script></body>/</html>';

    fs.readFile(indexHtml+'.template', 'utf8', function (err,fileData) {
        if (err) {
            L.error(err);
            return
        }
        var result = fileData.replace(/<\/body><\/html>/g, data);
        
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