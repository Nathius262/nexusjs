const fs = require('fs');
const path = require('path');
const mockFs = require('mock-fs');
const createController = require('../cli/commands/make_controller');

describe('Controller CLI Generator', () => {
  const basePath = path.join('src', 'modules', 'user', 'controllers');
  const expectedFile = path.join(basePath, 'User.controller.js');

  beforeEach(() => {
    mockFs({});
  });

  afterEach(() => {
    mockFs.restore();
  });

  test('should create controller file with expected content', () => {
    createController(['user']);

    const exists = fs.existsSync(expectedFile);
    expect(exists).toBe(true);

    const content = fs.readFileSync(expectedFile, 'utf-8');
    expect(content).toMatch(/exports\.create/);
    expect(content).toMatch(/res\.status\(201\)\.json/);
    expect(content).toMatch(/require\('\.\.\/services\/User\.service'\)/);
  });

  test('should not overwrite existing controller', () => {
    mockFs({
      [expectedFile]: '// existing controller'
    });

    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    createController(['user']);

    const content = fs.readFileSync(expectedFile, 'utf-8');
    expect(content).toBe('// existing controller');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('⚠️  Controller already exists'));

    warn.mockRestore();
  });

  test('should warn if no module name is given', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    createController([]);

    expect(error).toHaveBeenCalledWith(expect.stringContaining('❌ Module name is required'));

    error.mockRestore();
  });
});
