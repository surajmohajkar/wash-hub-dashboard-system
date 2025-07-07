
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useWasherStats, useWasherBookings, useUpdateBooking } from '@/hooks/useApi';
import { Car, MapPin, Clock, DollarSign, Calendar, Settings, LogOut, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const WasherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch washer data using React Query
  const { data: stats, isLoading: statsLoading } = useWasherStats(user?.id || '');
  const { data: bookingsData, isLoading: bookingsLoading } = useWasherBookings(user?.id || '', 1, 50);
  const updateBookingMutation = useUpdateBooking();

  // Filter bookings by status
  const todayBookings = bookingsData?.data?.filter(booking => {
    const bookingDate = new Date(booking.scheduledDate);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }) || [];

  const upcomingBookings = bookingsData?.data?.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  ) || [];

  const completedBookings = bookingsData?.data?.filter(booking => 
    booking.status === 'completed'
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartJob = async (bookingId: string) => {
    try {
      await updateBookingMutation.mutateAsync({
        id: bookingId,
        bookingData: { status: 'in-progress' }
      });
    } catch (error) {
      console.error('Failed to start job:', error);
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    try {
      await updateBookingMutation.mutateAsync({
        id: bookingId,
        bookingData: { status: 'completed' }
      });
    } catch (error) {
      console.error('Failed to complete job:', error);
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">WashPro Washer</span>
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
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats?.data?.totalJobs || 0}</p>
                  <p className="text-gray-600">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${stats?.data?.totalEarnings || 0}</p>
                  <p className="text-gray-600">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats?.data?.averageRating?.toFixed(1) || '0.0'}</p>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats?.data?.completedJobs || 0}</p>
                  <p className="text-gray-600">Completed Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="today">Today's Jobs</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Today's Jobs Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Today's Schedule</span>
                  </CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayBookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No jobs scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{booking.user?.name || 'Customer'}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p className="font-medium">{booking.plan?.name || 'Service'}</p>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.scheduledTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.location.address}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-primary">${booking.totalAmount}</span>
                            <div className="space-x-2">
                              {booking.status === 'confirmed' && (
                                <Button size="sm" onClick={() => handleStartJob(booking.id)}>
                                  Start Job
                                </Button>
                              )}
                              {booking.status === 'in-progress' && (
                                <Button size="sm" className="bg-green-600" onClick={() => handleCompleteJob(booking.id)}>
                                  Complete Job
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance</span>
                  </CardTitle>
                  <CardDescription>Your recent performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>This Week's Jobs</span>
                      <span className="font-semibold">{upcomingBookings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-semibold">
                        {stats?.data?.totalJobs ? Math.round((stats.data.completedJobs / stats.data.totalJobs) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-semibold flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {stats?.data?.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Today's Jobs Tab */}
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today's Jobs</CardTitle>
                <CardDescription>All your scheduled appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                {todayBookings.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No jobs scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{booking.user?.name || 'Customer'}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium">{booking.plan?.name || 'Service'}</p>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.scheduledTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.location.address}</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Amount:</span> ${booking.totalAmount}</p>
                            <p><span className="font-medium">Payment:</span> {booking.paymentStatus}</p>
                            {booking.notes && <p><span className="font-medium">Notes:</span> {booking.notes}</p>}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          {booking.status === 'confirmed' && (
                            <Button size="sm" onClick={() => handleStartJob(booking.id)}>
                              Start Job
                            </Button>
                          )}
                          {booking.status === 'in-progress' && (
                            <Button size="sm" className="bg-green-600" onClick={() => handleCompleteJob(booking.id)}>
                              Complete Job
                            </Button>
                          )}
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Jobs Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Jobs</CardTitle>
                <CardDescription>Your confirmed and pending appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user?.name || 'Customer'}</TableCell>
                        <TableCell>{booking.plan?.name || 'Service'}</TableCell>
                        <TableCell>
                          {format(new Date(booking.scheduledDate), 'MMM dd, yyyy')} at {booking.scheduledTime}
                        </TableCell>
                        <TableCell>{booking.location.address}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Job History</CardTitle>
                <CardDescription>Your completed and cancelled jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user?.name || 'Customer'}</TableCell>
                        <TableCell>{booking.plan?.name || 'Service'}</TableCell>
                        <TableCell>{format(new Date(booking.scheduledDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WasherDashboard;
