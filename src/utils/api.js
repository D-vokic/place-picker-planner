const API_BASE_URL = "http://localhost:3000";

async function request(url, options = {}) {
  const response = await fetch(API_BASE_URL + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

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

export function togglePlaceStatus(placeId) {
  return request(`/user-places/${placeId}`, {
    method: "PATCH",
  });
}

export function removeUserPlace(placeId) {
  return request(`/user-places/${placeId}`, {
    method: "DELETE",
  });
}
