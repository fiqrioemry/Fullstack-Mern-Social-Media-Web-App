import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Fragment>
      <Navbar />
      <main className="flex h-auto md:h-screen ">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </Fragment>
  );
};

export default Layout;
