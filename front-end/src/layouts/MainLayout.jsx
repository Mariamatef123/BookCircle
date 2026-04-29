import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "./SideBar";

export default function MainLayout() {
  return (
    <>
      <NavBar />

      <div className="container-fluid">
        <div className="row">
          <div className="col-2 p-0">
            <SideBar />
          </div>

          <div className="col-10 p-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}