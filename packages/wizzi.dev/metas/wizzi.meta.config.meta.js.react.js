/*
    artifact generator: C:\My\wizzi\stfnbssl\wizzi.plugins\packages\wizzi.plugin.js\lib\artifacts\js\module\gen\main.js
    package: wizzi-js@
    primary source IttfDocument: C:\My\wizzi\stfnbssl\wizzi.dev\packages\wizzi.dev\.wizzi\metas\wizzi.meta.config.meta.js.react.js.ittf
    utc time: Thu, 20 Jul 2023 13:56:51 GMT
*/
'use strict';
const path = require('path');
// const minimist = require('minimist')
// const config = require('../src/utils/config')
// const error = require('../src/utils/error')

// const args = minimist(process.argv.slice(2))

module.exports = {
    meta: "meta-meta-js-react", 
    metaCtxPath: path.join(__dirname, 'ittf', 'js.react.json.ittf'), 
    destPath: "C:/My/wizzi/stfnbssl/wizzi.metas/packages/wizzi.meta.js.react", 
    plugins: [
        "./wizzi.plugin.html/index", 
        "./wizzi.plugin.js/index", 
        "./wizzi.plugin.css/index", 
        "./wizzi.plugin.ittf/index", 
        "./wizzi.plugin.json/index"
    ], 
    pluginsBaseFolder: "C:/My/wizzi/stfnbssl/wizzi.plugins/packages", 
    metaPlugins: [
        "./wizzi.meta.cloud/index", 
        "./wizzi.meta.commons/index", 
        "./wizzi.meta.docs/index", 
        "./wizzi.meta.documents/index", 
        "./wizzi.meta.js/index", 
        "./wizzi.meta.js.vanilla/index", 
        "./wizzi.meta.js.react/index", 
        "./wizzi.meta.ts/index", 
        "./wizzi.meta.ts.express/index", 
        "./wizzi.meta.ts.react/index", 
        "./wizzi.meta.ts.db/index", 
        "./wizzi.meta.web/index", 
        "./wizzi.meta.wizzi/index"
    ], 
    metaPluginsBaseFolder: "C:/My/wizzi/stfnbssl/wizzi.metas/packages", 
    globalContext: {
        isPackageDeploy: true, 
        isDevelopment: false
     }
 };
