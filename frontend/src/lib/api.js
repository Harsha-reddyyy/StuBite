export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "";

const formatNetworkErrorMessage = (path) => {
  const isAuthRequest = path.startsWith("/api/auth/");

  if (isAuthRequest) {
    return "Could not reach the auth API. Start the backend server, then verify the frontend origin is allowed by CORS.";
  }

  return "Could not reach the API. Start the backend server, then verify the frontend origin is allowed by CORS.";
};

const formatServerErrorMessage = (response, data) => {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("stubite:auth-invalid"));
    }

    return data.message || "Your session expired. Please log in again.";
  }

  if (response.status === 503) {
    return (
      data.message ||
      "Database unavailable. Verify the backend is connected to MongoDB Atlas and your IP is whitelisted."
    );
  }

  return data.message || `Request failed (${response.status})`;
};

export const apiRequest = async (path, options = {}) => {
  let response;
  const requestHeaders = {
    ...(options.token
      ? { Authorization: `Bearer ${options.token}` }
      : {}),
    ...options.headers
  };

  if (options.body && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const requestOptions = {
    ...options,
    headers: requestHeaders
  };

  try {
    response = await fetch(`${apiBaseUrl}${path}`, requestOptions);
  } catch (error) {
    throw new Error(formatNetworkErrorMessage(path));
  }

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(formatServerErrorMessage(response, data));
  }

  return data;
};
