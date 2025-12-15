import React, { useState, useEffect } from 'react';
import { Filter, Map, List, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../api/propertyService';

export default function SearchResultsPage() {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [filters, setFilters] = useState({
        price: 5000,
        type: 'Any',
        bedrooms: 'Any'
    });

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            const data = await propertyService.fetchProperties({
                maxPrice: filters.price,
                type: filters.type
            });
            setProperties(data);
            setIsLoading(false);
        };
        fetch();
    }, [filters]);

    return (
        <div className="min-h-screen bg-slate-50 pt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                                <Filter className="w-5 h-5 text-slate-400" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Max Price / mo</label>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="10000"
                                        step="100"
                                        value={filters.price}
                                        onChange={(e) => setFilters({ ...filters, price: parseInt(e.target.value) })}
                                        className="w-full accent-accent"
                                    />
                                    <div className="text-right text-sm text-slate-600">${filters.price.toLocaleString()}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Property Type</label>
                                    <select
                                        className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-accent"
                                        value={filters.type}
                                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    >
                                        <option value="Any">Any Type</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Condo">Condo</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bedrooms</label>
                                    <div className="flex gap-2">
                                        {['Any', '1', '2', '3+'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setFilters({ ...filters, bedrooms: opt })}
                                                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${filters.bedrooms === opt
                                                        ? 'bg-accent text-white border-accent'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-accent'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">
                                {properties.length} Results Found
                            </h1>

                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                {showMap ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                                {showMap ? "List View" : "Map View"}
                            </button>
                        </div>

                        {showMap ? (
                            <div className="bg-slate-200 rounded-xl h-[600px] flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                    <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Map View Placeholder</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {isLoading ? (
                                    <div className="col-span-full py-12 text-center text-slate-500">Loading properties...</div>
                                ) : (
                                    properties.map(p => (
                                        <PropertyCard key={p.id} property={p} />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
