import { IProductRepository } from '../../domain/repositories/IProductRepository.js';
import { Product } from '../../domain/entities/Product.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase Product Repository Implementation
 * Implements IProductRepository using Supabase as data source
 */
export class SupabaseProductRepository extends IProductRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all products with categories and images
   * @returns {Promise<Product[]>}
   */
  async getAll() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => {
        const product = Product.fromDatabase(item);
        product.category = item.category;
        product.images = item.images || [];
        return product;
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Get product by ID
   * @param {string} id
   * @returns {Promise<Product|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const product = Product.fromDatabase(data);
      product.category = data.category;
      product.images = data.images || [];
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Create new product
   * @param {Product} product
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async create(product) {
    try {
      // Validate product
      const validation = product.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      const { data, error } = await this.supabase
        .from('products')
        .insert(product.toDatabase())
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Product.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update existing product
   * @param {string} id
   * @param {Product} product
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async update(id, product) {
    try {
      // Validate product
      const validation = product.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      const updateData = product.toDatabase();
      delete updateData.id; // Don't update ID

      const { data, error } = await this.supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Product.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete product
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add image to product
   * @param {string} productId
   * @param {Object} imageData - { url, alt, position }
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async addImage(productId, imageData) {
    try {
      const { data, error } = await this.supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url: imageData.url,
          alt_text: imageData.alt || '',
          display_position: imageData.position || 0
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error adding product image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update product stock
   * @param {string} productId
   * @param {number} quantity
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateStock(productId, quantity) {
    try {
      const { error } = await this.supabase
        .from('products')
        .update({ stock: quantity })
        .eq('id', productId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating stock:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
