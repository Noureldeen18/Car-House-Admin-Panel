/**
 * Category Entity
 * Represents a product category in the domain
 */
export class Category {
  constructor({
    id = null,
    name,
    icon = '🏷️',
    description = '',
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the category data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Category name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if icon is a URL (image)
   * @returns {boolean}
   */
  isIconUrl() {
    return this.icon && (
      this.icon.startsWith('http') ||
      this.icon.startsWith('data:') ||
      this.icon.endsWith('.svg') ||
      this.icon.endsWith('.png') ||
      this.icon.endsWith('.jpg') ||
      this.icon.endsWith('.webp')
    );
  }

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      description: this.description
    };
  }

  /**
   * Create Category from database object
   * @param {Object} data - Database object
   * @returns {Category}
   */
  static fromDatabase(data) {
    return new Category({
      id: data.id,
      name: data.name,
      icon: data.icon || '🏷️',
      description: data.description || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
