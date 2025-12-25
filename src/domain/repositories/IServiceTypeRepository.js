/**
 * ServiceType Repository Interface
 * Defines the contract for service type data access
 */
export class IServiceTypeRepository {
  /**
   * Get all service types
   * @returns {Promise<ServiceType[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get service type by ID
   * @param {string} id
   * @returns {Promise<ServiceType|null>}
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new service type
   * @param {ServiceType} serviceType
   * @returns {Promise<{success: boolean, data?: ServiceType, error?: string}>}
   */
  async create(serviceType) {
    throw new Error('Method not implemented');
  }

  /**
   * Update existing service type
   * @param {string} id
   * @param {ServiceType} serviceType
   * @returns {Promise<{success: boolean, data?: ServiceType, error?: string}>}
   */
  async update(id, serviceType) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete service type
   * @param {string} id
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Toggle service type active status
   * @param {string} id
   * @param {boolean} isActive
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async toggleActive(id, isActive) {
    throw new Error('Method not implemented');
  }
}
