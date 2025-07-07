
import { 
  User, 
  Washer, 
  Plan, 
  Booking, 
  Payment, 
  Notification, 
  Feedback,
  ApiResponse,
  PaginatedResponse 
} from '@/types/api';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User API
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Washer API
  async getWashers(page = 1, limit = 10): Promise<PaginatedResponse<Washer>> {
    return this.request(`/washers?page=${page}&limit=${limit}`);
  }

  async getWasherById(id: string): Promise<ApiResponse<Washer>> {
    return this.request(`/washers/${id}`);
  }

  async updateWasher(id: string, washerData: Partial<Washer>): Promise<ApiResponse<Washer>> {
    return this.request(`/washers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(washerData),
    });
  }

  async deleteWasher(id: string): Promise<ApiResponse<void>> {
    return this.request(`/washers/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailableWashers(): Promise<ApiResponse<Washer[]>> {
    return this.request('/washers/available');
  }

  // Plan API
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    return this.request('/plans');
  }

  async getPlanById(id: string): Promise<ApiResponse<Plan>> {
    return this.request(`/plans/${id}`);
  }

  async createPlan(planData: Partial<Plan>): Promise<ApiResponse<Plan>> {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(id: string, planData: Partial<Plan>): Promise<ApiResponse<Plan>> {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deletePlan(id: string): Promise<ApiResponse<void>> {
    return this.request(`/plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking API
  async getBookings(page = 1, limit = 10): Promise<PaginatedResponse<Booking>> {
    return this.request(`/bookings?page=${page}&limit=${limit}`);
  }

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async getUserBookings(userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Booking>> {
    return this.request(`/users/${userId}/bookings?page=${page}&limit=${limit}`);
  }

  async getWasherBookings(washerId: string, page = 1, limit = 10): Promise<PaginatedResponse<Booking>> {
    return this.request(`/washers/${washerId}/bookings?page=${page}&limit=${limit}`);
  }

  // Payment API
  async getPayments(page = 1, limit = 10): Promise<PaginatedResponse<Payment>> {
    return this.request(`/payments?page=${page}&limit=${limit}`);
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return this.request(`/payments/${id}`);
  }

  async createPayment(paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id: string, paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.request(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  // Notification API
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.request(`/users/${userId}/notifications`);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<Notification>> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async createNotification(notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Feedback API
  async getFeedback(page = 1, limit = 10): Promise<PaginatedResponse<Feedback>> {
    return this.request(`/feedback?page=${page}&limit=${limit}`);
  }

  async createFeedback(feedbackData: Partial<Feedback>): Promise<ApiResponse<Feedback>> {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getWasherFeedback(washerId: string): Promise<ApiResponse<Feedback[]>> {
    return this.request(`/washers/${washerId}/feedback`);
  }

  // Dashboard Stats
  async getAdminStats(): Promise<ApiResponse<{
    totalUsers: number;
    totalWashers: number;
    totalBookings: number;
    totalRevenue: number;
    recentActivity: any[];
  }>> {
    return this.request('/admin/stats');
  }

  async getUserStats(userId: string): Promise<ApiResponse<{
    totalBookings: number;
    completedBookings: number;
    totalSpent: number;
    upcomingBookings: number;
  }>> {
    return this.request(`/users/${userId}/stats`);
  }

  async getWasherStats(washerId: string): Promise<ApiResponse<{
    totalJobs: number;
    completedJobs: number;
    totalEarnings: number;
    averageRating: number;
  }>> {
    return this.request(`/washers/${washerId}/stats`);
  }
}

export const apiService = new ApiService();
