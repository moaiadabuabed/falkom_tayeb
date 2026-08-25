function EventDetails() {
  const navigate = useNavigate();
  const user = useAuth();
  const saved = JSON.parse(localStorage.getItem("eventDetails") || "{}");
  const [data, setData] = useState({ fullName: "", eventName: "", eventDate: "", guestCount: "", location: "", phone: "", eventDescription: "", specialRequest: "", ...saved });
  const [attachments, setAttachments] = useState(saved.attachments || []);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const change = e => setData({ ...data, [e.target.name]: e.target.value });
  const onFiles = e => setAttachments([...e.target.files].map(f => f.name));
  const submit = e => {
    e.preventDefault();
    localStorage.setItem("eventDetails", JSON.stringify({ ...data, attachments }));
    if (user) upsertUser({ username: data.fullName || user.username, email: user.email });
    navigate("/event-type");
  };
  return <section className="page"><h1 className="page-title">EVENT DETAILS</h1><p className="intro">Enter the essential details about your upcoming event to help us tailor the perfect experience.</p>
    <form className="card form-card" onSubmit={submit}>
      <p className="eyebrow">① BASIC EVENT INFORMATION</p>
      <Field label="Full Name" name="fullName" value={data.fullName} onChange={change} placeholder="Enter your full name" icon={<User />} required />
      <Field label="Event Name" name="eventName" value={data.eventName} onChange={change} placeholder="e.g. Annual Tech Conference, Wedding Reception" icon={<Type />} required />
      <div className="two-col"><Field label="Event Date" name="eventDate" type="date" min={minDate} value={data.eventDate} onChange={change} icon={<Calendar />} required /><Field label="Expected Guests Count" name="guestCount" type="number" min="1" value={data.guestCount} onChange={change} placeholder="e.g. 250" icon={<Users />} required /></div>
      <div className="two-col"><Field label="Location / Venue" name="location" value={data.location} onChange={change} placeholder="e.g. St. Regis Hotel, Hall A" icon={<MapPin />} required /><Field label="Phone Number" name="phone" type="tel" value={data.phone} onChange={change} placeholder="e.g. +971 50 000 0000" icon={<Phone />} required /></div>
      <label className="field"><span>Event Details</span><textarea name="eventDescription" value={data.eventDescription} onChange={change} placeholder="Describe your event in more detail — theme, style, vision..." /></label>
      <label className="upload"><span>Upload Image or File (optional)</span><input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={onFiles} />{attachments.length > 0 && <small>{attachments.length} file(s) selected</small>}</label>
      <label className="field"><span>Special Request / Notes</span><textarea name="specialRequest" value={data.specialRequest} onChange={change} placeholder="Any special requests or notes for our team..." /></label>
      <Actions next="NEXT STEP →" />
    </form>
  </section>;
}
