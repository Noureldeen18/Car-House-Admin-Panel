/**
 * Product Entity
 * Represents a car spare part product in the domain
 */
export class Product {
  constructor({
    id = null,
    sku = null,
    name,
    title = null,
    brand,
    categoryId,
    carModel,
    price,
    comparePrice = null,
    cost = null,
    stock = 0,
    imageUrl = null,
    tags = [],
    weight = null,
    dimensions = null,
    rating = 0,
    ratingCount = 0,
    totalRatings = 0,
    isActive = true,
    isFeatured = false,
    description = '',
    images = [],
    meta = {},
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.title = title;
    this.brand = brand;
    this.categoryId = categoryId;
    this.carModel = carModel;
    this.price = price;
    this.comparePrice = comparePrice;
    this.cost = cost;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.tags = tags;
    this.weight = weight;
    this.dimensions = dimensions;
    this.rating = rating;
    this.ratingCount = ratingCount;
    this.totalRatings = totalRatings;
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.description = description;
    this.images = images;
    this.meta = meta;
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
      sku: this.sku,
      name: this.name,
      title: this.title,
      brand: this.brand,
      category_id: this.categoryId,
      car_model: this.carModel,
      price: this.price,
      compare_price: this.comparePrice,
      cost: this.cost,
      stock: this.stock,
      image_url: this.imageUrl,
      tags: this.tags,
      weight: this.weight,
      dimensions: this.dimensions,
      rating: this.rating,
      rating_count: this.ratingCount,
      total_ratings: this.totalRatings,
      is_active: this.isActive,
      is_featured: this.isFeatured,
      description: this.description,
      meta: this.meta
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
      sku: data.sku || null,
      name: data.name,
      title: data.title || null,
      brand: data.brand,
      categoryId: data.category_id,
      carModel: data.car_model,
      price: data.price,
      comparePrice: data.compare_price || null,
      cost: data.cost || null,
      stock: data.stock || 0,
      imageUrl: data.image_url || null,
      tags: data.tags || [],
      weight: data.weight || null,
      dimensions: data.dimensions || null,
      rating: data.rating || 0,
      ratingCount: data.rating_count || 0,
      totalRatings: data.total_ratings || 0,
      isActive: data.is_active !== false,
      isFeatured: data.is_featured || false,
      description: data.description || '',
      images: data.images || [],
      meta: data.meta || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
