"use client";

import { FaBell, FaSun, FaMoon } from "react-icons/fa";
import { useContext } from "react";
import { AdminContext } from "../../app/admin/layout";

export default function Topbar({ role = "super_admin" }: { role?: string }) {
  const { theme, toggleTheme } = useContext(AdminContext);
  return (
    <div className="flex h-20 items-center justify-between border-b border-primary/10 bg-surface/80 backdrop-blur-md px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Welcome back, Admin 👋</h1>
        <p className="text-sm text-on-surface-muted">Here is what&apos;s happening with your salon today.</p>
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-card border border-primary/20 text-on-surface hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
        </button>

        <button className="text-on-surface-muted hover:text-primary transition-colors relative">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-surface"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-primary/10 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors capitalize">
              {role === 'super_admin' ? 'Super Admin' : 'Staff Member'}
            </p>
            <p className="text-xs text-on-surface-muted">Admin Portal</p>
          </div>
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-[#e6c498] flex items-center justify-center text-btn-primary font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
            A
          </div>
        </div>
      </div>
    </div>
  );
}



