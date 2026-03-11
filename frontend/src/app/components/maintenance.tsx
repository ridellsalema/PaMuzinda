import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wrench, Hammer, Zap, Droplet, Plus, MessageCircle, CheckCircle, Clock, MapPin, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";

const SERVICES = [
  { icon: Wrench, name: "Plumbing", color: "bg-blue-500" },
  { icon: Zap, name: "Electrical", color: "bg-yellow-500" },
  { icon: Hammer, name: "Carpentry", color: "bg-orange-500" },
  { icon: Droplet, name: "Painting", color: "bg-purple-500" },
];

export function Maintenance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tenant State
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [newReq, setNewReq] = useState({ property_id: "", issue_type: "Plumbing", description: "" });

  // Handyman State
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [handymanTab, setHandymanTab] = useState<"open" | "my">("open");

  const [loading, setLoading] = useState(true);

  const fetchTenantData = async () => {
    try {
      const [reqRes, propRes] = await Promise.all([
        api.get('/maintenance/my'),
        api.get('/properties') // User needs to select a property for the request, though typically should be their booked property
      ]);
      setMyRequests(reqRes.data.data || []);
      setProperties(propRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHandymanData = async () => {
    try {
      const [openRes, myRes] = await Promise.all([
        api.get('/maintenance/open'),
        api.get('/maintenance/my')
      ]);
      setOpenJobs(openRes.data.data || []);
      setActiveJobs(myRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (user.role === 'Handyman') {
      fetchHandymanData();
    } else {
      fetchTenantData();
    }
  }, [user]);

  const handleSubmitRequest = async (e: any) => {
    e.preventDefault();
    try {
      if (!newReq.property_id || !newReq.description) return alert("Fill all fields");
      await api.post('/maintenance', newReq);
      setShowNewForm(false);
      fetchTenantData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create request");
    }
  };

  const assignJob = async (id: number) => {
    try {
      await api.put(`/maintenance/${id}/accept`);
      fetchHandymanData();
      alert("Job Confirmed");
    } catch (err) {
      alert("Failed to accept job");
    }
  };

  const updateJobStatus = async (id: number, status: string) => {
    try {
      await api.put(`/maintenance/${id}/status`, { status });
      fetchHandymanData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const renderTenantView = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
          <p className="text-gray-500">Track and create repair jobs for your residence.</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Request
        </button>
      </div>

      {showNewForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">New Request</h2>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property</label>
              <select value={newReq.property_id} onChange={e => setNewReq({...newReq, property_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required>
                <option value="">Select a property</option>
                {properties.map(p => <option key={p.property_id} value={p.property_id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue Type</label>
              <select value={newReq.issue_type} onChange={e => setNewReq({...newReq, issue_type: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={newReq.description} onChange={e => setNewReq({...newReq, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl h-24 resize-none" placeholder="Describe the issue..." required></textarea>
            </div>
            <div className="flex gap-4">
               <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
               <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90">Submit</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myRequests.map(req => (
          <div key={req.request_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{req.issue_type}</span>
                <span className={`text-sm font-semibold flex items-center gap-1 ${req.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                   {req.status === 'Completed' ? <CheckCircle className="w-4 h-4"/> : <Clock className="w-4 h-4"/>} {req.status}
                </span>
             </div>
             <p className="text-gray-800 font-medium mb-2">{req.property?.title}</p>
             <p className="text-gray-500 text-sm mb-4 line-clamp-3">{req.description}</p>
             
             {req.handyman && (
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{req.handyman?.user?.full_name?.charAt(0) || "H"}</div>
                      <span className="text-sm font-medium">{req.handyman?.user?.full_name}</span>
                   </div>
                   <button onClick={() => navigate('/messages')} className="p-2 text-primary hover:bg-primary/10 rounded-full"><MessageCircle className="w-5 h-5"/></button>
                </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHandymanView = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
          <p className="text-gray-500">Find and manage maintenance requests in your area.</p>
        </div>
        <div className="flex p-1 bg-white border border-gray-200 rounded-xl">
           <button onClick={() => setHandymanTab("open")} className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${handymanTab === "open" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}>Open Jobs</button>
           <button onClick={() => setHandymanTab("my")} className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${handymanTab === "my" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}>My Active Jobs</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {handymanTab === "open" && (openJobs.length === 0 ? <p className="text-gray-500 text-center py-10">No open jobs currently available.</p> : openJobs.map(job => (
           <div key={job.request_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Wrench className="w-4 h-4"/> {job.issue_type}</span>
                    <span className="text-sm text-gray-400">{new Date(job.created_at).toLocaleDateString()}</span>
                 </div>
                 <h3 className="font-semibold text-gray-800 text-lg mb-1">{job.property?.title}</h3>
                 <p className="text-gray-500 text-sm mb-3 flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.property?.address}</p>
                 <p className="text-gray-700">{job.description}</p>
              </div>
              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                 <button onClick={() => assignJob(job.request_id)} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:bg-primary/90 transition text-center">Accept Job</button>
              </div>
           </div>
        )))}

        {handymanTab === "my" && (activeJobs.length === 0 ? <p className="text-gray-500 text-center py-10">You have no active or completed assignments.</p> : activeJobs.map(job => (
           <div key={job.request_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">{job.issue_type}</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${job.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{job.status}</span>
                 </div>
                 <h3 className="font-semibold text-gray-800 text-lg mb-1">{job.property?.title}</h3>
                 <p className="text-gray-500 text-sm mb-3 flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.property?.address}</p>
                 <p className="text-gray-700 mb-4">{job.description}</p>
                 
                 <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Tenant Info</p>
                      <p className="text-sm text-blue-600">{job.tenant?.full_name} — {job.tenant?.phone_number}</p>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                 {job.status === 'In Progress' && <button onClick={() => updateJobStatus(job.request_id, 'Completed')} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition text-center mb-3">Mark Completed</button>}
                 {job.status === 'Assigned' && <button onClick={() => updateJobStatus(job.request_id, 'In Progress')} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-yellow-600 transition text-center mb-3">Start Work</button>}
                 <button onClick={() => navigate('/messages')} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-center flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5"/> Message</button>
              </div>
           </div>
        )))}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50">
       {loading ? <div className="text-center py-20 text-gray-500 animate-pulse">Loading Hub...</div> : user.role === 'Handyman' ? renderHandymanView() : renderTenantView()}
    </div>
  );
}
