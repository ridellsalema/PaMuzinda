import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Filter, Bed, X } from "lucide-react";
import { api } from "../../api/axios";

export function PropertiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isStudentOnly, setIsStudentOnly] = useState(false);
  const [sharingType, setSharingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("Available");

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (isStudentOnly) params.append("is_student_only", "true");
    if (sharingType) params.append("sharing_type", sharingType);
    if (propertyType) params.append("property_type", propertyType);
    if (status) params.append("status", status);
    // Note: The backend doesn't have a direct 'q' search for title currently based on BACKEND_DOCS,
    // but we can pass it if we want to filter locally, or just ignore. 
    // Wait, the specification didn't mention adding 'q' to backend but maybe locally filtering title.
    return params.toString();
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const qs = buildQueryString();
      const res = await api.get(`/properties?${qs}`);
      let data = res.data.data || [];
      
      // Local filter for searchQuery (title/address)
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         data = data.filter(p => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
      }
      setProperties(data);
    } catch (err) {
      console.error(err);
      // fallback or toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [minPrice, maxPrice, isStudentOnly, sharingType, propertyType, status]); // Refetch on filter change

  // If user hits enter on search bar
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchProperties();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col relative">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Location, property title..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Sidebar / Modal Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-30 flex justify-end" onClick={() => setShowFilters(false)}>
           <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">Filters</h2>
                 <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($)</label>
                    <div className="flex items-center gap-2">
                       <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                       <span>-</span>
                       <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                    </div>
                 </div>

                 <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={isStudentOnly} onChange={e => setIsStudentOnly(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                       <span className="text-gray-700 font-medium">Student Only</span>
                    </label>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                       <option value="">All Types</option>
                       <option value="Apartment">Apartment</option>
                       <option value="House">House</option>
                       <option value="Room">Room</option>
                       <option value="Hostel">Hostel</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sharing Type</label>
                    <select value={sharingType} onChange={e => setSharingType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                       <option value="">All</option>
                       <option value="Solo">Solo</option>
                       <option value="Shared Content">Shared</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                       <option value="Available">Available</option>
                       <option value="Occupied">Occupied</option>
                       <option value="">All Statuses</option>
                    </select>
                 </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-4">
                 <button onClick={() => { setMinPrice(""); setMaxPrice(""); setIsStudentOnly(false); setPropertyType(""); setSharingType(""); setStatus("Available"); }} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Reset</button>
                 <button onClick={() => { setShowFilters(false); fetchProperties(); }} className="flex-1 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90">Apply</button>
              </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-1 w-full">
        <p className="text-gray-600 text-sm mb-4">{properties.length} properties found</p>
        
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
              {[1,2,3,4].map(i => (
                 <div key={i} className="bg-gray-200 h-64 rounded-2xl"></div>
              ))}
           </div>
        ) : properties.length === 0 ? (
           <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No properties found</h2>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((listing) => (
              <button
                key={listing.property_id}
                onClick={() => navigate(`/properties/${listing.property_id}`)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 text-left flex flex-col"
              >
                <div className="relative h-48 md:h-52 w-full">
                  <img src={listing.images?.[0]?.image_url || "https://placehold.co/600x400?text=No+Photo"} alt={listing.title} className="w-full h-full object-cover" />
                  {listing.is_student_only && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-full font-medium">Student Only</div>
                  )}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">{listing.sharing_type}</div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Bed className="w-4 h-4" />
                      <span>{listing.property_type}</span>
                    </div>
                    <span className="text-primary font-bold text-lg">${listing.price_per_month}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
