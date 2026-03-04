export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const api = {
  get: async (endpoint: string, params: Record<string, string> = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error occured:${response.statusText}`);
    }
    return response.json();
  },
  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Error occured :${response.statusText}`);
    return response.json();
  },
  postForm: async (endpoint: string, body: FormData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(true),
      body: body,
    });
    // if (!response.ok) throw new Error(`Error occured :${response.statusText}`);
    const data = await response.json();
    return {
      ok: response.ok,
      res: response.status === 200 ? "success": "error",
      status: response.status, // HTTP status code, e.g., 200, 400
      statusText: response.statusText, // "OK", "Bad Request"
      data, 
    };
  },
  patch: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Error occured :${response.statusText}`);
    return response.json();
  },
};
