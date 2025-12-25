/**
 * Create Product Use Case
 * Handles the business logic for creating a new product
 */
export class CreateProduct {
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
   * @param {Object} data - Product data including optional image file
   * @returns {Promise<{success: boolean, data?: Product, error?: string}>}
   */
  async execute(data) {
    try {
      // Import Product entity (dynamic import for browser compatibility)
      const { Product } = await import('../../../domain/entities/Product.js');

      // Create product entity
      const product = new Product({
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

      // Create product in database
      const result = await this.productRepository.create(product);

      if (!result.success) {
        return result;
      }

      // Handle image upload if provided
      if (data.imageFile) {
        try {
          const imageUrl = await this.fileStorage.uploadFile(data.imageFile, 'products');
          
          if (imageUrl) {
            await this.productRepository.addImage(result.data.id, {
              url: imageUrl,
              alt: data.name,
              position: 0
            });
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Don't fail the whole operation
          // Product was created successfully, just log the image failure
        }
      }

      return result;

    } catch (error) {
      console.error('CreateProduct use case error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create product'
      };
    }
  }
}
