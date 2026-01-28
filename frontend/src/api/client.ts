const API_BASE = import.meta.env.VITE_API_BASE as string;

type ApiError = {
  status: number;
  message: string;
  code?: string;
};

async function readJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: data?.error?.message || data?.message || `Request failed (${res.status})`,
      code: data?.error?.code,
    };
    throw err;
  }

  return data as T;
}
