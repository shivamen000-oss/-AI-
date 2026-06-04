/**
 * Package manager detection and selection
 * Detects npm, pnpm, yarn, or bun with intelligent fallback
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const utils = require('./utils');

const LOCK_FILES = {
  'package-lock.json': 'npm',
  'yarn.lock': 'yarn',
  'pnpm-lock.yaml': 'pnpm',
  'bun.lockb': 'bun',
};

const AVAILABLE_PMS = ['npm', 'pnpm', 'yarn', 'bun'];

/**
 * Detect package manager from environment variable
 * @returns {string|null}
 */
function detectFromEnv() {
  const pm = process.env.CLAUDE_PACKAGE_MANAGER;
  if (pm && AVAILABLE_PMS.includes(pm)) {
    return pm;
  }
  return null;
}

/**
 * Detect package manager from project config
 * @returns {string|null}
 */
function detectFromProjectConfig() {
  const configPath = utils.joinPath(process.cwd(), '.claude', 'package-manager.json');
  if (utils.fileExists(configPath)) {
    try {
      const config = utils.parseJSON(configPath);
      if (config.packageManager && AVAILABLE_PMS.includes(config.packageManager)) {
        return config.packageManager;
      }
    } catch {
      // Ignore parse errors
    }
  }
  return null;
}

/**
 * Detect package manager from package.json
 * @returns {string|null}
 */
function detectFromPackageJSON() {
  const packageJsonPath = utils.joinPath(process.cwd(), 'package.json');
  if (utils.fileExists(packageJsonPath)) {
    try {
      const pkg = utils.parseJSON(packageJsonPath);
      if (pkg.packageManager) {
        // Extract PM name from "yarn@4.0.0", "npm@10.0.0", etc.
        const pmMatch = pkg.packageManager.match(/^(\w+)@/);
        if (pmMatch && AVAILABLE_PMS.includes(pmMatch[1])) {
          return pmMatch[1];
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  return null;
}

/**
 * Detect package manager from lock file
 * @returns {string|null}
 */
function detectFromLockFile() {
  const cwd = process.cwd();
  for (const [lockFile, pm] of Object.entries(LOCK_FILES)) {
    if (utils.fileExists(utils.joinPath(cwd, lockFile))) {
      return pm;
    }
  }
  return null;
}

/**
 * Detect package manager from global config
 * @returns {string|null}
 */
function detectFromGlobalConfig() {
  const homeDir = utils.getHomeDirectory();
  const globalConfigPath = utils.joinPath(homeDir, '.claude', 'package-manager.json');
  if (utils.fileExists(globalConfigPath)) {
    try {
      const config = utils.parseJSON(globalConfigPath);
      if (config.packageManager && AVAILABLE_PMS.includes(config.packageManager)) {
        return config.packageManager;
      }
    } catch {
      // Ignore parse errors
    }
  }
  return null;
}

/**
 * Check if package manager is available in PATH
 * @param {string} pm
 * @returns {boolean}
 */
function isAvailable(pm) {
  try {
    const cmd = utils.isWindows() ? `where ${pm}` : `which ${pm}`;
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find first available package manager
 * @returns {string}
 */
function findFirstAvailable() {
  for (const pm of AVAILABLE_PMS) {
    if (isAvailable(pm)) {
      return pm;
    }
  }
  // Fallback to npm if nothing found
  return 'npm';
}

/**
 * Detect package manager using priority order
 * @returns {Promise<string>}
 */
async function detect() {
  // Priority order:
  // 1. Environment variable
  let detected = detectFromEnv();
  if (detected) return detected;

  // 2. Project config
  detected = detectFromProjectConfig();
  if (detected) return detected;

  // 3. package.json
  detected = detectFromPackageJSON();
  if (detected) return detected;

  // 4. Lock file
  detected = detectFromLockFile();
  if (detected) return detected;

  // 5. Global config
  detected = detectFromGlobalConfig();
  if (detected) return detected;

  // 6. First available
  return findFirstAvailable();
}

/**
 * Get install command for package manager
 * @param {string} pm
 * @returns {string}
 */
function getInstallCommand(pm) {
  const commands = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    yarn: 'yarn install',
    bun: 'bun install',
  };
  return commands[pm] || 'npm install';
}

/**
 * Get add command for package manager
 * @param {string} pm
 * @param {string} pkg
 * @returns {string}
 */
function getAddCommand(pm, pkg) {
  const commands = {
    npm: `npm install ${pkg}`,
    pnpm: `pnpm add ${pkg}`,
    yarn: `yarn add ${pkg}`,
    bun: `bun add ${pkg}`,
  };
  return commands[pm] || `npm install ${pkg}`;
}

/**
 * Save package manager preference to project config
 * @param {string} pm
 */
function saveProjectPreference(pm) {
  if (!AVAILABLE_PMS.includes(pm)) {
    throw new Error(`Invalid package manager: ${pm}`);
  }

  const configDir = utils.joinPath(process.cwd(), '.claude');
  utils.createDirectory(configDir);

  const configPath = utils.joinPath(configDir, 'package-manager.json');
  const config = { packageManager: pm };

  utils.writeJSON(configPath, config);
}

/**
 * Save package manager preference to global config
 * @param {string} pm
 */
function saveGlobalPreference(pm) {
  if (!AVAILABLE_PMS.includes(pm)) {
    throw new Error(`Invalid package manager: ${pm}`);
  }

  const homeDir = utils.getHomeDirectory();
  const configDir = utils.joinPath(homeDir, '.claude');
  utils.createDirectory(configDir);

  const configPath = utils.joinPath(configDir, 'package-manager.json');
  const config = { packageManager: pm };

  utils.writeJSON(configPath, config);
}

module.exports = {
  AVAILABLE_PMS,
  detect,
  isAvailable,
  findFirstAvailable,
  getInstallCommand,
  getAddCommand,
  saveProjectPreference,
  saveGlobalPreference,
  detectFromEnv,
  detectFromProjectConfig,
  detectFromPackageJSON,
  detectFromLockFile,
  detectFromGlobalConfig,
};
