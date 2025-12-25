/**
 * Update Product Use Case
 * Handles updating an existing product
 */
export class UpdateProduct {
  /**
   * @param {IProductRepository} productRepository - Product repository
   * @param {FileStorage} fileStorage - File storage service
   */
  constructor(productRepository, fileStorage) {
    this.productRepository = productRepository;
    this.fileStorage = fileStorage;
  }

  /**
   * Execute the use case
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async execute(id, data) {
    try {
      // Import Product entity
      const { Product } = await import('../../../domain/entities/Product.js');

      // Create product entity with updated data
      const product = new Product({
        id,
        name: data.name,
        brand: data.brand,
        categoryId: data.categoryId,
        carModel: data.carModel,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        rating: parseFloat(data.rating) || 0,
        description: data.description || ''
      });

      // Validate product
      const validation = product.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Update product in database
      const result = await this.productRepository.update(id, product);

      if (!result.success) {
        return result;
      }

      // Handle image upload if provided
      if (data.imageFile) {
        try {
          const imageUrl = await this.fileStorage.uploadFile(data.imageFile, 'products');
          
          if (imageUrl) {
            await this.productRepository.addImage(id, {
              url: imageUrl,
              alt: data.name,
              position: 0
            });
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
        }
      }

      return result;

    } catch (error) {
      console.error('UpdateProduct use case error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update product'
      };
    }
  }
}
