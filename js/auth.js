const API = "http://localhost:3000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = data.message;
  }
}


