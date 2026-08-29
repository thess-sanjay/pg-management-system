const API_BASE_URL = "http://localhost:8080/api";

// =====================================================
// COMMON API REQUEST
// =====================================================

async function apiRequest(url, options = {}) {

  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  // Add JWT token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || `Request failed: ${response.status}`
    );
  }

  // Handle empty responses such as DELETE
  const contentType = response.headers.get("content-type");

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    return response.json();
  }

  return response.text();
}
// =====================================================
// ROOMS
// =====================================================
export async function getRooms() {
  return apiRequest("/rooms");
}

export async function getAvailableRooms() {
  return apiRequest("/rooms/available");
}

export async function getFullRooms() {
  return apiRequest("/rooms/full");
}


// =====================================================
// CREATE ROOM
// =====================================================

export async function createRoom(room) {
  return apiRequest("/rooms", {
    method: "POST",
    body: JSON.stringify(room),
  });
}

// =====================================================
// UPDATE ROOM
// =====================================================

export async function updateRoom(id, roomData) {
  return apiRequest(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(roomData),
  });
}


// =====================================================
// DELETE ROOM
// =====================================================

export async function deleteRoom(id) {
  return apiRequest(`/rooms/${id}`, {
    method: "DELETE",
  });
}


// =====================================================
// TENANTS
// =====================================================

export async function getTenants() {
  return apiRequest("/tenants");
}

// =====================================================
// CREATE TENANT
// =====================================================

export async function createTenant(tenant) {
  return apiRequest("/tenants", {
    method: "POST",
    body: JSON.stringify(tenant),
  });
}

// =====================================================
// GET TENANT BY ID
// =====================================================

export async function getTenantById(id) {
  return apiRequest(`/tenants/${id}`);
}


// =====================================================
// UPDATE TENANT
// =====================================================

export async function updateTenant(id, tenantData) {
  return apiRequest(`/tenants/${id}`, {
    method: "PUT",
    body: JSON.stringify(tenantData),
  });
}
// =====================================================
// DELETE TENANT
// =====================================================
export async function deleteTenant(id) {
  return apiRequest(`/tenants/${id}`, {
    method: "DELETE",
  });
}



// =====================================================
// SEARCH TENANTS
// =====================================================

export async function searchTenants(name) {
  return apiRequest(
    `/tenants/search?name=${encodeURIComponent(name)}`
  );
}

// =====================================================
// RENT
// =====================================================

// GET ALL RENT RECORDS
export async function getRents() {
  return apiRequest("/rents");
}

export async function getPaidRents() {
  return apiRequest("/rents/paid");
}

export async function getPendingRents() {
  return apiRequest("/rents/pending");
}

export async function getOverdueRents() {
  return apiRequest("/rents/overdue");
}

export async function getTodayDueRents() {
  return apiRequest("/rents/due-today");
}

export async function getTenantRentHistory(tenantId) {
  return apiRequest(`/rents/tenant/${tenantId}`);
}

export async function createRent(rentData) {
  return apiRequest("/rents", {
    method: "POST",
    body: JSON.stringify(rentData),
  });
}

export async function updateRent(id, rentData) {
  return apiRequest(`/rents/${id}`, {
    method: "PUT",
    body: JSON.stringify(rentData),
  });
}

export async function getRentSummary(month) {
  return apiRequest(
    `/rents/summary/${encodeURIComponent(month)}`
  );
}

export async function getRentsByStatus(status) {
  return apiRequest(
    `/rents/status/${encodeURIComponent(status)}`
  );
}
// =====================================================
// ACTIVITIES
// =====================================================

export async function getRecentActivities() {
  return apiRequest("/activities/recent");
}