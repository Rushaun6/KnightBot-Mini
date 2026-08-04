/**
 * GitHub Integration Service
 * Handles all GitHub API operations for command management
 * Authenticates via GITHUB_TOKEN env variable
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.owner = process.env.GITHUB_OWNER || '';
    this.repo = process.env.GITHUB_REPO || '';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    
    if (!this.token) {
      console.warn('⚠️ GITHUB_TOKEN not set. GitHub integration will be disabled.');
      this.enabled = false;
      return;
    }
    
    if (!this.owner || !this.repo) {
      console.warn('⚠️ GITHUB_OWNER or GITHUB_REPO not set. GitHub integration will be disabled.');
      this.enabled = false;
      return;
    }
    
    this.enabled = true;
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'KnightBot-CommandGenerator'
      }
    });
  }

  /**
   * Get file content from GitHub
   * @param {string} filePath - Path to file in repo
   * @returns {Promise<{content: string, sha: string}|null>}
   */
  async getFile(filePath) {
    if (!this.enabled) return null;
    
    try {
      const response = await this.api.get(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        { params: { ref: this.branch } }
      );
      
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      return {
        content,
        sha: response.data.sha
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // File doesn't exist
      }
      console.error(`[GitHub] Error getting file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Create a new file on GitHub
   * @param {string} filePath - Path to file in repo
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<boolean>}
   */
  async createFile(filePath, content, message) {
    if (!this.enabled) {
      console.warn('[GitHub] Integration disabled. File not synced to GitHub.');
      return true; // Don't fail if GitHub is disabled
    }

    try {
      await this.api.put(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        {
          message,
          content: Buffer.from(content).toString('base64'),
          branch: this.branch
        }
      );
      console.log(`[GitHub] Created file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`[GitHub] Error creating file ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Update an existing file on GitHub
   * @param {string} filePath - Path to file in repo
   * @param {string} content - File content
   * @param {string} sha - Current file SHA (from getFile)
   * @param {string} message - Commit message
   * @returns {Promise<boolean>}
   */
  async updateFile(filePath, content, sha, message) {
    if (!this.enabled) {
      console.warn('[GitHub] Integration disabled. File not synced to GitHub.');
      return true;
    }

    try {
      await this.api.put(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        {
          message,
          content: Buffer.from(content).toString('base64'),
          sha,
          branch: this.branch
        }
      );
      console.log(`[GitHub] Updated file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`[GitHub] Error updating file ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Delete a file from GitHub
   * @param {string} filePath - Path to file in repo
   * @param {string} sha - Current file SHA (from getFile)
   * @param {string} message - Commit message
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath, sha, message) {
    if (!this.enabled) {
      console.warn('[GitHub] Integration disabled. File not deleted from GitHub.');
      return true;
    }

    try {
      await this.api.delete(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        {
          data: {
            message,
            sha,
            branch: this.branch
          }
        }
      );
      console.log(`[GitHub] Deleted file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`[GitHub] Error deleting file ${filePath}:`, error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new GitHubService();
