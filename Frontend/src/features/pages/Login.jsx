import { useState, useEffect, useRef } from "react";
import { Login, Register } from "../../Service/UserService";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #4F6EF7;
    --blue-dark: #3A56E0;
    --blue-light: #EEF1FE;
    --orange: #F97316;
    --orange-light: #FFF4ED;
    --cream: #FAFAF8;
    --text: #1A1A2E;
    --text-muted: #6B7280;
    --border: #E5E7EB;
    --white: #FFFFFF;
    --success: #10B981;
    --error: #EF4444;
  }

  .auth-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: var(--cream);
    overflow: hidden;
    position: relative;
  }

  /* Left panel */
  .auth-left {
    width: 46%;
    background: linear-gradient(145deg, #1A1A2E 0%, #2D2D5E 50%, #1A1A2E 100%);
    display: flex;
    flex-direction: column;
    padding: 48px 52px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(79,110,247,0.25) 0%, transparent 70%);
    border-radius: 50%;
  }

  .auth-left::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%);
    border-radius: 50%;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .logo-icon {
    width: 40px; height: 40px;
    background: var(--blue);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: -0.3px;
  }

  .left-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    padding: 40px 0;
  }

  .left-tagline {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    line-height: 1.15;
    color: var(--white);
    font-weight: 700;
    margin-bottom: 18px;
    letter-spacing: -0.5px;
  }

  .left-tagline em {
    color: var(--orange);
    font-style: italic;
  }

  .left-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 48px;
    font-weight: 300;
  }


  /* Right panel */
  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 52px;
    position: relative;
  }

  .auth-right::before {
    content: '';
    position: absolute;
    top: 60px; right: 80px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(79,110,247,0.07) 0%, transparent 70%);
    border-radius: 50%;
  }

  .form-container {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 2;
  }

  .form-header {
    margin-bottom: 36px;
  }

  .form-welcome {
    font-size: 13px;
    font-weight: 500;
    color: var(--blue);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
    line-height: 1.1;
    margin-bottom: 10px;
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 300;
    line-height: 1.6;
  }

  /* Tab switcher */
  .tab-switcher {
    display: flex;
    background: var(--blue-light);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 32px;
    gap: 4px;
  }

  .tab-btn {
    flex: 1;
    padding: 11px 20px;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    background: transparent;
    color: var(--text-muted);
  }

  .tab-btn.active {
    background: var(--white);
    color: var(--text);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-weight: 600;
  }

  /* Form fields */
  .field-group {
    margin-bottom: 18px;
  }

  .field-row {
    display: flex;
    gap: 14px;
  }

  .field-row .field-group {
    flex: 1;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 7px;
  }

  .roles { display: flex; gap: 8px; margin-bottom: 14px; }
  .role-pill {
    flex: 1; border: 1.5px solid var(--border); border-radius: 11px;
    padding: 11px 8px; cursor: pointer; background: var(--white);
    text-align: center; transition: all 0.2s;
  }
  .role-pill:hover, .role-pill.on { border-color: var(--blue); background: var(--blue-light); }
  .rp-icon { font-size: 18px; margin-bottom: 3px; }
  .rp-name { display: block; font-size: 11.5px; font-weight: 600; color: var(--text); }
  .rp-desc { display: block; font-size: 9.5px; color: var(--text-muted); }
 
  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 15px;
    pointer-events: none;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--white);
    transition: all 0.2s ease;
    outline: none;
  }

  input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 4px rgba(79,110,247,0.1);
  }

  input.error-input {
    border-color: var(--error);
    box-shadow: 0 0 0 4px rgba(239,68,68,0.08);
  }

  .eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 15px;
    padding: 2px;
    transition: color 0.2s;
  }

  .eye-btn:hover { color: var(--text); }

  .error-msg {
    font-size: 12px;
    color: var(--error);
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .field-hint {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 5px;
  }

  /* Role selector */
  .role-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
  }

  .role-opt {
    flex: 1;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    padding: 13px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--white);
    text-align: center;
  }

  .role-opt:hover {
    border-color: var(--blue);
    background: var(--blue-light);
  }

  .role-opt.selected {
    border-color: var(--blue);
    background: var(--blue-light);
  }

  .role-icon { font-size: 20px; margin-bottom: 4px; }

  .role-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    display: block;
  }

  .role-desc {
    font-size: 10px;
    color: var(--text-muted);
    display: block;
  }



  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 15px;
    background: var(--blue);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 22px;
    letter-spacing: 0.2px;
  }

  .submit-btn:hover {
    background: var(--blue-dark);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79,110,247,0.35);
  }

  .submit-btn:active { transform: translateY(0); }

  .submit-btn.loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .btn-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }


  /* Switch prompt */
  .switch-prompt {
    text-align: center;
    font-size: 13.5px;
    color: var(--text-muted);
  }

  .switch-link {
    color: var(--blue);
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    margin-left: 4px;
  }

  .switch-link:hover { text-decoration: underline; }

  /* Success state */
  .success-overlay {
    text-align: center;
    padding: 20px 0;
  }

  .success-icon {
    width: 70px; height: 70px;
    background: #DCFCE7;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px;
    margin: 0 auto 20px;
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 10px;
  }

  .success-sub {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 28px;
  }

  /* Password strength */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--border);
    transition: background 0.3s ease;
  }

  .strength-label {
    font-size: 11px;
    margin-top: 4px;
    font-weight: 500;
  }

  /* Terms */
  .terms-wrap {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 22px;
  }

  .terms-wrap input {
    width: 16px; height: 16px;
    padding: 0;
    margin-top: 2px;
    accent-color: var(--blue);
    flex-shrink: 0;
  }

  .terms-text {
    font-size: 12.5px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .terms-link {
    color: var(--blue);
    text-decoration: none;
    font-weight: 500;
  }

  /* Animations */
  .slide-in {
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @media (max-width: 768px) {
    .auth-left { display: none; }
    .auth-right { padding: 32px 24px; }
  }
`;

function getPasswordStrength(pwd) {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: "", color: "" },
    { label: "Weak", color: "#EF4444" },
    { label: "Fair", color: "#F97316" },
    { label: "Good", color: "#EAB308" },
    { label: "Strong", color: "#10B981" },
  ];
  return { level: score, ...levels[score] };
}


export default function BookCircleAuth() {
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [Role, setRole] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ Name: "",  email: "", password: "", confirm: "" ,role:""});
  const [errors, setErrors] = useState({});

  const pwdStrength = getPasswordStrength(signupForm.password);


const navigate = useNavigate();
  
    const loginEmailRef = useRef(null);
const loginPwdRef   = useRef(null);

// attached to inputs:




  function validateLogin() {
    const e = {};
    if (!loginForm.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = "Enter a valid email";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  }

  function validateSignup() {
    const e = {};
    if (!signupForm.Name) e.Name = "Required";

    if (!signupForm.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) e.email = "Enter a valid email";
    if (!signupForm.password) e.password = "Password is required";
    else if (signupForm.password.length < 8) e.password = "At least 8 characters";
    if (signupForm.confirm !== signupForm.password) e.confirm = "Passwords don't match";

    return e;
  }

async function handleSubmit() {
  const errs = tab === "login" ? validateLogin() : validateSignup();
  setErrors(errs);

  if (Object.keys(errs).length > 0) return;

  setLoading(true);

  try {
    if (tab === "login") {
      const res = await Login(loginForm);

      console.log("LOGIN SUCCESS:", res.data);

localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess(true);

      navigate("/");

    } else {
const res = await Register({
  Name: signupForm.Name,
  Email: signupForm.email,
  Password: signupForm.password,
  Role: signupForm.role ?? 2 // default to READER
});
      console.log("REGISTER SUCCESS:", res.data);

      setSuccess(true);

      // optional auto switch to login
      setTimeout(() => {
        setTab("login");
        setSuccess(false);
      }, 1500);
    }
  } catch (error) {
    console.log("AUTH ERROR:", error);

    setErrors({
      api: error.response?.data?.message || "Something went wrong"
    });
  } finally {
    setLoading(false);
  }
}

  function switchTab(t) {
    setTab(t); setErrors({}); setSuccess(false);
    setLoginForm({ email: "", password: "" });
    setSignupForm({ Name: "",  email: "", password: "", confirm: "" ,role:""});
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">

        {/* Left panel */}
        <div className="auth-left">
          <div className="logo">
            <div className="logo-icon">📚</div>
            <span className="logo-text">BookCircle</span>
          </div>

          <div className="left-content">
            <h1 className="left-tagline">
              Borrow books.<br />
              <em>Build community.</em><br />
              Connect people.
            </h1>
            <p className="left-sub">
              Join thousands of readers sharing books in their neighbourhoods. Discover new stories, meet fellow bibliophiles.
            </p>



          </div>

   
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="form-container">
            {success ? (
              <div className="success-overlay slide-in">
                <div className="success-icon">✓</div>
                <h2 className="success-title">{tab === "login" ? "Welcome back!" : "Account created!"}</h2>
                <p className="success-sub">
                  {tab === "login"
                    ? "You're all set. Redirecting you to your reading Home…"
                    : "Your BookCircle account is ready. Start discovering books in your area!"}
                </p>
                <button className="submit-btn" onClick={() => { setSuccess(false); setTab("login"); }}>
                  Go to Home →
                </button>
              </div>
            ) : (
              <div className="slide-in">
                <div className="form-header">
                  <div className="form-welcome">{tab === "login" ? "Welcome back" : "Join the circle"}</div>
                  <h2 className="form-title">{tab === "login" ? "Sign in to your account" : "Create your account"}</h2>
                  <p className="form-subtitle">{tab === "login" ? "Pick up where you left off." : "It's free, and takes less than a minute."}</p>
                </div>

                <div className="tab-switcher">
                  <button className={`tab-btn ${tab==="login"?"active":""}`} onClick={() => switchTab("login")}>Sign In</button>
                  <button className={`tab-btn ${tab==="signup"?"active":""}`} onClick={() => switchTab("signup")}>Create Account</button>
                </div>

                {/* SIGNUP EXTRAS */}
                {tab === "signup" && (
                  <>
  <div style={{ marginBottom:14 }}>
                      <label style={{ display:"block", fontSize:12.5, fontWeight:500, color:"var(--text)", marginBottom:8 }}>
                        I want to
                      </label>
<div className="roles">
  {[
    { id: 2, icon: "📖", name: "READER", desc: "Find books" },
    { id: 1, icon: "📦", name: "OWNER", desc: "Share books" }
  ].map(r => (
    <div
      key={r.id}
      className={`role-pill ${signupForm.role === r.id ? "on" : ""}`}
      onClick={() =>
        setSignupForm(f => ({ ...f, role: r.id }))
      }
    >
      <div className="rp-icon">{r.icon}</div>
      <span className="rp-name">{r.name}</span>
      <span className="rp-desc">{r.desc}</span>
    </div>
  ))}
</div>
                    </div>
                    <div className="field-row">
                      <div className="field-group">
                        <label> Name</label>
                        <div className="input-wrap">
                          <span className="input-icon">👤</span>
                          <input type="text" className={errors.Name?"error-input":""} placeholder="Ali" value={signupForm.Name}
                            onChange={e => setSignupForm(f=>({...f,Name:e.target.value}))} />
                        </div>
                        {errors.Name && <div className="error-msg">⚠ {errors.Name}</div>}
                      </div>
           
                    </div>
                  </>
                )}

                {/* EMAIL */}
                <div className="field-group">
                  <label>Email address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉</span>
                   <input
  type="email"
  className={errors.email ? "error-input" : ""}
  placeholder="you@example.com"
  value={tab === "login" ? loginForm.email : signupForm.email}
  onChange={(e) =>
    tab === "login"
      ? setLoginForm((f) => ({ ...f, email: e.target.value }))
      : setSignupForm((f) => ({ ...f, email: e.target.value }))
  }
/>
                  </div>
                  {errors.email && <div className="error-msg">⚠ {errors.email}</div>}
                </div>

                {/* PASSWORD */}
                <div className="field-group">
                  <label>Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                  <input
  type={showPwd ? "text" : "password"}
  value={tab === "login" ? loginForm.password : signupForm.password}
  onChange={(e) =>
    tab === "login"
      ? setLoginForm((f) => ({ ...f, password: e.target.value }))
      : setSignupForm((f) => ({ ...f, password: e.target.value }))
  }
/>
                    <button className="eye-btn" onClick={() => setShowPwd(v=>!v)}>{showPwd?"🙈":"👁"}</button>
                  </div>
                  {errors.password && <div className="error-msg">⚠ {errors.password}</div>}
                  {tab==="signup" && signupForm.password && (
                    <>
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="strength-seg" style={{ background: i<=pwdStrength.level ? pwdStrength.color : undefined }} />
                        ))}
                      </div>
                      <div className="strength-label" style={{ color: pwdStrength.color }}>{pwdStrength.label}</div>
                    </>
                  )}
                </div>

                {/* CONFIRM PASSWORD (signup) */}
                {tab==="signup" && (
                  <div className="field-group">
                    <label>Confirm password</label>
                    <div className="input-wrap">
                      <span className="input-icon">🔒</span>
                      <input type={showConfirm?"text":"password"} className={errors.confirm?"error-input":""}
                        placeholder="Re-enter password"
                        value={signupForm.confirm}
                        onChange={e => setSignupForm(f=>({...f,confirm:e.target.value}))} />
                      <button className="eye-btn" onClick={() => setShowConfirm(v=>!v)}>{showConfirm?"🙈":"👁"}</button>
                    </div>
                    {errors.confirm && <div className="error-msg">⚠ {errors.confirm}</div>}
                  </div>
                )}

                {/* EXTRAS */}
      
                {errors.terms && <div className="error-msg" style={{marginBottom:14}}>⚠ {errors.terms}</div>}

                <button className={`submit-btn ${loading?"loading":""}`} onClick={handleSubmit}>
                  {loading && <span className="btn-spinner"></span>}
                  {loading ? "Please wait…" : tab==="login" ? "Sign In" : "Create Account"}
                </button>


                <div className="switch-prompt">
                  {tab==="login" ? "Don't have an account yet?" : "Already part of the circle?"}
                  <button className="switch-link" onClick={() => switchTab(tab==="login"?"signup":"login")}>
                    {tab==="login" ? "Create one →" : "Sign in →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}