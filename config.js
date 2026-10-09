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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU246jRhD9l37FWpuLMVgaKRgw+A7GeDyO8tC4G4zNbbqbm1eWouyPRPm1/ZGImZ2dfUg2k7emmj51qs6p+gyyPKZ4gVsw/gwKEleQ4e7I2gKDMZiUYYgJ6AEEGQRj0OqbnIPF4MpplnJcp/Mn1fHMotL4OdkndqFNpty2b138QfQA7j1QlEESn34CGPlT10GyJkwua96eIWcLmcPVl2tW7uWNcwz0rEBua83qDrBDhDGJs8gszjjFBCYL3DowJh+j72pDIiyPXr1jLnOny2d4WLbzYrk2b9NgtDsoy0d3YLQHUXQ/Rv95jXPiHvujTEJOkNJtpi2p87xKn4eCXkWXkivVm6vI+Epf6dM4yjCaIZyxmLUf7rtkIHF6e0JIdp3Z48VXrw0616y6KbFS2wp0Vvpmc1kfglT7GHHDuhh2tqrZKJisj7p/DkRP9C1RPF2nuT2PHWTOrbVgQ/P0I3GHvHnl+n/6nptHMWxm2m6CuGBRRN4xjlRWbvYla27C4jaZqP0DrZ/Kvfkx+iQz5/YOYc0zBkysm6pNqL273ZCf69Yll7m+QKJorh/O0jt9yEryM5ZyAwX4nPrHFalWkqdQL/StYcwjcb9q+uo22qtSKgUNTs+CX1fSRq2apG22yaGCmKvNurAe62S+3541YX9RGO07ql4/vFR0xe0MgTF/7wGCo5gyAlmcZ11MHfYARJWHTwSzl+4Cnqdqc6CjfbY+26srk3FjjQq8LKoiLZpLsamm5zYKlbC5PoAeKEh+wpRiZMeU5aRdYUphhCkY//pbD2S4Ya+6ddlEvgfCmFDmZ2WR5BC9ifp2CU+nvMyY12YnvTtgAsaD9zBmLM4i2rWxzCA5neMK62fIKBiHMKH4e4GYYATGjJT4+9DqOer6vuftubEY8aAH0hc9YtTVrIxkSeGFkaCMReUX+qnuUGFRfMowAz2Qwe5n8PWPv75++f3rlz9BDyQvD2V+wEuKJIi8ospC97aL379T7jIgzGCcUDAG+ipbkGIwMVeOmq+fLEszI02PNPBe4ptVXrVYRMYWGaGtKb4TGbIU8Aw7x83sqZC3R/VIFpmyUPqVrG3Nh38AAWNgRsvWtHhu6awQpw6d/XIYDi+BLGLv0E/QaH11Al+6Lklp9x1JXqnQ89a2RWZkP9Aghw9+PbIzvGidkzg1L1iY2q7hPnTZEK7iE/4x2S3nLW/J++5xYjqL9DYxgp1RoNCDQ9WkHqFX0Wb2oGYjXX5OeKHgjdquTWUW0HZq5dpMXRru8bxMDhUXndRzEbryJHo18csQJd+WV/zir0687jOM8csu+KbSf4n5yruz3ODe+wHi23L5lwGdeLk2OLhiUztTQ9K40lKDw0XYxdYCXx/DR9gWfb1yRlxkbsH9/lsPFAlkYU5SMAY0DSDoAZKXnYFnWZj/JJOu0ZnhRtOu6gRSpr0PxS5OMWUwLcCYH6n8cKDwsnL/G0GbMl1JBwAA',
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
  
