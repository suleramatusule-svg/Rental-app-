import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

const DashboardPage = () => {
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
                // Fetch user's places using the specific endpoint
                const placesResp = await fetch(`${API_BASE_URL}/users/${user.id}/places`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
                if (placesResp.ok) {
                    const myPlacesData = await placesResp.json();
                    setMyPlaces(myPlacesData);
                }

                // Reviews are nested in user object from context
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
                <div className="flex gap-4">
                    <button onClick={() => navigate('/settings')} className="bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded hover:bg-slate-50 transition-colors">
                        Settings
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded transition-colors">
                        Sign Out
                    </button>
                </div>
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
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold">My Profile</h2>
                                <button onClick={() => navigate('/settings')} className="text-sm text-primary hover:underline">Edit Profile</button>
                            </div>

                            <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 rounded-xl">
                                <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex-shrink-0">
                                    {user.profile_pic ? (
                                        <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl">
                                            {user.first_name ? user.first_name[0] : 'U'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{user.first_name} {user.last_name}</h3>
                                    <p className="text-slate-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <label className="text-sm text-slate-500 block mb-1">User ID</label>
                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{user.id}</span>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <label className="text-sm text-slate-500 block mb-1">Account Type</label>
                                    <span className="font-medium text-slate-800">Regular User</span>
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
                                        <div key={place.id} className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                                            <div>
                                                <h3 className="font-bold text-lg">{place.name}</h3>
                                                <p className="text-sm text-slate-500">{place.city_id} • ${place.price_by_month}/mo</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => navigate(`/property/${place.id}`)} className="text-slate-600 hover:text-primary text-sm font-medium">View</button>
                                                {/* Edit button placeholder */}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                            <p className="text-slate-500 mb-4">You haven't listed any properties yet.</p>
                                            <button onClick={() => navigate('/list-property')} className="text-primary font-medium hover:underline">Create your first listing</button>
                                        </div>
                                    )}
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
                                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < (rev.rating || 0) ? "text-yellow-500" : "text-gray-300"}>★</span>
                                                ))}
                                            </div>
                                            <p className="italic text-slate-600">"{rev.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-lg">
                                    <p className="text-slate-500">You haven't written any reviews yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default DashboardPage;
