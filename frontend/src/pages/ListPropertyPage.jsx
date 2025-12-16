import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../api/propertyService';
import { useAuth } from '../context/AuthContext';

const ListPropertyPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Data lists
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Form Data
    const [selectedState, setSelectedState] = useState('');
    const [newStateName, setNewStateName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [newCityName, setNewCityName] = useState('');

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState(new Set());
    const [newAmenityName, setNewAmenityName] = useState('');

    const [listingData, setListingData] = useState({
        name: '',
        description: '',
        number_rooms: 1,
        number_bathrooms: 1,
        price_by_month: 0,
        price_by_night: 0,
        latitude: 0,
        longitude: 0,
    });

    // Step 1: Fetch States and Amenities on Mount
    useEffect(() => {
        const loadInitialData = async () => {
            const statesData = await propertyService.fetchStates();
            setStates(statesData);
            const amenitiesData = await propertyService.fetchAmenities();
            setAmenities(amenitiesData);
        };
        loadInitialData();
    }, []);

    // Fetch cities when state changes
    useEffect(() => {
        if (selectedState && selectedState !== 'new') {
            const loadCities = async () => {
                const data = await propertyService.fetchCities(selectedState);
                setCities(data);
            };
            loadCities();
        } else {
            setCities([]);
        }
    }, [selectedState]);

    const handleNext = async () => {
        setError('');
        setLoading(true);
        try {
            if (step === 1) {
                // Validation for Step 1
                if (!selectedState && !newStateName) throw new Error("Please select or create a state");
                if (selectedState === 'new' && !newStateName.trim()) throw new Error("Please enter a name for the new state");
                if (!selectedCity && !newCityName) throw new Error("Please select or create a city");
                if (selectedCity === 'new' && !newCityName.trim()) throw new Error("Please enter a name for the new city");

                // Process State/City creation if needed
                let stateId = selectedState;
                if (selectedState === 'new') {
                    const newState = await propertyService.createState(newStateName);
                    stateId = newState.id;
                    // Ideally update list, but we are moving forward
                }

                let cityId = selectedCity;
                if (selectedCity === 'new') {
                    const newCity = await propertyService.createCity(stateId, newCityName);
                    cityId = newCity.id;
                }

                // Save confirmed IDs
                setSelectedState(stateId);
                setSelectedCity(cityId);
                setStep(2);
                setSelectedCity(cityId);
                setStep(2);
            } else if (step === 2) {
                // Validation for Step 2
                if (!listingData.name) throw new Error("Property title is required");
                if (!listingData.description) throw new Error("Description is required");
                if (!listingData.price_by_month) throw new Error("Monthly price is required");

                setStep(3);
            } else if (step === 3) {
                // Submit
                const newPlace = await propertyService.createListing({
                    ...listingData,
                    city_id: selectedCity,
                    user_id: user.id,
                    landmarks: "Not specified"
                });

                // Link Amenities
                if (selectedAmenities.size > 0) {
                    await Promise.all(Array.from(selectedAmenities).map(amenityId =>
                        propertyService.linkAmenityToPlace(newPlace.id, amenityId)
                    ));
                }

                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setListingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">List Your Property</h1>

            {/* Progress Bar */}
            <div className="flex items-center mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-8 border border-slate-100">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Location Details</h2>

                        {/* State Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                            <select
                                value={selectedState}
                                onChange={(e) => {
                                    setSelectedState(e.target.value);
                                    setSelectedCity('');
                                    if (e.target.value !== 'new') setNewStateName('');
                                }}
                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Select a State</option>
                                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                <option value="new">+ Add New State</option>
                            </select>
                            {selectedState === 'new' && (
                                <input
                                    type="text"
                                    placeholder="Enter new state name"
                                    className="mt-2 w-full p-2 border border-slate-300 rounded bg-slate-50"
                                    value={newStateName}
                                    onChange={(e) => setNewStateName(e.target.value)}
                                />
                            )}
                        </div>

                        {/* City Selection - Only if State is selected */}
                        {(selectedState && (selectedState !== 'new' || newStateName)) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Select a City</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    <option value="new">+ Add New City</option>
                                </select>
                                {selectedCity === 'new' && (
                                    <input
                                        type="text"
                                        placeholder="Enter new city name"
                                        className="mt-2 w-full p-2 border border-slate-300 rounded bg-slate-50"
                                        value={newCityName}
                                        onChange={(e) => setNewCityName(e.target.value)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Property Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Property Title</label>
                            <input
                                type="text"
                                name="name"
                                value={listingData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 rounded"
                                placeholder="e.g. Modern Downtown Apartment"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={listingData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 rounded h-32"
                                placeholder="Describe your property..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price (per Month)</label>
                                <input
                                    type="number"
                                    name="price_by_month"
                                    value={listingData.price_by_month}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Guests</label>
                                <input
                                    type="number"
                                    name="max_guest"
                                    value={listingData.max_guest}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                                <input
                                    type="number"
                                    name="number_rooms"
                                    value={listingData.number_rooms}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                                <input
                                    type="number"
                                    name="number_bathrooms"
                                    value={listingData.number_bathrooms}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-300 rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Select Amenities</h2>

                        {/* New Amenity Creation */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newAmenityName}
                                onChange={(e) => setNewAmenityName(e.target.value)}
                                placeholder="Add new amenity (e.g. Gym)"
                                className="flex-1 p-2 border border-slate-300 rounded"
                            />
                            <button
                                onClick={async () => {
                                    if (!newAmenityName.trim()) return;
                                    try {
                                        const newAm = await propertyService.createAmenity(newAmenityName);
                                        setAmenities(prev => [...prev, newAm]);
                                        setSelectedAmenities(prev => new Set(prev).add(newAm.id));
                                        setNewAmenityName('');
                                    } catch (e) {
                                        console.error("Failed to add amenity", e);
                                        // Optional: setError("Failed to add amenity");
                                    }
                                }}
                                className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
                            >
                                Add
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {amenities.map(amenity => (
                                <label key={amenity.id} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.has(amenity.id)}
                                        onChange={(e) => {
                                            const newSet = new Set(selectedAmenities);
                                            if (e.target.checked) newSet.add(amenity.id);
                                            else newSet.delete(amenity.id);
                                            setSelectedAmenities(newSet);
                                        }}
                                        className="w-5 h-5 text-primary rounded"
                                    />
                                    <span>{amenity.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className={`ml-auto px-8 py-2 bg-primary text-white rounded font-medium hover:bg-primary-dark ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (step === 3 ? 'Publish Listing' : 'Next Step')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListPropertyPage;
