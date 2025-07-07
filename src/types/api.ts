
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'washer' | 'admin';
  avatar?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Washer extends User {
  role: 'washer';
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  services: string[];
  hourlyRate: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  washerId?: string;
  planId: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  washer?: Washer;
  plan?: Plan;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'cash' | 'digital_wallet';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  user?: User;
}

export interface Feedback {
  id: string;
  bookingId: string;
  userId: string;
  washerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  booking?: Booking;
  user?: User;
  washer?: Washer;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
