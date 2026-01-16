/* ========================================== */
/* AUTHENTICATION SERVICE - WITH MANUAL PROFILE CREATION */
/* ========================================== */
console.log('js/auth.js loading...');

/**
 * Authentication service for profiles-based system
 */
const AuthService = {
    currentUser: null,

    /**
     * Register a new user
     * Now creates profile manually to avoid trigger issues
     */
    async register(email, password, fullName, phone = '', role = 'customer') {
        try {
            // Step 1: Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                        role: role
                    }
                }
            });

            if (authError) throw authError;

            // Step 2: Create profile manually (don't rely on trigger)
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        email: email,
                        full_name: fullName,
                        phone: phone,
                        role: role
                    }])
                    .select()
                    .single();

                if (profileError) {
                    // Profile might already exist from trigger
                    console.warn('Profile insert failed (might already exist):', profileError);

                    // Try to fetch existing profile
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (existingProfile) {
                        return { success: true, user: existingProfile };
                    }
                } else {
                    return { success: true, user: profileData };
                }
            } catch (profileErr) {
                console.error('Profile creation error:', profileErr);
            }

            // Step 3: Wait and try to fetch profile (in case trigger worked)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { data: finalProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (fetchError) {
                // Profile really doesn't exist, return minimal data
                console.error('Could not fetch profile:', fetchError);
                return {
                    success: true,
                    user: {
                        id: authData.user.id,
                        email,
                        full_name: fullName,
                        phone,
                        role
                    },
                    warning: 'Profile not created in database. Please contact support.'
                };
            }

            return { success: true, user: finalProfile };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;

            // Fetch profile from profiles table
            let profileData;
            const { data: fetchedProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                // Profile doesn't exist, try to create it now
                console.warn('Profile not found, creating...');

                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        email: authData.user.email,
                        full_name: authData.user.user_metadata?.full_name || '',
                        phone: authData.user.user_metadata?.phone || '',
                        role: 'customer'
                    }])
                    .select()
                    .single();

                if (createError) {
                    throw new Error('Profile not found and could not be created. Please contact support.');
                }

                profileData = newProfile;
            } else {
                profileData = fetchedProfile;
            }

            // Check admin status efficiently - single check
            const isAdmin = profileData?.role === 'admin' || false;

            // Merge admin info
            const userData = {
                ...profileData,
                isAdmin: isAdmin,
                adminRole: isAdmin ? profileData.role : null
            };

            console.log('Login successful. Admin status:', isAdmin);

            this.currentUser = userData;
            return { success: true, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Logout current user
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get current session
     */
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (session) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    return null;
                }

                // Check admin status efficiently
                const isAdmin = profileData?.role === 'admin' || false;

                const userData = {
                    ...profileData,
                    isAdmin: isAdmin,
                    adminRole: isAdmin ? profileData.role : null
                };

                console.log('Session check. Admin status:', isAdmin);

                this.currentUser = userData;
                return userData;
            }

            return null;
        } catch (error) {
            console.error('Session error:', error);
            return null;
        }
    },

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    },

    /**
     * Get admin role
     */
    getAdminRole() {
        return this.currentUser?.adminRole || null;
    },

    /**
     * Check if authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    },

    /**
     * Log admin action to audit_logs
     */
    async logAction(action, resourceType, resourceId, details = {}) {
        if (!this.currentUser) return;

        try {
            await supabase.from('audit_logs').insert([{
                user_id: this.currentUser.id,
                action,
                resource_type: resourceType,
                resource_id: resourceId?.toString(),
                details,
                created_at: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Failed to log action:', error);
        }
    }
};

/**
 * Auth state change listener
 */
if (typeof supabase !== 'undefined' && supabase) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session) {
            await AuthService.getSession();
        } else if (event === 'SIGNED_OUT') {
            AuthService.currentUser = null;
            if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
                window.location.href = 'login.html';
            }
        }
    });
}
