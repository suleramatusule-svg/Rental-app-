import { API_BASE_URL } from './config';

// Helper to adapt backend data to frontend model
const adaptPlace = (place) => ({
    id: place.id,
    title: place.name,
    location: place.city_id, // In real app, would fetch city name
    type: "Apartment", // Backend doesn't have type field, defaulting
    bedrooms: place.number_rooms,
    bathrooms: place.number_bathrooms,
    // Use placeholder image since backend doesn't store images yet
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop"],
    prices: {
        3: Math.round(place.price_by_month * 1.1),
        6: place.price_by_month,
        12: Math.round(place.price_by_year / 12)
    },
    amenities: place.amenities || [], // Assuming amenities are included or separate call needed
    featured: false,
    description: place.description,
    user_id: place.user_id,
    max_guest: place.max_guest,
    price_by_night: place.price_by_night
});

export const propertyService = {
    fetchProperties: async (filters = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}/places`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to fetch properties');

            const data = await response.json();
            let places = data.map(adaptPlace);

            // Apply frontend filters
            if (filters.search) {
                const term = filters.search.toLowerCase();
                places = places.filter(p => p.title.toLowerCase().includes(term));
            }
            if (filters.minPrice) {
                places = places.filter(p => p.prices[12] >= filters.minPrice);
            }
            if (filters.maxPrice) {
                places = places.filter(p => p.prices[12] <= filters.maxPrice);
            }

            return places;
        } catch (error) {
            console.error("API Error:", error);
            return []; // Return empty array on error to prevent crash
        }
    },

    getPropertyDetails: async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/places/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch property details');
            const data = await response.json();
            return adaptPlace(data);
        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    },

    userLogin: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return await response.json();
    },



    registerUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return await response.json();
    },

    fetchAmenities: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/amenities`);
            if (!response.ok) throw new Error('Failed to fetch amenities');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    },

    fetchReviews: async (placeId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch reviews');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return []; // Return empty array to verify safe fallback
        }
    },

    fetchStates: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/states`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch states');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    },

    fetchCities: async (stateId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/states/${stateId}/cities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cities');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    },

    createState: async (name) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/states`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create state');
        return await response.json();
    },

    createCity: async (stateId, name) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/states/${stateId}/cities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create city');
        return await response.json();
    },

    // Updated createListing to include token
    createListing: async (data) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/cities/${data.city_id}/places`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create listing');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};
