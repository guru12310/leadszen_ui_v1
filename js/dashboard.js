const API = "https://leadszen-v1.onrender.com/api";
const token = localStorage.getItem("token");

async function loadSummary() {
  const res = await fetch(`${API}/dashboard/summary`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  const d = data.data;

  document.getElementById("total").innerHTML = `
  <div>Total Leads</div>
  <h2>${d.total_leads}</h2>
`;

document.getElementById("converted").innerHTML = `
  <div>Converted</div>
  <h2>${d.converted}</h2>
`;
  document.getElementById("progress").innerHTML = `In Progress<br>${d.in_progress}`;
  document.getElementById("lost").innerHTML = `Lost<br>${d.lost}`;
}

async function loadLeads() {
  const res = await fetch(`${API}/lead`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  document.getElementById("leads").innerHTML =
   data.data.map(l => {
    let cls = "new";
    if (l.status === "CONVERTED") cls = "converted";
    if (l.status === "IN_PROGRESS") cls = "progress";
    if (l.status === "LOST") cls = "lost";

    return `
      <tr>
        <td>${l.name}</td>
        <td>${l.phone}</td>
        <td><span class="status ${cls}">${l.status}</span></td>
      </tr>
    `;
  }).join('');
}

async function loadChart() {
  const res = await fetch(`${API}/dashboard/analytics?from=2026-03-01&to=2026-03-25`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  const labels = data.data.map(d => d.date);
  const values = data.data.map(d => d.total_leads);

new Chart(document.getElementById("chart"), {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        label: "Total Leads",
        data: values,
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  },
  options: {
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
}

async function loadUser() {
  const res = await fetch(`${API}/client/me`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  if (data.success) {
      const name = data.data.name;

      document.getElementById("welcome").innerText = `Welcome, ${name}`;
      document.getElementById("username").innerText = name;
      document.getElementById("drop-name").innerText = name;
      document.getElementById("drop-email").innerText = data.data.email;

    // avatar first letter
    document.querySelector(".avatar").innerText = name.charAt(0).toUpperCase();
  }
}


function toggleMenu(event) {
  event.stopPropagation(); // 🔥 prevents immediate close

  const menu = document.getElementById("dropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
  menu.classList.toggle("show");
}

function goProfile() {
  window.location.href = "profile.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


// close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const profile = document.querySelector(".profile");
  const dropdown = document.getElementById("dropdown");

  if (!profile.contains(event.target)) {
    dropdown.style.display = "none";
  }
});



loadUser();
loadSummary();
loadLeads();
loadChart();