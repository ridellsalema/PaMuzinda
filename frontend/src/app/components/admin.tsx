import { useState, useEffect } from "react";
import { Users, Home, Shield, DollarSign, Search, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'Admin') {
     return <div className="text-center py-20 text-red-500 font-bold">Access Denied</div>;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview') {
         const res = await api.get('/admin/stats');
         setStats(res.data.data);
      } else {
         const res = await api.get('/admin/users');
         setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const verifyUser = async (userId: number, type: 'student' | 'handyman' | 'vehicle') => {
     try {
       await api.put(`/admin/users/${userId}/verify-${type}`, { [`is_verified_${type === 'vehicle' ? 'transport' : type}`]: true });
       alert(`Verified successfully`);
       fetchData();
     } catch(err) {
       alert("Failed to verify");
     }
  };

  const updateRole = async (userId: number, role: string) => {
     try {
        await api.put(`/admin/users/${userId}/role`, { role });
        alert(`Role updated to ${role}`);
        fetchData();
     } catch(err) {
        alert("Failed to update role");
     }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Admin Portal</h1>
              <p className="text-gray-500">System Overview and Moderation</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
               <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-medium rounded-lg transition ${activeTab === 'overview' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}>Overview</button>
               <button onClick={() => setActiveTab('users')} className={`px-4 py-2 font-medium rounded-lg transition ${activeTab === 'users' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}>User Management</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
         {loading ? <div className="text-center py-20 text-gray-500 animate-pulse">Loading Admin Data...</div> : (
           activeTab === 'overview' ? (
              <div className="space-y-6">
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"><Users className="w-6 h-6 text-blue-600" /></div>
                       <div className="text-3xl font-bold text-gray-800">{stats?.usersCount || 0}</div>
                       <div className="text-sm text-gray-500">Total Users</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3"><Home className="w-6 h-6 text-green-600" /></div>
                       <div className="text-3xl font-bold text-gray-800">{stats?.propertiesCount || 0}</div>
                       <div className="text-sm text-gray-500">Active Properties</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                       <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3"><DollarSign className="w-6 h-6 text-purple-600" /></div>
                       <div className="text-3xl font-bold text-gray-800">{stats?.bookingsCount || 0}</div>
                       <div className="text-sm text-gray-500">Total Bookings</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                       <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3"><AlertCircle className="w-6 h-6 text-orange-600" /></div>
                       <div className="text-3xl font-bold text-gray-800">{stats?.maintenanceCount || 0}</div>
                       <div className="text-sm text-gray-500">Maintenance Req</div>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-md">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users by name or email..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50 text-gray-600 text-sm">
                             <th className="px-6 py-4 font-semibold border-b border-gray-200">User</th>
                             <th className="px-6 py-4 font-semibold border-b border-gray-200">Role</th>
                             <th className="px-6 py-4 font-semibold border-b border-gray-200">Verification Need</th>
                             <th className="px-6 py-4 font-semibold border-b border-gray-200">Joined</th>
                             <th className="px-6 py-4 font-semibold border-b border-gray-200text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm">
                          {users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                             <tr key={u.user_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                   <div className="font-semibold text-gray-800">{u.full_name} {u.is_verified && <CheckCircle className="w-4 h-4 text-green-500 inline-block" />}</div>
                                   <div className="text-gray-500">{u.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                   <select value={u.role} onChange={(e) => updateRole(u.user_id, e.target.value)} className="bg-gray-100 border border-gray-200 text-gray-700 py-1 px-2 rounded font-medium outline-none">
                                      <option value="Student">Student</option>
                                      <option value="General">General</option>
                                      <option value="Landlord">Landlord</option>
                                      <option value="Handyman">Handyman</option>
                                      <option value="Transport">Transport</option>
                                      <option value="Admin">Admin</option>
                                   </select>
                                </td>
                                <td className="px-6 py-4">
                                   {!u.is_verified && u.role === 'Student' && <button onClick={() => verifyUser(u.user_id, 'student')} className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Verify Student ID</button>}
                                   {!u.is_verified && u.role === 'Handyman' && <button onClick={() => verifyUser(u.user_id, 'handyman')} className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">Verify Handyman</button>}
                                   {!u.is_verified && u.role === 'Transport' && <button onClick={() => verifyUser(u.user_id, 'vehicle')} className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded">Verify Vehicle</button>}
                                   {u.is_verified && <span className="text-xs text-gray-400">Verified</span>}
                                   {!u.is_verified && u.role === 'General' && <span className="text-xs text-gray-400">N/A</span>}
                                   {!u.is_verified && u.role === 'Landlord' && <span className="text-xs text-gray-400">Pending Background Check</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                   {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Ban User"><Trash2 className="w-4 h-4" /></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )
         )}
      </div>
    </div>
  );
}
