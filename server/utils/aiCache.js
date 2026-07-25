/**
 * AI Response Cache Utility
 * Caches AI responses to reduce API calls and prevent quota exhaustion
 */

class AICache {
  constructor() {
    this.cache = new Map();
    this.dailyTipCache = null;
    this.dailyTipDate = null;
  }

  /**
   * Generate cache key from prompt
   */
  generateKey(prompt, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prompt.substring(0, 100)}|${paramString}`;
  }

  /**
   * Get cached response
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache is expired (24 hours)
    const now = Date.now();
    if (now - cached.timestamp > 24 * 60 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    console.log('✅ Cache HIT:', key.substring(0, 50));
    return cached.data;
  }

  /**
   * Set cache response
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size to 1000 entries
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Get daily tip (cached for the day)
   */
  getDailyTip() {
    const today = new Date().toDateString();
    if (this.dailyTipDate === today && this.dailyTipCache) {
      console.log('✅ Using cached daily tip');
      return this.dailyTipCache;
    }
    return null;
  }

  /**
   * Set daily tip
   */
  setDailyTip(tip) {
    this.dailyTipDate = new Date().toDateString();
    this.dailyTipCache = tip;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.dailyTipCache = null;
    this.dailyTipDate = null;
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      hasDailyTip: !!this.dailyTipCache,
      dailyTipDate: this.dailyTipDate
    };
  }
}

// Singleton instance
const aiCache = new AICache();

module.exports = aiCache;
