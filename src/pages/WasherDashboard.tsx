
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Car, MapPin, Clock, DollarSign, Calendar, Settings, LogOut, CheckCircle } from 'lucide-react';

const WasherDashboard = () => {
  const { user, logout } = useAuth();
  const [todayJobs] = useState([
    {
      id: '1',
      customer: 'John Doe',
      service: 'Premium Wash',
      time: '10:00 AM',
      location: '123 Main St',
      price: '$25',
      status: 'upcoming'
    },
    {
      id: '2',
      customer: 'Jane Smith',
      service: 'Basic Wash',
      time: '2:00 PM',
      location: '456 Oak Ave',
      price: '$15',
      status: 'in-progress'
    }
  ]);

  const [weeklyStats] = useState({
    totalJobs: 24,
    earnings: 540,
    rating: 4.8,
    completionRate: 96
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
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
                  <p className="text-2xl font-bold">{weeklyStats.totalJobs}</p>
                  <p className="text-gray-600">Jobs This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${weeklyStats.earnings}</p>
                  <p className="text-gray-600">Weekly Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{weeklyStats.rating}</p>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{weeklyStats.completionRate}%</p>
                  <p className="text-gray-600">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Jobs</span>
              </CardTitle>
              <CardDescription>Your scheduled appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{job.customer}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p className="font-medium">{job.service}</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">{job.price}</span>
                      <div className="space-x-2">
                        {job.status === 'upcoming' && (
                          <Button size="sm">Start Job</Button>
                        )}
                        {job.status === 'in-progress' && (
                          <Button size="sm" className="bg-green-600">Complete Job</Button>
                        )}
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Available Jobs</span>
              </CardTitle>
              <CardDescription>New job requests in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No new jobs available</p>
                    <p className="text-sm">Check back later for new opportunities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-16 flex-col space-y-2">
                <Clock className="h-6 w-6" />
                <span>Set Availability</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <MapPin className="h-6 w-6" />
                <span>Update Location</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <DollarSign className="h-6 w-6" />
                <span>View Earnings</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Profile Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasherDashboard;
