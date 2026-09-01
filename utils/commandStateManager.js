/**
 * Command State Manager - Supabase-backed persistence layer
 * Handles all command metadata, versioning, state, and audit logging
 * NO local JSON files - all data persists in Supabase
 */

const { getSupabaseClient, isSupabaseAvailable } = require('../services/supabase');
const crypto = require('crypto');

/**
 * Initialize Supabase tables (idempotent check)
 * Called once on startup
 */
async function initializeTables() {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available. Command state persistence disabled.');
    return false;
  }

  try {
    const db = getSupabaseClient();
    
    // Check if tables exist by attempting a query
    await Promise.all([
      db.from('custom_commands').select('count', { count: 'exact', head: true }).limit(0),
      db.from('command_versions').select('count', { count: 'exact', head: true }).limit(0),
      db.from('command_audit_logs').select('count', { count: 'exact', head: true }).limit(0)
    ]);

    console.log('✅ Command tables initialized in Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error initializing command tables:', error.message);
    return false;
  }
}

/**
 * Generate unique command ID
 * @param {string} name - Command name
 * @returns {string}
 */
function generateCommandId(name) {
  return `cmd_${name}_${crypto.randomBytes(4).toString('hex')}`;
}

/**
 * Log audit event to Supabase
 * @param {string} operation - Operation type
 * @param {string} commandName - Command name
 * @param {string} category - Category
 * @param {string} performedBy - Owner JID who performed it
 * @param {string} details - Additional details
 * @param {boolean} success - Operation success
 */
async function auditLog(operation, commandName, category, performedBy, details = '', success = true) {
  if (!isSupabaseAvailable()) {
    console.warn(`[AUDIT] ${operation} ${category}/${commandName} - ${details}`);
    return;
  }

  try {
    const db = getSupabaseClient();
    await db.from('command_audit_logs').insert({
      operation,
      command_name: commandName,
      category,
      details,
      success,
      performed_by: performedBy,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error writing audit log:', error.message);
  }
}

/**
 * Create command metadata in Supabase
 * @param {string} name - Command name
 * @param {string} category - Category
 * @param {string} filePath - Relative file path
 * @param {string} author - Author JID
 * @returns {Promise<Object|null>}
 */
async function createCommandMetadata(name, category, filePath, author) {
  if (!isSupabaseAvailable()) {
    return null;
  }

  try {
    const db = getSupabaseClient();
    const now = new Date().toISOString();
    
    const { data, error } = await db.from('custom_commands').insert({
      id: generateCommandId(name),
      name,
      category,
      file_path: filePath,
      author,
      enabled: true,
      version: 1,
      created_at: now,
      updated_at: now,
      last_modified_by: author
    }).select().single();

    if (error) {
      console.error('Error creating command metadata:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating command metadata:', error.message);
    return null;
  }
}

/**
 * Get command metadata by name
 * @param {string} commandName - Command name
 * @returns {Promise<Object|null>}
 */
async function getCommandMetadata(commandName) {
  if (!isSupabaseAvailable()) {
    return null;
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('custom_commands')
      .select('*')
      .eq('name', commandName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting command metadata:', error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting command metadata:', error.message);
    return null;
  }
}

/**
 * Get all commands (with optional filtering)
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>}
 */
async function getAllCommands(category = null) {
  if (!isSupabaseAvailable()) {
    return [];
  }

  try {
    const db = getSupabaseClient();
    let query = db.from('custom_commands').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting commands:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting commands:', error.message);
    return [];
  }
}

/**
 * Update command metadata
 * @param {string} commandName - Command name
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>}
 */
async function updateCommandMetadata(commandName, updates) {
  if (!isSupabaseAvailable()) {
    return false;
  }

  try {
    const db = getSupabaseClient();
    const { error } = await db
      .from('custom_commands')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('name', commandName);

    if (error) {
      console.error('Error updating command metadata:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating command metadata:', error.message);
    return false;
  }
}

/**
 * Save command version to Supabase
 * @param {string} commandId - Command ID
 * @param {number} version - Version number
 * @param {string} content - JavaScript source code
 * @param {string} author - Author JID
 * @returns {Promise<Object|null>}
 */
async function saveCommandVersion(commandId, version, content, author) {
  if (!isSupabaseAvailable()) {
    return null;
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db.from('command_versions').insert({
      command_id: commandId,
      version,
      content,
      author,
      created_at: new Date().toISOString()
    }).select().single();

    if (error) {
      console.error('Error saving command version:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving command version:', error.message);
    return null;
  }
}

/**
 * Get specific command version
 * @param {string} commandId - Command ID
 * @param {number} version - Version number
 * @returns {Promise<Object|null>}
 */
async function getCommandVersion(commandId, version) {
  if (!isSupabaseAvailable()) {
    return null;
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('command_versions')
      .select('*')
      .eq('command_id', commandId)
      .eq('version', version)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting command version:', error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting command version:', error.message);
    return null;
  }
}

/**
 * Get previous version (for rollback)
 * @param {string} commandId - Command ID
 * @param {number} currentVersion - Current version
 * @returns {Promise<Object|null>}
 */
async function getPreviousVersion(commandId, currentVersion) {
  if (!isSupabaseAvailable()) {
    return null;
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('command_versions')
      .select('*')
      .eq('command_id', commandId)
      .lt('version', currentVersion)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting previous version:', error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting previous version:', error.message);
    return null;
  }
}

/**
 * Set command enabled/disabled state
 * @param {string} commandName - Command name
 * @param {boolean} enabled - Is enabled
 * @param {string} modifiedBy - Who modified it
 * @returns {Promise<boolean>}
 */
async function setCommandEnabled(commandName, enabled, modifiedBy) {
  return updateCommandMetadata(commandName, {
    enabled,
    last_modified_by: modifiedBy
  });
}

/**
 * Check if command is enabled
 * @param {string} commandName - Command name
 * @returns {Promise<boolean>}
 */
async function isCommandEnabled(commandName) {
  const metadata = await getCommandMetadata(commandName);
  return metadata ? metadata.enabled : true; // Default enabled if no metadata
}

/**
 * Get audit log entries
 * @param {number} lines - Number of entries to return
 * @param {string} filter - Optional command name filter
 * @returns {Promise<Array>}
 */
async function getAuditLog(lines = 50, filter = null) {
  if (!isSupabaseAvailable()) {
    return [];
  }

  try {
    const db = getSupabaseClient();
    let query = db
      .from('command_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(lines);

    if (filter) {
      query = query.eq('command_name', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting audit log:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting audit log:', error.message);
    return [];
  }
}

/**
 * Delete command metadata (cascades to versions via foreign key)
 * @param {string} commandName - Command name
 * @returns {Promise<boolean>}
 */
async function deleteCommandMetadata(commandName) {
  if (!isSupabaseAvailable()) {
    return false;
  }

  try {
    const db = getSupabaseClient();
    const { error } = await db
      .from('custom_commands')
      .delete()
      .eq('name', commandName);

    if (error) {
      console.error('Error deleting command metadata:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting command metadata:', error.message);
    return false;
  }
}

module.exports = {
  initializeTables,
  generateCommandId,
  auditLog,
  createCommandMetadata,
  getCommandMetadata,
  getAllCommands,
  updateCommandMetadata,
  saveCommandVersion,
  getCommandVersion,
  getPreviousVersion,
  setCommandEnabled,
  isCommandEnabled,
  getAuditLog,
  deleteCommandMetadata
};
