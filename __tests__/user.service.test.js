const fs = require('fs');
const path = require('path');
const mockFs = require('mock-fs');
const createService = require('../cli/commands/make_service');

describe('Service CLI Generator', () => {
  const basePath = path.join('src', 'modules', 'user', 'services');
  const expectedFile = path.join(basePath, 'User.service.js');

  beforeEach(() => {
    mockFs({});
  });

  afterEach(() => {
    mockFs.restore();
  });

  test('should create service file with correct content', () => {
    createService(['user']);

    const exists = fs.existsSync(expectedFile);
    expect(exists).toBe(true);

    const content = fs.readFileSync(expectedFile, 'utf-8');
    expect(content).toMatch(/exports\.create/);
    expect(content).toMatch(/exports\.findById/);
    expect(content).toMatch(/User\.create/);
  });

  test('should not overwrite if service file exists', () => {
    mockFs({
      [expectedFile]: 'existing content'
    });

    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    createService(['user']);

    const content = fs.readFileSync(expectedFile, 'utf-8');
    expect(content).toBe('existing content');
    expect(consoleWarnMock).toHaveBeenCalledWith(expect.stringContaining('⚠️  Service already exists'));

    consoleWarnMock.mockRestore();
  });

  test('should log error if module name is missing', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    createService([]);

    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('❌ Module name is required')
    );

    consoleErrorMock.mockRestore();
  });
});
