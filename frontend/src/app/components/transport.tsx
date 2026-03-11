import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function TransportHub() {
  const { user } = useAuth();
  
  // Student view
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModal, setBookingModal] = useState<any>(null);
  
  // Provider view
  const [myServices, setMyServices] = useState<any[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ route_from: "", route_to: "", schedule_time: "", total_seats: 15, price: 10 });

  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    try {
      const res = await api.get('/transport');
      setServices(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
       setLoading(false);
    }
  };

  const fetchProviderData = async () => {
    try {
      const res = await api.get('/transport/my-services');
      setMyServices(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (user.role === 'Transport') {
       fetchProviderData();
    } else {
       fetchStudentData();
    }
  }, [user]);

  const handleBookSeat = async () => {
     if(!bookingModal) return;
     try {
        await api.post(`/transport/${bookingModal.service_id}/book`);
        alert("Seat Booked Successfully!");
        setBookingModal(null);
        fetchStudentData(); // refresh seats
     } catch (err: any) {
        alert(err.response?.data?.message || "Failed to book seat");
     }
  };

  const handleAddService = async (e: any) => {
     e.preventDefault();
     try {
        await api.post('/transport', newService);
        setShowAddService(false);
        fetchProviderData();
     } catch (err: any) {
        alert(err.response?.data?.message || "Failed to add service");
     }
  };

  const renderStudentView = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-4">University Transport Hub</h1>
        <p className="opacity-90 max-w-2xl mb-8">Find safe, reliable transport to and from campus. Book your seat in advance.</p>
        <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-4">
             <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="From (e.g. CBD)" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
             </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-colors">Search Routes</button>
        </div>
      </div>

      <div className="mb-6"><h2 className="text-xl font-bold text-gray-800">Available Routes</h2></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.filter(s => s.route_from.toLowerCase().includes(searchQuery.toLowerCase()) || s.route_to.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => (
          <div key={service.service_id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Car className="w-5 h-5 text-blue-600" /></div>
                 <div><h3 className="font-bold text-gray-800 uppercase line-clamp-1">{service.provider?.user?.full_name || "Provider"}</h3></div>
              </div>
              <div className="text-right">
                 <div className="text-2xl font-bold text-primary">${service.price}</div>
                 <div className="text-xs text-gray-500">per seat</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 relative">
              <div className="flex-1 text-center"><p className="text-sm text-gray-500 mb-1">From</p><p className="font-bold text-gray-800 truncate">{service.route_from}</p></div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <div className="flex-1 text-center"><p className="text-sm text-gray-500 mb-1">To</p><p className="font-bold text-gray-800 truncate">{service.route_to}</p></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div><p className="text-xs text-gray-500">Time</p><p className="font-semibold text-gray-800 text-sm">{new Date(service.schedule_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div><p className="text-xs text-gray-500">Seats Open</p><p className="font-semibold text-gray-800 text-sm">{service.available_seats}/{service.total_seats}</p></div>
               </div>
            </div>

            <button disabled={service.available_seats === 0} onClick={() => setBookingModal(service)} className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50">
               {service.available_seats > 0 ? 'Book Seat' : 'Full'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
               <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
               <p className="text-gray-600 mb-6">You are booking a seat from <strong>{bookingModal.route_from}</strong> to <strong>{bookingModal.route_to}</strong> for <strong>${bookingModal.price}</strong>.</p>
               <div className="flex gap-3">
                  <button onClick={() => setBookingModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">Cancel</button>
                  <button onClick={handleBookSeat} className="flex-1 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 font-medium">Confirm Booking</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );

  const renderProviderView = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-2xl font-bold text-gray-800">My Routes</h1><p className="text-gray-500">Manage your transport schedules and bookings.</p></div>
        <button onClick={() => setShowAddService(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4" /> Add Route</button>
      </div>

      {showAddService && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">New Route</h2>
          <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departure (From)</label>
              <input type="text" value={newService.route_from} onChange={e => setNewService({...newService, route_from: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destination (To)</label>
              <input type="text" value={newService.route_to} onChange={e => setNewService({...newService, route_to: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Time</label>
              <input type="datetime-local" value={newService.schedule_time} onChange={e => setNewService({...newService, schedule_time: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-xl" required />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Total Seats</label>
                  <input type="number" value={newService.total_seats} onChange={e => setNewService({...newService, total_seats: Number(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-xl" required />
               </div>
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2">
               <button type="button" onClick={() => setShowAddService(false)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">Cancel</button>
               <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 font-medium">Create Route</button>
            </div>
          </form>
        </div>
      )}

      {myServices.length === 0 ? (
         <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No active routes</h3>
            <p className="text-gray-500">Create your first transport schedule to start accepting bookings.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myServices.map(service => (
               <div key={service.service_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <MapPin className="w-4 h-4 text-gray-400"/>
                           <span className="font-semibold text-gray-800">{service.route_from} → {service.route_to}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <Calendar className="w-4 h-4"/>
                           <span>{new Date(service.schedule_time).toLocaleString()}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xl font-bold text-primary">${service.price}</span>
                        <p className="text-xs text-gray-500">per seat</p>
                     </div>
                  </div>
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400"/>
                        <span className="font-medium text-gray-700">{service.total_seats - service.available_seats} / {service.total_seats} Seats Booked</span>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{service.status}</span>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50">
       {loading ? <div className="text-center py-20 text-gray-500 animate-pulse">Loading Transport Hub...</div> : user.role === 'Transport' ? renderProviderView() : renderStudentView()}
    </div>
  );
}
