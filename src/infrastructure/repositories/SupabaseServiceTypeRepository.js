import { IServiceTypeRepository } from '../../domain/repositories/IServiceTypeRepository.js';
import { ServiceType } from '../../domain/entities/ServiceType.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase ServiceType Repository Implementation
 * Implements IServiceTypeRepository using Supabase as data source
 */
export class SupabaseServiceTypeRepository extends IServiceTypeRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all service types
   * @param {boolean} activeOnly - If true, return only active service types
   * @returns {Promise<ServiceType[]>}
   */
  async getAll(activeOnly = false) {
    try {
      let query = this.supabase
        .from('service_types')
        .select('*')
        .order('position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(item => ServiceType.fromDatabase(item));
    } catch (error) {
      console.error('Error fetching service types:', error);
      return [];
    }
  }

  /**
   * Get service type by ID
   * @param {string} id
   * @returns {Promise<ServiceType|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('service_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return ServiceType.fromDatabase(data);
    } catch (error) {
      console.error('Error fetching service type:', error);
      return null;
    }
  }

  /**
   * Create new service type
   * @param {Object} serviceTypeData - Service type data
   * @returns {Promise<{success: boolean, data?: ServiceType, error?: string}>}
   */
  async create(serviceTypeData) {
    try {
      const { data, error } = await this.supabase
        .from('service_types')
        .insert([serviceTypeData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: ServiceType.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error creating service type:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update existing service type
   * @param {string} id
   * @param {Object} updates - Updates to apply
   * @returns {Promise<{success: boolean, data?: ServiceType, error?: string}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('service_types')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: ServiceType.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error updating service type:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete service type
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('service_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting service type:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Toggle service type active status
   * @param {string} id
   * @param {boolean} isActive
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async toggleActive(id, isActive) {
    try {
      const { data, error } = await this.supabase
        .from('service_types')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: ServiceType.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error toggling service type:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
