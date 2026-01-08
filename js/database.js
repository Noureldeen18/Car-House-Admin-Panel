/* ========================================== */
/* DATABASE SERVICE - UPDATED FOR NEW SCHEMA */
/* ========================================== */
console.log('js/database.js loading...');

/**
 * Database service for all CRUD operations with new schema
 */
const DatabaseService = {
  /* ========================================== */
  /* FILE UPLOAD */
  /* ========================================== */

  /**
   * Upload a file to Supabase Storage
   * @param {File} file - The file object to upload
   * @param {string} bucket - 'categories' or 'products'
   * @returns {Promise<string|null>} Public URL of the uploaded file
   */
  async uploadFile(file, bucket) {
    try {
      if (!file) return null;

      // Create a unique file name
      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Determine content type based on file extension
      const contentTypes = {
        svg: "image/svg+xml",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
      };
      const contentType =
        contentTypes[fileExt] || file.type || "application/octet-stream";

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: contentType,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error);
      throw error;
    }
  },

  /**
   * Get public URL for a file in storage
   * @param {string} bucket - 'categories' or 'products'
   * @param {string} filePath - Path to the file in the bucket
   * @returns {string} Public URL
   */
  getPublicUrl(bucket, filePath) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
  },

  /* ========================================== */
  /* CATEGORIES */
  /* ========================================== */

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([category])
        .select()
        .single();

      if (error) throw error;

      // Log action
      await AuthService.logAction("create", "category", data.id, {
        name: category.name,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error creating category:", error);
      return { success: false, error: error.message };
    }
  },

  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update", "category", id, updates);

      return { success: true, data };
    } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteCategory(id) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      await AuthService.logAction("delete", "category", id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* PRODUCTS */
  /* ========================================== */

  async getProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(id, name, slug, icon),
          images:product_images(id, url, alt, position),
          inventory:inventory(quantity, reserved, store:stores(name))
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map to include total_stock
      return data.map(product => ({
        ...product,
        total_stock: product.inventory?.reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async createProduct(product) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("create", "product", data.id, {
        title: product.title,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, error: error.message };
    }
  },

  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update", "product", id, updates);

      return { success: true, data };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      await AuthService.logAction("delete", "product", id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* PRODUCT IMAGES */
  /* ========================================== */

  async addProductImage(productId, imageData) {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .insert([{ product_id: productId, ...imageData }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error adding product image:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* INVENTORY */
  /* ========================================== */

  async updateInventory(productId, storeId, quantity) {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .upsert({
          product_id: productId,
          store_id: storeId,
          quantity,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update_inventory", "product", productId, {
        storeId,
        quantity,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error updating inventory:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* PROFILES (USERS) */
  /* ========================================== */

  async getProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Check which users are admins
      const { data: admins } = await supabase
        .from("admins")
        .select("user_id, role");

      const adminMap = new Map(admins?.map((a) => [a.user_id, a.role]) || []);

      return data.map((profile) => ({
        ...profile,
        isAdmin: adminMap.has(profile.id),
        adminRole: adminMap.get(profile.id) || null,
      }));
    } catch (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }
  },

  async updateProfile(id, updates) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update", "profile", id, updates);

      return { success: true, data };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* USERS (BACKWARD COMPATIBILITY WRAPPERS) */
  /* ========================================== */

  /**
   * Get all users (wrapper for getProfiles)
   * @returns {Promise<Array>} List of users
   */
  async getUsers() {
    return await this.getProfiles();
  },

  /**
   * Update user (wrapper for updateProfile)
   * @param {string} id - User ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Result
   */
  async updateUser(id, updates) {
    return await this.updateProfile(id, updates);
  },

  /* ========================================== */
  /* ADMINS */
  /* ========================================== */

  async addAdmin(userId, role, meta = {}) {
    try {
      const { data, error } = await supabase
        .from("admins")
        .insert([{ user_id: userId, role, meta }])
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("add_admin", "admin", data.id, {
        userId,
        role,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error adding admin:", error);
      return { success: false, error: error.message };
    }
  },

  async removeAdmin(userId) {
    try {
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      await AuthService.logAction("remove_admin", "admin", userId);

      return { success: true };
    } catch (error) {
      console.error("Error removing admin:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* ORDERS */
  /* ========================================== */

  async getOrders() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          profile:profiles(id, email, full_name, phone),
          items:order_items(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update_status", "order", id, { status });

      return { success: true, data };
    } catch (error) {
      console.error("Error updating order:", error);
      return { success: false, error: error.message };
    }
  },

  async createOrder(orderData) {
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: orderData.user_id,
            total_amount: orderData.total_amount,
            status: "pending",
            shipping_address: orderData.shipping_address,
            billing_address: orderData.billing_address,
            payment_meta: orderData.payment_meta,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const items = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        sku: item.sku,
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
        subtotal: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(items);

      if (itemsError) throw itemsError;

      await AuthService.logAction("create", "order", order.id, {
        total: orderData.total_amount,
      });

      return { success: true, data: order };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteOrder(id) {
    try {
      // First delete order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", id);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await AuthService.logAction("delete", "order", id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* REVIEWS */
  /* ========================================== */

  async getReviews(productId = null) {
    try {
      let query = supabase
        .from("reviews")
        .select(
          `
          *,
          profile:profiles(full_name, avatar_url),
          product:products(title)
        `
        )
        .order("created_at", { ascending: false });

      if (productId) {
        query = query.eq("product_id", productId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  async toggleReviewVisibility(id, isVisible) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({ is_visible: isVisible })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("toggle_visibility", "review", id, {
        isVisible,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error toggling review:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* COUPONS */
  /* ========================================== */

  async getCoupons() {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching coupons:", error);
      return [];
    }
  },

  async createCoupon(coupon) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .insert([coupon])
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("create", "coupon", data.id, {
        code: coupon.code,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error creating coupon:", error);
      return { success: false, error: error.message };
    }
  },

  async toggleCoupon(id, isActive) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("toggle", "coupon", id, { isActive });

      return { success: true, data };
    } catch (error) {
      console.error("Error toggling coupon:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* AUDIT LOGS */
  /* ========================================== */

  async getAuditLogs(limit = 100) {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(
          `
          *,
          profile:profiles(full_name, email)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }
  },

  /* ========================================== */
  /* SERVICE TYPES */
  /* ========================================== */

  async getServiceTypes(activeOnly = false) {
    try {
      let query = supabase
        .from('service_types')
        .select('*')
        .order('position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching service types:', error);
      return [];
    }
  },

  async createServiceType(serviceType) {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .insert([serviceType])
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction('create', 'service_type', data.id, { name: serviceType.name });

      return { success: true, data };
    } catch (error) {
      console.error('Error creating service type:', error);
      return { success: false, error: error.message };
    }
  },

  async updateServiceType(id, updates) {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction('update', 'service_type', id, updates);

      return { success: true, data };
    } catch (error) {
      console.error('Error updating service type:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteServiceType(id) {
    try {
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await AuthService.logAction('delete', 'service_type', id);

      return { success: true };
    } catch (error) {
      console.error('Error deleting service type:', error);
      return { success: false, error: error.message };
    }
  },

  async toggleServiceTypeActive(id, isActive) {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction('toggle_active', 'service_type', id, { isActive });

      return { success: true, data };
    } catch (error) {
      console.error('Error toggling service type:', error);
      return { success: false, error: error.message };
    }
  },

  async getServiceTypeProducts(serviceTypeId) {
    try {
      const { data, error } = await supabase
        .from('service_type_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('service_type_id', serviceTypeId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching service products:', error);
      return [];
    }
  },

  async addServiceTypeProduct(serviceTypeId, productId, quantity = 1) {
    try {
      const { data, error } = await supabase
        .from('service_type_products')
        .upsert({
          service_type_id: serviceTypeId,
          product_id: productId,
          quantity
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding service product:', error);
      return { success: false, error: error.message };
    }
  },

  async removeServiceTypeProduct(serviceTypeId, productId) {
    try {
      const { error } = await supabase
        .from('service_type_products')
        .delete()
        .match({ service_type_id: serviceTypeId, product_id: productId });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error removing service product:', error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* WORKSHOP BOOKINGS */
  /* ========================================== */

  async getBookings() {
    try {
      const { data, error } = await supabase
        .from("workshop_bookings")
        .select(
          `
                    *,
                    profile:profiles(id, email, full_name, phone),
                    service_type_details:service_types(base_price)
                `
        )
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  },

  async createBooking(booking) {
    try {
      const { data, error } = await supabase
        .from("workshop_bookings")
        .insert([booking])
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("create", "workshop_booking", data.id, {
        service_type: booking.service_type,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, error: error.message };
    }
  },

  async updateBooking(id, updates) {
    try {
      const { data, error } = await supabase
        .from("workshop_bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update", "workshop_booking", id, updates);

      return { success: true, data };
    } catch (error) {
      console.error("Error updating booking:", error);
      return { success: false, error: error.message };
    }
  },

  async updateBookingStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from("workshop_bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await AuthService.logAction("update_status", "workshop_booking", id, {
        status,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error updating booking status:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteBooking(id) {
    try {
      const { error } = await supabase
        .from("workshop_bookings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await AuthService.logAction("delete", "workshop_booking", id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { success: false, error: error.message };
    }
  },

  /* ========================================== */
  /* STATISTICS */
  /* ========================================== */

  async getStatistics() {
    try {
      const [
        { count: productCount },
        { count: categoryCount },
        { data: orderData },
        { count: userCount },
        { data: reviewData },
        { data: bookingData }
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount, status"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("rating"),
        supabase.from("workshop_bookings").select("status")
      ]);

      const totalRevenue = (orderData || []).reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );

      const pendingOrders = (orderData || []).filter((o) => o.status === "pending").length;
      const pendingBookings = (bookingData || []).filter(
        (b) => b.status === "scheduled" || b.status === "pending"
      ).length;

      const avgRating = (reviewData || []).length > 0
        ? reviewData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewData.length
        : 0;

      return {
        totalProducts: productCount || 0,
        totalCategories: categoryCount || 0,
        totalOrders: (orderData || []).length,
        totalUsers: userCount || 0,
        totalRevenue,
        pendingOrders,
        totalReviews: (reviewData || []).length,
        averageRating: avgRating.toFixed(1),
        totalBookings: (bookingData || []).length,
        pendingBookings,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalReviews: 0,
        averageRating: 0,
        totalBookings: 0,
        pendingBookings: 0,
      };
    }
  },
};
