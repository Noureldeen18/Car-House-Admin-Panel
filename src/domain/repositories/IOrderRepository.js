/**
 * Order Repository Interface
 * Defines the contract for order data access
 */
export class IOrderRepository {
  /**
   * Get all orders
   * @returns {Promise<Order[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get order by ID
   * @param {string} id
   * @returns {Promise<Order|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new order
   * @param {Order} order
   * @returns {Promise<{success: boolean, data?: Order, error?: string}>}
   */
  async create(order) {
    throw new Error('Method not implemented');
  }

  /**
   * Update order status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateStatus(id, status) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete order
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}
