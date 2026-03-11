import { useState } from "react";
import { User, Mail, Phone, Pencil, CheckCircle, Save, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

export function Profile() {
  const { user, login } = useAuth(); // Assuming login or another custom function could refresh contextual data if needed
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
  });
  const [loading, setLoading] = useState(false);

  const displayRole = user?.role || "Tenant";

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put('/users/me', formData);
      // We don't have a direct "updateUser" in context, but assuming a page reload or token refresh is handled, or we just silently update the local state.
      // Easiest is to force a reload to get the new contextual token if backend issues a new one. Or just show toast.
      alert("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload(); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 pb-20 md:pb-8">
       {/* Desktop Header */}
       <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500">Manage your account details.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover strip */}
          <div className="h-32 bg-gradient-to-r from-primary/80 to-indigo-600" />

          <div className="px-6 pb-8 -mt-16 relative">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-lg mb-4 overflow-hidden">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 font-bold uppercase">
                 {user?.full_name?.charAt(0) || <User className="w-16 h-16 text-gray-300" />}
              </div>
            </div>

            <div className="flex justify-between items-start mb-8">
               <div>
                 <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {user?.full_name} 
                    {user?.is_verified && <span title="Verified"><CheckCircle className="w-5 h-5 text-green-500" /></span>}
                 </h1>
                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary mt-2 uppercase tracking-wider">
                   {displayRole}
                 </span>
               </div>
               {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                     <Pencil className="w-4 h-4"/> Edit
                  </button>
               ) : (
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                     <X className="w-4 h-4"/> Cancel
                  </button>
               )}
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Email (Read Only usually unless backend supports changing email explicitly) */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Email Address</p>
                   <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800 font-medium">{user?.email}</span>
                   </div>
                 </div>

                 {/* Phone Number */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Phone Number</p>
                   <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      {isEditing ? (
                         <input type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="bg-white border border-gray-200 px-3 py-1 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none" />
                      ) : (
                         <span className="text-gray-800 font-medium">{user?.phone_number || "Not set"}</span>
                      )}
                   </div>
                 </div>

                 {/* Full Name */}
                 {isEditing && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Full Name</p>
                      <div className="flex items-center gap-3">
                         <User className="w-5 h-5 text-gray-400" />
                         <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="bg-white border border-gray-200 px-3 py-1 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>
                 )}
               </div>

               {isEditing && (
                 <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition font-bold disabled:opacity-50">
                       <Save className="w-5 h-5"/> {loading ? "Saving..." : "Save Changes"}
                    </button>
                 </div>
               )}
            </div>

            {/* Verification Status Banner (If strictly required by roles) */}
            {!user?.is_verified && (user?.role === 'Student' || user?.role === 'Transport' || user?.role === 'Landlord') && (
               <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                     <h3 className="font-bold text-yellow-800 flex items-center gap-2">Action Required</h3>
                     <p className="text-yellow-700 text-sm">You must verify your identity to unlock full platform features for your role.</p>
                  </div>
                  <button className="whitespace-nowrap px-5 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-sm w-full md:w-auto">
                     Verify Now
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
