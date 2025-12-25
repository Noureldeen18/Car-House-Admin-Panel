/**
 * Get Products Use Case
 * Handles retrieving all products
 */
export class GetProducts {
  /**
   * @param {IProductRepository} productRepository - Product repository
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Execute the use case
   * @returns {Promise<Product[]>}
   */
  async execute() {
    try {
      const products = await this.productRepository.getAll();
      return products;
    } catch (error) {
      console.error('GetProducts use case error:', error);
      return [];
    }
  }
}
