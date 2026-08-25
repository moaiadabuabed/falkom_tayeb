function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", message: "" });
  const [status, setStatus] = useState("");
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setStatus("Sending...");
    try {
      await apiRequest("/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      saveContactMessage(form);
      setStatus("Your message was sent successfully.");
      setForm({ name: "", email: "", phone: "", eventType: "", message: "" });
    }
    catch {
      saveContactMessage(form);
      setStatus("Thanks! We'll be in touch shortly.");
      setForm({ name: "", email: "", phone: "", eventType: "", message: "" });
    }
  };
  return <section className="page"><p className="eyebrow">CONTACT US</p><h1 className="page-title">LET'S CREATE SOMETHING <b>EXTRAORDINARY</b></h1>
    <p className="intro">We would love to hear about your event. Get in touch with us and our team will be happy to assist you.</p>
    <div className="contact-layout">
      <div className="contact-info">
        <div className="footer-item"><Phone size={16} /><div><small>PHONE</small><p>+971 50 664 2554</p></div></div>
        <div className="footer-item"><Mail size={16} /><div><small>EMAIL</small><p>falkomtayyeb2024@gmail.com</p></div></div>
        <div className="footer-item"><MapPin size={16} /><div><small>LOCATION</small><p>Abu Dhabi, UAE</p></div></div>
        <div className="footer-item"><Clock size={16} /><div><small>WORKING HOURS</small><p>Every day 24/7</p></div></div>
      </div>
      <form className="card form-card" onSubmit={submit}>
        <p className="eyebrow">SEND US A MESSAGE</p>
        <div className="two-col"><Field label="Full Name" name="name" value={form.name} onChange={change} placeholder="Enter your full name" icon={<User />} required /><Field label="Email Address" name="email" type="email" value={form.email} onChange={change} placeholder="Enter your email" icon={<Mail />} required /></div>
        <div className="two-col"><Field label="Phone Number" name="phone" value={form.phone} onChange={change} placeholder="Enter your phone number" icon={<Phone />} required /><Field label="Event Type" name="eventType" value={form.eventType} onChange={change} placeholder="e.g. Wedding, Conference" icon={<Tag />} /></div>
        <label className="field"><span>Message</span><textarea name="message" value={form.message} onChange={change} placeholder="Tell us about your event..." required /></label>
        {status && <p className="status">{status}</p>}
        <button className={goldButton} type="submit">SEND MESSAGE <ArrowRight size={14} /></button>
      </form>
    </div>
  </section>;
}