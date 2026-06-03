import {Outlet} from "react-router-dom";
import {SuperAdminSidebar} from "../components/layout/SuperAdminSidebar";
import {Header} from "./Header";
import {Footer} from "./Footer";

export const SuperAdminLayout = () => {
  return (
        <div className="flex bg-slate-50 min-h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
