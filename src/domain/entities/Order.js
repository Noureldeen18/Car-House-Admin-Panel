/**
 * Order Entity
 * Represents a customer order in the domain
 */
export class Order {
  static STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  };

  constructor({
    id = null,
    userId,
    status = Order.STATUS.PENDING,
    total,
    items = [],
    profile = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.total = total;
    this.items = items;
    this.profile = profile;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the order data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (this.total === null || this.total === undefined || this.total < 0) {
      errors.push('Valid total is required');
    }

    if (!this.items || this.items.length === 0) {
      errors.push('Order must have at least one item');
    }

    if (!Object.values(Order.STATUS).includes(this.status)) {
      errors.push('Invalid order status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if order can be cancelled
   * @returns {boolean}
   */
  canBeCancelled() {
    return this.status === Order.STATUS.PENDING || 
           this.status === Order.STATUS.PROCESSING;
  }

  /**
   * Check if order is completed
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === Order.STATUS.DELIVERED;
  }

  /**
   * Get item count
   * @returns {number}
   */
  getItemCount() {
    return this.items?.length || 0;
  }

  /**
   * Calculate subtotal (before tax)
   * @param {number} taxRate - Tax rate (default: 0.14 for 14%)
   * @returns {number}
   */
  calculateSubtotal(taxRate = 0.14) {
    return this.total / (1 + taxRate);
  }

  /**
   * Calculate tax amount
   * @param {number} taxRate - Tax rate (default: 0.14 for 14%)
   * @returns {number}
   */
  calculateTax(taxRate = 0.14) {
    const subtotal = this.calculateSubtotal(taxRate);
    return this.total - subtotal;
  }

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      status: this.status,
      total_amount: this.total
    };
  }

  /**
   * Create Order from database object
   * @param {Object} data - Database object
   * @returns {Order}
   */
  static fromDatabase(data) {
    return new Order({
      id: data.id,
      userId: data.user_id,
      status: data.status,
      total: data.total || data.total_amount,
      items: data.items || [],
      profile: data.profile || data.user,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
