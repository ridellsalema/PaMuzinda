import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Plus, 
  Home as HomeIcon, 
  MessageCircle, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Users,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Calendar
} from "lucide-react";

const myListings = [
  {
    id: 1,
    title: "Modern Student Studio",
    location: "Near UZ, Mutare",
    price: "$150",
    status: "Occupied",
    views: 234,
    inquiries: 12,
    image: "https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NzEzNDczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Spacious 2BR Apartment",
    location: "Greenside, Mutare",
    price: "$280",
    status: "Vacant",
    views: 189,
    inquiries: 8,
    image: "https://images.unsplash.com/photo-1744509636454-7b7d179b6d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTMwNDI1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Cozy Furnished Room",
    location: "City Center, Mutare",
    price: "$120",
    status: "Occupied",
    views: 312,
    inquiries: 15,
    image: "https://images.unsplash.com/photo-1661796428175-55423b19409f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwYmVkcm9vbSUyMGZ1cm5pc2hlZHxlbnwxfHx8fDE3NzEzNDczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const stats = [
  { icon: HomeIcon, label: "Properties", value: "3", color: "bg-blue-500", change: "+1" },
  { icon: DollarSign, label: "Monthly Income", value: "$420", color: "bg-green-500", change: "+12%" },
  { icon: Eye, label: "Total Views", value: "735", color: "bg-purple-500", change: "+23%" },
  { icon: MessageCircle, label: "Messages", value: "35", color: "bg-orange-500", change: "+5" },
];

export function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "listings" | "messages" | "tenants">("dashboard");
  const [showAddProperty, setShowAddProperty] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
              <p className="text-gray-500">Manage your properties and bookings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">My Dashboard</h1>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ icon: Icon, label, value, color, change }) => (
            <div key={label} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs md:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-6">
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline-block mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "listings"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <HomeIcon className="w-4 h-4 inline-block mr-2" />
            Listings
          </button>
          <button
            onClick={() => navigate("/messages")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "messages"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageCircle className="w-4 h-4 inline-block mr-2" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("tenants")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "tenants"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Tenants
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        {/* Listings Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Properties</h2>
          <button 
            onClick={() => setShowAddProperty(true)}
className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Desktop: Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Property</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Price</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Views</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Inquiries</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map((listing) => (
                <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-sm text-gray-500">{listing.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
<span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.status === "Occupied"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">{listing.price}/mo</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      {listing.views}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      {listing.inquiries}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="md:hidden space-y-4">
          {myListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{listing.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        listing.status === "Occupied"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
                  <div className="text-primary font-semibold mb-3">{listing.price}/mo</div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{listing.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{listing.inquiries}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 p-3 flex gap-2">
                <button className="flex-1 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">View Analytics</h3>
            <p className="text-sm text-gray-500">Track your property performance</p>
          </button>
          <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Manage Bookings</h3>
            <p className="text-sm text-gray-500">View upcoming check-ins</p>
          </button>
          <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Tenant List</h3>
            <p className="text-sm text-gray-500">Manage your current tenants</p>
          </button>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Property</h2>
                <button onClick={() => setShowAddProperty(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input type="text" placeholder="e.g., Modern Student Studio" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input type="text" placeholder="e.g., Near UZ, Mutare" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($/month)</label>
                  <input type="number" placeholder="150" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <input type="number" placeholder="1" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea rows={4} placeholder="Describe your property..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Photos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowAddProperty(false)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowAddProperty(false)} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90">Add Property</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
