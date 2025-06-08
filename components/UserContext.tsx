"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (res.status === 200 && data.user) {
          localStorage.setItem("userInfo", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          localStorage.removeItem("userInfo");
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    };

    checkUser();
  }, [pathname]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// Utility function to get a cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
