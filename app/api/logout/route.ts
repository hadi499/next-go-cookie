import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // ✅ Ambil cookies dengan await
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }

    // ✅ Panggil backend logout dengan menyertakan token di cookie
    const backendLogout = await fetch("http://localhost:8080/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!backendLogout.ok) {
      const errorData = await backendLogout.json();
      return NextResponse.json(
        { error: errorData.error || "Logout failed" },
        { status: 500 }
      );
    }

    // ✅ Hapus cookie di sisi Next.js
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set("token", "", {
      path: "/",
      maxAge: 0, // Hapus cookie
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
