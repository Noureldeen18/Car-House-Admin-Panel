import { IOrderRepository } from '../../domain/repositories/IOrderRepository.js';
import { Order } from '../../domain/entities/Order.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase Order Repository Implementation
 * Implements IOrderRepository using Supabase as data source
 */
export class SupabaseOrderRepository extends IOrderRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all orders with user profiles and items
   * @returns {Promise<Order[]>}
   */
  async getAll() {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(id, email, full_name, phone),
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => {
        const order = Order.fromDatabase(item);
        order.profile = item.profile;
        order.items = item.items || [];
        return order;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   * @param {string} id
   * @returns {Promise<Order|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(id, email, full_name, phone),
          items:order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const order = Order.fromDatabase(data);
      order.profile = data.profile;
      order.items = data.items || [];
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Get orders by user ID
   * @param {string} userId
   * @returns {Promise<Order[]>}
   */
  async getByUserId(userId) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => {
        const order = Order.fromDatabase(item);
        order.items = item.items || [];
        return order;
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Create new order with items
   * @param {Object} orderData - Order data including items
   * @returns {Promise<{success: boolean, data?: Order, error?: string}>}
   */
  async create(orderData) {
    try {
      // Insert order first
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert([{
          user_id: orderData.user_id,
          status: orderData.status || 'pending',
          total_amount: orderData.total_amount,
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          shipping_cost: orderData.shipping_cost || 0,
          discount_amount: orderData.discount_amount || 0,
          payment_status: orderData.payment_status || 'pending',
          payment_method: orderData.payment_method,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          payment_meta: orderData.payment_meta || {},
          notes: orderData.notes
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (orderData.items && orderData.items.length > 0) {
        const items = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          sku: item.sku || '',
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          subtotal: item.subtotal || (item.unit_price * item.quantity)
        }));

        const { error: itemsError } = await this.supabase
          .from('order_items')
          .insert(items);

        if (itemsError) {
          // Try to rollback order if items failed
          await this.supabase.from('orders').delete().eq('id', order.id);
          throw itemsError;
        }
      }

      return {
        success: true,
        data: Order.fromDatabase(order)
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update order status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateStatus(id, status) {
    try {
      const { error } = await this.supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update order payment status
   * @param {string} id
   * @param {string} paymentStatus
   * @param {Object} paymentMeta - Additional payment metadata
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updatePaymentStatus(id, paymentStatus, paymentMeta = {}) {
    try {
      const { error } = await this.supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          payment_meta: paymentMeta,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete order and its items
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      // Order items will be deleted automatically due to ON DELETE CASCADE
      const { error } = await this.supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
