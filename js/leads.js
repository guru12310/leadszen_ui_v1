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

window.saveLead = async function () {
  const data = {
    name: document.getElementById("m_name").value,
    phone: document.getElementById("m_phone").value,
    location: document.getElementById("m_location").value
  };

  await fetch("https://leadszen-v1.onrender.com/api/lead/manual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(data)
  });

  closeModal();
  loadLeads();
};