import { IBookingRepository } from '../../domain/repositories/IBookingRepository.js';
import { Booking } from '../../domain/entities/Booking.js';
import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * Supabase Booking Repository Implementation
 * Implements IBookingRepository using Supabase as data source
 */
export class SupabaseBookingRepository extends IBookingRepository {
  constructor() {
    super();
    this.supabase = supabaseClient.getClient();
  }

  /**
   * Get all bookings with user profiles and service type details
   * @returns {Promise<Booking[]>}
   */
  async getAll() {
    try {
      const { data, error } = await this.supabase
        .from('workshop_bookings')
        .select(`
          *,
          profile:profiles(id, email, full_name, phone),
          service_type_details:service_types(base_price)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      return data.map(item => {
        const booking = Booking.fromDatabase(item);
        booking.profile = item.profile;
        booking.service = item.service_type_details;
        return booking;
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  /**
   * Get booking by ID
   * @param {string} id
   * @returns {Promise<Booking|null>}
   */
  async getById(id) {
    try {
      const { data, error } = await this.supabase
        .from('workshop_bookings')
        .select(`
          *,
          profile:profiles(id, email, full_name, phone),
          service_type_details:service_types(base_price)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const booking = Booking.fromDatabase(data);
      booking.profile = data.profile;
      booking.service = data.service_type_details;
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  /**
   * Create new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<{success: boolean, data?: Booking, error?: string}>}
   */
  async create(bookingData) {
    try {
      const { data, error } = await this.supabase
        .from('workshop_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Booking.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update existing booking
   * @param {string} id
   * @param {Object} updates - Updates to apply
   * @returns {Promise<{success: boolean, data?: Booking, error?: string}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('workshop_bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: Booking.fromDatabase(data)
      };
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete booking
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('workshop_bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
