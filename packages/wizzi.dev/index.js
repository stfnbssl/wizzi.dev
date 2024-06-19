/*
    artifact generator: C:\My\wizzi\stfnbssl\wizzi.plugins\packages\wizzi.plugin.js\lib\artifacts\js\module\gen\main.js
    package: @wizzi/plugin.js@0.8.9
    primary source IttfDocument: C:\My\wizzi\stfnbssl\wizzi.dev\packages\wizzi.dev\.wizzi\root\index.js.ittf
    utc time: Tue, 11 Jun 2024 19:28:25 GMT
*/
'use strict';
const path = require('path');
const minimist = require('minimist');
const error = require('./src/utils/error');

const args = minimist(process.argv.slice(2));
console.log('args', args, __filename);
let cmd = args._[0] || 'generate';
if (args.version || args.v) {
    cmd = 'version';
}
if (args.help || args.h || args['?']) {
    cmd = 'help';
}
console.log('cmd', cmd, __filename);
switch (cmd) {
    case 'first': {
        require('./src/commands/first')(args);
        break;
    }
    case 'help': {
        require('./src/commands/help')(args);
        break;
    }
    case 'version': {
        console.log('Version 0.1');
        break;
    }
    default: {
        error(`"${cmd}" is not a valid command!`);
        error(`try wizzi help`, true);
        break;
    }
}