const API_BASE_URL = "http://localhost:3000";

/* ------------------------------------------------------------------ */
/* Low-level HTTP helper */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Endpoints */
/* ------------------------------------------------------------------ */

const ENDPOINTS = {
  PLACES: "/places",
  USER_PLACES: "/user-places",
};

/* ------------------------------------------------------------------ */
/* Business / domain API */
/* ------------------------------------------------------------------ */

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

export function removeUserPlace(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}`, {
    method: "DELETE",
  });
}
