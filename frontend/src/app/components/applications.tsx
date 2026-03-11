import { useState, useEffect } from "react";
import { Search, Filter, Calendar, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function Applications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = user.role === 'Landlord' ? '/bookings/landlord' : '/bookings/my';
      const response = await api.get(url);
      setBookings(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings(); // Refresh list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return b.status === "Requested";
    if (activeTab === "approved") return b.status === "Approved";
    if (activeTab === "rejected") return b.status === "Denied";
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Approved":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Approved" };
      case "Requested":
        return { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" };
      case "Denied":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Rejected" };
      default:
        return { icon: Clock, color: "text-gray-600", bg: "bg-gray-100", label: status };
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.role === 'Landlord' ? "Tenant Applications" : "My Applications"}</h1>
              <p className="text-gray-500">{user.role === 'Landlord' ? "Manage incoming property requests" : "Track your property booking requests"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 mb-4">{user.role === 'Landlord' ? "Applications" : "My Applications"}</h1>
        <div className="flex gap-2 text-sm overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab("all")} className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${activeTab === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>All</button>
          <button onClick={() => setActiveTab("pending")} className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${activeTab === "pending" ? "bg-yellow-100 text-yellow-700 font-medium" : "bg-gray-100 text-gray-600"}`}>Pending</button>
          <button onClick={() => setActiveTab("approved")} className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${activeTab === "approved" ? "bg-green-100 text-green-700 font-medium" : "bg-gray-100 text-gray-600"}`}>Approved</button>
          <button onClick={() => setActiveTab("rejected")} className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${activeTab === "rejected" ? "bg-red-100 text-red-700 font-medium" : "bg-gray-100 text-gray-600"}`}>Rejected</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-2 mb-6">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "all" ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-100"}`}>All Applications</button>
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "pending" ? "bg-yellow-100 text-yellow-800" : "text-gray-600 hover:bg-gray-100"}`}>Pending</button>
          <button onClick={() => setActiveTab("approved")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "approved" ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"}`}>Approved</button>
          <button onClick={() => setActiveTab("rejected")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "rejected" ? "bg-red-100 text-red-800" : "text-gray-600 hover:bg-gray-100"}`}>Rejected</button>
        </div>

        {loading ? (
           <div className="text-center py-12 text-gray-500 animate-pulse">Loading applications...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
             <h3 className="text-lg font-medium text-gray-800">No applications found</h3>
             <p className="text-gray-500">You do not have any {activeTab !== 'all' ? activeTab : ''} applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBookings.map((app) => {
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={app.booking_id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                        <span className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">${app.total_price}</span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 truncate">{app.property?.title}</h3>
                    
                    {user.role === 'Landlord' && (
                       <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                          <p className="text-sm font-medium text-gray-700">Applicant:</p>
                          <p className="text-gray-900">{app.tenant?.full_name}</p>
                          <p className="text-gray-500 text-sm">{app.tenant?.phone_number}</p>
                       </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{app.property?.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(app.start_date).toLocaleDateString()} - {new Date(app.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                  </div>
                  
                  {user.role === 'Landlord' && app.status === 'Requested' && (
                     <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex gap-3">
                        <button onClick={() => handleUpdateStatus(app.booking_id, 'Approved')} className="flex-1 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition">Approve</button>
                        <button onClick={() => handleUpdateStatus(app.booking_id, 'Denied')} className="flex-1 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition">Reject</button>
                     </div>
                  )}

                  {user.role !== 'Landlord' && (
                    <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
                      <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
