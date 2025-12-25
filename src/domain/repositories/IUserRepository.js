/**
 * User Repository Interface
 * Defines the contract for user/profile data access
 */
export class IUserRepository {
  /**
   * Get all users
   * @returns {Promise<User[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get user by ID
   * @param {string} id
   * @returns {Promise<User|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Update user
   * @param {string} id
   * @param {User} user
   * @returns {Promise<{success: boolean, data?: User, error?: string}>}
   */
  async update(id, user) {
    throw new Error('Method not implemented');
  }
}
