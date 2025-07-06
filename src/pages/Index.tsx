
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Droplets, Clock, Star, Shield, Users } from 'lucide-react';

const Index = () => {
  const services = [
    {
      title: 'Basic Wash',
      description: 'Exterior wash with soap and rinse',
      price: '$15',
      duration: '30 min',
      icon: Car
    },
    {
      title: 'Premium Wash',
      description: 'Exterior + interior cleaning',
      price: '$25',
      duration: '45 min',
      icon: Droplets
    },
    {
      title: 'Deluxe Detail',
      description: 'Complete car detailing service',
      price: '$45',
      duration: '90 min',
      icon: Star
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'On-Demand Service',
      description: 'Book a wash anytime, anywhere'
    },
    {
      icon: Users,
      title: 'Professional Washers',
      description: 'Trained and verified professionals'
    },
    {
      icon: Shield,
      title: 'Insured & Secure',
      description: 'Fully insured service guarantee'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">WashPro</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            On-Demand Car Wash
            <span className="text-primary block">At Your Doorstep</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional car washing services delivered to your location. 
            Book instantly and get your car sparkling clean without leaving home.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="px-8">Book Now</Button>
            </Link>
            <Link to="/washer-signup">
              <Button size="lg" variant="outline" className="px-8">Join as Washer</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Choose the perfect wash for your vehicle</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{service.price}</div>
                  <div className="text-sm text-gray-500 mb-4">{service.duration}</div>
                  <Button className="w-full">Select Service</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose WashPro?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust WashPro for their car care needs.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8">
              Book Your First Wash
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6" />
              <span className="text-lg font-semibold">WashPro</span>
            </div>
            <p className="text-gray-400">© 2024 WashPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
