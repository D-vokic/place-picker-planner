const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEV_USER_ID = "dev-user";

async function request(endpoint, options = {}) {
  const response = await fetch(API_BASE_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEV_USER_ID}`,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchPlaces() {
  return request("/places");
}

export function fetchUserPlaces() {
  return request("/user-places");
}

export function addUserPlace(place) {
  return request("/user-places", {
    method: "POST",
    body: JSON.stringify({ place }),
  });
}

export function removeUserPlace(placeId) {
  return request(`/user-places/${placeId}`, {
    method: "DELETE",
  });
}

export function togglePlaceStatus(placeId) {
  return request(`/user-places/${placeId}/status`, {
    method: "PATCH",
  });
}

export function togglePlaceFavorite(placeId) {
  return request(`/user-places/${placeId}/favorite`, {
    method: "PATCH",
  });
}

export function updatePlaceMeta(placeId, meta) {
  return request(`/user-places/${placeId}`, {
    method: "PATCH",
    body: JSON.stringify({ meta }),
  });
}

export function exportCollection() {
  return request("/user-places");
}
