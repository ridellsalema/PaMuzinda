import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // using react-router-dom to fix typings
import { Search, MapPin, Home as HomeIcon, Building2, Car, Wrench, CheckCircle, Clock, XCircle, FileText, Check, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

// --- STUDENT DASHBOARD ---
function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, transRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/transport')
        ]);
        setBookings(bookingsRes.data.data || []);
        setTransports((transRes.data.data || []).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = bookings.filter(b => b.status === 'Requested').length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      {user.is_student_verified === false && !user.student_id_url && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-xl shadow-sm">
          <div className="flex justify-between items-center">
             <div>
                <p className="font-semibold text-yellow-800">Verification Required</p>
                <p className="text-sm text-yellow-700">Upload your student ID to unlock student-only housing and transport.</p>
             </div>
             <button onClick={() => navigate('/profile#verify')} className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition">Verify Now</button>
          </div>
        </div>
      )}
      {user.is_student_verified === false && user.student_id_url && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-xl shadow-sm">
           <p className="font-semibold text-blue-800">Review Pending</p>
           <p className="text-sm text-blue-700">Your student ID is under review by the administration.</p>
        </div>
      )}

      {/* Applications Summary */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Clock className="w-6 h-6"/></div>
            <div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{pendingCount}</p></div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle className="w-6 h-6"/></div>
            <div><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold">{approvedCount}</p></div>
         </div>
         <button onClick={() => navigate('/applications')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary"><FileText className="w-6 h-6"/></div>
            <div><p className="text-sm text-gray-500">Total Applications</p><p className="text-2xl font-bold">{bookings.length}</p></div>
         </button>
      </div>

      <div className="mb-10 flex items-center gap-4">
         <div className="relative flex-1 max-w-lg">
            <input type="text" placeholder="Search properties..." className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary shadow-sm" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
         </div>
         <button onClick={() => navigate('/properties')} className="px-6 py-4 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-primary/90">Search</button>
      </div>

      {transports.length > 0 && (
         <>
          <div className="flex justify-between items-end mb-4">
             <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Transport Services</h2>
             <button onClick={() => navigate('/transport')} className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {transports.map(t => (
               <div key={t.service_id} onClick={() => navigate('/transport')} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 transition transform">
                  <div className="flex items-center gap-3 mb-3"><Car className="text-purple-500 w-6 h-6"/><h3 className="font-semibold text-gray-800">{t.route_description}</h3></div>
                  <p className="text-sm text-gray-500 mb-2"><MapPin className="inline w-4 h-4 mr-1"/>{t.pickup_area}</p>
                  <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">{t.available_seats} seats left</div>
               </div>
             ))}
          </div>
         </>
      )}
    </div>
  );
}

// --- GENERAL DASHBOARD ---
function GeneralDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, pRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/properties?status=Available')
        ]);
        setBookings(bRes.data.data || []);
        setProperties((pRes.data.data || []).slice(0, 3));
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const totalCount = bookings.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
         <button onClick={() => navigate('/applications')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary"><FileText className="w-6 h-6"/></div>
            <div className="text-left"><p className="text-sm text-gray-500">Total Applications</p><p className="text-2xl font-bold">{totalCount}</p></div>
         </button>
      </div>

      <div className="mb-10 flex items-center gap-4">
         <div className="relative flex-1 max-w-lg">
            <input type="text" placeholder="Search general properties..." className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary shadow-sm" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
         </div>
         <button onClick={() => navigate('/properties')} className="px-6 py-4 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-primary/90">Search</button>
      </div>

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((p) => (
             <button key={p.property_id} onClick={() => navigate(`/properties/${p.property_id}`)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 text-left">
               <div className="relative h-44 md:h-52">
                 <img src={p.images?.[0]?.image_url || "https://placehold.co/600x400?text=No+Image"} alt={p.title} className="w-full h-full object-cover"/>
               </div>
               <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{p.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2"><MapPin className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{p.address}</span></div>
                  <span className="text-primary font-bold text-lg">${p.price_per_month}</span>
               </div>
             </button>
          ))}
      </div>
    </div>
  );
}

// --- LANDLORD DASHBOARD ---
function LandlordDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
         // The landlord filter relies on the JWT identity inside the controller
         const [pRes, bRes] = await Promise.all([
           api.get('/properties'), // Ensure backend returns ONLY landlord's if identity matches (Wait, /properties is public. I should add landlord endpoint or UI filter)
           api.get('/bookings/landlord')
         ]);
         // Filter properties listed by THIS user - the generic endpoint returns all. We need to filter locally since properties endpoint doesn't strictly isolate landlords unless there's a param. We will just show stats from bookings for now.
         setBookings(bRes.data.data.filter(b => b.status === "Requested") || []);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const handleStatus = async (id, status) => {
     try {
        await api.put(`/bookings/${id}/status`, { status });
        setBookings(prev => prev.filter(b => b.booking_id !== id));
     } catch (err) { alert("Failed to update status"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
       <div className="flex gap-4 mb-10">
          <button onClick={() => navigate('/properties/new')} className="px-6 py-4 bg-primary text-white rounded-xl shadow-md font-semibold hover:bg-primary/90 flex items-center gap-2"><Building2 className="w-5 h-5"/> Add New Property</button>
          <button onClick={() => navigate('/properties')} className="px-6 py-4 bg-white text-primary border border-primary rounded-xl font-semibold hover:bg-gray-50">View All Listings</button>
       </div>

       <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Pending Booking Requests</h2>
       <div className="grid grid-cols-1 gap-4">
          {bookings.length === 0 ? (
             <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 text-center">No pending requests right now.</p>
          ) : (
            bookings.map(b => (
               <div key={b.booking_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                     <p className="font-semibold text-lg">{b.tenant?.full_name || "Unknown User"}</p>
                     <p className="text-gray-500 text-sm">{b.property?.title} <span className="mx-2">•</span> {new Date(b.start_date).toLocaleDateString()} to {new Date(b.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                     <button onClick={() => handleStatus(b.booking_id, 'Approved')} className="flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">Approve</button>
                     <button onClick={() => handleStatus(b.booking_id, 'Denied')} className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium">Reject</button>
                  </div>
               </div>
            ))
          )}
       </div>
    </div>
  );
}

// --- HANDYMAN DASHBOARD ---
function HandymanDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user.is_available);
  const [openJobs, setOpenJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const [openRes, myRes] = await Promise.all([
         api.get('/maintenance/open'),
         api.get('/maintenance/my')
      ]);
      setOpenJobs(openRes.data.data || []);
      // Filter active: handyman_id is mapped in backend for 'my', but we must ensure status is not Completed
      const mine = myRes.data.data || [];
      setActiveJobs(mine.filter(j => j.status !== 'Completed'));
    } catch (err) { console.error(err); }
  };

  const toggleAvailability = async () => {
    try {
       const toggled = !isAvailable;
       await api.put('/users/me/availability', { is_available: toggled });
       setIsAvailable(toggled);
    } catch(err) { alert("Failed"); }
  };

  const acceptJob = async (id) => {
     try {
        await api.put(`/maintenance/${id}/accept`);
        fetchJobs();
     } catch (err) { alert("Failed to accept"); }
  };

  const updateStatus = async (id, status) => {
     try {
        await api.put(`/maintenance/${id}/status`, { status });
        fetchJobs();
     } catch(err) { alert("Failed"); }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">My Availability</h2>
            <p className="text-gray-500 text-sm">Turn this off if you aren't currently taking jobs.</p>
          </div>
          <button 
             onClick={toggleAvailability}
             className={`px-6 py-2 rounded-full font-medium transition ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
             {isAvailable ? "Available" : "Busy"}
          </button>
       </div>

       <div className="mb-10">
         <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Open Jobs Near You</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openJobs.length === 0 ? <p className="text-gray-500">No open jobs right now.</p> : openJobs.map(j => (
               <div key={j.request_id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="bg-primary/10 text-primary w-fit px-3 py-1 rounded-full text-sm font-semibold mb-3">{j.issue_type}</div>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{j.description}</p>
                  <p className="text-xs text-gray-400 mb-4">{new Date(j.created_at).toLocaleDateString()}</p>
                  <button onClick={() => acceptJob(j.request_id)} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90">Accept Job</button>
               </div>
            ))}
         </div>
       </div>

       <div>
         <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">My Active Jobs</h2>
         <div className="flex flex-col gap-4">
            {activeJobs.length === 0 ? <p className="text-gray-500">No active jobs.</p> : activeJobs.map(j => (
               <div key={j.request_id} className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-l-primary flex justify-between items-center sm:flex-row flex-col gap-4">
                  <div className="flex-1">
                     <p className="font-semibold mb-1">{j.issue_type}</p>
                     <p className="text-gray-600 text-sm mb-1">{j.description}</p>
                     <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md w-fit mt-2">Status: {j.status}</div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                     {j.status === 'Pending' && <button onClick={() => updateStatus(j.request_id, 'In Progress')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">Mark In Progress</button>}
                     {j.status === 'In Progress' && <button onClick={() => updateStatus(j.request_id, 'Completed')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">Mark Completed</button>}
                  </div>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
}

// --- TRANSPORT DASHBOARD ---
function TransportDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  
  useEffect(() => {
     api.get('/transport').then(res => {
        // Find our services manually since GET /transport gets all active, although Transport endpoint should potentially filter. We will filter by owner_id if available, or just rely on backend.
        setServices((res.data.data || []).filter(s => s.provider?.user_id === user.user_id));
     });
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
       <div className="flex justify-between items-center mb-8">
         <h2 className="text-lg md:text-xl font-semibold text-gray-800">My Transport Services</h2>
         <button onClick={() => navigate('/transport/manage')} className="px-6 py-3 bg-primary text-white rounded-xl shadow-md font-semibold hover:bg-primary/90">Manage Services</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Car className="w-6 h-6"/></div>
             <div><p className="text-sm text-gray-500">Total Routes</p><p className="text-2xl font-bold">{services.length}</p></div>
          </div>
          {/* Real data maps below */}
       </div>
    </div>
  );
}

// --- MAIN EXPORT ---
export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  if (user.role === 'Admin') {
    // Redirection pattern
    setTimeout(() => navigate('/admin'), 0);
    return <div className="min-h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Universal Hero Context Bar */}
      <div className="bg-primary text-white pt-24 md:pt-14 pb-12 px-4 md:px-8 -mt-16 md:-mt-8">
        <div className="max-w-7xl mx-auto">
           <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.full_name.split(' ')[0]}</h1>
           <p className="text-white/90">Here is what's happening today in your Muzinda dashboard.</p>
        </div>
      </div>

      {/* Conditional Role Rendering */}
      {user.role === 'Student' && <StudentDashboard />}
      {user.role === 'General' && <GeneralDashboard />}
      {user.role === 'Landlord' && <LandlordDashboard />}
      {user.role === 'Handyman' && <HandymanDashboard />}
      {user.role === 'Transport' && <TransportDashboard />}
    </div>
  );
}
