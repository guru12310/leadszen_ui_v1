const API = "https://leadszen-v1.onrender.com/api";
// const API = "http://localhost:3000/api";



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

  // try {
  //   // ✅ API call
  //   const res = await fetch(`${API}/auth/login`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password })
  //   });

  //   const data = await res.json();

  //   if (data.success) {
  //     localStorage.setItem("token", data.data.token);

  //     showToast("Welcome to LeadsZen");

  //     setTimeout(() => {
  //       window.location.href = "dashboard.html";
  //     }, 3000);

  //   } else {
  //     error.innerText = data.message || "Login failed";
  //   }

  // } catch (err) {
  //   error.innerText = "Something went wrong. Try again.";
  //   console.error(err);
  // }

  try {
showLoader();

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });


hideLoader();
  const data = await res.json();

  if (data.success) {

    const token = data.data.token;
    console.log("----token-----",token)
    localStorage.setItem("token", token);

    showToast("Login Successful");

    // Check subscription status
    const subRes = await fetch(
      `${API}/payment/subscription`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const subData = await subRes.json();

    console.log("----subData-----",subData)


    if (
      subData.success &&
      subData.data.subscription_status === "ACTIVE"
    ) {
    console.log("----ACTIVE-----")

      showToast("Welcome to LeadsZen");

      // setTimeout(() => {
      //   window.location.href = "dashboard.html";
      // }, 1500);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 3000);

    } else {

      showToast("Please subscribe to a plan to access LeadsZen");

      setTimeout(() => {
        // window.location.href = "index.html";
        window.location.href = "index.html?subscription=required";
      }, 3000);

    }

  } else {

    error.innerText =
      data.message || "Login failed";

  }

} catch (err) {

  console.error(err);

  error.innerText =
    "Something went wrong. Please try again.";

}
}


function showLoader(message = "Please wait...") {
    document.getElementById("loaderText").innerText = message;
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}