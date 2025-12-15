import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../api/propertyService';

export default function HomePage() {
    const navigate = useNavigate();
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [searchParams, setSearchParams] = useState({
        location: '',
        date: '',
        duration: '6'
    });

    useEffect(() => {
        // Fetch featured properties
        const loadFeatured = async () => {
            const all = await propertyService.fetchProperties();
            setFeaturedProperties(all.filter(p => p.featured));
        };
        loadFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?location=${searchParams.location}&duration=${searchParams.duration}`);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-primary h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=1600&auto=format&fit=crop"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Find Your Perfect Long-Term Stay
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Flexible leases for 3, 6, or 12 months. Fully furnished homes ready for living.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-200 px-2">
                            <MapPin className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Where do you want to live?"
                                className="w-full p-2 outline-none text-slate-800 placeholder-slate-400"
                                value={searchParams.location}
                                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                            />
                        </div>

                        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-200 px-2">
                            <Calendar className="text-slate-400 mr-2" />
                            <input
                                type="date"
                                className="w-full p-2 outline-none text-slate-800"
                                value={searchParams.date}
                                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center border-b md:border-b-0 px-2 md:w-48">
                            <select
                                className="w-full p-2 outline-none text-slate-800 bg-transparent"
                                value={searchParams.duration}
                                onChange={(e) => setSearchParams({ ...searchParams, duration: e.target.value })}
                            >
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                            </select>
                        </div>

                        <button type="submit" className="bg-accent hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Featured Properties */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Featured Leases</h2>
                    <button onClick={() => navigate('/search')} className="text-accent font-semibold flex items-center hover:underline">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
}
