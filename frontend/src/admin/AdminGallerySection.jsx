import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { getCustomGalleryImages, addCustomGalleryImage, removeCustomGalleryImage, GALLERY_EVENT } from "../services/store.js";
import { galleryFilters, goldButton } from "../data/constants.js";

function AdminGalleryList() {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    const data = await getCustomGalleryImages();
    setImages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadImages();
    window.addEventListener(GALLERY_EVENT, loadImages);
    return () => window.removeEventListener(GALLERY_EVENT, loadImages);
  }, []);

  if (images.length === 0) return null;

  return (
    <div style={{ marginTop: 26 }}>
      <p className="eyebrow">UPLOADED PHOTOS ({images.length})</p>
      <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10 }}>
        {images.map(img => (
          <div className="gallery-item" key={img.id || img._id} style={{ position: "relative" }}>
            <img src={img.src || img.imageUrl} alt={img.category} style={{ height: 110 }} />
            <button type="button" className="icon-btn" style={{ position: "absolute", top: 6, right: 6 }} onClick={async () => { await removeCustomGalleryImage(img.id || img._id); loadImages(); }} aria-label="Remove photo">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminGallerySection() {
  const galleryCategories = galleryFilters.filter(f => f !== "ALL");
  const [category, setCategory] = useState(galleryCategories[0]);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");

  const onFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPreview(reader.result); setStatus(""); };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!preview) { setStatus("Choose an image first."); return; }
    await addCustomGalleryImage(category, preview);
    setPreview("");
    setStatus(`Image added to ${category}.`);
  };

  return (
    <div className="card form-card admin-block">
      <p className="eyebrow">ADD A PHOTO</p>
      <div className="admin-two" style={{ alignItems: "flex-start" }}>
        <select className="admin-select" value={category} onChange={e => setCategory(e.target.value)}>
          {galleryCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="admin-upload-box" style={{ width: 160 }}>
          {preview ? <img src={preview} alt="Preview" /> : <ImageIcon size={26} />}
        </div>
      </div>
      <label className="button outline" style={{ display: "inline-flex", marginTop: 14, cursor: "pointer" }}>
        <ImageIcon size={14} /> CHOOSE AN IMAGE
        <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      </label>
      {status && <p className="status">{status}</p>}
      <div style={{ marginTop: 18 }}>
        <button type="button" className={goldButton} onClick={submit}>SUBMIT</button>
      </div>
      <AdminGalleryList />
    </div>
  );
}