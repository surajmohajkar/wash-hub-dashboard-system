
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Car, DollarSign, TrendingUp, Settings, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [systemStats] = useState({
    totalUsers: 1247,
    activeWashers: 89,
    todayBookings: 156,
    monthlyRevenue: 25460
  });

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'booking',
      message: 'New booking created by John Doe',
      time: '2 minutes ago',
      status: 'info'
    },
    {
      id: '2',
      type: 'washer',
      message: 'Washer Mike Johnson completed a job',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment failed for booking #1234',
      time: '10 minutes ago',
      status: 'error'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Car className="h-4 w-4" />;
      case 'washer': return <Users className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
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
              <span className="text-2xl font-bold text-gray-900">WashPro Admin</span>
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{systemStats.activeWashers}</p>
                  <p className="text-gray-600">Active Washers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{systemStats.todayBookings}</p>
                  <p className="text-gray-600">Today's Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">${systemStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-gray-600">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>System activity in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className={`mt-0.5 ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Management Tools</CardTitle>
              <CardDescription>Quick access to admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Car className="h-6 w-6" />
                  <span>Manage Washers</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <CheckCircle className="h-6 w-6" />
                  <span>View Bookings</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Financial Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
                <p className="text-gray-600">Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">150ms</div>
                <p className="text-gray-600">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">2.3k</div>
                <p className="text-gray-600">API Calls/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
