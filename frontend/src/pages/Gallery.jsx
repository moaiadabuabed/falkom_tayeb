import React, { useEffect, useState } from "react";
import { getCustomGalleryImages, GALLERY_EVENT } from "../services/store.js";
import { galleryImages, galleryFilters, GALLERY_FALLBACK } from "../data/constants.js";

export default function Gallery() {
  const [active, setActive] = useState("ALL");
  const [uploaded, setUploaded] = useState([]);

  const fetchUploaded = async () => {
    try {
      const data = await getCustomGalleryImages();
      setUploaded(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setUploaded([]);
    }
  };

  useEffect(() => {
    fetchUploaded();
    window.addEventListener(GALLERY_EVENT, fetchUploaded);
    window.addEventListener("storage", fetchUploaded);
    return () => {
      window.removeEventListener(GALLERY_EVENT, fetchUploaded);
      window.removeEventListener("storage", fetchUploaded);
    };
  }, []);

  const safeUploaded = Array.isArray(uploaded) ? uploaded : [];
  const safeGalleryImages = Array.isArray(galleryImages) ? galleryImages : [];

  const allImages = [...safeUploaded, ...safeGalleryImages];
  const shown = active === "ALL" ? allImages : allImages.filter((img) => img && img.category === active);

  return (
    <section className="page">
      <h1 className="page-title">OUR <b>GALLERY</b></h1>
      <p className="intro">A look at some of the events we've brought to life.</p>
      <div className="gallery-layout">
        <div className="gallery-filters">
          {(galleryFilters || []).map((name) => (
            <button 
              type="button" 
              key={name} 
              className={`button ${active === name ? "gold" : "outline"}`} 
              onClick={() => setActive(name)}
            >
              {name}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="admin-empty">
            No photos yet{active !== "ALL" ? ` in ${active}` : ""}. The admin can add photos from the admin panel's Gallery tab.
          </p>
        ) : (
          <div className="gallery-grid">
            {shown.map((img, i) => (
              <div className="gallery-item" key={(img.id || "base") + (img.category || "cat") + i}>
                <img 
                  src={img.src || GALLERY_FALLBACK} 
                  alt={img.category || "Gallery image"} 
                  loading="lazy" 
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = GALLERY_FALLBACK; 
                  }} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}