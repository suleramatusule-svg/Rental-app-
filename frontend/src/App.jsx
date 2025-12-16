import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import ListPropertyPage from './pages/ListPropertyPage';
import { LoginPage, SignupPage } from './pages/Placeholders';

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
};

// Navigation Component (Separate to use auth hook)
const Navigation = () => {
    const { user, logout } = useAuth();
    if (!user) return null; // Hide nav on landing/login pages or make it different

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/home" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="bg-accent text-white px-2 rounded">U</span> Uniconnect
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    <Link to="/search" className="hover:text-primary transition-colors">Find a Home</Link>
                    <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <Link to="/list-property" className="hover:text-primary transition-colors">List Property</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/settings" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                            {user.profile_pic ? (
                                <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                                    {user.first_name ? user.first_name[0] : 'U'}
                                </div>
                            )}
                        </div>
                        <span className="hidden md:inline">{user.first_name ? user.first_name : 'Account'}</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Navigation />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />

                            {/* Protected Routes */}
                            <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
                            <Route path="/search" element={<RequireAuth><SearchResultsPage /></RequireAuth>} />
                            <Route path="/property/:id" element={<RequireAuth><PropertyDetailPage /></RequireAuth>} />
                            <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                            <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                            <Route path="/list-property" element={<RequireAuth><ListPropertyPage /></RequireAuth>} />
                        </Routes>
                    </main>
                    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
                        <div className="container mx-auto px-4 text-center text-slate-500">
                            <p>&copy; 2024 Uniconnect. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
