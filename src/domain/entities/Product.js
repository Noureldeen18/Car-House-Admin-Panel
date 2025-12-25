/**
 * Product Entity
 * Represents a car spare part product in the domain
 */
export class Product {
  constructor({
    id = null,
    name,
    brand,
    categoryId,
    carModel,
    price,
    stock,
    rating = 0,
    description = '',
    images = [],
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.categoryId = categoryId;
    this.carModel = carModel;
    this.price = price;
    this.stock = stock;
    this.rating = rating;
    this.description = description;
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the product data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Product name is required');
    }

    if (!this.brand || this.brand.trim() === '') {
      errors.push('Brand is required');
    }

    if (this.price === null || this.price === undefined || this.price < 0) {
      errors.push('Valid price is required');
    }

    if (this.stock === null || this.stock === undefined || this.stock < 0) {
      errors.push('Valid stock quantity is required');
    }

    if (this.rating < 0 || this.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if product is in stock
   * @returns {boolean}
   */
  isInStock() {
    return this.stock > 0;
  }

  /**
   * Check if product is low on stock
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {boolean}
   */
  isLowStock(threshold = 10) {
    return this.stock <= threshold && this.stock > 0;
  }

  /**
   * Reduce stock by quantity
   * @param {number} quantity
   * @returns {boolean} Success or failure
   */
  reduceStock(quantity) {
    if (quantity <= 0) {
      return false;
    }
    if (this.stock < quantity) {
      return false;
    }
    this.stock -= quantity;
    return true;
  }

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      category_id: this.categoryId,
      car_model: this.carModel,
      price: this.price,
      stock: this.stock,
      rating: this.rating,
      description: this.description
    };
  }

  /**
   * Create Product from database object
   * @param {Object} data - Database object
   * @returns {Product}
   */
  static fromDatabase(data) {
    return new Product({
      id: data.id,
      name: data.name,
      brand: data.brand,
      categoryId: data.category_id,
      carModel: data.car_model,
      price: data.price,
      stock: data.stock,
      rating: data.rating || 0,
      description: data.description || '',
      images: data.images || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
