/**
 * Command State Manager - Handles persistence and metadata for custom commands
 * Stores: command metadata, enabled/disabled state, version history, audit logs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'database');
const COMMANDS_STATE_DB = path.join(DB_PATH, 'commands-state.json');
const COMMANDS_AUDIT_LOG = path.join(DB_PATH, 'commands-audit.log');
const COMMANDS_BACKUP_DIR = path.join(DB_PATH, 'commands-backup');

/**
 * Initialize command state database and directories
 */
function initializeStateDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
  }

  if (!fs.existsSync(COMMANDS_BACKUP_DIR)) {
    fs.mkdirSync(COMMANDS_BACKUP_DIR, { recursive: true });
  }

  if (!fs.existsSync(COMMANDS_STATE_DB)) {
    fs.writeFileSync(COMMANDS_STATE_DB, JSON.stringify({}, null, 2));
  }

  if (!fs.existsSync(COMMANDS_AUDIT_LOG)) {
    fs.writeFileSync(COMMANDS_AUDIT_LOG, '');
  }
}

initializeStateDB();

/**
 * Generate unique command ID
 * @param {string} name - Command name
 * @returns {string}
 */
function generateCommandId(name) {
  return `cmd_${name}_${crypto.randomBytes(4).toString('hex')}`;
}

/**
 * Read command state database
 * @returns {Object}
 */
function readStateDB() {
  try {
    const data = fs.readFileSync(COMMANDS_STATE_DB, 'utf-8');
    return JSON.parse(data) || {};
  } catch (error) {
    console.error('Error reading command state:', error.message);
    return {};
  }
}

/**
 * Write command state database atomically (write to temp, then rename)
 * @param {Object} data - State data
 * @returns {boolean}
 */
function writeStateDB(data) {
  try {
    const tmpFile = `${COMMANDS_STATE_DB}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
    fs.renameSync(tmpFile, COMMANDS_STATE_DB);
    return true;
  } catch (error) {
    console.error('Error writing command state:', error.message);
    return false;
  }
}

/**
 * Append audit log entry
 * @param {string} operation - Operation type (create, edit, delete, enable, disable, reload)
 * @param {string} commandName - Command name
 * @param {string} category - Command category
 * @param {string} details - Additional details
 * @param {boolean} success - Operation success
 */
function auditLog(operation, commandName, category, details = '', success = true) {
  try {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    const logEntry = `[${timestamp}] ${status} - ${operation.toUpperCase()} - ${category}/${commandName} - ${details}\n`;
    fs.appendFileSync(COMMANDS_AUDIT_LOG, logEntry);
  } catch (error) {
    console.error('Error writing audit log:', error.message);
  }
}

/**
 * Create new command metadata
 * @param {string} name - Command name
 * @param {string} category - Category
 * @param {string} author - Author (owner JID)
 * @returns {Object}
 */
function createCommandMetadata(name, category, author) {
  return {
    id: generateCommandId(name),
    name,
    category,
    author,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    previousVersions: [],
    lastModifiedBy: author
  };
}

/**
 * Get command metadata by name
 * @param {string} commandName - Command name
 * @returns {Object|null}
 */
function getCommandMetadata(commandName) {
  const state = readStateDB();
  return state[commandName] || null;
}

/**
 * Save command metadata
 * @param {string} commandName - Command name
 * @param {Object} metadata - Metadata object
 * @returns {boolean}
 */
function saveCommandMetadata(commandName, metadata) {
  const state = readStateDB();
  state[commandName] = metadata;
  return writeStateDB(state);
}

/**
 * Set command enabled/disabled state
 * @param {string} commandName - Command name
 * @param {boolean} enabled - Is enabled
 * @param {string} modifiedBy - Who modified it
 * @returns {boolean}
 */
function setCommandEnabled(commandName, enabled, modifiedBy) {
  const metadata = getCommandMetadata(commandName);
  if (!metadata) return false;

  metadata.enabled = enabled;
  metadata.updatedAt = new Date().toISOString();
  metadata.lastModifiedBy = modifiedBy;

  return saveCommandMetadata(commandName, metadata);
}

/**
 * Check if command is enabled
 * @param {string} commandName - Command name
 * @returns {boolean}
 */
function isCommandEnabled(commandName) {
  const metadata = getCommandMetadata(commandName);
  return metadata ? metadata.enabled : true; // Default to enabled if no metadata
}

/**
 * Backup previous command version
 * @param {string} commandName - Command name
 * @param {string} category - Category
 * @param {string} content - File content
 * @returns {string} - Backup file path
 */
function backupCommand(commandName, category, content) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(COMMANDS_BACKUP_DIR, `${commandName}-v${timestamp}.js`);
    fs.writeFileSync(backupPath, content);
    return backupPath;
  } catch (error) {
    console.error('Error creating backup:', error.message);
    return null;
  }
}

/**
 * Restore command from backup
 * @param {string} backupPath - Path to backup file
 * @param {string} commandName - Command name
 * @param {string} category - Category
 * @returns {boolean}
 */
function restoreFromBackup(backupPath, commandName, category) {
  try {
    if (!fs.existsSync(backupPath)) {
      return false;
    }

    const content = fs.readFileSync(backupPath, 'utf-8');
    const targetPath = path.join(__dirname, '..', 'commands', category, `${commandName}.js`);

    fs.writeFileSync(targetPath, content);
    return true;
  } catch (error) {
    console.error('Error restoring from backup:', error.message);
    return false;
  }
}

/**
 * Get recent command versions for rollback
 * @param {string} commandName - Command name
 * @returns {Array}
 */
function getCommandBackups(commandName) {
  try {
    const files = fs.readdirSync(COMMANDS_BACKUP_DIR);
    return files
      .filter(f => f.startsWith(commandName))
      .sort()
      .reverse()
      .slice(0, 5); // Last 5 versions
  } catch (error) {
    console.error('Error reading backups:', error.message);
    return [];
  }
}

/**
 * Record command edit in metadata version history
 * @param {string} commandName - Command name
 * @param {string} modifiedBy - Who modified it
 * @param {string} backupPath - Path to backup
 * @returns {boolean}
 */
function recordVersion(commandName, modifiedBy, backupPath) {
  const metadata = getCommandMetadata(commandName);
  if (!metadata) return false;

  if (!metadata.previousVersions) {
    metadata.previousVersions = [];
  }

  metadata.previousVersions.push({
    version: metadata.version,
    backupPath,
    createdAt: metadata.updatedAt,
    modifiedBy: metadata.lastModifiedBy
  });

  metadata.version++;
  metadata.updatedAt = new Date().toISOString();
  metadata.lastModifiedBy = modifiedBy;

  return saveCommandMetadata(commandName, metadata);
}

/**
 * Get audit log entries
 * @param {number} lines - Number of lines to return
 * @returns {Array}
 */
function getAuditLog(lines = 50) {
  try {
    const content = fs.readFileSync(COMMANDS_AUDIT_LOG, 'utf-8');
    return content.split('\n').filter(l => l.trim()).slice(-lines);
  } catch (error) {
    console.error('Error reading audit log:', error.message);
    return [];
  }
}

module.exports = {
  initializeStateDB,
  generateCommandId,
  readStateDB,
  writeStateDB,
  auditLog,
  createCommandMetadata,
  getCommandMetadata,
  saveCommandMetadata,
  setCommandEnabled,
  isCommandEnabled,
  backupCommand,
  restoreFromBackup,
  getCommandBackups,
  recordVersion,
  getAuditLog
};
