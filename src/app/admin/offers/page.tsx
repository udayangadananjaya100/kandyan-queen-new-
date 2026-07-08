"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FaTrash, FaEdit } from "react-icons/fa";
import Image from "next/image";

type Offer = {
  id: string;
  title: string;
  sub: string;
  free: string;
  img: string;
};

export default function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({ title: "", sub: "", free: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "offers"));
      const data: Offer[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Offer);
      });
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingOfferId) {
      alert("Please select an image");
      return;
    }

    setUploading(true);
    let imgUrl = "";

    // If there is a new image, upload it
    if (imageFile) {
      const storageRef = ref(storage, `offers/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      imgUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
          (error) => {
            console.error("Upload error", error);
            reject(error);
          },
          async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
        );
      });
    } else if (editingOfferId) {
      // If editing but no new image, keep the existing image url
      const existingOffer = offers.find(o => o.id === editingOfferId);
      if (existingOffer) imgUrl = existingOffer.img;
    }

    try {
      if (editingOfferId) {
        await updateDoc(doc(db, "offers", editingOfferId), {
          ...formData,
          ...(imageFile && { img: imgUrl }) // only update img if new file
        });
      } else {
        await addDoc(collection(db, "offers"), {
          ...formData,
          img: imgUrl
        });
      }
      
      setUploading(false);
      setProgress(0);
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error("Error saving offer", error);
      setUploading(false);
      alert("Failed to save offer.");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", sub: "", free: "" });
    setImageFile(null);
    setEditingOfferId(null);
    const fileInput = document.getElementById("offerImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setFormData({ title: offer.title, sub: offer.sub, free: offer.free });
    // Reset file input
    const fileInput = document.getElementById("offerImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (offer: Offer) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    
    try {
      if (offer.img.includes("firebasestorage")) {
        const fileRef = ref(storage, offer.img);
        await deleteObject(fileRef).catch(err => console.warn(err));
      }
      await deleteDoc(doc(db, "offers", offer.id));
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer", error);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-on-surface">Special Offers Management</h2>
      
      <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-on-surface">
              {editingOfferId ? "Edit Offer" : "Create New Offer"}
            </h3>
            {editingOfferId && (
              <button 
                onClick={resetForm}
                className="text-xs font-medium text-on-surface-muted hover:text-on-surface"
              >
                Cancel Edit
              </button>
            )}
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Offer Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. BRIDAL PACKAGE" 
              className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary w-full" 
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Subtitle / Description</label>
            <input 
              type="text" 
              required
              value={formData.sub}
              onChange={(e) => setFormData({...formData, sub: e.target.value})}
              placeholder="e.g. Book your special day with us" 
              className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary w-full" 
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Free Item / Tagline</label>
            <input 
              type="text" 
              required
              value={formData.free}
              onChange={(e) => setFormData({...formData, free: e.target.value})}
              placeholder="e.g. Free Haircut" 
              className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary w-full" 
            />
          </div>
          <div className="sm:col-span-2 mt-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Offer Image</label>
            <div className="flex items-center gap-4">
              <input 
                id="offerImage"
                type="file" 
                accept="image/*" 
                required={!editingOfferId}
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="text-sm text-on-surface-muted file:mr-4 file:rounded-full file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/30"
              />
              {uploading && <span className="text-sm text-primary">Uploading {Math.round(progress)}%...</span>}
            </div>
          </div>
          <div className="sm:col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={uploading}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {editingOfferId ? "Update Offer" : "Add Offer"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary/20 bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20 bg-background text-on-surface-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Subtitle</th>
              <th className="px-6 py-4 font-medium">Free Item</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-muted">Loading offers...</td></tr>
            ) : offers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-muted">No offers found.</td></tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-primary/20">
                      <Image src={offer.img} alt={offer.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-on-surface">{offer.title}</td>
                  <td className="px-6 py-4 text-on-surface-muted">{offer.sub}</td>
                  <td className="px-6 py-4 text-primary font-medium">{offer.free}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(offer)} className="text-xs font-medium text-blue-500 hover:underline">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(offer)} className="text-xs font-medium text-red-500 hover:underline">
                      <FaTrash className="inline mr-1" /> Delete
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



