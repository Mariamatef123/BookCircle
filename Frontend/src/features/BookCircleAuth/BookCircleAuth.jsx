import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Login, Register } from "../../Service/UserService";
import { setAuthToken } from "../../utils/auth";
import AuthLeftPanel from "./components/AuthLeftPanel";
import AuthRightPanel from "./components/AuthRightPanel";
import styles from"./auth-styles";

export default function BookCircleAuth() {
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ Name: "", email: "", password: "", confirm: "", role: "" });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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

  const pwdStrength = getPasswordStrength(signupForm.password);

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
        setAuthToken(res.data.token);
        setSuccess(true);
        navigate("/");
      } else {
        const res = await Register({
          Name: signupForm.Name,
          Email: signupForm.email,
          Password: signupForm.password,
          Role: signupForm.role
        });
        console.log("REGISTER SUCCESS:", res.data);
        setSuccess(true);
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
    setSignupForm({ Name: "", email: "", password: "", confirm: "", role: "" });
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <AuthLeftPanel />
        <AuthRightPanel
          tab={tab}
          showPwd={showPwd}
          setShowPwd={setShowPwd}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          loading={loading}
          success={success}
          setSuccess={setSuccess}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          signupForm={signupForm}
          setSignupForm={setSignupForm}
          errors={errors}
          pwdStrength={pwdStrength}
          handleSubmit={handleSubmit}
          switchTab={switchTab}
        />
      </div>
    </>
  );
}

