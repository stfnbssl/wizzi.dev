var path = require('path');
var wizzi = require("wizzi");
var wizziUtils = require("wizzi-utils");
var file = wizziUtils.fSystem.file;

var baseSearchPath = path.join(__dirname, '..', '..', '..');
var searchInFolders = ['wizzi.metas', 'wizzi.plugins'];
var options = {
    hasContent: false,
    metaHasContent: true
}
var result = {
    wizziPackages: []
}
console.log("baseSearchPath", baseSearchPath);
var folders = file.getFolders(
    baseSearchPath,
    { deep: false }
);

console.log("folders", folders, options);
folders.forEach(folderName => {
    if (searchInFolders.indexOf(folderName) < 0) { return }
    console.log("searching folder", folderName);
    var packagesInfo = scanPackages(folderName, baseSearchPath, options);
    packagesInfo.forEach(packageInfo => {
        // console.log("packageInfo", packageInfo);
        result.wizziPackages.push(packageInfo);
        var packageData = { 
            isPlugin: false, 
            isMetaPlugin: false, 
            schemas:{}, 
            artifacts: {}, 
            transformations: {}, 
            wizzifiers: {},
            metaProductions: {} 
        };        
        detectPlugin(packageInfo, ".wizzi", packageData, options);
        detectPlugin(packageInfo, ".wizzi-override", packageData, options);
        packageInfo.isPlugin = packageData.isPlugin;
        if (packageData.isPlugin) {
            packageInfo.schemas = packageData.schemas;
            packageInfo.artifacts = packageData.artifacts;
            packageInfo.transformations = packageData.transformations;
            packageInfo.hasWizzifiers = packageData.hasWizzifiers;
            if (packageData.hasWizzifiers) {
                packageInfo.wizzifiers = packageData.wizzifiers;
            }
        }
        // detectMetaPlugin(packageInfo, ".wizzi", packageData, options);
        detectMetaPlugin(packageInfo, ".wizzi-override", packageData, options);
        packageInfo.isMetaPlugin = packageData.isMetaPlugin;
        if (packageData.isMetaPlugin) {
            packageInfo.metaProductions = packageData.metaProductions;
        }
        return;
    })
})

function scanPackages(folderName, folderPath, options) {
    var packagesFolder = path.join(folderPath, folderName, 'packages');
    console.log('scan packages in', packagesFolder);
    var folders = file.getFolders(
        packagesFolder,
        { deep: false }
    );
    var packagesInfo = [];
    folders.forEach(childFolderName => {
        var packageInfo = detectWizziPackage(childFolderName, packagesFolder, options);
        if (packageInfo.ok) { packagesInfo.push(packageInfo.item) }
    }); 
    return packagesInfo;
}

function detectWizziPackage(folderName, folderPath, options) {
    var packageInfo = { ok: false };
    var folders = file.getFolders(
        path.join(folderPath, folderName),
        { deep: false }
    );
    // console.log("detectWizziPackage.folders", folders);
    folders.forEach(childFolderName => {
        // console.log("childFolderName", childFolderName);
        if (childFolderName == '.wizzi') {
            packageInfo.ok = true;
            packageInfo.item = { 
                name: folderName,
                fullPath: path.join(folderPath, folderName),
                wizziConfigFiles: []
            } ;
        }
        if (childFolderName == '.wizzi-override') {
            packageInfo.ok = true;
            packageInfo.item = { 
                name: folderName,
                fullPath: path.join(folderPath, folderName),
                hasWizziOverride: true,
                wizziConfigFiles: []
            } ;
        }
    })
    var files = file.getFiles(
        path.join(folderPath, folderName),
        { deep: false }
    );
    files.forEach(childFileName => {
        // console.log("childFileName", childFileName);
        if (childFileName.startsWith('wizzi.config.')) {
            var fullPath = path.join(folderPath, folderName, childFileName);
            packageInfo.item.wizziConfigFiles.push({
                name: childFileName,
                fullPath: fullPath,
                content: options.hasContent ? require(fullPath) : null
            });
        }
    })
    // console.log("detectWizziPackage.packageInfo", packageInfo);
    return packageInfo;
}

function detectPlugin(packageInfo, wizziFolder, packageData, options) {
    if (wizziFolder == 't') return;
    var wizziSchemasFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'wizzi', 'schemas');
    var wizziModelsFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'wizzi', 'models');
    var artifactsFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'artifacts');
    var wizzifiersFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'wizzifiers');
    
    if (file.exists(wizziSchemasFolder) && file.exists(wizziModelsFolder) && file.exists(artifactsFolder)) {
        packageData.isPlugin = true;
        var schemas = file.getFiles(
            wizziSchemasFolder,
            { deep: false }
        );
        schemas.forEach(schemaFile => {
            console.log(schemaFile);
            if (schemaFile.endsWith('.wfschema.ittf'))
            {
                var schema = schemaFile.substring(0, schemaFile.length - '.wfschema.ittf'.length);
                packageData.schemas[schema] = {
                    name: schema,
                    fullPath: path.join(wizziSchemasFolder, schema, schema + '.wfschema.ittf'),
                    content: null
                };
                if (options.hasContent) {
                    try {packageData.schemas[schema].content = file.read(packageData.schemas[schema].fullPath);} catch {}
                }
            }
        });
        var artifactSchemas = file.getFolders(
            artifactsFolder,
            { deep: false }
        );
        artifactSchemas.forEach(schema => {
            // console.log("detectArtifacts.schema", schema);
            var artifactSchemaFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'artifacts', schema);
            var artifactSchemaArtifacts = file.getFolders(
                artifactSchemaFolder,
                { deep: false }
            );
            artifactSchemaArtifacts.forEach(artifact => {
                // console.log("detectArtifacts.artifact", artifact);
                var artifactSchemaArtifactGenOrTransFolder = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'artifacts', schema, artifact);
                var artifactSchemaArtifactGenOrTrans = file.getFolders(
                    artifactSchemaArtifactGenOrTransFolder,
                    { deep: false }
                );
                artifactSchemaArtifactGenOrTrans.forEach(genortrans => {
                    // console.log("detectArtifacts.genortrans", genortrans);
                    if (genortrans == 'gen') {
                        packageData.ok = true;
                        var artifactFullPath = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'artifacts', schema, artifact, 'gen', 'main.js.ittf');
                        var key = schema + '/' + artifact;
                        packageData.artifacts[key] ={
                            name: key,
                            schema: schema,
                            artifact: artifact,
                            fullPath: artifactFullPath,
                            content: null
                        };
                        if (options.hasContent) {
                            packageData.artifacts[key].content = file.read(artifactFullPath);
                        }
                    }
                    if (genortrans == 'trans') {
                        packageData.ok = true;
                        var artifactFullPath = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'artifacts', schema, artifact, 'trans', 'main.js.ittf');
                        var key = schema + '/' + artifact;
                        packageData.transformations[key] ={
                            name: key,
                            schema: schema,
                            artifact: artifact,
                            fullPath: artifactFullPath,
                            content: null
                        };
                        if (options.hasContent) {
                            packageData.transformations[key].content = file.read(artifactFullPath);
                        }
                    }
                })
            });
        });
        if (file.exists(wizzifiersFolder)) {
            var wizzifierFolderSchemas = file.getFolders(
                wizzifiersFolder,
                { deep: false }
            );
            wizzifierFolderSchemas.forEach(schema => {
                var wizzifierFullPath = path.join(packageInfo.fullPath, wizziFolder, 'lib', 'wizzifiers', schema, 'wizzifier.js.ittf');
                if (file.exists(wizzifierFullPath)) {
                    packageData.hasWizzifiers = true;
                    var key = schema;
                    packageData.wizzifiers[key] = {
                        name: key,
                        schema: schema,
                        fullPath: wizzifierFullPath,
                        content: null
                    };
                    if (options.hasContent) {
                        packageData.wizzifiers[key].content = file.read(wizzifierFullPath);
                    }
                }
            });
        }
    }
}

function detectMetaPlugin(packageInfo, wizziFolder, packageData, options) {
    if (wizziFolder == 't') return;
    var ittfFolder = path.join(packageInfo.fullPath, wizziFolder, 'ittf');
    var detector1Filepath = path.join(packageInfo.fullPath, wizziFolder, 'root', 't', 'meta-production.js.ittf');
    var detector2Filepath = path.join(packageInfo.fullPath, wizziFolder, 'root', 't', 'meta-production-starter.js.ittf');

    if (file.exists(ittfFolder) && file.exists(detector1Filepath) && file.exists(detector2Filepath)) {
        packageData.isMetaPlugin = true;
        var metaProductions = file.getFolders(
            ittfFolder,
            { deep: false }
        );
        metaProductions.forEach(metaProduction => {
            if (metaProduction == 't') return;
            var metaProductionPath = path.join(ittfFolder, metaProduction);
            var metaCtxSchemaPath = path.join(ittfFolder, metaProduction, 'metaCtxSchemas', 'index.json.ittf');
            packageData.metaProductions[metaProduction] = {
                name: metaProduction,
                fullPath: metaProductionPath,
                metaCtxSchemaPath: metaCtxSchemaPath,
                content: null
            };
            if (file.exists(metaCtxSchemaPath)) {
                if (options.metaHasContent) {
                    packageData.metaProductions[metaProduction].metaCtxSchemaContent = file.read(metaCtxSchemaPath);
                }
            } else {
                packageData.metaProductions[metaProduction].metaCtxSchemaPath = null
            }
        });
    }
}


file.write('scaffolding.json', JSON.stringify(result, null, 4));
file.write('C:/My/wizzi/stfnbssl/wizzi.cli/packages/wizzi.cli.meta/src/cmds/data/wizzi.plugins.data.json', JSON.stringify(result, null, 4));
