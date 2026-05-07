import { BooksIcon } from "../../../components/icons/AppIcons";

function AuthLeftPanel() {
  return (
    <div className="auth-left">
      <div className="logo">
        <div className="logo-icon"><BooksIcon size={22} /></div>
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
  );
}

export default AuthLeftPanel;