/**
 * Booking Repository Interface
 * Defines the contract for booking data access
 */
export class IBookingRepository {
  /**
   * Get all bookings
   * @returns {Promise<Booking[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get booking by ID
   * @param {string} id
   * @returns {Promise<Booking|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new booking
   * @param {Booking} booking
   * @returns {Promise<{success: boolean, data?: Booking, error?: string}>}
   */
  async create(booking) {
    throw new Error('Method not implemented');
  }

  /**
   * Update existing booking
   * @param {string} id
   * @param {Booking} booking
   * @returns {Promise<{success: boolean, data?: Booking, error?: string}>}
   */
  async update(id, booking) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete booking
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}
