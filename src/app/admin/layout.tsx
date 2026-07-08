"use client";

import { useEffect, useState, createContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export const AdminContext = createContext<{ role: string; theme: string; toggleTheme: () => void }>({ 
  role: "staff", 
  theme: "dark", 
  toggleTheme: () => {} 
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("staff");
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (user && pathname === "/admin/login") {
        router.push("/admin");
      } else if (user) {
        // Fetch custom claims for role
        const tokenResult = await user.getIdTokenResult(true);
        const userRole = (tokenResult.claims.role as string) || "super_admin";
        setRole(userRole);
        
        // Security redirect for staff
        if (userRole === "staff" && ["/admin/gallery", "/admin/services", "/admin/offers", "/admin/users"].includes(pathname)) {
          router.push("/admin");
        }
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background text-primary">Loading...</div>;
  }

  // If on login page, don't show sidebar/topbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AdminContext.Provider value={{ role, theme, toggleTheme }}>
      <div data-theme={theme} className="flex h-screen bg-surface text-on-surface transition-colors duration-300">
        <Sidebar role={role} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar role={role} />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
