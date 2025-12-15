import React from 'react';
import { propertyService } from '../api/propertyService';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="w-full bg-primary text-white py-2 rounded">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export const SignupPage = () => {
    const [formData, setFormData] = React.useState({ email: '', password: '', firstName: '', lastName: '' });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors
        try {
            // Split name into first/last for backend if needed, or just send as is
            // API expects email, password. Additional fields might need adjustment based on user model
            await propertyService.registerUser({
                email: formData.email,
                password: formData.password,
                // first_name: formData.firstName, // Uncomment if supported by backend
                // last_name: formData.lastName   // Uncomment if supported by backend
            });
            window.location.href = '/login'; // Redirect on success
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border rounded"
                        onChange={e => setFormData({ ...formData, firstName: e.target.value.split(' ')[0], lastName: e.target.value.split(' ')[1] || '' })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button disabled={loading} className="w-full bg-accent text-white py-2 rounded">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    )
};

// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { useEffect, useState } from 'react';

export const DashboardPage = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState('profile');
    const [myPlaces, setMyPlaces] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            setLoadingData(true);
            try {
                // Fetch user's places (Requires an endpoint or filtering /places)
                // Since our API analysis didn't show a direct /users/:id/places, 
                // we might need to fetch all places and filter client side or use a search endpoint if available.
                // For efficiency/demo, let's assume we filter the /places_search endpoint
                const placesResp = await fetch(`${API_BASE_URL}/places_search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}) // Get all
                });
                if (placesResp.ok) {
                    const allPlaces = await placesResp.json();
                    // Filter where user_id matches current user.id
                    setMyPlaces(allPlaces.filter(p => p.user_id === user.id));
                }

                // Fetch reviews (Similar logic, or if user object has reviews relationship populated)
                // The dashboard endpoint already returned 'all' which is the user object.
                // Let's check if 'reviews' are nested in the user object from the context
                if (user.reviews) {
                    setMyReviews(user.reviews);
                }
            } catch (e) {
                console.error("Dashboard fetch error", e);
            } finally {
                setLoadingData(false);
            }
        };
        fetchUserData();
    }, [user, token]);

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">User Dashboard</h1>
                <button onClick={() => { logout(); navigate('/'); }} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded transition-colors">
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${activeTab === 'listings' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${activeTab === 'reviews' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Reviews
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    {activeTab === 'profile' && user && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <label className="text-sm text-slate-500 block">First Name</label>
                                        <span className="font-semibold">{user.first_name || 'N/A'}</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <label className="text-sm text-slate-500 block">Last Name</label>
                                        <span className="font-semibold">{user.last_name || 'N/A'}</span>
                                    </div>
                                    <div className="col-span-2 p-4 bg-slate-50 rounded-lg">
                                        <label className="text-sm text-slate-500 block">Email Address</label>
                                        <span className="font-semibold">{user.email}</span>
                                    </div>
                                    <div className="col-span-2 p-4 bg-slate-50 rounded-lg">
                                        <label className="text-sm text-slate-500 block">User ID</label>
                                        <span className="font-mono text-xs">{user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">My Properties ({myPlaces.length})</h2>
                                <button onClick={() => navigate('/list-property')} className="text-sm bg-accent text-white px-3 py-1.5 rounded hover:bg-blue-600">
                                    + Add New
                                </button>
                            </div>
                            {loadingData ? <p>Loading...</p> : (
                                <div className="space-y-4">
                                    {myPlaces.length > 0 ? myPlaces.map(place => (
                                        <div key={place.id} className="border p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold">{place.name}</h3>
                                                <p className="text-sm text-slate-500">{place.city_id} - ${place.price_by_month}/mo</p>
                                            </div>
                                            <button onClick={() => navigate(`/property/${place.id}`)} className="text-accent text-sm hover:underline">View</button>
                                        </div>
                                    )) : <p className="text-slate-500">You haven't listed any properties yet.</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
                            {user?.reviews && user.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {user.reviews.map((rev, i) => (
                                        <div key={i} className="bg-slate-50 p-4 rounded-lg">
                                            <p className="italic text-slate-600">"{rev.text}"</p>
                                            <div className="mt-2 text-xs text-slate-400">Rating: {rev.rating || 'N/A'}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-slate-500">You haven't written any reviews yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export const ListPropertyPage = () => (
    <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">List Your Property</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">1. Property Details</h2>
            <div className="space-y-4">
                <input type="text" placeholder="Property Title" className="w-full p-2 border rounded" />
                <input type="text" placeholder="Address" className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Beds" className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Baths" className="w-full p-2 border rounded" />
                </div>
                <button className="w-full bg-primary text-white py-2 rounded mt-4">Next Step</button>
            </div>
        </div>
    </div>
);
