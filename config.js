/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['18764526429'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['ruh'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'freci',
    prefix: ',',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU246jRhD9l34FrRsMBiyNFGwu9viKr9hRHhpocGNubhpsZmUpyv5IlF/bH4nw7OzsQ7KZ8NQUdJ1TdU7VZ5DlpMQT3ID+Z1BQUiOG2yNrCgz6YFCFIaaABwFiCPSBMzt5zfZsYE3U6VE2NvVAXC/XycAbFYYSc3PSuaF0Ot0mzhO486CovIT4P0vIlZNVd2jtRrkgdrokdqHRy2u5ivdcxhlQbToz7aozEUZP4N5mRISSLDKLE04xRckEN0tE6Mfoq+Ncu3LULfflpIoOeWKrA6HW4S4/bfez60bQ1nU9oK4H9Y/R109KTyKW0R3J1iJXp66dM1zKottVNArHvntxwnUpb7ov0iv9kkQZDsYBzhhhzYf7fraHa/k5Vm672JNmmKb7mbESE2GnRntvs4bF/jan4ZS7CdePEQ/qSr9k9vySahI+bDlJVUfS89Yc1clgkZon2d7O0Rapw435I/ElffPK+f/03RnF27nJLY1V5SVuEdHehe6ZddXkjoku0ENyb5FwhysV1I/RbzJHt63EE3z7BRre8XTQfSM+zmxT7lR6l8UoEUl+uagr/Z0+YhX9GcuRp2QGHGp6Lk/HTieCxWzDTfAzJwu383EM/fGpmDvsJpFys1nL3i4sLnNvPMt3LPTtEQyC8LyMb9tcmkDXfe4swhUhztOjojNuxgHoC3ceUByRklHESJ61MUXkAQrqNfYpZo/ugssCD/a9wMLFlKRmeUxFyDW3nRByI/c42DM1HS1Oz8urGJ+fAA8Kmvu4LHEwIiXLaTPDZYkiXIL+r7/xIMM39qpbi9YVeBASWrJtVhVJjoI3Ud8+It/Pq4ytm8wftgdMQR++hzFjJIvKto1Vhqh/IjUenhArQT9ESYm/F4gpDkCf0Qp/H9phHrR9nx8GzkhTTMCD9KEHCUAfCKrSk1RBVES131V+KT9d26yoKD5lmAEeZKj9GXz946+vX37/+uVPwIPkcbEnQEFSJbErqFpPbO+28ft3yi1CgBkiSQn6YDiLJ7SAA3Pa6Pl8Ztu6GenDSAfvJb5Z5VWLSWSsAiMc6ep2GRk9yRMYXh4X40PRWx21I51k6kTt1D19ZT79QxLQB8ultfc62bw8+PpCeXbRy/DgBU3s7zLL8qW186L1NNNTfPvMBDXJjwvj0hWdvUd2A/Gy20urBWNL3Iz123zuuoc85S569NSiBbgmPv4RzCPe8zWQGipurKMBz7lxw87magupdTnF1qAqrNuazunqAGHPGSgQ6qRA5jWDs5eFePKnNIlxEDcvQfe4NGpo1DM1vr6a+DFEybflRR7+asVrX0OCH7vgm0r/JeYr79Zy8M7/kOLbcvmXAR2scx26Tvd2XVqGpHOVrXluLG6IPcHnfbhHTdEZ1kuFi8wVuN9/40GRIBbmNAV9UKYeAjygedUaeJyF+U+Qhno5NpzIaqtOUMn096HYkBSXDKUF6AuKKosQKlDmQdroRbFmiL3NEtDbZ6JCcP8ba0g0m2YHAAA=',
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: 'By adam',
    
    // Bot Behavior
    selfMode: false, // Private mode - only owner can use commands
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: 'bot',
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: false,
      antilinkAction: 'delete', // 'delete', 'kick', 'warn'
      antitag: false,
      antitagAction: 'delete',
      antiall: false, // Owner only - blocks all messages from non-admins
      antiviewonce: false,
      antibot: false,
      antibotAction: 'warn', // 'warn' | 'kick'
      anticall: false, // Anti-call feature
      antigroupmention: false, // Anti-group mention feature
      antigroupmentionAction: 'delete', // 'delete', 'kick'
      antigroupstatus: false, // Block group status posts
      antigroupstatusAction: 'delete', // 'delete', 'kick'
      antisticker: false, // Stickers not allowed in group
      antistickerAction: 'delete', // 'delete', 'kick'
      antibadword: false, // Block bad words in group
      antibadwordAction: 'delete', // 'delete', 'kick', 'warn'
      welcome: false,
      welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
      goodbye: false,
      goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false // Auto-convert images/videos to stickers
    },
    
    // API Keys (add your own)
    apiKeys: {
      // Add API keys here if needed
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: '👑 This command is only for bot owner!',
      adminOnly: '🛡️ This command is only for group admins!',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 Bot needs to be admin to execute this command!',
      invalidCommand: '❓ Invalid command! Type .menu for help'
    },
    
    // Timezone
    timezone: 'Asia/Kolkata',
    
    // Limits
    maxWarnings: 3,
    
    // Social Links (optional)
    social: {
      github: 'https://github.com/mruniquehacker',
      instagram: 'https://instagram.com/yourusername',
      youtube: 'http://youtube.com/@mr_unique_hacker'
    }
};
  
