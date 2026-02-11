import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { Category } from '../../domain/entities/Category.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase Category Repository Implementation
 * Implements ICategoryRepository using Supabase as data source
 */
export class SupabaseCategoryRepository extends ICategoryRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll() {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return data.map(item => Category.fromDatabase(item));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get category by ID
   * @param {string} id
   * @returns {Promise<Category|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return Category.fromDatabase(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<{success: boolean, data?: Category, error?: string}>}
   */
  async create(categoryData) {
    try {
      // Auto-generate slug from name if not provided
      if (!categoryData.slug && categoryData.name) {
        categoryData.slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const { data, error } = await this.supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Category.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update existing category
   * @param {string} id
   * @param {Object} updates - Updates to apply
   * @returns {Promise<{success: boolean, data?: Category, error?: string}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Category.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete category
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
