/**
 * Booking Entity
 * Represents a workshop booking/appointment in the domain
 */
export class Booking {
  static STATUS = {
    SCHEDULED: 'scheduled',
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };

  constructor({
    id = null,
    userId = null,
    serviceType,
    scheduledDate,
    vehicleMake = '',
    vehicleModel = '',
    vehicleYear = null,
    status = Booking.STATUS.SCHEDULED,
    notes = '',
    profile = null,
    service = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.userId = userId;
    this.serviceType = serviceType;
    this.scheduledDate = scheduledDate;
    this.vehicleMake = vehicleMake;
    this.vehicleModel = vehicleModel;
    this.vehicleYear = vehicleYear;
    this.status = status;
    this.notes = notes;
    this.profile = profile;
    this.service = service;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates the booking data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.serviceType || this.serviceType.trim() === '') {
      errors.push('Service type is required');
    }

    if (!this.scheduledDate) {
      errors.push('Scheduled date is required');
    }

    if (this.scheduledDate && new Date(this.scheduledDate) < new Date()) {
      errors.push('Scheduled date cannot be in the past');
    }

    if (!Object.values(Booking.STATUS).includes(this.status)) {
      errors.push('Invalid booking status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if booking can be cancelled
   * @returns {boolean}
   */
  canBeCancelled() {
    return this.status === Booking.STATUS.SCHEDULED || 
           this.status === Booking.STATUS.PENDING;
  }

  /**
   * Check if booking is upcoming
   * @returns {boolean}
   */
  isUpcoming() {
    return this.status === Booking.STATUS.SCHEDULED && 
           new Date(this.scheduledDate) > new Date();
  }

  /**
   * Get vehicle info as string
   * @returns {string}
   */
  getVehicleInfo() {
    const parts = [];
    if (this.vehicleMake) parts.push(this.vehicleMake);
    if (this.vehicleModel) parts.push(this.vehicleModel);
    if (this.vehicleYear) parts.push(this.vehicleYear);
    return parts.length > 0 ? parts.join(' ') : 'N/A';
  }

  /**
   * Convert to plain object for database
   * @returns {Object}
   */
  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      service_type: this.serviceType,
      scheduled_date: this.scheduledDate,
      vehicle_make: this.vehicleMake,
      vehicle_model: this.vehicleModel,
      vehicle_year: this.vehicleYear,
      status: this.status,
      notes: this.notes
    };
  }

  /**
   * Create Booking from database object
   * @param {Object} data - Database object
   * @returns {Booking}
   */
  static fromDatabase(data) {
    return new Booking({
      id: data.id,
      userId: data.user_id,
      serviceType: data.service_type,
      scheduledDate: data.scheduled_date,
      vehicleMake: data.vehicle_make || '',
      vehicleModel: data.vehicle_model || '',
      vehicleYear: data.vehicle_year,
      status: data.status,
      notes: data.notes || '',
      profile: data.profile,
      service: data.service,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }
}
