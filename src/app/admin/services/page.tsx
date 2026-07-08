"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function ServicesPage() {
  const [services, setServices] = useState<{id: string, name: string}[]>([]);
  const [newService, setNewService] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "services"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setServices(data);
    } catch (error) {
      console.error("Error fetching services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, "services", editingId), { name: newService.trim() });
      } else {
        await addDoc(collection(db, "services"), { name: newService.trim() });
      }
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service", error);
    }
  };

  const resetForm = () => {
    setNewService("");
    setEditingId(null);
  };

  const handleEdit = (service: {id: string, name: string}) => {
    setEditingId(service.id);
    setNewService(service.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, "services", id));
        fetchServices();
      } catch (error) {
        console.error("Error deleting service", error);
      }
    }
  };

  if (loading) return <div className="text-on-surface-muted">Loading services...</div>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-on-surface">Services Management</h2>
      
      <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-on-surface">
          {editingId ? "Edit Service" : "Add New Service"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Service name (e.g., Hair Coloring)"
            className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="rounded-lg border border-primary/50 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/20 bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20 bg-background text-on-surface-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {services.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-on-surface-muted">
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-primary/5">
                  <td className="px-6 py-4 font-medium text-on-surface">{service.name}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-xs font-medium text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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
    </div>
  );
}



