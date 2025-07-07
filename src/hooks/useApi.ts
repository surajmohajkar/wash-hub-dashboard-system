
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { User, Washer, Plan, Booking, Payment, Notification, Feedback } from '@/types/api';

// Query Keys
export const queryKeys = {
  users: ['users'],
  user: (id: string) => ['users', id],
  washers: ['washers'],
  washer: (id: string) => ['washers', id],
  plans: ['plans'],
  plan: (id: string) => ['plans', id],
  bookings: ['bookings'],
  booking: (id: string) => ['bookings', id],
  userBookings: (userId: string) => ['users', userId, 'bookings'],
  washerBookings: (washerId: string) => ['washers', washerId, 'bookings'],
  payments: ['payments'],
  payment: (id: string) => ['payments', id],
  notifications: (userId: string) => ['users', userId, 'notifications'],
  feedback: ['feedback'],
  washerFeedback: (washerId: string) => ['washers', washerId, 'feedback'],
  adminStats: ['admin', 'stats'],
  userStats: (userId: string) => ['users', userId, 'stats'],
  washerStats: (washerId: string) => ['washers', washerId, 'stats'],
};

// Custom hooks for Users
export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.users, page, limit],
    queryFn: () => apiService.getUsers(page, limit),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: Partial<User>) => apiService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      apiService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Custom hooks for Bookings
export const useBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.bookings, page, limit],
    queryFn: () => apiService.getBookings(page, limit),
  });
};

export const useUserBookings = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.userBookings(userId), page, limit],
    queryFn: () => apiService.getUserBookings(userId, page, limit),
    enabled: !!userId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (bookingData: Partial<Booking>) => apiService.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string; bookingData: Partial<Booking> }) =>
      apiService.updateBooking(id, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Custom hooks for Plans
export const usePlans = () => {
  return useQuery({
    queryKey: queryKeys.plans,
    queryFn: () => apiService.getPlans(),
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (planData: Partial<Plan>) => apiService.createPlan(planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
      toast({
        title: "Success",
        description: "Plan created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Custom hooks for Dashboard Stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: () => apiService.getAdminStats(),
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userStats(userId),
    queryFn: () => apiService.getUserStats(userId),
    enabled: !!userId,
  });
};

export const useWasherStats = (washerId: string) => {
  return useQuery({
    queryKey: queryKeys.washerStats(washerId),
    queryFn: () => apiService.getWasherStats(washerId),
    enabled: !!washerId,
  });
};
