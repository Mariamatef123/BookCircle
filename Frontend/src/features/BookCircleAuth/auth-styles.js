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
    display: flex;
    align-items: center;
    justify-content: center;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
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
export default styles;