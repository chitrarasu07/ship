// File: sliding-cache.js
class SlidingExpireCache {
  constructor(defaultTtlMs) {
    if (!defaultTtlMs) throw "Provide defaultTtlMs";
    // default 30 min
    this.defaultTtlMs = defaultTtlMs;
    this.cache = new Map();

    setInterval(() => {
      this.#cleanup();
    }, 2 * 60 * 100);
  }

  /**
   * Set a value in the cache.
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    const expiresAt = Date.now() + this.defaultTtlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a value from the cache.
   * If found and not expired, refresh TTL (sliding).
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Reset TTL
    entry.expiresAt = Date.now() + this.defaultTtlMs;
    return entry.value;
  }

  /**
   * Optional: manually clear expired keys
   */
  #cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = SlidingExpireCache;
