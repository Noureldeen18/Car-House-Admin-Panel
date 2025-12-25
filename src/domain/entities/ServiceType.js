/**
 * ServiceType Entity
 * Represents a workshop service offering in the domain
 */
export class ServiceType {
  constructor({
    id = null,
    name,
    description = '',
    duration = null,
    price = null,
    icon = '🔧',
    position = 0,
    isActive = true,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.price = price;
    this.icon = icon;
    this.position = position;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the service type data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Service name is required');
    }

    if (this.duration !== null && this.duration < 0) {
      errors.push('Duration must be non-negative');
    }

    if (this.price !== null && this.price < 0) {
      errors.push('Price must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get formatted duration
   * @returns {string}
   */
  getFormattedDuration() {
    if (!this.duration) return 'N/A';
    
    if (this.duration < 60) {
      return `${this.duration} min`;
    }
    
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}min`;
  }

  /**
   * Get formatted price
   * @returns {string}
   */
  getFormattedPrice() {
    if (this.price === null || this.price === undefined) {
      return 'Contact for price';
    }
    
    return `${this.price.toLocaleString('en-EG', { 
      style: 'currency', 
      currency: 'EGP' 
    })}`;
  }

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      duration_minutes: this.duration,
      base_price: this.price,
      icon: this.icon,
      display_position: this.position,
      is_active: this.isActive
    };
  }

  /**
   * Create ServiceType from database object
   * @param {Object} data - Database object
   * @returns {ServiceType}
   */
  static fromDatabase(data) {
    return new ServiceType({
      id: data.id,
      name: data.name,
      description: data.description || '',
      duration: data.duration_minutes,
      price: data.base_price,
      icon: data.icon || '🔧',
      position: data.display_position || 0,
      isActive: data.is_active !== false,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
