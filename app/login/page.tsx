"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import Link from "next/link";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      }
      setUser(data.user);

      router.push("/");
      setLoading(false);
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server");
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-20">
      <div className="w-full max-w-md bg-white border border-slate-300 px-3 py-6 shadow-lg rounded-lg">
        <h1 className="text-center text-2xl text-slate-700 font-bold mb-4 text-shadow-lg text-shadow-indigo-300 ">
          Login
        </h1>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-2 mb-3">
            <label
              htmlFor="username"
              className="block text-slate-700 text-medium font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              id="username"
              className="w-full text-slate-700  text-lg px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-400 "
            />
          </div>
          <div className="space-y-2 mb-3">
            <label
              htmlFor="password"
              className="block text-slate-700 text-medium font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="off"
              value={form.password}
              onChange={handleChange}
              id="password"
              className="w-full text-slate-700 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-400 "
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300 cursor-pointer"
          >
            {loading ? "Processing..." : "Log in"}
          </button>
        </form>
        <div className="mt-3 text-center text-sm font-semibold text-slate-600 hover:text-indigo-700 ">
          <Link href="/register">Create new account?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
