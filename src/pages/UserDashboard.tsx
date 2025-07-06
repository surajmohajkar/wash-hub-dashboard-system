
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Calendar, MapPin, Clock, Star, Plus, Settings, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeBookings] = useState([
    {
      id: '1',
      service: 'Premium Wash',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      washer: 'Mike Johnson',
      location: '123 Main St',
      price: '$25'
    },
    {
      id: '2',
      service: 'Basic Wash',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'pending',
      washer: 'Sarah Wilson',
      location: '456 Oak Ave',
      price: '$15'
    }
  ]);

  const [pastBookings] = useState([
    {
      id: '3',
      service: 'Deluxe Detail',
      date: '2024-01-10',
      washer: 'John Smith',
      rating: 5,
      price: '$45'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Button className="h-20 flex-col space-y-2">
                  <Car className="h-6 w-6" />
                  <span>Basic Wash - $15</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Car className="h-6 w-6" />
                  <span>Premium Wash - $25</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Star className="h-6 w-6" />
                  <span>Deluxe Detail - $45</span>
                </Button>
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
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{booking.service}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date} at {booking.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Washer: {booking.washer}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-semibold text-primary">{booking.price}</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="destructive">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{booking.service}</h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(booking.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Date: {booking.date}</p>
                      <p>Washer: {booking.washer}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-semibold text-primary">{booking.price}</span>
                      <Button size="sm" variant="outline">Book Again</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
