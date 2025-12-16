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
