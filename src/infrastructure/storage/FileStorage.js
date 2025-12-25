import { supabaseClient } from '../database/SupabaseClient.js';

/**
 * File Storage Service
 * Handles file uploads to Supabase Storage
 */
export class FileStorage {
  /**
   * Upload file to storage
   * @param {File} file - File to upload
   * @param {string} bucket - Storage bucket name ('categories' or 'products')
   * @returns {Promise<string|null>} Public URL or null on failure
   */
  static async uploadFile(file, bucket) {
    try {
      const supabase = supabaseClient.getClient();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Validate bucket
      const validBuckets = ['categories', 'products'];
      if (!validBuckets.includes(bucket)) {
        throw new Error(`Invalid bucket: ${bucket}. Must be one of: ${validBuckets.join(', ')}`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log(`Uploading file to ${bucket}/${filePath}...`);

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  }

  /**
   * Get public URL for a file
   * @param {string} bucket - Storage bucket name
   * @param {string} filePath - Path to file in bucket
   * @returns {string} Public URL
   */
  static getPublicUrl(bucket, filePath) {
    const supabase = supabaseClient.getClient();
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Delete file from storage
   * @param {string} bucket - Storage bucket name
   * @param {string} filePath - Path to file in bucket
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteFile(bucket, filePath) {
    try {
      const supabase = supabaseClient.getClient();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('File deletion failed:', error);
      return { success: false, error: error.message };
    }
  }
}
