import { useLocation, useNavigate, Link } from "react-router-dom";
import { getUser } from "../../utils/auth";

import SearchBar from "./components/SearchBar";
import NotificationsBell from "./components/NotificationBell";
import UserSection from "./components/UserSection";

function NavBar({ onMenuToggle, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  return (
    <nav className="navbar bg-body-white pb-0 col-12 book-navbar" style={{ backgroundColor: "white" }}>
      <div
        className="container-fluid mt-2 book-navbar-inner"
        style={{ borderBottom: "1px solid #f0f0f5", paddingBottom: "15px" }}
      >
        <button
          type="button"
          className="book-navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isSidebarOpen}
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>

        {/* BRAND */}
        <div className="col-2 text-center book-navbar-brand">
          <Link
            className="navbar-brand fs-4"
            to="/"
            style={{ fontWeight: "bold", textDecoration: "none", color: "inherit" }}
          >
            Book Circle
          </Link>
        </div>

        {/* SEARCH */}
        <div
          className="col-8 justify-content-center book-navbar-search"
          id="navbarSupportedContent"
        >
          <SearchBar navigate={navigate} location={location} />
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3 col-2 justify-content-center book-navbar-actions">
          <NotificationsBell navigate={navigate} user={user} />
          <UserSection user={user} />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
