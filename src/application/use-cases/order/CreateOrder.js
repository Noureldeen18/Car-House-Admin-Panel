/**
 * Create Order Use Case
 * Handles the business logic for creating a new order
 */
export class CreateOrder {
  /**
   * @param {IOrderRepository} orderRepository - Order repository
   */
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  /**
   * Execute the use case
   * @param {Object} data - Order data
   * @param {string} data.userId - User ID
   * @param {Array} data.items - Order items [{productId, sku, title, unitPrice, quantity}]
   * @param {Object} data.shippingAddress - Shipping address
   * @param {Object} data.billingAddress - Billing address (optional)
   * @param {string} data.paymentMethod - Payment method
   * @param {Object} data.paymentMeta - Payment metadata (optional)
   * @param {string} data.notes - Order notes (optional)
   * @returns {Promise<{success: boolean, data?: Order, error?: string}>}
   */
  async execute(data) {
    try {
      // Import Order entity (dynamic import for browser compatibility)
      const { Order } = await import('../../../domain/entities/Order.js');

      // Calculate totals
      const TAX_RATE = 0.14; // 14% tax
      const subtotal = data.items.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity);
      }, 0);
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      // Create order entity
      const order = new Order({
        userId: data.userId,
        status: Order.STATUS.PENDING,
        total: total,
        items: data.items.map(item => ({
          productId: item.productId,
          sku: item.sku || '',
          title: item.title,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity
        }))
      });

      // Validate order
      const validation = order.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Prepare order data for repository
      const orderData = {
        user_id: data.userId,
        total_amount: total,
        subtotal: subtotal,
        tax: tax,
        status: Order.STATUS.PENDING,
        shipping_address: data.shippingAddress || null,
        billing_address: data.billingAddress || null,
        payment_method: data.paymentMethod || null,
        payment_meta: data.paymentMeta || {},
        notes: data.notes || null,
        items: data.items.map(item => ({
          product_id: item.productId,
          sku: item.sku || '',
          title: item.title,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity
        }))
      };

      // Create order in database
      const result = await this.orderRepository.create(orderData);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data,
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('CreateOrder use case error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }
}
