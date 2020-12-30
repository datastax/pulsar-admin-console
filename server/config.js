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
    'token_path': '',
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
            obj[key] = process.env[key]
        }
    }
}

const config = (indexHtml) => {
    reconcileConfig(serverConfig)
    reconcileConfig(dashboardConfig)
    generateIndexHtml(indexHtml)
}
const fs = require('fs');

const generateIndexHtml = (indexHtml) => {

    let overrideConfig = {}

    if (dashboardConfig.token_path) {
        
        const token = fs.readFileSync(dashboardConfig.token_path, "utf8")
        overrideConfig.admin_token = token.trim()
        overrideConfig.client_token = token.trim()
        
    }

    const data = '<div id=wp-vue-app></div><script type=\'text/javascript\' id=\'chunk-index-js-extra\'> /* <![CDATA[ */'
           + 'let overrideConf = ' + JSON.stringify(overrideConfig)
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
