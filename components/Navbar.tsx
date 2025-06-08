"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import NavbarSkeleton from "./skeleton/NavbarSkeleton";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    await fetch("api/logout", {
      method: "GET",
      credentials: "include",
    });
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    // Cek user di localStorage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Delay showing the real navbar ONLY on reload

    setIsLoading(false);

    const handleScroll = () => {
      console.log("window.scrollY =", window.scrollY); // debug
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav
      className={`w-full z-[9999] md:px-10 lg:px-16 transition-all duration-300 flex justify-between items-center px-8 ${
        scrolled
          ? "fixed   bg-white/80 shadow-lg backdrop-blur-md py-4"
          : "absolute  bg-transparent py-4"
      }`}
    >
      <div className="text-xl flex items-center gap-3">
        <div className="mr-6">
          <Link
            href="/"
            className="text-gray-800 text-2xl text-shadow-lg text-shadow-red-500 font-bold"
          >
            Logo
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              href="/products"
              className="text-gray-800 text-lg hover:text-indigo-700 transition-colors"
            >
              Products
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-lg  text-gray-800 hover:text-red-600 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-gray-800 text-lg hover:text-indigo-700  transition-colors cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
