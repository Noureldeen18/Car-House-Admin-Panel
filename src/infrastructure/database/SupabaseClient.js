/**
 * Supabase Client
 * Singleton instance for Supabase connection
 */
class SupabaseClient {
  constructor() {
    if (SupabaseClient.instance) {
      return SupabaseClient.instance;
    }

    this.client = null;
    this.initialized = false;
    SupabaseClient.instance = this;
  }

  /**
   * Initialize Supabase client
   * @returns {boolean} Success status
   */
  initialize() {
    if (this.initialized) {
      return true;
    }

    if (typeof supabase === 'undefined' || !supabase) {
      console.error('Supabase is not loaded. Please check your script imports.');
      return false;
    }

    this.client = supabase;
    this.initialized = true;
    console.log('Supabase client initialized successfully');
    return true;
  }

  /**
   * Get Supabase client instance
   * @returns {Object|null}
   */
  getClient() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.client;
  }

  /**
   * Check if client is initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
export const supabaseClient = new SupabaseClient();
