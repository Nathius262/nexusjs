const fs = require('fs');
const path = require('path');

/**
 * Checks if the user's project is an ESM module
 */
function isESModuleProject() {
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.type === 'module';
    }
  } catch (_) {}
  return false;
}

/**
 * Returns import and export syntax depending on the module type
 */
function getControllerSyntaxHelpers(isModule) {
    return {
      importService: (modulePath) =>
        isModule ? `import * as service from '${modulePath}.js';` : `const service = require('${modulePath}');`,
      exportFunction: (name, body) =>
        isModule ? `export const ${name} = ${body};` : `exports.${name} = ${body};`,
    };
}

  
function getServiceSyntaxHelpers({ isESM, modelName, moduleName }) {
    const importStatement = isESM


        ? `import db from '../../../models/index.cjs';`
        : `const db = require('../../../models/index.cjs');`;

    const exportFn = (fnName, fnBody) =>
        isESM
        ? `export const ${fnName} = ${fnBody};`
        : `exports.${fnName} = ${fnBody};`;

    return {
        importStatement,
        exportFn,
    };
}


function getRouterSyntaxHelpers(isModule) {
    return {
      importExpress: isModule
        ? `import express from 'express';`
        : `const express = require('express');`,

      importUseModuleViews: isModule
        ? `import useModuleViews from '../../../middlewares/moduleViews.js';`
        : `const useModuleViews = require('../../../middlewares/moduleViews.js');`,
  
      importController: (controllerPath) =>
        isModule
          ? `import * as controller from '${controllerPath}.js';`
          : `const controller = require('${controllerPath}');`,
  
      routerExport: (routerVar) =>
        isModule
          ? `export default ${routerVar};`
          : `module.exports = ${routerVar};`,
    };
}
  
async function loadModule(filePath, isModule) {
  return isModule ? (await import(filePath)).default : require(filePath);
}

module.exports = {
    isESModuleProject,
    getControllerSyntaxHelpers,
    getServiceSyntaxHelpers,
    getRouterSyntaxHelpers,
    loadModule,
  };
  