function Gallery() {
  const [active, setActive] = useState("ALL");
  const [uploaded, setUploaded] = useState(getCustomGalleryImages());
  useEffect(() => {
    const sync = () => setUploaded(getCustomGalleryImages());
    window.addEventListener(GALLERY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(GALLERY_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const allImages = [...uploaded, ...galleryImages];
  const shown = active === "ALL" ? allImages : allImages.filter(img => img.category === active);
  return <section className="page"><h1 className="page-title">OUR <b>GALLERY</b></h1><p className="intro">A look at some of the events we've brought to life.</p>
    <div className="gallery-layout">
      <div className="gallery-filters">{galleryFilters.map(name => <button key={name} className={`button ${active === name ? "gold" : "outline"}`} onClick={() => setActive(name)}>{name}</button>)}</div>
      {shown.length === 0
        ? <p className="admin-empty">No photos yet{active !== "ALL" ? ` in ${active}` : ""}. The admin can add photos from the admin panel's Gallery tab.</p>
        : <div className="gallery-grid">{shown.map((img, i) => <div className="gallery-item" key={(img.id || "base") + img.category + i}><img src={img.src || GALLERY_FALLBACK} alt={img.category} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = GALLERY_FALLBACK; }} /></div>)}</div>}
    </div>
  </section>;
}