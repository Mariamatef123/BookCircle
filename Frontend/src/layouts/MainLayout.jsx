import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import SideBar from "./SideBar";
import { NotificationsProvider } from "../context/notificationContext";
import "../App.css";

export default function MainLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <NotificationsProvider>
      <div className="app">
        <NavBar
          isSidebarOpen={isSidebarOpen}
          onMenuToggle={() => setIsSidebarOpen((open) => !open)}
        />
        <div
          className={`mobile-sidebar-backdrop ${isSidebarOpen ? "is-open" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <main className="mainLayout">
          <aside className={`sidebarWrapper col-2 ${isSidebarOpen ? "is-open" : ""}`}>
            <SideBar onClose={() => setIsSidebarOpen(false)} />
          </aside>
          <section className="content col-10">
            <Outlet />
          </section>
        </main>
      </div>
    </NotificationsProvider>
  );
}