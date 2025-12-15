import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Search, Shield, Home } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="bg-accent text-white px-2 rounded">U</span> Uniconnect
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-6 py-2 text-slate-600 hover:text-primary font-medium transition-colors">Log In</Link>
                    <Link to="/signup" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        Long-Term Rentals,<br />
                        <span className="text-accent">Simplified.</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 max-w-lg">
                        Say goodbye to 12-month rigid leases. Find flexible homes for 3, 6, or 12 months with Uniconnect. Secure, transparent, and easy.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/signup" className="flex items-center gap-2 px-8 py-4 bg-accent hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="mt-8 flex gap-6 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Verified Listings</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Secure Payments</span>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"
                        alt="Modern Apartment"
                        className="relative z-10 w-full rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-50 py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Why Choose Uniconnect?</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-accent rounded-lg flex items-center justify-center mb-6">
                                <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Search</h3>
                            <p className="text-slate-600">Filter by lease duration, amenities, and location to find exactly what you need in seconds.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-accent rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Verified Owners</h3>
                            <p className="text-slate-600">Every property owner is vetted to ensure your safety and preventing rental scams.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-accent rounded-lg flex items-center justify-center mb-6">
                                <Home className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Flexible Terms</h3>
                            <p className="text-slate-600">Choose from 3, 6, or 12 month leases. Perfect for digital nomads, students, and relocators.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
