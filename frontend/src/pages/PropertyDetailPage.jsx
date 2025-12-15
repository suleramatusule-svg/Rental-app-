import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { propertyService } from '../api/propertyService';

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Parallel fetching property details and reviews
        const fetchData = async () => {
            try {
                setLoading(true);
                const [propData, reviewsData] = await Promise.all([
                    propertyService.getPropertyDetails(id),
                    propertyService.fetchReviews(id)
                ]);
                setProperty(propData);
                setReviews(reviewsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!property) return <div className="p-8 text-center text-red-500">Property not found</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-slate-900">{property.title}</h1>
            <img src={property.images[0]} alt={property.title} className="w-full h-96 object-cover rounded-xl mb-8 shadow-sm" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2 text-slate-800">Description</h2>
                    <p className="text-slate-600 mb-4">{property.description || `Beautiful ${property.type} located in ${property.location}.`}</p>

                    <div className="flex gap-4 mb-6 text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-lg inline-flex">
                        <span>{property.bedrooms} Bedrooms</span>
                        <span className="w-px bg-slate-200"></span>
                        <span>{property.bathrooms} Bathrooms</span>
                    </div>

                    <h3 className="font-bold mb-2 text-slate-800">Amenities</h3>
                    <ul className="grid grid-cols-2 gap-2 mb-8">
                        {property.amenities.length > 0 ? (
                            property.amenities.map((a, i) => (
                                <li key={i} className="text-slate-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                                    {/* Handle if amenity is string or object based on API */}
                                    {typeof a === 'string' ? a : a.name}
                                </li>
                            ))
                        ) : (
                            <li className="text-slate-400 italic">No amenities listed</li>
                        )}
                    </ul>

                    {/* Reviews Section */}
                    <div className="border-t pt-8">
                        <h3 className="font-bold text-xl mb-4 text-slate-800">Reviews ({reviews.length})</h3>
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="bg-slate-50 p-4 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-slate-900">User {review.user_id}</span>
                                            {/* Date could be formatted here */}
                                        </div>
                                        <p className="text-slate-600">{review.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 italic">No reviews yet for this property.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-fit sticky top-24">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h3 className="text-xl font-bold mb-4 text-slate-800">Lease Options</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-accent">
                                <span className="text-slate-600">12 Months</span>
                                <span className="font-bold text-slate-900">${property.prices[12].toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-accent">
                                <span className="text-slate-600">6 Months</span>
                                <span className="font-bold text-slate-900">${property.prices[6].toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-accent">
                                <span className="text-slate-600">3 Months</span>
                                <span className="font-bold text-slate-900">${property.prices[3].toLocaleString()}/mo</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                            Request to Book
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
