import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import SideBar from "./SideBar";
import { NotificationsProvider } from "../context/notificationContext";
import "../App.css";

export default function MainLayout() {
  return (
    <NotificationsProvider>
      <div className="app">
        <NavBar />
        <main className="mainLayout">
          <aside className="sidebarWrapper col-2">
            <SideBar />
          </aside>
          <section className="content col-10">
            <Outlet />
          </section>
        </main>
      </div>
    </NotificationsProvider>
  );
}