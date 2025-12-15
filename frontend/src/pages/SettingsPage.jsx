import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

const SettingsPage = () => {
    const { user, setUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        profile_pic: '',
        password: '',
        confirm_password: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                profile_pic: user.profile_pic || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const updatePayload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                profile_pic: formData.profile_pic
            };

            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();

            // Update context with new user data immediately
            // Ensure we keep existing fields just in case backend response structure varies, 
            // but usually it returns the full object.
            setUser(updatedUser);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                password: '',
                confirm_password: ''
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Account Settings</h1>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                            {formData.profile_pic ? (
                                <img src={formData.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl">
                                    <span style={{ fontFamily: 'sans-serif' }}>👤</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Profile Picture URL
                            </label>
                            <input
                                type="url"
                                name="profile_pic"
                                value={formData.profile_pic}
                                onChange={handleChange}
                                placeholder="https://example.com/my-photo.jpg"
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-slate-500 mt-1">Paste a direct link to an image to set your avatar.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            {formData.password && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary text-white font-bold py-3 px-4 rounded hover:bg-primary-dark transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
