// Store devices data in localStorage
let devices = JSON.parse(localStorage.getItem("itDevices")) || [];
let editingIndex = -1;

// DOM Elements
const addDeviceBtn = document.getElementById("add-device-btn");
const addForm = document.getElementById("add-form");
const deviceForm = document.getElementById("device-form");
const cancelFormBtn = document.getElementById("cancel-form");
const devicesList = document.getElementById("devices-list");
const totalDevicesEl = document.getElementById("total-devices");
const incomingDevicesEl = document.getElementById("incoming-devices");
const outgoingDevicesEl = document.getElementById("outgoing-devices");
const filterCategory = document.getElementById("filter-category");
const filterStatus = document.getElementById("filter-status");
const searchInput = document.getElementById("search-input");

// Event Listeners
addDeviceBtn.addEventListener("click", showForm);
cancelFormBtn.addEventListener("click", hideForm);
deviceForm.addEventListener("submit", handleFormSubmit);
filterCategory.addEventListener("change", applyFilters);
filterStatus.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// Initialize the page
renderDevices();
updateSummary();

// Functions
function showForm() {
  addForm.style.display = "block";
  deviceForm.reset();
  editingIndex = -1;
}

function hideForm() {
  addForm.style.display = "none";
}

function handleFormSubmit(e) {
  e.preventDefault();

  const deviceData = {
    name: document.getElementById("device-name").value,
    category: document.getElementById("device-category").value,
    serial: document.getElementById("device-serial").value,
    date: document.getElementById("device-date").value,
    destination: document.getElementById("device-destination").value,
    status: document.getElementById("device-status").value,
  };

  if (editingIndex === -1) {
    // Add new device
    devices.push(deviceData);
  } else {
    // Update existing device
    devices[editingIndex] = deviceData;
  }

  // Save to localStorage
  localStorage.setItem("itDevices", JSON.stringify(devices));

  // Update UI
  renderDevices();
  updateSummary();
  hideForm();
}

function renderDevices() {
  // Clear the list
  devicesList.innerHTML = "";

  // Get filter values
  const categoryFilter = filterCategory.value;
  const statusFilter = filterStatus.value;
  const searchQuery = searchInput.value.toLowerCase();

  // Filter the devices
  const filteredDevices = devices.filter((device) => {
    const categoryMatch =
      categoryFilter === "all" || device.category === categoryFilter;
    const statusMatch =
      statusFilter === "all" || device.status === statusFilter;
    const searchMatch =
      device.name.toLowerCase().includes(searchQuery) ||
      device.serial.toLowerCase().includes(searchQuery) ||
      device.destination.toLowerCase().includes(searchQuery);

    return categoryMatch && statusMatch && searchMatch;
  });

  // Render each device
  filteredDevices.forEach((device, index) => {
    const tr = document.createElement("tr");
    const deviceIndex = devices.indexOf(device);

    const formattedDate = new Date(device.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    tr.innerHTML = `
             <td>${device.name}</td>
             <td>${device.category}</td>
             <td>${device.serial}</td>
             <td>${formattedDate}</td>
             <td>${device.destination}</td>
             <td>${device.status}</td>
             <td>
                 <button class="action-btn edit" data-index="${deviceIndex}">
                     ✏️
                 </button>
                 <button class="action-btn delete" data-index="${deviceIndex}">
                     🗑️
                 </button>
             </td>
         `;

    devicesList.appendChild(tr);
  });

  // Add event listeners to edit and delete buttons
  document.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", editDevice);
  });

  document.querySelectorAll(".action-btn.delete").forEach((btn) => {
    btn.addEventListener("click", deleteDevice);
  });
}

function editDevice(e) {
  const index = e.target.dataset.index;
  editingIndex = parseInt(index);
  const device = devices[editingIndex];

  // Fill the form with device data
  document.getElementById("device-name").value = device.name;
  document.getElementById("device-category").value = device.category;
  document.getElementById("device-serial").value = device.serial;
  document.getElementById("device-date").value = device.date;
  document.getElementById("device-destination").value = device.destination;
  document.getElementById("device-status").value = device.status;

  // Show the form
  addForm.style.display = "block";
}

function deleteDevice(e) {
  if (confirm("Apakah Anda yakin ingin menghapus device ini?")) {
    const index = e.target.dataset.index;
    devices.splice(index, 1);

    // Save to localStorage
    localStorage.setItem("itDevices", JSON.stringify(devices));

    // Update UI
    renderDevices();
    updateSummary();
  }
}

function updateSummary() {
  // Update total devices
  totalDevicesEl.textContent = devices.length;

  // Count incoming and outgoing devices
  const incoming = devices.filter((device) => device.status === "Masuk").length;
  const outgoing = devices.filter(
    (device) => device.status === "Keluar"
  ).length;

  incomingDevicesEl.textContent = incoming;
  outgoingDevicesEl.textContent = outgoing;
}

function applyFilters() {
  renderDevices();
}
