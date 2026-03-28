const API = "https://leadszen-v1.onrender.com/api";

async function apiCall(endpoint, method = "GET", body = null) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(API + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token })
      },
      body: body ? JSON.stringify(body) : null
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "API Error"
      };
    }

    return data;

  } catch (err) {
    return {
      success: false,
      message: "Network error"
    };
  }
}