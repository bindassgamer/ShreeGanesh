export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://shree-backend-eta.vercel.app";

export const apiFetch = async (path, options = {}) => {
  const { token, headers, ...rest } = options;
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers || {})
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.message || payload?.error || "Request failed.";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

