const API_URL = "http://localhost:8080/api";

async function requestWithTimeout(url, options = {}) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    console.log("Sending request to:", url);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    clearTimeout(timeout);

    console.error("API error:", error);

    if (error.name === "AbortError") {
      throw new Error("Request timed out. Backend may not be reachable.");
    }

    throw new Error(error.message || "Load failed");
  }
}

export async function signupUser(userData) {
  return requestWithTimeout(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export async function loginUser(userData) {
  return requestWithTimeout(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export async function getDashboard() {
  const token = localStorage.getItem("token");

  return requestWithTimeout(`${API_URL}/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}