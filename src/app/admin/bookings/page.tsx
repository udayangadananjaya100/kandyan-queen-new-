"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FaCalendarAlt, FaList, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Booking = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed";
  createdAt: any;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    status: "pending" as "pending" | "confirmed" | "completed"
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Booking[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const q = query(collection(db, "services"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setServices(data);
    } catch (error) {
      console.error("Error fetching services", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking", error);
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      if (editingBookingId) {
        await updateDoc(doc(db, "bookings", editingBookingId), {
          ...formData,
        });
      } else {
        await addDoc(collection(db, "bookings"), {
          ...formData,
          createdAt: new Date(),
        });
      }
      resetForm();
      fetchBookings();
    } catch (error) {
      console.error("Error saving booking", error);
      alert("Failed to save booking.");
    } finally {
      setAdding(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", service: "", date: "", time: "", status: "pending" });
    setEditingBookingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setFormData({
      name: booking.name,
      phone: booking.phone,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      status: booking.status
    });
    setShowAddForm(true);
    setSelectedDate(null); // close modal if open
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const blanks = Array(firstDay).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (loading) {
    return <div className="text-on-surface-muted">Loading bookings...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-on-surface">Bookings Management</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-surface p-1 border border-primary/20">
            <button 
              onClick={() => { setViewMode("table"); setShowAddForm(false); resetForm(); }}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "table" ? "bg-primary/20 text-primary" : "text-on-surface-muted hover:text-on-surface"}`}
            >
              <FaList /> Table
            </button>
            <button 
              onClick={() => { setViewMode("calendar"); setShowAddForm(false); resetForm(); }}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "calendar" ? "bg-primary/20 text-primary" : "text-on-surface-muted hover:text-on-surface"}`}
            >
              <FaCalendarAlt /> Calendar
            </button>
          </div>
          
          <button 
            onClick={() => { 
              if (showAddForm) resetForm(); 
              else setShowAddForm(true); 
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90"
          >
            {showAddForm ? "Cancel" : "+ Add Booking"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-on-surface">
            {editingBookingId ? "Edit Booking" : "Create New Booking"}
          </h3>
          <form onSubmit={handleAddSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Phone</label>
              <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Service</label>
              <select 
                required 
                value={formData.service} 
                onChange={(e) => setFormData({...formData, service: e.target.value})} 
                className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" disabled className="bg-white text-black">Select a Service</option>
                {services.map(s => (
                  <option key={s.id} value={s.title} className="bg-white text-black">{s.title}</option>
                ))}
                {/* Fallback if list is empty or editing a deleted service */}
                {formData.service && !services.find(s => s.title === formData.service) && (
                  <option value={formData.service} className="bg-white text-black">{formData.service}</option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Date</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Time</label>
              <input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary">
                <option value="pending" className="bg-white text-black">Pending</option>
                <option value="confirmed" className="bg-white text-black">Confirmed</option>
                <option value="completed" className="bg-white text-black">Completed</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 mt-2">
              <button type="submit" disabled={adding} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90 disabled:opacity-50">
                {adding ? "Saving..." : editingBookingId ? "Update Booking" : "Save Booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-primary/20 bg-surface">
          <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20 bg-background text-on-surface-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-on-surface-muted">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">{booking.name}</td>
                  <td className="px-6 py-4 text-on-surface-muted">{booking.phone}</td>
                  <td className="px-6 py-4 text-on-surface-muted">{booking.service}</td>
                  <td className="px-6 py-4 text-on-surface-muted">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`rounded-lg border px-3 py-1 text-xs font-semibold outline-none ${
                        booking.status === "pending" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500" :
                        booking.status === "confirmed" ? "border-blue-500/50 bg-blue-500/10 text-blue-500" :
                        "border-green-500/50 bg-green-500/10 text-green-500"
                      }`}
                    >
                      <option value="pending" className="bg-white text-black">Pending</option>
                      <option value="confirmed" className="bg-white text-black">Confirmed</option>
                      <option value="completed" className="bg-white text-black">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="text-xs font-medium text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="rounded-xl border border-primary/20 bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={prevMonth} className="rounded-full p-2 hover:bg-primary/10 text-on-surface">
              <FaChevronLeft />
            </button>
            <h3 className="text-xl font-bold text-on-surface">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="rounded-full p-2 hover:bg-primary/10 text-on-surface">
              <FaChevronRight />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-on-surface-muted pb-2 border-b border-primary/20">
                {day}
              </div>
            ))}
            
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[100px] rounded-lg bg-background/50 p-2 opacity-50"></div>
            ))}
            
            {monthDays.map(day => {
              // Construct current day string like "YYYY-MM-DD"
              const monthStr = String(currentMonth.getMonth() + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const dateString = `${currentMonth.getFullYear()}-${monthStr}-${dayStr}`;
              
              // Find bookings for this day
              const dayBookings = bookings.filter(b => b.date === dateString);
              
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDate(dateString)}
                  className="min-h-[100px] cursor-pointer rounded-lg border border-primary/10 bg-background p-2 transition-colors hover:border-primary/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-on-surface-muted">
                      {dayBookings.length > 0 ? `${dayBookings.length} Bookings` : ""}
                    </span>
                    <span className="text-sm font-semibold text-on-surface-muted">{day}</span>
                  </div>
                  <div className="space-y-1.5">
                    {dayBookings.slice(0, 3).map(booking => (
                      <div key={booking.id} className="flex flex-col gap-1 rounded bg-surface p-1.5 text-xs border border-primary/5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface truncate">{booking.time}</span>
                          <span className={`h-2 w-2 rounded-full ${booking.status === 'completed' ? 'bg-green-500' : booking.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                        </div>
                        <span className="truncate text-on-surface-muted">{booking.name}</span>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-center text-xs font-medium text-primary">+{dayBookings.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Bookings Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-primary/20 bg-surface p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-on-surface">Bookings for {selectedDate}</h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-on-surface-muted hover:text-primary font-bold text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              {bookings.filter(b => b.date === selectedDate).length === 0 ? (
                <div className="text-center text-on-surface-muted py-8">No bookings for this date.</div>
              ) : (
                bookings.filter(b => b.date === selectedDate).map(booking => (
                  <div key={booking.id} className="rounded-lg border border-primary/10 bg-background p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-on-surface text-lg">{booking.name}</h4>
                        <div className="text-sm text-on-surface-muted mt-1">
                          <span className="block">📞 {booking.phone}</span>
                          <span className="block mt-1">💆‍♀️ {booking.service}</span>
                          <span className="block mt-1">⏰ {booking.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className={`rounded-lg border px-3 py-1 text-xs font-semibold outline-none ${
                            booking.status === "pending" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500" :
                            booking.status === "confirmed" ? "border-blue-500/50 bg-blue-500/10 text-blue-500" :
                            "border-green-500/50 bg-green-500/10 text-green-500"
                          }`}
                        >
                          <option value="pending" className="bg-white text-black">Pending</option>
                          <option value="confirmed" className="bg-white text-black">Confirmed</option>
                          <option value="completed" className="bg-white text-black">Completed</option>
                        </select>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-xs font-medium text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



