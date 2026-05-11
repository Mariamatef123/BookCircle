import { useNavigate } from "react-router-dom";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  BoxIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../../../components/icons/AppIcons";

function AuthRightPanel(props) {
 const {
    tab,
    roles,
    showPwd,
    setShowPwd,
    showConfirm,
    setShowConfirm,
    loading,
    success,
    setSuccess,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    errors,
    pwdStrength,    
    handleSubmit,
    switchTab,
  } = props;
  const navigate = useNavigate();

  const handleTabSwitch = (newTab) => {
    switchTab(newTab);
    navigate(newTab === "login" ? "/login" : "/signup");
  };

  return (
    <div className="auth-right">
      <div className="form-container">
        {success ? (
          <div className="success-overlay slide-in">
            <div className="success-icon"><CheckCircleIcon size={32} /></div>
            <h2 className="success-title">{tab === "login" ? "Welcome back!" : "Account created!"}</h2>
            <p className="success-sub">
              {tab === "login"
                ? "You're all set. Redirecting you to your reading Home…"
                : "Your BookCircle account is ready. Start discovering books in your area!"}
            </p>
            <button className="submit-btn" onClick={() => { setSuccess(false); navigate("/"); }}>
              Go to Home <ArrowRightIcon size={16} />
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
              <button className={`tab-btn ${tab==="login"?"active":""}`} onClick={() => handleTabSwitch("login")}>Sign In</button>
              <button className={`tab-btn ${tab==="signup"?"active":""}`} onClick={() => handleTabSwitch("signup")}>Create Account</button>
            </div>

            {tab === "signup" && (
              <>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:500, color:"var(--text)", marginBottom:8 }}>
                    I want to
                  </label>
                 <div className="roles">
  {roles.map((role, index) => {
    const roleData = {
      READER: {
        Icon: BookOpenIcon,
        desc: "Find books"
      },
      BOOK_OWNER: {
        Icon: BoxIcon,
        desc: "Share books"
      }
    };

    const currentRole = roleData[role];

    return (
      <div
        key={index}
        className={`role-pill ${signupForm.role === role ? "on" : ""}`}
        onClick={() =>
          setSignupForm(f => ({ ...f, role }))
        }
      >
        <div className="rp-icon">
          <currentRole.Icon size={20} />
        </div>

        <span className="rp-name">{role}</span>

        <span className="rp-desc">
          {currentRole.desc}
        </span>
      </div>
    );
  })}
</div>
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label> Name</label>
                    <div className="input-wrap">
                      <span className="input-icon"><UserIcon size={15} /></span>
                      <input type="text" className={errors.Name?"error-input":""} placeholder="Ali" value={signupForm.Name}
                        onChange={e => setSignupForm(f=>({...f,Name:e.target.value}))} />
                    </div>
                    {errors.Name && <div className="error-msg"><AlertTriangleIcon size={13} /> {errors.Name}</div>}
                  </div>
                </div>
              </>
            )}

            <div className="field-group">
              <label>Email address</label>
              <div className="input-wrap">
                <span className="input-icon"><MailIcon size={15} /></span>
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
              {errors.email && <div className="error-msg"><AlertTriangleIcon size={13} /> {errors.email}</div>}
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon"><LockIcon size={15} /></span>
                <input
                  type={showPwd ? "text" : "password"}
                  value={tab === "login" ? loginForm.password : signupForm.password}
                  onChange={(e) =>
                    tab === "login"
                      ? setLoginForm((f) => ({ ...f, password: e.target.value }))
                      : setSignupForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <button className="eye-btn" onClick={() => setShowPwd(v=>!v)}>
                  {showPwd ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
              {errors.password && <div className="error-msg"><AlertTriangleIcon size={13} /> {errors.password}</div>}
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

       
            {tab==="signup" && (
              <div className="field-group">
                <label>Confirm password</label>
                <div className="input-wrap">
                  <span className="input-icon"><LockIcon size={15} /></span>
                  <input type={showConfirm?"text":"password"} className={errors.confirm?"error-input":""}
                    placeholder="Re-enter password"
                    value={signupForm.confirm}
                    onChange={e => setSignupForm(f=>({...f,confirm:e.target.value}))} />
                  <button className="eye-btn" onClick={() => setShowConfirm(v=>!v)}>
                    {showConfirm ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                  </button>
                </div>
                {errors.confirm && <div className="error-msg"><AlertTriangleIcon size={13} /> {errors.confirm}</div>}
              </div>
            )}

            {errors.terms && <div className="error-msg" style={{marginBottom:14}}><AlertTriangleIcon size={13} /> {errors.terms}</div>}

            <button className={`submit-btn ${loading?"loading":""}`} onClick={handleSubmit}>
              {loading && <span className="btn-spinner"></span>}
              {loading ? "Please wait…" : tab==="login" ? "Sign In" : "Create Account"}
            </button>

            <div className="switch-prompt">
              {tab==="login" ? "Don't have an account yet?" : "Already part of the circle?"}
              <button className="switch-link" onClick={() => handleTabSwitch(tab==="login"?"signup":"login")}>
                {tab==="login" ? "Create one" : "Sign in"} <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthRightPanel;