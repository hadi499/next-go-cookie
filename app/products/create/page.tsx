"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.user_id) {
        setUserId(parsedUser.user_id);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Hanya file JPG atau PNG yang diperbolehkan!");
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !price || !userId) {
      alert("Semua field wajib diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("user_id", userId);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal membuat produk");
      }

      router.push("/products");
    } catch (error) {
      console.error("Gagal membuat produk:", error);
      alert("Gagal membuat produk. Cek log untuk detail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg border border-slate-300 rounded-2xl mt-8">
      <h2 className="text-2xl font-semibold mb-6">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="mt-1 p-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            className="mt-1 p-3 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="hidden"
            value={userId}
            readOnly
            className="mt-1 p-3 w-full border rounded-xl bg-gray-100 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Gambar Produk
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-1 file:border-slate-200 file:text-sm file:shadow-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 border bg-slate-50 border-slate-300 shadow-sm text-slate-700 font-semibold p-3 rounded-xl hover:bg-slate-200 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
