const path = require('path');
const fs = require('fs');
const mockFs = require('mock-fs');
const createModule = require('../cli/commands/make_module');

// Mock all dependencies
jest.mock('../cli/commands/make_model');
jest.mock('../cli/commands/make_controller');
jest.mock('../cli/commands/make_router');
jest.mock('../cli/commands/make_service');
jest.mock('../cli/commands/make_admin');

describe('createModule', () => {
  const moduleName = 'user';
  const modulePath = path.join(process.cwd(), 'src/modules', moduleName);
  const modulesRoot = path.join(process.cwd(), 'src/modules');

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    mockFs.restore();
    jest.restoreAllMocks();
  });

  test('should show error when no module name is provided', () => {
    createModule([]);
    expect(console.error).toHaveBeenCalledWith(
      "❌ Module name is required. Usage: nexus make-module <moduleName> [-mcrs] [--admin]"
    );
  });

  test('should create module directory when it does not exist', () => {
    mockFs({
      [modulesRoot]: {} // Empty modules directory
    });

    createModule([moduleName]);
    
    expect(fs.existsSync(modulePath)).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      `✅ Module created at ${modulePath}`
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('should warn when module exists and not admin', () => {
    mockFs({
      [modulePath]: {} // Module exists
    });

    createModule([moduleName]);
    
    expect(console.warn).toHaveBeenCalledWith(
      `⚠️  Module "${moduleName}" already exists. Skipping base module creation.`
    );
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('✅ Module created at')
    );
  });

  test('should proceed with admin generation when module exists and --admin flag passed', () => {
    mockFs({
      [modulePath]: {} // Module exists
    });

    createModule([moduleName, '--admin']);
    
    expect(console.log).toHaveBeenCalledWith(
      `🔐 Generating admin layer for "${moduleName}"`
    );
    expect(require('../cli/commands/make_admin')).toHaveBeenCalledWith(
      [moduleName, '--admin']
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('should call makeModel with capitalized name when -m flag passed', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-m']);
    
    expect(console.log).toHaveBeenCalledWith(
      `📦 Generating model and migration for "${moduleName}"`
    );
    expect(require('../cli/commands/make_model')).toHaveBeenCalledWith(
      ['User', '-m', 'user']
    );
  });

  test('should call makeController when -c flag passed', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-c']);
    
    expect(console.log).toHaveBeenCalledWith(
      `🧠 Generating controller`
    );
    expect(require('../cli/commands/make_controller')).toHaveBeenCalledWith(
      [moduleName]
    );
  });

  test('should call makeRouter when -r flag passed', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-r']);
    
    expect(console.log).toHaveBeenCalledWith(
      `🌐 Generating router`
    );
    expect(require('../cli/commands/make_router')).toHaveBeenCalledWith(
      [moduleName]
    );
  });

  test('should call makeService when -s flag passed', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-s']);
    
    expect(console.log).toHaveBeenCalledWith(
      `⚙️ Generating service`
    );
    expect(require('../cli/commands/make_service')).toHaveBeenCalledWith(
      [moduleName]
    );
  });

  test('should pass admin flag to subcommands when --admin specified', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-c', '--admin']);
    
    expect(require('../cli/commands/make_controller')).toHaveBeenCalledWith(
      [moduleName, '--admin']
    );
  });

  test('should create directory and generate components when flags combined', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName, '-m', '-c', '-r', '-s']);
    
    expect(fs.existsSync(modulePath)).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      `✅ Module created at ${modulePath}`
    );
    expect(require('../cli/commands/make_model')).toHaveBeenCalled();
    expect(require('../cli/commands/make_controller')).toHaveBeenCalled();
    expect(require('../cli/commands/make_router')).toHaveBeenCalled();
    expect(require('../cli/commands/make_service')).toHaveBeenCalled();
  });

  test('should not generate components when no flags specified', () => {
    mockFs({
      [modulesRoot]: {}
    });

    createModule([moduleName]);
    
    expect(fs.existsSync(modulePath)).toBe(true);
    expect(require('../cli/commands/make_model')).not.toHaveBeenCalled();
    expect(require('../cli/commands/make_controller')).not.toHaveBeenCalled();
    expect(require('../cli/commands/make_router')).not.toHaveBeenCalled();
    expect(require('../cli/commands/make_service')).not.toHaveBeenCalled();
  });
});