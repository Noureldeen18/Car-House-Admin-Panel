/**
 * Category Repository Interface
 * Defines the contract for category data access
 */
export class ICategoryRepository {
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get category by ID
   * @param {string} id
   * @returns {Promise<Category|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new category
   * @param {Category} category
   * @returns {Promise<{success: boolean, data?: Category, error?: string}>}
   */
  async create(category) {
    throw new Error('Method not implemented');
  }

  /**
   * Update existing category
   * @param {string} id
   * @param {Category} category
   * @returns {Promise<{success: boolean, data?: Category, error?: string}>}
   */
  async update(id, category) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete category
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}
