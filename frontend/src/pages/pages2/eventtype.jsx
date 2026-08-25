const eventTypes = [
  ["CORPORATE EVENTS", "Conferences, seminars, product launches, gala dinners and more.", Building2],
  ["WEDDINGS", "Full wedding planning and exceptional celebrations.", Heart], ["PRIVATE EVENTS", "Birthday parties, anniversaries and private celebrations.", Users],
  ["FASHION SHOWS", "Runway shows, model management and fashion events.", Sparkles], ["EXHIBITIONS", "Exhibition design, booth construction and management.", Store],
  ["GRADUATIONS", "School and university graduation ceremonies and parties.", GraduationCap], ["FESTIVALS & CULTURAL", "Festivals, cultural shows and community celebrations.", PartyPopper],
  ["GOVERNMENT EVENTS", "Official ceremonies and government gatherings.", Landmark], ["OTHER", "Can't find your event type? Let us know your requirements.", MoreHorizontal],
];
function EventType() {
  const navigate = useNavigate(); const [selected, setSelected] = useState("CORPORATE EVENTS");
  return <section className="page"><p className="eyebrow">STEP 2 OF 5</p><h1 className="page-title">EVENT TYPE</h1><p className="intro">Select the type of event you are planning.</p>
    <div className="event-type-grid">{eventTypes.map(([title, desc, Icon]) => <button className={`card type-card ${selected === title ? "selected" : ""}`} key={title} onClick={() => setSelected(title)}><Icon size={32} /><h3>{title}</h3><p>{desc}</p><span className="radio">{selected === title && "•"}</span></button>)}</div>
    <Actions previous={() => navigate("/event-details")} next="NEXT STEP →" onNext={() => { localStorage.setItem("eventType", selected); navigate("/packages"); }} />
  </section>;
}