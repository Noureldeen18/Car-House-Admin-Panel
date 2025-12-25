/* ========================================== */
/* SUPABASE CONFIGURATION */
/* ========================================== */
console.log('js/config.js loading...');

/**
 * Supabase configuration object
 * IMPORTANT: Replace these with your actual Supabase project credentials
 */
const SUPABASE_CONFIG = {
    url: 'https://bzbximgipjziqrwkctop.supabase.co', // Replace with your Supabase URL (e.g., https://xxxxx.supabase.co)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6YnhpbWdpcGp6aXFyd2tjdG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzI2MzMsImV4cCI6MjA4MDAwODYzM30.F6-CCUPgJodPAOJl9rKRSSXmjb2UY_RDwPBqICniSMM' // Replace with your Supabase anon/public key
};

/**
 * Initialize Supabase client
 * This will be available globally throughout the application
 */
// Store library reference safely before we declare our client variable
const _supabaseLib = window.supabase || window.Supabase;
var supabase = null;

/**
 * Initialize the Supabase client when the Supabase library is loaded
 * Returns a Promise that resolves to true if initialized, false otherwise
 */
window.initializeSupabase = async function () {
    console.log('initializeSupabase() called');

    // Retry logic to wait for the library to load if needed
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
        // Use the captured library or look for it again
        const lib = _supabaseLib || window.supabase || window['supabase-js'] || window.Supabase;

        if (lib && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
            supabase = lib.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase client initialized');
            return true;
        }

        console.log(`Waiting for Supabase library... (Retry ${retries + 1}/${maxRetries})`, {
            hasWindowSupabase: !!window.supabase,
            hasWindowSupabaseJs: !!window['supabase-js'],
            hasWindowSupabaseGlobal: !!window.Supabase
        });
        retries++;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.error('❌ Failed to initialize Supabase. Check your configuration.', {
        supabaseLib: !!window.supabase,
        url: !!SUPABASE_CONFIG.url,
        key: !!SUPABASE_CONFIG.anonKey
    });
    return false;
};
