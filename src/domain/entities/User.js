/**
 * User Entity
 * Represents a user profile in the domain
 */
export class User {
  static ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    // SUPER_ADMIN removed - only admin and customer roles supported
  };

  constructor({
    id = null,
    email,
    fullName,
    phone = '',
    role = User.ROLES.CUSTOMER,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the user data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.fullName || this.fullName.trim() === '') {
      errors.push('Full name is required');
    }

    if (!Object.values(User.ROLES).includes(this.role)) {
      errors.push('Invalid user role');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is valid
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === User.ROLES.ADMIN;
  }

  // isSuperAdmin method removed - superadmin role no longer supported

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      email: this.email,
      full_name: this.fullName,
      phone: this.phone,
      role: this.role
    };
  }

  /**
   * Create User from database object
   * @param {Object} data - Database object
   * @returns {User}
   */
  static fromDatabase(data) {
    return new User({
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone || '',
      role: data.role || User.ROLES.CUSTOMER,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
