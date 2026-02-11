import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase User Repository Implementation
 * Implements IUserRepository using Supabase as data source
 */
export class SupabaseUserRepository extends IUserRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all users with admin status
   * @returns {Promise<User[]>}
   */
  async getAll() {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which users are admins
      const { data: admins } = await this.supabase
        .from('admins')
        .select('user_id, role');

      const adminMap = new Map(admins?.map(a => [a.user_id, a.role]) || []);

      return data.map(item => {
        const user = User.fromDatabase(item);
        user.isAdmin = adminMap.has(item.id);
        user.adminRole = adminMap.get(item.id) || null;
        return user;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  /**
   * Get user by ID
   * @param {string} id
   * @returns {Promise<User|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return User.fromDatabase(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * @param {string} id
   * @param {Object} updates - Updates to apply
   * @returns {Promise<{success: boolean, data?: User, error?: string}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: User.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
