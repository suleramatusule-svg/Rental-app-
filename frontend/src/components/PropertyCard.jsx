import React from 'react';
import { MapPin, Bed, Bath, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-semibold text-slate-800">
                    ${property.prices[12].toLocaleString()}/mo
                    <span className="text-xs font-normal text-slate-500 block text-right">12 mo</span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">{property.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                </div>

                <div className="flex items-center justify-between text-slate-600 text-sm border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {property.bathrooms}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                        <Link to={`/property/${property.id}`} className="flex items-center">
                            Details
                        </Link>
                    </div>
                </div>

                <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">3 Mo</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">6 Mo</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">12 Mo</span>
                </div>
            </div>
        </div>
    );
}
