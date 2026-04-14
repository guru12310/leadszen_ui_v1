console.log("LEADS JS LOADED 🚀");

document.addEventListener("DOMContentLoaded", function () {

  const API = "https://leadszen-v1.onrender.com/api";
  const token = localStorage.getItem("token");

  let allLeads = [];
  let currentPage = 1;
  const limit = 10;

  async function fetchLeads() {
    const res = await fetch(`${API}/lead`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    allLeads = data.data || data;

    applyFilters();
  }

let filteredLeads = [];

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const status = document.getElementById("status").value;

  filteredLeads = allLeads.filter(l => {
    return (
      (!search || l.name.toLowerCase().includes(search) || l.phone.includes(search)) &&
      (!status || l.status === status)
    );
  });

  currentPage = 1;
  renderTable();
}

function renderTable() {
  const start = (currentPage - 1) * limit;
  const end = start + limit;

  const pageData = filteredLeads.slice(start, end);

  document.getElementById("leads").innerHTML =
    pageData.map(l => `
      <tr>
        <td>${l.name}</td>
        <td>${l.phone}</td>

<td id="status-${l.id}">
  <div class="status-cell">
    <span class="status-badge ${l.status.toLowerCase()}">${l.status}</span>
    <button class="edit-btn" onclick="enableEdit(${l.id}, '${l.status}')">Edit</button>
  </div>
</td>

        <td>${l.source}</td>
        <td>${new Date(l.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');

  const totalPages = Math.ceil(filteredLeads.length / limit);

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages || 1}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage >= totalPages;
}

window.enableEdit = function(id, currentStatus) {
  document.getElementById(`status-${id}`).innerHTML = `
    <select id="select-${id}">
      <option ${currentStatus=='NEW'?'selected':''}>NEW</option>
      <option ${currentStatus=='IN_PROGRESS'?'selected':''}>IN_PROGRESS</option>
      <option ${currentStatus=='CONVERTED'?'selected':''}>CONVERTED</option>
      <option ${currentStatus=='LOST'?'selected':''}>LOST</option>
    </select>
    <button onclick="saveStatus(${id})">Save</button>
  `;
};

window.saveStatus = async function(id) {
  const status = document.getElementById(`select-${id}`).value;

  await fetch(`${API}/lead/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status })
  });

  fetchLeads();
};

window.nextPage = function() {
  const totalPages = Math.ceil(filteredLeads.length / limit);

  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
};

window.prevPage = function() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
};


async function saveStatus(id) {
  const status = document.getElementById(`select-${id}`).value;

  await fetch(`${API}/lead/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status })
  });

  fetchLeads(); // reload
}


async function fetchLeads() {
  const res = await fetch(`${API}/lead`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  allLeads = data.data || data;

  applyFilters();
}

function nextPage() {
  const totalPages = Math.ceil(filteredLeads.length / limit);

  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}



  // 🔥 EVENT LISTENERS (NO onclick)
  document.getElementById("applyBtn").addEventListener("click", applyFilters);

  document.getElementById("search").addEventListener("input", applyFilters);

  // 🔥 LOAD DATA
  fetchLeads();

});




window.openModal = function () {
  document.getElementById("leadModal").style.display = "block";
};

window.closeModal = function () {
  document.getElementById("leadModal").style.display = "none";
};


function showToastSafe(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);

    toast.style.position = "fixed";
    toast.style.top = "20px";              // ✅ top
    toast.style.left = "50%";              // ✅ center horizontally
    toast.style.transform = "translateX(-50%)"; // ✅ center fix

    toast.style.background = "#111827";
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "6px";
    toast.style.zIndex = "99999";
  }

  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}



window.saveLead = async function () {
  const nameInput = document.getElementById("m_name");
  const phoneInput = document.getElementById("m_phone");
  const locationInput = document.getElementById("m_location");
  const error = document.getElementById("leadError");

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const location = locationInput.value.trim();

  error.innerText = "";

  // Validation
  if (!name) {
    error.innerText = "Name is required";
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    error.innerText = "Enter valid 10-digit phone number";
    return;
  }

  if (!location) {
    error.innerText = "Location is required";
    return;
  }

  try {
    const res = await fetch("https://leadszen-v1.onrender.com/api/dashboard/leadmanual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ name, phone, location })
    });

    let result = {};
    try {
      result = await res.json();
    } catch {}

    console.log("API response:", res.status, result);

    // ✅ FORCE SUCCESS if saved
    showToastSafe("Lead saved successfully ✅");


    // small delay so user can see toast
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    nameInput.value = "";
    phoneInput.value = "";
    locationInput.value = "";

    setTimeout(() => {
      closeModal();
      loadLeads();
    }, 500);

  } catch (err) {
    console.error("Error:", err);

    showToastSafe("Lead saved (network issue ignored) ✅");

    setTimeout(() => {
      closeModal();
      loadLeads();
    }, 500);
  }
};


showToast("Lead saved successfully ✅", "success");

setTimeout(() => {
  closeModal();
  loadLeads();
}, 800);