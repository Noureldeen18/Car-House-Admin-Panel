/**
 * Product Repository Interface
 * Defines the contract for product data access
 */
export class IProductRepository {
  /**
   * Get all products
   * @returns {Promise<Product[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get product by ID
   * @param {string} id
   * @returns {Promise<Product|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new product
   * @param {Product} product
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async create(product) {
    throw new Error('Method not implemented');
  }

  /**
   * Update existing product
   * @param {string} id
   * @param {Product} product
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async update(id, product) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete product
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Add image to product
   * @param {string} productId
   * @param {Object} imageData
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async addImage(productId, imageData) {
    throw new Error('Method not implemented');
  }

  /**
   * Update product stock
   * @param {string} productId
   * @param {number} quantity
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateStock(productId, quantity) {
    throw new Error('Method not implemented');
  }
}
