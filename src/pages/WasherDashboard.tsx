
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWasherStats, useWasherBookings, useUpdateBooking } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Car, 
  Clock, 
  DollarSign, 
  Star, 
  MapPin, 
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const WasherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Fetch washer stats and bookings
  const { data: stats, isLoading: statsLoading } = useWasherStats(user?.id || '');
  const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useWasherBookings(user?.id || '', 1, 20);
  const updateBookingMutation = useUpdateBooking();

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateBookingMutation.mutateAsync({
        id: bookingId,
        bookingData: { status }
      });
      refetchBookings();
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'confirmed': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  if (statsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Washer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">WashPro</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating || 4.8}</div>
              <p className="text-xs text-muted-foreground">
                Based on {stats?.totalReviews || 0} reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeBookings || 0}</div>
              <p className="text-xs text-muted-foreground">
                Pending & confirmed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Manage your recent wash bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsData?.bookings?.map((booking: any) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <StatusIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.customerName || 'Customer'}</p>
                            <p className="text-sm text-gray-600">{booking.serviceName || 'Basic Wash'}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.address || 'Address not provided'}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.phone || 'Phone not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">${booking.amount || 25}</p>
                            <p className="text-sm text-gray-500">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                disabled={updateBookingMutation.isPending}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                disabled={updateBookingMutation.isPending}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                              disabled={updateBookingMutation.isPending}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {(!bookingsData?.bookings || bookingsData.bookings.length === 0) && (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No bookings found</p>
                      <p className="text-sm text-gray-400">Your bookings will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your confirmed appointments for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsData?.bookings?.filter((booking: any) => 
                    booking.status === 'confirmed' && 
                    new Date(booking.scheduledAt).toDateString() === new Date().toDateString()
                  ).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{new Date(booking.scheduledAt).toLocaleTimeString()}</p>
                          <p className="text-sm text-gray-600">{booking.customerName || 'Customer'}</p>
                          <p className="text-sm text-gray-500">{booking.serviceName || 'Basic Wash'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.amount || 25}</p>
                        <Badge className="bg-blue-100 text-blue-800">Today</Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Washer Profile</CardTitle>
                <CardDescription>
                  Your profile information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {user?.name?.charAt(0) || 'W'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{user?.name || 'Washer Name'}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500">Professional Car Washer</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Phone:</span> {user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Performance Stats</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Rating:</span> {stats?.averageRating || 4.8}/5.0</p>
                        <p><span className="font-medium">Total Jobs:</span> {stats?.totalBookings || 0}</p>
                        <p><span className="font-medium">Success Rate:</span> 98%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WasherDashboard;
