/**
 * Delete Product Use Case
 * Handles deleting a product
 */
export class DeleteProduct {
  /**
   * @param {IProductRepository} productRepository - Product repository
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Execute the use case
   * @param {string} id - Product ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async execute(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Product ID is required'
        };
      }

      const result = await this.productRepository.delete(id);
      return result;

    } catch (error) {
      console.error('DeleteProduct use case error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete product'
      };
    }
  }
}
