/**
 * Cross-platform utilities for ECC scripts
 * Works on Windows, macOS, and Linux
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Get platform identifier
 * @returns {string} 'win32' | 'darwin' | 'linux'
 */
function getPlatform() {
  return process.platform;
}

/**
 * Check if running on Windows
 * @returns {boolean}
 */
function isWindows() {
  return getPlatform() === 'win32';
}

/**
 * Check if running on macOS
 * @returns {boolean}
 */
function isMacOS() {
  return getPlatform() === 'darwin';
}

/**
 * Check if running on Linux
 * @returns {boolean}
 */
function isLinux() {
  return getPlatform() === 'linux';
}

/**
 * Get home directory (cross-platform)
 * @returns {string}
 */
function getHomeDirectory() {
  return os.homedir();
}

/**
 * Normalize path for current platform
 * @param {string} filePath
 * @returns {string}
 */
function normalizePath(filePath) {
  return path.normalize(filePath);
}

/**
 * Join path segments (cross-platform)
 * @param {...string} segments
 * @returns {string}
 */
function joinPath(...segments) {
  return path.join(...segments);
}

/**
 * Check if file exists
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Check if directory exists
 * @param {string} dirPath
 * @returns {boolean}
 */
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Create directory recursively
 * @param {string} dirPath
 */
function createDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Read file contents
 * @param {string} filePath
 * @param {string} encoding
 * @returns {string}
 */
function readFile(filePath, encoding = 'utf8') {
  return fs.readFileSync(filePath, encoding);
}

/**
 * Write file contents
 * @param {string} filePath
 * @param {string} content
 * @param {string} encoding
 */
function writeFile(filePath, content, encoding = 'utf8') {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  fs.writeFileSync(filePath, content, encoding);
}

/**
 * List directory contents
 * @param {string} dirPath
 * @returns {string[]}
 */
function listDirectory(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

/**
 * Delete file
 * @param {string} filePath
 */
function deleteFile(filePath) {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Delete directory recursively
 * @param {string} dirPath
 */
function deleteDirectory(dirPath) {
  if (directoryExists(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Execute command and return output
 * @param {string} command
 * @param {object} options
 * @returns {string}
 */
function executeCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options,
    }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

/**
 * Parse JSON file
 * @param {string} filePath
 * @returns {object}
 */
function parseJSON(filePath) {
  const content = readFile(filePath);
  return JSON.parse(content);
}

/**
 * Write JSON file
 * @param {string} filePath
 * @param {object} data
 * @param {number} indent
 */
function writeJSON(filePath, data, indent = 2) {
  writeFile(filePath, JSON.stringify(data, null, indent));
}

/**
 * Get file stats
 * @param {string} filePath
 * @returns {fs.Stats}
 */
function getStats(filePath) {
  return fs.statSync(filePath);
}

/**
 * Resolve path relative to current directory
 * @param {string} filePath
 * @returns {string}
 */
function resolvePath(filePath) {
  return path.resolve(filePath);
}

/**
 * Get absolute path from home directory
 * @param {string} filePath
 * @returns {string}
 */
function getAbsolutePathFromHome(filePath) {
  if (filePath.startsWith('~')) {
    return path.join(getHomeDirectory(), filePath.slice(1));
  }
  return filePath;
}

module.exports = {
  getPlatform,
  isWindows,
  isMacOS,
  isLinux,
  getHomeDirectory,
  normalizePath,
  joinPath,
  fileExists,
  directoryExists,
  createDirectory,
  readFile,
  writeFile,
  listDirectory,
  deleteFile,
  deleteDirectory,
  executeCommand,
  parseJSON,
  writeJSON,
  getStats,
  resolvePath,
  getAbsolutePathFromHome,
};
