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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUyZKjOBT8F11xtNltiKiIxoD3BbyWPdEHGQTI7JKwwR3+9wlcXVV9mOmpuYknIl++zHz6CbIcUzRDDdB/goLgK2SoPbKmQEAHgyoIEAEd4EMGgQ7c0Xn6GsBzOvXPtyqzD5E5Haz3zc3ucdPzdGVlpn80B4prH1/AowOK6pxg7w+AQ8zxF15N0ZUfjndS+UqFbh7v8ns9h2oQWkZkmCXfH40P/RfwaBEhJjgL7SJCKSIwmaHGgZh8jX5jqWXc31nHY+TUwrjfm0nWSsQwb+6LS53voRQO93hua6nxNfokXMd37xw2eekObQFOFvKopt5sxWnNJE3tyaK2xPthYWD+jT7FYYb8iY8yhlnzZd3jmTfbsNIJ2IQLolGKp/HtYnHOanqW1qHbY3lcKbtGNNP+14jHmTrYJOtXA5ZkYo2Ofvd+pIsu7m/sYUCEve+wsUNQX1u7vxN3yHtW4v+juzy7L3b5vJTPRa72OHk5OCnQLTzcFJbldm/J0pCd8V01DvzX6J+zO18u+5xLfclaJFpt8LLrB87Rd5M6ukQ2b/aiimXhLvykD1lF/sQy2o5TWZXRlnslJevKapixUcxtVLxbxtHBkNez2fzVTY758OApm+PhNOSEZaPFdLRmx2J8KPZGPM8X4WC73HHro7sc0Uv48pwoRs3EB7rw6ACCQkwZgQzn2bPG8x0A/esGeQSxp7zgUDqisZ2vzstKuUh2z3CiddSk+fDEKWtrU6fw1lXt6X4Rey+gAwqSe4hS5I8xZTlpFohSGCIK9L9+dECGavZmXNtOEjogwISyXVYVSQ79d1ffL6Hn5VXGNk3mme0BEaDzn2XEGM5C2upYZZB4Eb4iM4KMAj2ACUUfEyKCfKAzUqGPrTVzvxX+JMqqM1OGoAPSpyHYBzoQ+j1V0jRB7iu68J1+u7WgsCi+ZYiBDkieP8mS0pN4iZcVSdJUXfjelh8f7FowHzGIEwp0YM65iyLbY3u+ii6+OxoZdmiYoQE+p3mPxZvsV68m6+6s1FI6h9q9N1GCg5pvCnLJRlseieecxYUDtexgv/wDCNBBQFm1Om33vKhKjTUejMnNPEznFDv9U3xdNsUg4mehdDtaWyPdTs9brMwxRdyNH/dOnrfPs8XB7So7SVyfJF8ZTM0zM9sMdYCPrthDvzcrreZSWTdt2FWwexlONn0htuGtjNxTLtRo9RpEMKhvZWnXh1tOEzyk4r4bloU8XIjeaCny271ti4UzWIsLF0n8nltejLfAPhcm+fVQ4WeUWp/azwCj595nsHXvv3x7o92Gi390fkP49Y78yy4OztIC8kFTXk/EFK8e16xehaq0SygrdayNWarOT7OteD0JEXg8fnRAkUAW5CQFOoCZT3Lsgw4gedWmdZIF+R+amYPJxHLDSTt3AikzPjdgi1NEGUwLoAu9vqppfK/Xf/wNq/QAszcHAAA=',
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
  
