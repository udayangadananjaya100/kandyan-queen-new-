"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { FaSearch, FaSortAmountDown, FaDownload, FaTimes, FaHistory, FaPlus, FaTrash, FaUserEdit, FaStickyNote } from "react-icons/fa";

type Booking = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

type Customer = {
  phone: string;
  name: string;
  visits: number;
  lastVisit: string;
  notes: string;
  history: Booking[];
  isManual: boolean;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"visits-desc" | "visits-asc" | "recent-desc" | "name-asc">("visits-desc");
  
  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // CRUD state
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", notes: "" });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const qBookings = query(collection(db, "bookings"), orderBy("date", "desc"));
      const bookingsSnapshot = await getDocs(qBookings);
      
      const qCustomers = query(collection(db, "customers"));
      const customersSnapshot = await getDocs(qCustomers);
      
      const customerMap: Record<string, Customer> = {};

      customersSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        customerMap[docSnap.id] = {
          phone: docSnap.id,
          name: data.name || "Unknown",
          visits: 0,
          lastVisit: "N/A",
          notes: data.notes || "",
          history: [],
          isManual: true,
        };
      });

      bookingsSnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Booking;
        if (data.phone) {
          const phone = data.phone;
          if (!customerMap[phone]) {
            customerMap[phone] = {
              phone: phone,
              name: data.name || "Unknown",
              visits: 0,
              lastVisit: data.date || "N/A",
              notes: "",
              history: [],
              isManual: false,
            };
          }
          
          customerMap[phone].visits += 1;
          customerMap[phone].history.push({ ...data, id: docSnap.id });
          
          if (data.date && (customerMap[phone].lastVisit === "N/A" || data.date > customerMap[phone].lastVisit)) {
              customerMap[phone].lastVisit = data.date;
              if (!customerMap[phone].isManual) {
                customerMap[phone].name = data.name || customerMap[phone].name;
              }
          }
        }
      });

      setCustomers(Object.values(customerMap));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(term) || c.phone.includes(term)
      );
    }
    result.sort((a, b) => {
      if (sortBy === "visits-desc") return b.visits - a.visits;
      if (sortBy === "visits-asc") return a.visits - b.visits;
      if (sortBy === "recent-desc") {
        if (a.lastVisit === "N/A") return 1;
        if (b.lastVisit === "N/A") return -1;
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      }
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [customers, searchTerm, sortBy]);

  const handleExportCSV = () => {
    const headers = ["Name,Phone Number,Total Bookings,Last Visit Date,Notes\n"];
    const csvData = filteredAndSortedCustomers.map(
      (c) => `"${c.name}","${c.phone}",${c.visits},"${c.lastVisit}","${c.notes.replace(/"/g, '""')}"`
    );
    const blob = new Blob([headers.join("") + csvData.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customers_crm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return alert("Phone number is required!");
    
    setSaving(true);
    try {
      await setDoc(doc(db, "customers", formData.phone.trim()), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        notes: formData.notes.trim(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setShowAddForm(false);
      setIsEditing(false);
      setFormData({ name: "", phone: "", notes: "" });
      if (selectedCustomer) {
        setSelectedCustomer({
          ...selectedCustomer,
          name: formData.name,
          phone: formData.phone,
          notes: formData.notes,
          isManual: true
        });
      }
      await fetchCustomers();
    } catch (error) {
      console.error("Error saving customer", error);
      alert("Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (phone: string) => {
    if (confirm("Are you sure you want to delete this customer's manual profile? Their past bookings will NOT be deleted.")) {
      try {
        await deleteDoc(doc(db, "customers", phone));
        setSelectedCustomer(null);
        setIsEditing(false);
        await fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer", error);
        alert("Failed to delete customer profile.");
      }
    }
  };

  const openAddForm = () => {
    setFormData({ name: "", phone: "", notes: "" });
    setShowAddForm(true);
  };

  const openEditForm = (customer: Customer) => {
    setFormData({ name: customer.name, phone: customer.phone, notes: customer.notes });
    setIsEditing(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-on-surface">Customers (CRM)</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90 transition-all shadow-sm"
          >
            <FaPlus /> Add Customer
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 rounded-lg bg-surface-card border border-primary/20 px-4 py-2 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-on-surface">Add New Customer</h3>
            <button onClick={() => setShowAddForm(false)} className="text-on-surface-muted hover:text-primary"><FaTimes/></button>
          </div>
          <form onSubmit={handleSaveCustomer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Phone Number (ID)</label>
              <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Private Notes</label>
              <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary" placeholder="e.g. VIP client, allergic to some products..." />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-primary/20 bg-surface py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <FaSortAmountDown className="text-on-surface-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-primary/20 bg-surface px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary transition-all"
            style={{ colorScheme: 'dark' }}
          >
            <option value="visits-desc" className="bg-white text-black">Most Bookings</option>
            <option value="visits-asc" className="bg-white text-black">Least Bookings</option>
            <option value="recent-desc" className="bg-white text-black">Most Recent Visit</option>
            <option value="name-asc" className="bg-white text-black">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary/20 bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20 bg-background text-on-surface-muted">
            <tr>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Name</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Phone Number</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Total Bookings</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Last Visit Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-muted">
                  Loading CRM data...
                </td>
              </tr>
            ) : filteredAndSortedCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-muted">
                  No customers found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedCustomers.map((c) => (
                <tr key={c.phone} className="hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                  <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-2">
                    {c.name}
                    {c.notes && <FaStickyNote className="text-primary opacity-70" title="Has Notes" />}
                  </td>
                  <td className="px-6 py-4 text-on-surface-muted">{c.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/30">
                      {c.visits} Bookings
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-muted">{c.lastVisit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer History & Edit Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-primary/20 bg-surface shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-primary/10 p-6">
              <div>
                <h3 className="text-2xl font-bold text-on-surface">{selectedCustomer.name}</h3>
                <p className="text-sm text-on-surface-muted mt-1">📞 {selectedCustomer.phone} • {selectedCustomer.visits} Total Bookings</p>
              </div>
              <div className="flex gap-4 items-center">
                {!isEditing && (
                  <button onClick={() => openEditForm(selectedCustomer)} className="text-primary hover:text-primary-light transition-colors" title="Edit Profile">
                    <FaUserEdit className="text-xl" />
                  </button>
                )}
                {selectedCustomer.isManual && (
                  <button onClick={() => handleDeleteCustomer(selectedCustomer.phone)} className="text-red-500 hover:text-red-400 transition-colors" title="Delete Manual Profile">
                    <FaTrash className="text-xl" />
                  </button>
                )}
                <button 
                  onClick={() => { setSelectedCustomer(null); setIsEditing(false); }}
                  className="rounded-full p-2 text-on-surface-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {isEditing ? (
                <form onSubmit={handleSaveCustomer} className="space-y-4 rounded-xl border border-primary/20 bg-background p-4">
                  <h4 className="font-semibold text-on-surface mb-2">Edit Customer Profile</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-on-surface-muted">Name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-surface px-4 py-2 text-sm text-on-surface outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-on-surface-muted">Phone Number</label>
                      <input type="text" required disabled value={formData.phone} className="w-full rounded-lg border border-primary/20 bg-surface px-4 py-2 text-sm text-on-surface-muted outline-none cursor-not-allowed opacity-70" title="Phone number acts as ID and cannot be changed" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-on-surface-muted">Private Notes</label>
                    <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full rounded-lg border border-primary/20 bg-surface px-4 py-2 text-sm text-on-surface outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90 disabled:opacity-50">
                      {saving ? "Saving..." : "Update Profile"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg border border-primary/50 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                selectedCustomer.notes && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 relative">
                    <div className="absolute -top-3 left-4 bg-surface px-2 text-xs font-bold text-primary flex items-center gap-1">
                      <FaStickyNote /> Notes
                    </div>
                    <p className="text-sm text-on-surface pt-2">{selectedCustomer.notes}</p>
                  </div>
                )
              )}

              <div>
                <h4 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <FaHistory className="text-primary" /> Booking History
                </h4>
                
                {selectedCustomer.history.length === 0 ? (
                  <div className="text-sm text-on-surface-muted">No booking history available.</div>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.history.map((booking) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-primary/10 bg-background p-4 transition-all hover:border-primary/30">
                        <div>
                          <h5 className="font-bold text-on-surface text-lg">{booking.service}</h5>
                          <div className="text-sm text-on-surface-muted mt-1 flex items-center gap-3">
                            <span>📅 {booking.date}</span>
                            <span>⏰ {booking.time}</span>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            booking.status === "pending" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500" :
                            booking.status === "confirmed" ? "border-blue-500/50 bg-blue-500/10 text-blue-500" :
                            "border-green-500/50 bg-green-500/10 text-green-500"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
