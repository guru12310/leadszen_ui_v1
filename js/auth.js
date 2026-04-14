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
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const error = document.getElementById("error");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Reset error
  error.innerText = "";

  // ✅ Validation
  if (!email) {
    error.innerText = "Email is required";
    emailInput.focus();
    return;
  }

  if (!emailInput.checkValidity()) {
    error.innerText = "Enter a valid email";
    emailInput.focus();
    return;
  }

  if (!password) {
    error.innerText = "Password is required";
    passwordInput.focus();
    return;
  }

  try {
    // ✅ API call
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
      error.innerText = data.message || "Login failed";
    }

  } catch (err) {
    error.innerText = "Something went wrong. Try again.";
    console.error(err);
  }
}


