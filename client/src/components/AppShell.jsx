"use client";
import { createContext, Suspense, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DashboardsideBar from "./DashboardsideBar";
import MobileNav from "./MobileNav";
import { IconLogo } from "./Icons";
import { currentUser } from "@/data/mockData";
import { clearSession, getSession } from "@/lib/auth";

const UserContext = createContext(currentUser);

export function useUser() {
  return useContext(UserContext);
}

function Splash() {
  return (
    <div className="splash" role="status" aria-label="Loading">
      <span className="brand-mark splash-mark">
        <IconLogo width={22} height={22} />
      </span>
    </div>
  );
}

// الهيكل المشترك لكل الصفحات بعد تسجيل الدخول: فحص التوكن + النافبار + السايدبار
export default function AppShell({ variant = "main", aside = null, children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      clearSession();
      router.replace("/sign/login");
      return;
    }
    const name = session.username;
    setUser(name ? { ...currentUser, name, handle: "@" + name } : currentUser);
  }, [router]);

  if (!user) return <Splash />;

  return (
    <UserContext.Provider value={user}>
      <div className="app">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <div className={`app-layout${aside ? " has-aside" : ""}`}>
          <Suspense fallback={<aside className="sidebar" />}>
            {variant === "dashboard" ? <DashboardsideBar /> : <Sidebar />}
          </Suspense>
          <main id="main" className="app-main">
            {children}
          </main>
          {aside}
        </div>
        <MobileNav />
        <ToastContainer position="bottom-right" theme="dark" autoClose={3000} newestOnTop />
      </div>
    </UserContext.Provider>
  );
}
