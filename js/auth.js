const API = "https://leadszen-v1.onrender.com/api";



function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.className = "toast show";

  setTimeout(() => {
    t.className = "toast";
  }, 3000);
}



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
    showToast("Welcome to LeadsZen");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 3000);
    
  } else {
    document.getElementById("error").innerText = data.message;
  }
}


