const API_BASE_URL = "http://localhost:3000";

async function request(endpoint, options = {}) {
  const response = await fetch(API_BASE_URL + endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

const ENDPOINTS = {
  PLACES: "/places",
  USER_PLACES: "/user-places",
};

export function fetchPlaces() {
  return request(ENDPOINTS.PLACES);
}

export function fetchUserPlaces() {
  return request(ENDPOINTS.USER_PLACES);
}

export function addUserPlace(place) {
  return request(ENDPOINTS.USER_PLACES, {
    method: "POST",
    body: JSON.stringify({ place }),
  });
}

export function togglePlaceStatus(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}`, {
    method: "PATCH",
  });
}

export function togglePlaceFavorite(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}/favorite`, {
    method: "PATCH",
  });
}

export function removeUserPlace(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}`, {
    method: "DELETE",
  });
}
