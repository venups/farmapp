import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ListTodo, 
  ArrowLeft, 
  Trash2, 
  MoreVertical,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/trips';

const App = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // New trip form state
  const [newTrip, setNewTrip] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(API_BASE);
      setTrips(resp.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(API_BASE, newTrip);
      setTrips([...trips, resp.data]);
      setIsCreating(false);
      setNewTrip({ destination: '', start_date: '', end_date: '', description: '' });
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTrips(trips.filter(t => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  const handleAddItinerary = async (tripId, item) => {
    try {
      const resp = await axios.post(`${API_BASE}/${tripId}/itineraries`, item);
      setSelectedTrip(resp.data);
    } catch (err) { console.error(err); }
  };

  const handleAddBudget = async (tripId, item) => {
    try {
      const resp = await axios.post(`${API_BASE}/${tripId}/budgets`, item);
      setSelectedTrip(resp.data);
    } catch (err) { console.error(err); }
  };

  const handleAddChecklist = async (tripId, item) => {
    try {
      const resp = await axios.post(`${API_BASE}/${tripId}/checklists`, item);
      setSelectedTrip(resp.data);
    } catch (err) { console.error(err); }
  };

  const handleToggleChecklist = async (tripId, itemId) => {
    try {
      const resp = await axios.patch(`${API_BASE}/${tripId}/checklists/${itemId}`);
      setSelectedTrip(resp.data);
    } catch (err) { console.error(err); }
  };

  // Views
  const Dashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Travels</h1>
          <p className="text-slate-500 text-sm mt-1">Plan your next adventures and track memories.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} /> New Trip
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Briefcase size={20} />
            <span className="font-semibold text-sm uppercase tracking-wider">Total Trips</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{trips.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <CheckCircle2 size={20} />
            <span className="font-semibold text-sm uppercase tracking-wider">Active Tasks</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {trips.reduce((acc, trip) => acc + trip.checklists.filter(c => !c.is_completed).length, 0)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate.100">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <DollarSign size={20} />
            <span className="font-semibold text-sm uppercase tracking-wider">Est. Budget</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ${trips.reduce((acc, trip) => acc + trip.budgets.reduce((bAcc, b) => bAcc + b.amount, 0), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Trips List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No trips planned yet. Start by creating your first one!</p>
          </div>
        ) : (
          trips.map((trip) => (
            <motion.div 
              key={trip.id}
              layoutId={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                 <div className="absolute bottom-4 left-4 text-white">
                   <h3 className="text-xl font-bold">{trip.destination}</h3>
                   <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                     <Calendar size={12} /> {trip.start_date} - {trip.end_date}
                   </div>
                 </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-3 text-slate-500 text-xs">
                    <span className="flex items-center gap-1"><ListTodo size={14}/> {trip.checklists.length}</span>
                    <span className="flex items-center gap-1"><DollarSign size={14}/> ${trip.budgets.reduce((a,b)=>a+b.amount,0).toFixed(0)}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal: Create Trip */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Plan a New Trip</h2>
              </div>
              <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Tokyo, Japan"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newTrip.start_date}
                      onChange={(e) => setNewTrip({...newTrip, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newTrip.end_date}
                      onChange={(e) => setNewTrip({...newTrip, end_date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                    placeholder="Tell us about the trip..."
                    value={newTrip.description}
                    onChange={(e) => setNewTrip({...newTrip, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Create Trip
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const TripDetail = ({ trip }) => {
    const [itineraryItem, setItineraryItem] = useState({ date: '', activity: '', location: '' });
    const [budgetItem, setBudgetItem] = useState({ category: '', amount: '', description: '' });
    const [checklistItem, setChecklistItem] = useState({ content: '', is_completed: false });

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-5xl mx-auto p-6"
      >
        <button 
          onClick={() => setSelectedTrip(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative p-8 flex items-end">
             <div className="text-white">
               <h1 className="text-4xl font-bold">{trip.destination}</h1>
               <div className="flex items-center gap-4 mt-2 text-white/80 font-medium">
                 <span className="flex items-center gap-1"><Calendar size={18} /> {trip.start_date} — {trip.end_date}</span>
                 <span className="flex items-center gap-1"><MapPin size={18} /> Adventure</span>
               </div>
             </div>
          </div>
          <div className="p-8">
            <p className="text-slate-600 leading-relaxed">{trip.description || "No description provided."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="text-indigo-600" size={22} /> Itinerary
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                {trip.itineraries.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-sm font-semibold text-indigo-600 min-w-[80px]">{item.date}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{item.activity}</div>
                      {item.location && <div className="text-sm text-slate-500">{item.location}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    className="text-sm px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Date (YYYY-MM-DD)" 
                    value={itineraryItem.date}
                    onChange={(e) => setItineraryItem({...itineraryItem, date: e.target.value})}
                  />
                  <input 
                    className="text-sm px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Activity" 
                    value={itineraryItem.activity}
                    onChange={(e) => setItineraryItem({...itineraryItem, activity: e.target.value})}
                  />
                  <button 
                    onClick={() => handleAddItinerary(trip.id, itineraryItem)}
                    className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="text-emerald-600" size={22} /> Budget
                </h2>
                <div className="text-lg font-bold text-emerald-600">
                  ${trip.budgets.reduce((a,b) => a + b.amount, 0).toFixed(2)}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {trip.budgets.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <div className="font-semibold text-slate-800">{item.category}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                    <div className="font-bold text-slate-900">${item.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  className="text-sm px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Category" 
                  value={budgetItem.category}
                  onChange={(e) => setBudgetItem({...budgetItem, category: e.target.value})}
                />
                <input 
                  className="text-sm px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  type="number" 
                  placeholder="Amount" 
                  value={budgetItem.amount}
                  onChange={(e) => setBudgetItem({...budgetItem, amount: parseFloat(e.target.value) || 0})}
                />
                <button 
                  onClick={() => handleAddBudget(trip.id, budgetItem)}
                  className="bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Add Budget Item
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <ListTodo className="text-amber-500" size={22} /> Checklist
              </h2>

              <div className="space-y-3 mb-6">
                {trip.checklists.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggleChecklist(trip.id, item.id)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className={`transition-colors ${item.is_completed ? 'text-emerald-500' : 'text-slate-300'}`}>
                      <CheckCircle2 size={22} />
                    </div>
                    <span className={`text-sm flex-1 ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                      {item.content}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <input 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="New item..." 
                  value={checklistItem.content}
                  onChange={(e) => setChecklistItem({...checklistItem, content: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddChecklist(trip.id, checklistItem);
                      setChecklistItem({ content: '', is_completed: false });
                    }
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      <AnimatePresence mode="wait">
        {selectedTrip ? (
          <TripDetail key={selectedTrip.id} trip={selectedTrip} />
        ) : (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
