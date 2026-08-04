/**
 * Enhanced Command Loader with Hot Reload Support
 * Provides both initial loading and runtime command reloading
 */

const fs = require('fs');
const path = require('path');

/**
 * Global command registry Map
 * Shared across all reloads to avoid duplicates
 */
let globalCommands = null;

/**
 * Register commands from external registries (fun, economy)
 * @param {Map} commands - Command registry map
 * @param {string} modulePath - Path to module
 * @param {string} label - Label for logging
 */
function registerRegistryCommands(commands, modulePath, label) {
  try {
    // Clear require cache for registry modules to get fresh data on reload
    delete require.cache[require.resolve(modulePath)];
    
    const list = require(modulePath);
    for (const cmd of list) {
      if (!cmd?.name) continue;
      commands.set(cmd.name, cmd);
      cmd.aliases?.forEach((alias) => commands.set(alias, cmd));
    }
  } catch (error) {
    console.error(`Error loading ${label} commands:`, error.message);
  }
}

/**
 * Register fun commands from registry
 * @param {Map} commands - Command registry map
 */
function registerFunCommands(commands) {
  registerRegistryCommands(commands, './funCommands', 'fun');
}

/**
 * Register economy commands from registry
 * @param {Map} commands - Command registry map
 */
function registerEconomyCommands(commands) {
  registerRegistryCommands(commands, './economyCommands', 'economy');
}

/**
 * Load all commands from file system
 * @returns {Map} - Map of command name -> command object
 */
const loadCommands = () => {
  const commands = new Map();
  const commandsPath = path.join(__dirname, '..', 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.log('Commands directory not found');
    return commands;
  }
  
  const categories = fs.readdirSync(commandsPath);
  
  categories.forEach(category => {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;
    
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    
    files.forEach(file => {
      try {
        const filePath = path.join(categoryPath, file);
        // Clear require cache to ensure fresh load
        delete require.cache[require.resolve(filePath)];
        
        const command = require(filePath);
        if (command.name) {
          commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
              commands.set(alias, command);
            });
          }
        }
      } catch (error) {
        console.error(`Error loading command ${file}:`, error.message);
      }
    });
  });
  
  registerFunCommands(commands);
  registerEconomyCommands(commands);
  
  globalCommands = commands;
  return commands;
};

/**
 * Reload a specific command by name
 * @param {string} commandName - Name of command to reload
 * @param {string} category - Category of command
 * @returns {Object} - { success: boolean, message: string, command?: Object }
 */
const reloadCommand = (commandName, category) => {
  if (!globalCommands) {
    return { success: false, message: 'Command registry not initialized' };
  }

  try {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const filePath = path.join(commandsPath, category, `${commandName}.js`);

    if (!fs.existsSync(filePath)) {
      return { success: false, message: `Command file not found: ${filePath}` };
    }

    // Clear require cache
    delete require.cache[require.resolve(filePath)];

    // Load fresh module
    const command = require(filePath);

    if (!command.name) {
      return { success: false, message: 'Invalid command: missing name property' };
    }

    // Remove old command and aliases from registry
    for (const [key, value] of globalCommands.entries()) {
      if (value === globalCommands.get(commandName)) {
        globalCommands.delete(key);
      }
    }

    // Register new command with fresh aliases
    globalCommands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        globalCommands.set(alias, command);
      });
    }

    return {
      success: true,
      message: `✅ Command reloaded: ${commandName}`,
      command
    };
  } catch (error) {
    return {
      success: false,
      message: `Error reloading command: ${error.message}`
    };
  }
};

/**
 * Reload all commands
 * @returns {Object} - { success: boolean, message: string, reloadedCount: number }
 */
const reloadAllCommands = () => {
  try {
    const newCommands = loadCommands();
    return {
      success: true,
      message: '✅ All commands reloaded',
      reloadedCount: newCommands.size
    };
  } catch (error) {
    return {
      success: false,
      message: `Error reloading all commands: ${error.message}`,
      reloadedCount: 0
    };
  }
};

/**
 * Get current global command registry
 * @returns {Map}
 */
const getCommands = () => {
  return globalCommands || new Map();
};

module.exports = {
  loadCommands,
  reloadCommand,
  reloadAllCommands,
  getCommands,
  registerFunCommands,
  registerEconomyCommands
};
