/**
 * Supabase Client Service
 * Singleton Supabase client for all database operations
 * Initialize once, reuse everywhere
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Supabase features will be disabled.');
}

// Create Supabase client (singleton)
let supabase = null;

function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceRoleKey) {
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
  return supabase;
}

/**
 * Check if Supabase is available
 * @returns {boolean}
 */
function isSupabaseAvailable() {
  return getSupabaseClient() !== null;
}

module.exports = {
  getSupabaseClient,
  isSupabaseAvailable
};
