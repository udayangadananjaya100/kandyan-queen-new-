"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaCalendarAlt, FaCog, FaSignOutAlt, FaUsers, FaAddressBook, FaImages, FaGift } from "react-icons/fa";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Sidebar({ role = "super_admin" }: { role?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const allNavItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Bookings", path: "/admin/bookings", icon: <FaCalendarAlt /> },
    { name: "Customers", path: "/admin/customers", icon: <FaAddressBook /> },
    { name: "Services", path: "/admin/services", icon: <FaCog /> },
    { name: "Offers", path: "/admin/offers", icon: <FaGift /> },
    { name: "Gallery", path: "/admin/gallery", icon: <FaImages /> },
    { name: "Admin Users", path: "/admin/users", icon: <FaUsers /> },
  ];

  const navItems = role === "staff" 
    ? allNavItems.filter(item => ["Dashboard", "Bookings", "Customers"].includes(item.name))
    : allNavItems;

  return (
    <div className="flex h-screen w-72 flex-col bg-surface border-r border-primary/10 shadow-xl z-20">
      <div className="flex h-20 items-center justify-center border-b border-primary/10 px-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-[#e6c498] to-primary bg-clip-text text-transparent font-playfair tracking-wide text-center leading-tight">
          Kandyan Queen<br/><span className="text-xs uppercase tracking-[0.2em] text-primary/70 font-lato">Admin Portal</span>
        </h2>
      </div>
      <div className="flex flex-1 flex-col p-5 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-transparent text-primary shadow-[inset_4px_0_0_0_#C19A6B]"
                  : "text-on-surface-muted hover:bg-white/5 hover:text-on-surface hover:translate-x-1"
              }`}
            >
              <span className={`text-lg transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-5 border-t border-primary/10 bg-background/30">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          Secure Logout
        </button>
      </div>
    </div>
  );
}
