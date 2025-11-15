// src/components/Blog.jsx/blogApi.js
import { apiService } from '../../../services/apiservice';

export const blogApi = {
  // Get all blogs
  getAllBlogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/blog/get-all-blog${queryString ? `?${queryString}` : ''}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id) => {
    try {
      const response = await apiService.get(`/blog/get-blog/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  // Create a new blog (admin only)
  createBlog: async (blogData) => {
    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'featuredImage' && key !== 'bannerImage') {
          formData.append(key, blogData[key]);
        }
      });

      // Add files
      if (blogData.featuredImage) {
        formData.append('featuredImage', blogData.featuredImage);
      }
      if (blogData.bannerImage) {
        formData.append('bannerImage', blogData.bannerImage);
      }

      const response = await apiService.apiCall('/blog/create-blog', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Update blog (admin only)
  updateBlog: async (blogData) => {
    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'featuredImage' && key !== 'bannerImage') {
          formData.append(key, blogData[key]);
        }
      });

      // Add files
      if (blogData.featuredImage) {
        formData.append('featuredImage', blogData.featuredImage);
      }
      if (blogData.bannerImage) {
        formData.append('bannerImage', blogData.bannerImage);
      }

      const response = await apiService.apiCall('/blog/update-blog', {
        method: 'PUT',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        }
      });
      return response;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Delete blog (admin only)
  deleteBlog: async (id) => {
    try {
      const response = await apiService.delete(`/blog/delete-blog/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }
};

export default blogApi;