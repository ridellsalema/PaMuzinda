import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart,
  Calendar,
  Check,
  Clock,
  MessageCircle,
  Wrench,
  AlertCircle
} from "lucide-react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Booking state
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<"dates" | "confirm" | "success">("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Maintenance state
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false);
  const [maintenanceIssue, setMaintenanceIssue] = useState("");
  const [maintenanceCategory, setMaintenanceCategory] = useState("General");
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading property...</div>;
  if (error || !property) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Property not found"}</div>;

  const images = property.images?.length > 0 
    ? property.images.map((img: any) => img.image_url) 
    : ["https://placehold.co/1080x720?text=No+Image"];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleBooking = () => {
    if (checkIn && checkOut) {
      setBookingStep("confirm");
    }
  };

  const confirmBooking = async () => {
    try {
      setBookingLoading(true);
      await api.post('/bookings', {
        property_id: property.property_id,
        start_date: checkIn,
        end_date: checkOut,
        total_price: property.price_per_month // simplified calculation based on backend docs for monthly bookings, but technically should calc
      });
      setBookingStep("success");
      setTimeout(() => {
        setShowBooking(false);
        navigate("/applications");
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to book property.");
    } finally {
      setBookingLoading(false);
    }
  };

  const submitMaintenance = async () => {
    try {
       setMaintenanceLoading(true);
       await api.post('/maintenance', {
          property_id: property.property_id,
          issue_type: maintenanceCategory,
          description: maintenanceIssue
       });
       setMaintenanceSubmitted(true);
    } catch(err: any) {
       alert(err.response?.data?.message || "Failed to submit maintenance request.");
    } finally {
       setMaintenanceLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 pb-20 md:pb-0">
      <div className="hidden md:block max-w-7xl mx-auto px-8 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      {/* Image Gallery */}
      <div className="bg-gray-900 mt-0 md:mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-64 md:h-96 lg:h-[500px]">
            <img src={images[currentImage]} alt="Property" className="w-full h-full object-cover" />
            
            <div className="md:hidden absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white text-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white text-gray-800">
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white text-gray-800">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full items-center justify-center shadow-lg hover:bg-white text-gray-800 transition"><ChevronLeft className="w-6 h-6"/></button>
                <button onClick={nextImage} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full items-center justify-center shadow-lg hover:bg-white text-gray-800 transition"><ChevronRight className="w-6 h-6"/></button>
              </>
            )}
          </div>

          <div className="hidden md:flex gap-2 p-4 overflow-x-auto">
            {images.map((img: string, index: number) => (
              <button key={index} onClick={() => setCurrentImage(index)} className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition ${index === currentImage ? "ring-2 ring-primary" : "opacity-60"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                {property.is_student_only && <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded inline-block mb-2">Student Only</span>}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-2"><MapPin className="w-5 h-5" /><span>{property.address}</span></div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Bed className="w-4 h-4" /><span>{property.property_type}</span></div>
                  <div className="flex items-center gap-1 font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded"><span>{property.sharing_type}</span></div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl md:text-4xl font-bold text-primary">${property.price_per_month}</div>
                <div className="text-gray-500">per month</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{property.landlord?.user?.full_name?.charAt(0) || "L"}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{property.landlord?.user?.full_name || "Verified Landlord"}</h3>
                  <p className="text-gray-500">Owner</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => navigate('/messages')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                  <MessageCircle className="w-5 h-5" /> Message Landlord
                </button>
              </div>

              {/* Maintenance request button shown for tenants */}
              {(user?.role === 'Student' || user?.role === 'General') && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => setShowMaintenance(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                    <Wrench className="w-5 h-5" /> Request maintenance
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar for PC */}
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Book this property</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Due Today</span>
                  <span className="text-primary">${property.price_per_month}</span>
                </div>
              </div>
              <button disabled={!checkIn || !checkOut || property.status !== 'Available'} onClick={handleBooking} className="w-full bg-primary text-white py-4 rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {property.status === 'Available' ? 'Reserve Now' : 'Not Available'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Header */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10 flex items-center justify-between">
         <div><div className="text-2xl font-bold text-primary">${property.price_per_month}</div><div className="text-gray-500 text-sm">per month</div></div>
         <button disabled={property.status !== 'Available'} onClick={() => setShowBooking(true)} className="px-8 py-3 bg-primary text-white rounded-xl font-medium shadow-lg disabled:opacity-50">{property.status === 'Available' ? 'Book Now' : 'Occupied'}</button>
      </div>

      {/* Booking Modal Flow */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center lg:justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-md p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Book Property</h2>
              <button onClick={() => {setShowBooking(false); setBookingStep("dates");}} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>

            {bookingStep === "dates" && (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                     <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <button disabled={!checkIn || !checkOut} onClick={handleBooking} className="w-full bg-primary text-white py-4 rounded-xl font-medium disabled:opacity-50 shadow-lg mt-4">Continue</button>
              </>
            )}

            {bookingStep === "confirm" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-primary" /></div>
                  <h3 className="text-lg font-semibold mb-2">Confirm Your Booking</h3>
                  <p className="text-gray-500 line-clamp-1">{property.title}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4 mb-3"><Clock className="w-5 h-5 text-gray-400" /><div><p className="font-medium">Check-in</p><p className="text-gray-500">{checkIn}</p></div></div>
                  <div className="flex items-center gap-4"><Clock className="w-5 h-5 text-gray-400" /><div><p className="font-medium">Check-out</p><p className="text-gray-500">{checkOut}</p></div></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setBookingStep("dates")} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50">Back</button>
                  <button disabled={bookingLoading} onClick={confirmBooking} className="flex-1 bg-primary text-white py-4 rounded-xl font-medium shadow-lg hover:bg-primary/90">{bookingLoading ? 'Sending...' : 'Confirm'}</button>
                </div>
              </>
            )}

            {bookingStep === "success" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-10 h-10 text-green-500" /></div>
                <h3 className="text-xl font-bold mb-2">Booking Requested!</h3>
                <p className="text-gray-500 mb-4">The landlord will review your request shortly.</p>
                <div className="flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maintenance request modal */}
      {showMaintenance && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Wrench className="w-5 h-5 text-primary" /> Maintenance request</h2>
              <button onClick={() => { setShowMaintenance(false); setMaintenanceSubmitted(false); }} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            {!maintenanceSubmitted ? (
              <>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select value={maintenanceCategory} onChange={(e) => setMaintenanceCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                      <option>General</option><option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>Painting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe the issue</label>
                    <textarea value={maintenanceIssue} onChange={(e) => setMaintenanceIssue(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"></textarea>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button onClick={() => setShowMaintenance(false)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-medium">Cancel</button>
                  <button disabled={maintenanceLoading} onClick={submitMaintenance} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium">{maintenanceLoading ? 'Submitting...' : 'Submit request'}</button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-500" /></div>
                <h3 className="text-lg font-semibold mb-2">Request submitted</h3>
                <p className="text-gray-500 mb-4">A nearby handyman will be assigned to review this.</p>
                <button onClick={() => { setShowMaintenance(false); setMaintenanceSubmitted(false); }} className="w-full py-3 bg-primary text-white rounded-xl font-medium">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
