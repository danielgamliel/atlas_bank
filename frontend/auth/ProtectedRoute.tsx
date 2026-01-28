import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE as string;


  useEffect(() => {
    (async () => {
      const url = `${API_BASE}me`;

      console.log("[ProtectedRoute] start check:", {
        url,
        documentCookieVisibleToJS: document.cookie,
      });

      try {
        const res = await fetch(url, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("[ProtectedRoute] response:", {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          type: res.type,
          url: res.url,
        });

        console.log("[ProtectedRoute] response headers:");
        for (const [k, v] of res.headers.entries()) {
          console.log("  ", k, "=", v);
        }

 
        const raw = await res.text().catch(() => "");
        console.log("[ProtectedRoute] raw body:", raw);

        let data: any = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          data = null;
        }
        console.log("[ProtectedRoute] parsed body:", data);

        setIsAuthed(res.ok);
      } catch (err) {
        console.error("[ProtectedRoute] fetch error:", err);
        setIsAuthed(false);
      } finally {
        setIsLoading(false);
        console.log("[ProtectedRoute] done. isAuthed will be:", isAuthed);
      }
    })();

  }, []);

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!isAuthed) {
    console.warn("[ProtectedRoute] no auth -> redirect to /");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
