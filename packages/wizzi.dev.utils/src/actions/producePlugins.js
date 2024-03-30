/*
    artifact generator: C:\My\wizzi\stfnbssl\wizzi.plugins\packages\wizzi.plugin.js\lib\artifacts\js\module\gen\main.js
    package: wizzi-js@
    primary source IttfDocument: C:\My\wizzi\stfnbssl\wizzi.dev\packages\wizzi.dev.utils\.wizzi-override\src\actions\producePlugins.js.ittf
    utc time: Thu, 21 Mar 2024 16:00:44 GMT
*/
'use strict';
const path = require("path");
const spawnUtils = require("../services/spawn");

const pluginList = [
    "css", 
    "docx", 
    "html", 
    "ittf", 
    "js", 
    "json", 
    "md", 
    "pdf", 
    "ppt", 
    "svg", 
    "text", 
    "ts", 
    "vtt", 
    "xml", 
    "yaml"
];

function doProductions(ndx) {
    var pluginName = pluginList[ndx];
    if (!pluginName) {
        console.log("[32m%s[0m", "All plugin productions done");
        return ;
    }
    producePlugin(pluginName, (err, notUsed) => {
    
        if (err) {
            return callback(err);
        }
        console.log("[32m%s[0m", "*** Plugin productions " + pluginName + " DONE ***");
        doProductions(ndx + 1)
    }
    )
}
doProductions(0)
function producePlugin(pluginName, callback) {
    console.log('Starting production of ', pluginName, __filename);
    const PowerShell = spawnUtils.PowerShell;
    let ps = new PowerShell("wz meta plugin." + pluginName, {
        cwd: "C:/My/wizzi/stfnbssl/wizzi.dev/packages/wizzi.dev/plugins"
     });
    spawnUtils.psOutput(ps, {}, (err, stdout, stderr) => {
    
        console.log("powershell 2", err || stderr || stdout, __filename);
        callback(null)
    }
    )
}
