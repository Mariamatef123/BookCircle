import NavBar from "./NavBar";
import SideBar from "../layouts/SideBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" , position:"sticky",
  //  height:"100vh",
   top:"0",
   overflowY:"auto" }}>

      {/* NavBar */}
      <NavBar />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div style={{
    position: "sticky",
    top: "0",
    height: "100vh",
    overflowY: "auto",
        }}>
          <SideBar />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default App;