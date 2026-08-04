/**
 * Command Generator Utility
 * Generates command file templates with proper structure and metadata
 */

const path = require('path');
const fs = require('fs');

/**
 * Valid command categories
 */
const VALID_CATEGORIES = [
  'admin',
  'owner',
  'fun',
  'general',
  'media',
  'utility',
  'anime',
  'ai',
  'textmaker'
];

/**
 * Protected command names that cannot be created/edited/deleted
 */
const PROTECTED_COMMANDS = new Set([
  'menu',
  'help',
  'list',
  'command',
  'update',
  'restart',
  'shutdown',
  'eval',
  'exec'
]);

/**
 * Validate command name
 * @param {string} name - Command name to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
function validateCommandName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Command name is required and must be a string.' };
  }

  const trimmed = name.trim().toLowerCase();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Command name must be at least 2 characters.' };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, error: 'Command name must be no more than 30 characters.' };
  }
  
  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Command name can only contain lowercase letters, numbers, underscores, and hyphens.' };
  }
  
  if (PROTECTED_COMMANDS.has(trimmed)) {
    return { valid: false, error: `❌ The command name "${trimmed}" is protected and cannot be modified.` };
  }
  
  return { valid: true, name: trimmed };
}

/**
 * Validate category
 * @param {string} category - Category name
 * @returns {Object} - { valid: boolean, error?: string, category?: string }
 */
function validateCategory(category) {
  if (!category) {
    return { valid: true, category: 'general' }; // Default to 'general'
  }
  
  const trimmed = category.trim().toLowerCase();
  if (!VALID_CATEGORIES.includes(trimmed)) {
    return {
      valid: false,
      error: `Invalid category. Valid categories are: ${VALID_CATEGORIES.join(', ')}`
    };
  }
  
  return { valid: true, category: trimmed };
}

/**
 * Generate command template
 * @param {string} commandName - Name of command
 * @param {string} category - Category of command
 * @returns {string} - Generated command file content
 */
function generateCommandTemplate(commandName, category = 'general') {
  const formattedName = commandName.trim().toLowerCase();
  const displayName = formattedName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `/**
 * ${displayName} Command
 * 
 * Auto-generated command template
 * Edit this file to add your command logic
 */

module.exports = {
  name: '${formattedName}',
  aliases: [],
  category: '${category}',
  description: 'Description of what this command does',
  usage: '.${formattedName} <arguments>',
  ownerOnly: false,
  adminOnly: false,
  groupOnly: false,
  privateOnly: false,
  botAdminNeeded: false,

  /**
   * Execute the command
   * @param {Object} sock - Baileys socket connection
   * @param {Object} msg - WhatsApp message object
   * @param {Array} args - Command arguments (already split by whitespace)
   * @param {Object} extra - Extra context with helpers
   * @param {string} extra.from - Chat JID
   * @param {string} extra.sender - Sender JID
   * @param {boolean} extra.isGroup - Is this a group chat
   * @param {Object} extra.groupMetadata - Group metadata (if group)
   * @param {boolean} extra.isOwner - Is sender the bot owner
   * @param {boolean} extra.isAdmin - Is sender a group admin
   * @param {boolean} extra.isBotAdmin - Is bot a group admin
   * @param {boolean} extra.isMod - Is sender a bot moderator
   * @param {Function} extra.reply - Helper to reply to message
   * @param {Function} extra.react - Helper to react to message
   */
  async execute(sock, msg, args, extra) {
    try {
      // Add your command logic here
      // Examples:
      // - Check arguments: if (!args[0]) return extra.reply('❌ Please provide arguments');
      // - Send message: await extra.reply('✅ Success!');
      // - React to message: await extra.react('👍');
      // - Check permissions: if (!extra.isOwner) return extra.reply('❌ Owner only');

      return extra.reply('✅ Command executed! Edit this command to add functionality.');
    } catch (error) {
      console.error(\`[${formattedName}] Error:\`, error);
      return extra.reply(\`❌ An error occurred: \${error.message}\`);
    }
  }
};
`;
}

/**
 * Get file path for a command
 * @param {string} commandName - Command name
 * @param {string} category - Category name
 * @returns {string} - Full file path
 */
function getCommandFilePath(commandName, category) {
  const commandsDir = path.join(process.cwd(), 'commands');
  return path.join(commandsDir, category, `${commandName.toLowerCase()}.js`);
}

/**
 * Check if command file exists
 * @param {string} commandName - Command name
 * @param {string} category - Category name
 * @returns {boolean}
 */
function commandExists(commandName, category) {
  const filePath = getCommandFilePath(commandName, category);
  return fs.existsSync(filePath);
}

/**
 * Get all created custom commands (non-built-in)
 * @returns {Array} - Array of custom command files with metadata
 */
function getCustomCommands() {
  const commandsDir = path.join(process.cwd(), 'commands');
  const customCommands = [];
  
  if (!fs.existsSync(commandsDir)) {
    return customCommands;
  }

  const categories = fs.readdirSync(commandsDir);
  
  categories.forEach(category => {
    const categoryPath = path.join(commandsDir, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;
    
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    
    files.forEach(file => {
      const filePath = path.join(categoryPath, file);
      const fileName = file.replace('.js', '');
      
      // Check if file is custom generated (contains auto-generated marker or is newer)
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const isAutoGen = content.includes('Auto-generated command template');
        const stats = fs.statSync(filePath);
        const age = Date.now() - stats.mtimeMs;
        
        customCommands.push({
          name: fileName,
          category,
          path: filePath,
          size: stats.size,
          autoGenerated: isAutoGen,
          createdAt: new Date(stats.birthtime).toLocaleString(),
          modifiedAt: new Date(stats.mtime).toLocaleString()
        });
      } catch (err) {
        console.error(`Error reading command file ${file}:`, err.message);
      }
    });
  });

  return customCommands.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  validateCommandName,
  validateCategory,
  generateCommandTemplate,
  getCommandFilePath,
  commandExists,
  getCustomCommands,
  VALID_CATEGORIES,
  PROTECTED_COMMANDS
};
