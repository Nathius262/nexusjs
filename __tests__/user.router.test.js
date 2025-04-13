const mockFs = require('mock-fs');
const fs = require('fs');
const path = require('path');

const createRouter = require('../cli/commands/make_router'); // Adjust if path differs

describe('CLI - createRouter', () => {
  const basePath = 'src/modules/user/routes';
  const fullFilePath = path.join(basePath, 'User.routes.js');

  beforeEach(() => {
    mockFs({
      'src/modules/user': {} // Initial structure
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.clearAllMocks();
  });

  test('should create a standard router file', () => {
    const logSpy = jest.spyOn(console, 'log');

    createRouter(['user']);

    const exists = fs.existsSync(fullFilePath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(fullFilePath, 'utf8');
    expect(content).toContain("const controller = require('../controllers/User.controller');");
    expect(content).toContain("router.post('/', controller.create);");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('✅ Router created'));
  });

  test('should create an admin router file when --admin flag is passed', () => {
    const adminFilePath = path.join(basePath, 'admin.User.routes.js');
    createRouter(['user', '--admin']);

    const exists = fs.existsSync(adminFilePath);
    const content = fs.readFileSync(adminFilePath, 'utf8');

    expect(exists).toBe(true);
    expect(content).toContain("controller.adminDashboard");
  });

  test('should skip file creation if file already exists', () => {
    fs.mkdirSync(basePath, { recursive: true });
    fs.writeFileSync(fullFilePath, '// existing file');

    const warnSpy = jest.spyOn(console, 'warn');
    createRouter(['user']);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️  Router already exists'));
  });

  test('should show error if no module name is provided', () => {
    const errorSpy = jest.spyOn(console, 'error');
    createRouter([]);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Module name is required'));
  });
});
