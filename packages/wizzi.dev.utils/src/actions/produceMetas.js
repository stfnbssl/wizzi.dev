/*
    artifact generator: C:\My\wizzi\stfnbssl\wizzi.plugins\packages\wizzi.plugin.js\lib\artifacts\js\module\gen\main.js
    package: @wizzi/plugin.js@0.8.9
    primary source IttfDocument: C:\My\wizzi\stfnbssl\wizzi.dev\packages\wizzi.dev.utils\.wizzi-override\src\actions\produceMetas.js.ittf
    utc time: Thu, 25 Apr 2024 11:34:09 GMT
*/
'use strict';
const path = require("path");
const spawnUtils = require("../services/spawn");

const metaList = [
    "cloud", 
    "commons", 
    "docs", 
    "documents", 
    "js.db", 
    "js.express", 
    "js", 
    "js.node", 
    "js.react", 
    "js.vanilla", 
    "ts.db", 
    "ts.express", 
    "ts", 
    "ts.nextjs", 
    "ts.react", 
    "web", 
    "wizzi"
];

function doProductions(ndx) {
    var metaName = metaList[ndx];
    if (!metaName) {
        console.log("[32m%s[0m", "All meta productions done");
        return ;
    }
    produceMeta(metaName, (err, notUsed) => {
    
        if (err) {
            return callback(err);
        }
        console.log("[32m%s[0m", "*** Meta productions " + metaName + " DONE ***");
        doProductions(ndx + 1)
    }
    )
}
doProductions(0)
function produceMeta(metaName, callback) {
    console.log('Starting production of ', metaName, __filename);
    const PowerShell = spawnUtils.PowerShell;
    let ps = new PowerShell("wz meta meta." + metaName, {
        cwd: "C:/My/wizzi/stfnbssl/wizzi.dev/packages/wizzi.dev/metas"
     });
    spawnUtils.psOutput(ps, {}, (err, stdout, stderr) => {
    
        console.log("powershell 2", err || stderr || stdout, __filename);
        callback(null)
    }
    )
}
