"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FaTrash, FaUpload } from "react-icons/fa";
import Image from "next/image";

type GalleryImage = {
  id: string;
  url: string;
  name: string;
  category: string;
};

const categories = ["Hair", "Makeup", "Skincare", "Nails", "Spa", "Salon"];

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "gallery"));
      const data: GalleryImage[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      setImages(data);
    } catch (error) {
      console.error("Error fetching images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error("Upload error", error);
        setUploading(false);
        alert("Failed to upload image. Ensure Firebase Storage rules are set to allow writes for authenticated users.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "gallery"), {
          url,
          name: file.name,
          category: selectedCategory
        });
        setUploading(false);
        setProgress(0);
        fetchImages();
      }
    );
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const fileRef = ref(storage, image.url);
      await deleteObject(fileRef).catch(err => console.warn("Storage file might be already deleted or inaccessible", err));
      
      await deleteDoc(doc(db, "gallery", image.id));
      fetchImages();
    } catch (error) {
      console.error("Error deleting image", error);
      alert("Failed to delete image.");
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-on-surface">Gallery Management</h2>
      
      <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-on-surface">Upload New Image</h3>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-on-surface-muted">Select Category</label>
          <select 
            className="w-full max-w-xs rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={uploading}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-white text-black">{cat}</option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-background py-10 hover:border-primary/60 transition-colors">
          <FaUpload className="mb-3 text-3xl text-primary/70" />
          <span className="text-sm font-medium text-on-surface-muted">
            {uploading ? `Uploading... ${Math.round(progress)}%` : "Click to select or drag and drop an image"}
          </span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload} 
            disabled={uploading} 
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full text-center text-on-surface-muted">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="col-span-full text-center text-on-surface-muted">No images found. Upload some!</div>
        ) : (
          images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-primary/20 bg-surface">
              <Image src={img.url} alt={img.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(img)}
                  className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
              <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                {img.category}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
