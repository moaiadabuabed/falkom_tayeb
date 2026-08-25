function RequireAuth({ children }) {
  const navigate = useNavigate();
  const user = useAuth();
  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem("afterLogin", window.location.pathname);
      navigate("/login", { replace: true, state: { from: window.location.pathname } });
    }
  }, [navigate, user]);
  return getToken() ? children : null;
}

function AuthPage({ signup = false }) {
  const navigate = useNavigate(); const location = useLocation(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [username, setUsername] = useState(""); const [confirmPassword, setConfirmPassword] = useState(""); const [error, setError] = useState("");
  const submit = async e => {
    e.preventDefault(); setError("");
    if (!signup && email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
      setAdminAuth();
      navigate("/admin", { replace: true });
      return;
    }
    if (signup && password !== confirmPassword) { setError("Passwords do not match."); return; }
    const fallbackName = username || (email ? email.split("@")[0] : "Guest");
    try {
      const data = await apiRequest(signup ? "/auth/register" : "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }) });
      setAuth(data.token || "session-token", data.user || { username: fallbackName, email });
      if (signup) upsertUser({ username: fallbackName, email });
      const destination = location.state?.from || localStorage.getItem("afterLogin") || "/";
      localStorage.removeItem("afterLogin");
      navigate(destination, { replace: true });
    } catch (err) {
      /*
        The UI can still be tested before the backend is installed.
        A real API response is always used when the backend is available.
      */
      if (isOffline(err)) {
        setAuth("local-demo-token", { username: fallbackName, email });
        if (signup) upsertUser({ username: fallbackName, email });
        const destination = location.state?.from || localStorage.getItem("afterLogin") || "/";
        localStorage.removeItem("afterLogin");
        navigate(destination, { replace: true });
      } else setError(err.message);
    }
  };
  return <section className="auth-page"><div className="auth-card"><div className="auth-intro"><Logo compact /><h2>{signup ? <>CREATE YOUR <em>ACCOUNT</em></> : <>WELCOME <em>BACK</em></>}</h2><p>{signup ? "Join Falkom Tayyeb and let's create extraordinary events together." : "Log in to your account to manage events, requests and quotations."}</p><div className="auth-benefits"><span>✦ Secure and Reliable</span><span>◷ Save Time</span><span>✧ Personalized Experience</span></div></div><div className="auth-form"><h3>{signup ? "SIGN UP" : "LOG IN"}</h3><p>{signup ? "Create your account to get started" : "Enter your credentials to continue"}</p><form onSubmit={submit}>{signup && <Field label="Username" icon={<User />} value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required />}<Field label="Email Address" icon={<Mail />} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required /><Field label="Password" icon={<Lock />} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={signup ? "Create a password" : "Enter your password"} required />{signup && <Field label="Confirm Password" icon={<Lock />} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />}{error && <p className="error">{error}</p>}<button className={goldButton}>{signup ? "CREATE ACCOUNT" : "LOG IN"} <ArrowRight size={14} /></button></form><p className="auth-switch">{signup ? "Already have an account? " : "Don't have an account? "}<Link to={signup ? "/login" : "/signup"}>{signup ? "Log In" : "Sign Up"}</Link></p></div></div></section>;
}