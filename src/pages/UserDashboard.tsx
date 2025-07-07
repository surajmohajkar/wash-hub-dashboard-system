
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Calendar, MapPin, Clock, Star, Plus, Settings, LogOut } from 'lucide-react';
import { useUserBookings, useUserStats, usePlans, useCreateBooking } from '@/hooks/useApi';
import { Booking, Plan } from '@/types/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { data: userBookings, isLoading: bookingsLoading } = useUserBookings(user?.id || '', 1, 10);
  const { data: userStats } = useUserStats(user?.id || '');
  const { data: plansData } = usePlans();
  const createBookingMutation = useCreateBooking();

  const bookings = userBookings?.data || [];
  const stats = userStats?.data || {
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    upcomingBookings: 0
  };
  const plans = plansData?.data || [];

  const activeBookings = bookings.filter(booking => 
    ['pending', 'confirmed', 'in-progress'].includes(booking.status)
  );
  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed'
  );

  const handleQuickBook = async (plan: Plan) => {
    if (!user) return;

    const bookingData = {
      userId: user.id,
      planId: plan.id,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:00',
      location: {
        address: '123 Main St', // This would come from user input in a real app
      },
      totalAmount: plan.price,
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
    };

    try {
      await createBookingMutation.mutateAsync(bookingData);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">WashPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">${stats.totalSpent}</p>
                <p className="text-gray-600">Total Spent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.upcomingBookings}</p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Quick Book</span>
              </CardTitle>
              <CardDescription>Book your next car wash service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Button
                    key={plan.id}
                    className="h-20 flex-col space-y-2"
                    variant={plan.name === 'Basic Wash' ? 'default' : 'outline'}
                    onClick={() => handleQuickBook(plan)}
                    disabled={createBookingMutation.isPending}
                  >
                    <Car className="h-6 w-6" />
                    <span>{plan.name} - ${plan.price}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Active Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBookings.length > 0 ? (
                  activeBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{booking.plan?.name || 'Service'}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location.address}</span>
                        </div>
                        {booking.washer && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Washer: {booking.washer.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold text-primary">${booking.totalAmount}</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" variant="destructive">Cancel</Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No active bookings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{booking.plan?.name || 'Service'}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Date: {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        {booking.washer && <p>Washer: {booking.washer.name}</p>}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold text-primary">${booking.totalAmount}</span>
                        <Button size="sm" variant="outline">Book Again</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No completed bookings yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
