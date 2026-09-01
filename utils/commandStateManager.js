/**
 * Command State Manager - Supabase-backed persistence layer
 * Handles all command metadata, versioning, state, and audit logging
 * NO local JSON files - all data persists in Supabase
 */

const { getSupabaseClient, isSupabaseAvailable } = require('../services/supabase');
const crypto = require('crypto');

/**
 * Initialize Supabase tables (checks only, does NOT create tables)
 * Call this on startup to verify schema exists
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function initializeTables() {
  if (!isSupabaseAvailable()) {
    return {
      success: false,
      message: '❌ Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
    };
  }

  try {
    const db = getSupabaseClient();
    
    // Test table existence by attempting a query
    const results = await Promise.all([
      db.from('custom_commands').select('count', { count: 'exact', head: true }).limit(0),
      db.from('command_versions').select('count', { count: 'exact', head: true }).limit(0),
      db.from('command_audit_logs').select('count', { count: 'exact', head: true }).limit(0)
    ]);

    return {
      success: true,
      message: '✅ Command tables verified in Supabase'
    };
  } catch (error) {
    const msg = error.message || 'Unknown error';
    if (msg.includes('does not exist') || msg.includes('relation')) {
      return {
        success: false,
        message: `❌ Command tables do not exist in Supabase. Run the SQL migration: database/migrations/001_init_command_tables.sql\nError: ${msg}`
      };
    }
    return {
      success: false,
      message: `❌ Error checking command tables: ${msg}`
    };
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
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function createCommandMetadata(name, category, filePath, author) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
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
      version: 0, // Will be 1 after first version saved
      created_at: now,
      updated_at: now,
      last_modified_by: author,
      deleted_at: null
    }).select().single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { data: null, error: `Command "${name}" already exists` };
      }
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Get command metadata by name (excluding deleted commands)
 * @param {string} commandName - Command name
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function getCommandMetadata(commandName) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('custom_commands')
      .select('*')
      .eq('name', commandName)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return { data: null, error: error.message };
    }

    return { data: data || null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Get all commands (excluding deleted, with optional filtering)
 * @param {string} category - Optional category filter
 * @returns {Promise<{data: Array, error: string|null}>}
 */
async function getAllCommands(category = null) {
  if (!isSupabaseAvailable()) {
    return { data: [], error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    let query = db
      .from('custom_commands')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

/**
 * Update command metadata
 * @param {string} commandName - Command name
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function updateCommandMetadata(commandName, updates) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('custom_commands')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('name', commandName)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Save command version to Supabase
 * @param {string} commandId - Command ID
 * @param {number} version - Version number
 * @param {string} content - JavaScript source code
 * @param {string} author - Author JID
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function saveCommandVersion(commandId, version, content, author) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
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
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Get latest working version of a command
 * @param {string} commandId - Command ID
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function getLatestCommandVersion(commandId) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    const { data, error } = await db
      .from('command_versions')
      .select('*')
      .eq('command_id', commandId)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error: error.message };
    }

    return { data: data || null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Get specific command version
 * @param {string} commandId - Command ID
 * @param {number} version - Version number
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function getCommandVersion(commandId, version) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
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
      return { data: null, error: error.message };
    }

    return { data: data || null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Get previous version (for rollback)
 * @param {string} commandId - Command ID
 * @param {number} currentVersion - Current version
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function getPreviousVersion(commandId, currentVersion) {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'Supabase not available' };
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
      return { data: null, error: error.message };
    }

    return { data: data || null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**
 * Set command enabled/disabled state
 * @param {string} commandName - Command name
 * @param {boolean} enabled - Is enabled
 * @param {string} modifiedBy - Who modified it
 * @returns {Promise<{data: Object|null, error: string|null}>}
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
 * @returns {Promise<{enabled: boolean, error: string|null}>}
 */
async function isCommandEnabled(commandName) {
  const result = await getCommandMetadata(commandName);
  if (result.error) {
    return { enabled: true, error: result.error }; // Default enabled if error/no metadata
  }
  return { enabled: result.data ? result.data.enabled : true, error: null };
}

/**
 * Get audit log entries
 * @param {number} lines - Number of entries to return
 * @param {string} filter - Optional command name filter
 * @returns {Promise<{data: Array, error: string|null}>}
 */
async function getAuditLog(lines = 50, filter = null) {
  if (!isSupabaseAvailable()) {
    return { data: [], error: 'Supabase not available' };
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
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

/**
 * Soft-delete command (preserves version history and audit logs)
 * @param {string} commandName - Command name
 * @param {string} deletedBy - Who deleted it
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function deleteCommand(commandName, deletedBy) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    const { error } = await db
      .from('custom_commands')
      .update({
        deleted_at: new Date().toISOString(),
        last_modified_by: deletedBy
      })
      .eq('name', commandName)
      .is('deleted_at', null);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Recover a deleted command
 * @param {string} commandName - Command name
 * @param {string} recoveredBy - Who recovered it
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function recoverCommand(commandName, recoveredBy) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Supabase not available' };
  }

  try {
    const db = getSupabaseClient();
    const { error } = await db
      .from('custom_commands')
      .update({
        deleted_at: null,
        last_modified_by: recoveredBy
      })
      .eq('name', commandName);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
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
  getLatestCommandVersion,
  getCommandVersion,
  getPreviousVersion,
  setCommandEnabled,
  isCommandEnabled,
  getAuditLog,
  deleteCommand,
  recoverCommand
};
